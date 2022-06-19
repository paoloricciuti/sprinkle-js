import { AppendNode, CSSStyles, DOMUpdate, ICreateEffect, ICreateEffectExecute, ICreateEffectRunning, IEffect, IEqualFunction, IEqualFunctionMap, IStringOrDomElement, ISubscription, Primitive } from "./types/index";
import { findNext, updateDom, diff, getDomElement } from "./utils";

let context: ICreateEffectRunning[] = [];

const subscribe = (field: string | symbol, running: ICreateEffectRunning, subscriptionsMap: Map<string | symbol, ISubscription>) => {
    let subscriptions = subscriptionsMap.get(field);
    if (!subscriptions) {
        subscriptions = new Set<ICreateEffectRunning>();
        subscriptionsMap.set(field, subscriptions);
    }
    subscriptions.add(running);
    running.dependencies.add(subscriptions);
};

const runRupdates = (subscriptions: Map<string | symbol, ISubscription>, field: string | symbol) => {
    for (const sub of [...subscriptions.get(field) || []]) {
        const cleanUpFn = sub.execute();
        if (cleanUpFn) {
            sub.cleanup = cleanUpFn;
        }
    }
};

const createVariable = <T extends Object>(value: T, eq?: IEqualFunctionMap<T>) => {
    if (typeof value !== "object") throw new Error("It's not possible to create a variable from a primitive value...you can use createRef");
    const keys = Object.keys(value);
    for (let keyString of keys) {
        const key = keyString as keyof T;
        if (typeof value[key] === "object") {
            value[key] = createVariable(value[key], (eq?.[key] as any as IEqualFunctionMap<T[keyof T]>));
        }
    }
    const subscriptions: Map<string | symbol, ISubscription> = new Map<string, ISubscription>();
    const variable = new Proxy(value, {
        get: (...props) => {
            const running = context[context.length - 1];
            if (running) subscribe(props[1], running, subscriptions);
            return Reflect.get(...props);
        },
        set: (target, field, value) => {
            //cast the field to a keyof T
            const fieldCast = field as keyof T;
            //get the equality function, if it's not defined default it to Object.is
            const equality = eq?.[fieldCast] ?? Object.is as any;
            //check if the current value is equal to the new value
            const isEqual = equality(target[fieldCast], value);
            //update the value
            const ok = Reflect.set(target, field, value);
            //if it's not equal run the updates
            if (!isEqual) {
                runRupdates(subscriptions, field);
            }
            return ok;
        }
    });
    return variable;
};

const createComputed = <T>(fn: () => T, eq?: IEqualFunction<T>) => {
    const value = { value: fn() };
    let canWrite = false;
    const subscriptions: Map<string | symbol, ISubscription> = new Map<string, ISubscription>();
    const computed = new Proxy(value, {
        get: (...props) => {
            const running = context[context.length - 1];
            if (running) subscribe(props[1], running, subscriptions);
            return Reflect.get(...props);
        },
        set: (target, field, value) => {
            if (!canWrite) return true;
            //cast the field to the const value since it's the only field it can have
            const fieldCast = field as "value";
            //get the equality function, if it's not defined default it to Object.is
            const equality = eq ?? Object.is as any;
            //check if the current value is equal to the new value
            const isEqual = equality(target[fieldCast], value);
            //update the value
            const ok = Reflect.set(target, field, value);
            if (!isEqual) {
                runRupdates(subscriptions, field);
            }
            return ok;
        }
    });
    createEffect(() => {
        canWrite = true;
        computed.value = fn();
        canWrite = false;
    });
    return computed;
};

const createStored = <T extends Object>(key: string, value: T, eq?: IEqualFunctionMap<T>, storage: Storage = window.localStorage) => {
    if (typeof value !== "object") throw new Error("It's not possible to create a variable from a primitive value...you can use createRef");
    const subscriptions: Map<string | symbol, ISubscription> = new Map<string, ISubscription>();
    let existingValue: T | null = null;
    try {
        const storedValue = storage.getItem(key);
        if (storedValue) {
            existingValue = JSON.parse(storedValue);
        } else {
            storage.setItem(key, JSON.stringify(value));
        }
    } catch (e) {
        throw new Error("The specified key is associated with a non Object-like element");
    }
    const variable = new Proxy(existingValue ?? value, {
        get: (...props) => {
            const running = context[context.length - 1];
            if (running) subscribe(props[1], running, subscriptions);
            return Reflect.get(...props);
        },
        set: (target, field, value) => {
            //cast the field to a keyof T
            const fieldCast = field as keyof T;
            //get the equality function, if it's not defined default it to Object.is
            const equality = eq?.[fieldCast] ?? Object.is as any;
            //check if the current value is equal to the new value
            const isEqual = equality(target[fieldCast], value);
            //update the value
            const ok = Reflect.set(target, field, value);
            storage.setItem(key, JSON.stringify(target));
            if (!isEqual) {
                runRupdates(subscriptions, field);
            }
            return ok;
        }
    });
    window.addEventListener("storage", (e) => {
        if (e.storageArea === storage && e.key === key) {
            try {
                if (e.newValue) {
                    const newObj: T = JSON.parse(e.newValue);
                    for (let key in newObj) {
                        variable[key] = newObj[key];
                    }
                }
            } catch (e) {
                console.warn("The storage was modified but the resulting object is not parsable...the variable was not updated.");
            }
        }
    });
    return variable;
};

const createRef = <T extends Primitive>(ref: T, eq?: IEqualFunction<T>) => {
    return createVariable({ value: ref }, eq ? { value: eq } : undefined);
};

const cleanup = (running: ICreateEffectRunning) => {
    for (const dep of running.dependencies) {
        dep.delete(running);
    }
    running.dependencies.clear();
};

const createEffect: ICreateEffect = (fn) => {
    const execute: ICreateEffectExecute = () => {
        if (running.cleanup) {
            running.cleanup();
        }
        cleanup(running);
        context.push(running);
        let retval;
        try {
            retval = fn();
        } finally {
            context.pop();
        }
        return retval;
    };

    const running: ICreateEffectRunning = {
        execute,
        dependencies: new Set()
    };
    const cleanupFn = execute();
    if (cleanupFn) {
        running.cleanup = cleanupFn;
    }
};

const untrack = (fn: () => any) => {
    const oldContext = context;
    context = [];
    const retval = fn();
    context = oldContext;
    return retval;
};

const bindTextContent = <TElement extends HTMLElement = HTMLElement>(domElement: IStringOrDomElement<TElement>, fn: IEffect<string, TElement>) => {
    const elem = getDomElement(domElement);
    createEffect(() => {
        if (elem) {
            elem.textContent = fn(elem);
        }
    });
    return elem;
};

const bindClass = <TElement extends HTMLElement = HTMLElement>(domElement: IStringOrDomElement<TElement>, className: string, fn: IEffect<boolean, TElement>) => {
    const elem = getDomElement(domElement);
    createEffect(() => {
        if (elem) {
            const isPresent = fn(elem);
            if (isPresent) {
                elem.classList.add(className);
            } else {
                elem.classList.remove(className);
            }
        }
    });
    return elem;
};

const bindInputValue = (domElement: IStringOrDomElement<HTMLInputElement>, fn: IEffect<string, HTMLInputElement>) => {
    const elem = getDomElement(domElement);
    createEffect(() => {
        if (elem) {
            elem.value = fn(elem);
        }
    });
    return elem;
};

const bindDom = <TElement extends HTMLElement = HTMLElement>(domElement: IStringOrDomElement<TElement>, fn: IEffect<DOMUpdate<TElement>, TElement>) => {
    const elem = getDomElement(domElement);
    createEffect(() => updateDom(elem, fn(elem)));
    return elem;
};

const bindStyle = <TElement extends HTMLElement = HTMLElement>(domElement: IStringOrDomElement<TElement>, fn: IEffect<CSSStyles<TElement>, TElement>) => {
    const elem = getDomElement(domElement);
    if (!elem) return;
    bindDom(elem, () => ({ style: fn(elem) as any }));
    return elem;
};

const bindChildrens = <TElement extends HTMLElement = HTMLElement>(domElement: IStringOrDomElement<TElement>, fn: IEffect<NodeListOf<AppendNode> | AppendNode[], TElement>) => {
    const elem = getDomElement(domElement);
    createEffect(() => {
        if (elem === null) return;
        const elements = fn(elem);
        if (elem.childNodes.length === 0) {
            elem.append(...Array.from(elements));
            return;
        }
        const differentElements = diff([...Array.from((elem.childNodes as NodeListOf<AppendNode>))], [...Array.from(elements)], (a, b) => a.key != null && b.key != null ? a.key === b.key : a === b);
        let nextEqual = differentElements.find(element => element.type === "=");
        let index = 0;
        for (let element of differentElements) {
            if (element.type === "+") {
                if (!nextEqual) {
                    elem.append(element.value);
                    index++;
                    continue;
                }
                nextEqual.value.before(element.value);
            } else if (element.type === "-") {
                elem.removeChild(element.value);
            } else {
                nextEqual = findNext(differentElements, (element) => element.type === "=", index);
            }
            index++;
        }
    });
    return elem;
};

export { createEffect, untrack, createRef, createVariable, createComputed, createStored, bindInputValue, bindTextContent, bindDom, bindClass, bindStyle, bindChildrens };