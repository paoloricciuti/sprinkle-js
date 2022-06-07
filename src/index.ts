import { AppendNode, ICreateEffect, ICreateEffectExecute, ICreateEffectRunning, IEffect, IStringOrDomElement, ISubscription } from "./types/index";
import { findNext, updateDom, diff, getDomElement } from "./utils";

let context: ICreateEffectRunning[] = [];

function subscribe(field: string | symbol, running: ICreateEffectRunning, subscriptionsMap: Map<string | symbol, ISubscription>) {
    let subscriptions = subscriptionsMap.get(field);
    if (!subscriptions) {
        subscriptions = new Set<ICreateEffectRunning>();
        subscriptionsMap.set(field, subscriptions);
    }
    subscriptions.add(running);
    running.dependencies.add(subscriptions);
}

const createVariable = <T extends Object>(value: T) => {
    if (typeof value !== "object") throw new Error("It's not possible to create a variable from a primitive value...you can use createRef");
    const subscriptions: Map<string | symbol, ISubscription> = new Map<string, ISubscription>();
    const variable = new Proxy(value, {
        get: (...props) => {
            const running = context[context.length - 1];
            if (running) subscribe(props[1], running, subscriptions);
            return Reflect.get(...props);
        },
        set: (...props) => {
            const ok = Reflect.set(...props);
            for (const sub of [...subscriptions.get(props[1]) || []]) {
                const cleanUpFn = sub.execute();
                if (cleanUpFn) {
                    sub.cleanup = cleanUpFn;
                }
            }
            return ok;
        }
    });
    return variable;
};

const createRef = (ref: any) => {
    return createVariable({ value: ref });
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

const bindDom = <TElement extends HTMLElement = HTMLElement>(domElement: IStringOrDomElement<TElement>, fn: IEffect<any, TElement>) => {
    const elem = getDomElement(domElement);
    createEffect(() => updateDom(elem, fn(elem)));
    return elem;
};

const bindStyle = <TElement extends HTMLElement = HTMLElement>(domElement: IStringOrDomElement<TElement>, fn: IEffect<any, TElement>) => {
    const elem = getDomElement(domElement);
    if (!elem) return;
    bindDom(elem, () => ({ style: fn(elem) }));
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

export { createEffect, untrack, createRef, createVariable, bindInputValue, bindTextContent, bindDom, bindClass, bindStyle, bindChildrens };