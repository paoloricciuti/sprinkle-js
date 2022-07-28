import { CSSStyles, DiffedElements, DOMUpdate, ICreateEffect, ICreateEffectExecute, ICreateEffectRunning, IEffect, IEqualFunction, IEqualFunctionMap, IStringOrDomElement, ISubscription, Primitive } from "./types/index";
import { diff, findNext, getDomElement, getRawType, html, key, updateDom } from "./utils";

let context: ICreateEffectRunning[] = [];
const IS_REACTIVE_SYMBOL = Symbol("is-reactive");

let batched: Set<ICreateEffectRunning> | null = null;

const batch = (fn: Function) => {
    batched = new Set<ICreateEffectRunning>();
    try {
        fn();
    } finally {
        const effectsToRun = new Set(batched);
        batched = null;
        runEffects(effectsToRun);
    }
};

const subscribe = (field: string | symbol, running: ICreateEffectRunning, subscriptionsMap: Map<string | symbol, ISubscription>) => {
    let subscriptions = subscriptionsMap.get(field);
    if (!subscriptions) {
        subscriptions = new Set<ICreateEffectRunning>();
        subscriptionsMap.set(field, subscriptions);
    }
    subscriptions.add(running);
    running.dependencies.add(subscriptions);
};

const runEffects = (effects: Set<ICreateEffectRunning>) => {
    [...effects].forEach((sub) => {
        if (!sub.toRun) return;
        const cleanUpFn = sub.execute();
        if (cleanUpFn) {
            sub.cleanup = cleanUpFn;
        }
    });
};

const runOrQueueUpdates = (subscriptions: Map<string | symbol, ISubscription>, field: string | symbol) => {
    const effects = subscriptions.get(field);
    if (!effects) return;
    if (batched !== null) {
        effects.forEach((effect) => batched!.add(effect));
        return;
    }
    runEffects(effects);
};

const createVariable = <T extends Object>(value: T, eq?: IEqualFunctionMap<T>) => {
    //if the value is already reactive we simply return the value
    if ((value as any)[IS_REACTIVE_SYMBOL]) return value;
    if (typeof value !== "object") throw new Error("It's not possible to create a variable from a primitive value...you can use createRef");
    const keys = Object.keys(value || {});
    for (let keyString of keys) {
        const key = keyString as keyof T;
        if (!!value[key] && typeof value[key] === "object" && (getRawType(value[key]) === "Object" || Array.isArray(value[key]))) {
            value[key] = createVariable(value[key], (eq?.[key] as any as IEqualFunctionMap<T[keyof T]>));
        }
    }
    const subscriptions: Map<string | symbol, ISubscription> = new Map<string, ISubscription>();
    const variable = new Proxy(value, {
        get: (...props) => {
            //using IS_REACTIVE_SYMBOL to differenciate between normal values and reactive values to avoid
            //recreating the proxy if a value is already reactive
            if (props[1] === IS_REACTIVE_SYMBOL) return true;;
            const running = context[context.length - 1];
            if (running) subscribe(props[1], running, subscriptions);
            return Reflect.get(...props);
        },
        set: (target, field, value) => {
            //cast the field to a keyof T
            const fieldCast = field as keyof T;
            //get the equality function, if it's not defined default it to Object.is
            const equality = eq?.[fieldCast] ?? Object.is as any;
            let varValue = value;
            //if the passed in value is already reactive no need to create a new reactive variable from it
            //otherwise the effect will run twice every time
            if (!!value && typeof value === "object" && (getRawType(value) === "Object" || Array.isArray(value)) && !value[IS_REACTIVE_SYMBOL]) {
                varValue = createVariable(value, equality);
            }
            //check if the current value is equal to the new value
            const isEqual = equality(target[fieldCast], value);
            //update the value
            const ok = Reflect.set(target, field, varValue);
            //if it's not equal run the updates
            if (!isEqual) {
                runOrQueueUpdates(subscriptions, field);
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
                runOrQueueUpdates(subscriptions, field);
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
                runOrQueueUpdates(subscriptions, field);
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

const cleanEffect = (running: ICreateEffectRunning) => {
    running.owned.forEach(owned => {
        owned.toRun = false;
        cleanEffect(owned);
    });
    for (const dep of running.dependencies) {
        dep.delete(running);
    }
    running.dependencies.clear();
};

const createEffect: ICreateEffect = (fn) => {
    const execute: ICreateEffectExecute = () => {
        if (!running.toRun) return;
        running?.owner?.owned?.push?.(running);
        if (running.cleanup && typeof running.cleanup === "function") {
            running.cleanup();
        }
        cleanEffect(running);
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
        dependencies: new Set(),
        owned: [],
        owner: context[context.length - 1],
        toRun: true,
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

const bindInnerHTML = <TElement extends HTMLElement = HTMLElement>(domElement: IStringOrDomElement<TElement>, fn: IEffect<string, TElement>) => {
    const elem = getDomElement(domElement);
    createEffect(() => {
        if (elem) {
            elem.innerHTML = fn(elem);
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

const bindClasses = <TElement extends HTMLElement = HTMLElement>(domElement: IStringOrDomElement<TElement>, fn: IEffect<{ [key: string]: boolean; }, TElement>) => {
    const elem = getDomElement(domElement);
    createEffect(() => {
        if (elem) {
            const classesObj = fn(elem);
            const classList = Object.keys(classesObj || {});
            for (let className of classList) {
                if (classesObj[className]) {
                    elem.classList.add(className);
                } else {
                    elem.classList.remove(className);
                }
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

const bindChildrens = <TElement extends HTMLElement = HTMLElement>(domElement: IStringOrDomElement<TElement>, fn: IEffect<string, TElement>, afterDiff?: ((root: TElement, elements: Map<string, DiffedElements>) => void)) => {
    const elem = getDomElement(domElement);
    createEffect(() => {
        if (elem === null) return;
        const elementsHtml = fn(elem);
        const elements = html(elementsHtml).childNodes;
        const mapped = new Map<string, DiffedElements>();
        const safeSetElement = (element: Node, isNew: boolean = true) => {
            const elementKey = key(element);
            if (elementKey !== null || elementKey != undefined) {
                mapped.set(elementKey, { element, isNew });
            }
        };
        if (elem.children.length === 0) {
            const toAppend = Array.from(elements);
            elem.append(...toAppend);
            toAppend.forEach(appended => safeSetElement(appended));
            if (typeof afterDiff === "function") {
                createEffect(() => {
                    afterDiff(elem, mapped);
                });
            }
            return;
        }
        const differentElements = diff(Array.from((elem.childNodes)), Array.from(elements), (a, b) => key(a) != null && key(b) != null ? key(a) === key(b) : a === b);
        let nextEqual = differentElements.find(element => element.type === "=");
        let index = 0;
        for (let element of differentElements) {
            if (element.type === "+") {
                const nextRemoved = findNext(differentElements, (el) => el.type === "-" && key(el.value) === key(element.value), index);
                if (nextRemoved) {
                    element.value = nextRemoved.value;
                    nextRemoved.skip = true;
                }
                if (!nextEqual) {
                    elem.append(element.value);
                    safeSetElement(element.value);
                    index++;
                    continue;
                }
                nextEqual.value.before(element.value);
                safeSetElement(element.value);
            } else if (element.type === "-") {
                if (element.skip) { index++; continue; }
                elem.removeChild(element.value);
                const nextAdded = findNext(differentElements, (el) => el.type === "+" && key(el.value) === key(element.value), index);
                if (nextAdded) {
                    nextAdded.value = element.value;
                }
            } else {
                nextEqual = findNext(differentElements, (element) => element.type === "=", index);
                safeSetElement(element.value, false);
            }
            index++;
        }
        if (typeof afterDiff === "function") {
            createEffect(() => {
                afterDiff(elem, mapped);
            });
        }
    });
    return elem;
};

export { createEffect, untrack, batch, createRef, createVariable, createComputed, createStored, bindInputValue, bindInnerHTML, bindTextContent, bindDom, bindClass, bindClasses, bindStyle, bindChildrens };
