import { findNext, updateDom, diff, getDomElement } from "./utils";

const context: ICreateEffectRunning[] = [];

function subscribe(running: ICreateEffectRunning, subscriptions: ISubscription) {
    subscriptions.add(running);
    running.dependencies.add(subscriptions);
}

const createVariable = (value: Object) => {
    if (typeof value !== "object") throw new Error("It's not possible to create a variable from a primitive value...you can use createRef");
    const subscriptions: ISubscription = new Set<ICreateEffectRunning>();
    const variable = new Proxy(value, {
        get: (...props) => {
            const running = context[context.length - 1];
            if (running) subscribe(running, subscriptions);
            return Reflect.get(...props);
        },
        set: (...props) => {
            const ok = Reflect.set(...props);
            for (const sub of [...subscriptions]) {
                sub.execute();
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
        cleanup(running);
        context.push(running);
        try {
            fn();
        } finally {
            context.pop();
        }
    };

    const running: ICreateEffectRunning = {
        execute,
        dependencies: new Set()
    };

    execute();
};

const bindTextContent = (domElement: IStringOrDomElement<HTMLElement>, fn: IEffect<string>) => {
    const elem = getDomElement(domElement);
    createEffect(() => {
        if (elem) {
            elem.textContent = fn();
        }
    });
};

const bindInputValue = (domElement: IStringOrDomElement<HTMLInputElement>, fn: IEffect<string>) => {
    const elem = getDomElement(domElement);
    createEffect(() => {
        if (elem) {
            elem.value = fn();
        }
    });
};

const bindDom = (domElement: IStringOrDomElement<HTMLElement>, fn: IEffect<any>) => {
    const elem = getDomElement(domElement);
    createEffect(() => updateDom(elem, fn()));
};

const bindStyle = (domElement: IStringOrDomElement<HTMLElement>, fn: IEffect<any>) => {
    const elem = getDomElement(domElement);
    if (!elem) return;
    bindDom(elem, () => ({ style: fn() }));
};

const bindChildrens = (domElement: IStringOrDomElement<HTMLElement>, fn: IEffect<NodeListOf<AppendNode>>) => {
    const elem = getDomElement(domElement);
    createEffect(() => {
        if (elem === null) return;
        const elements = fn();
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
};

export { createEffect, createRef, createVariable, bindInputValue, bindTextContent, bindDom, bindStyle, bindChildrens };