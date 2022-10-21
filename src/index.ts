import { CSSStyles, DiffedElements, DOMUpdate, ElementWithListeners, HTMLOrSVGElement, ICreateEffect, ICreateEffectExecute, ICreateEffectRunning, ICssVariable, IEffect, IEqualFunction, IEqualFunctionMap, ISetupOptions, IStringOrDomElement, ISubscription, Primitive } from './types/index';
import { diff, findNext, getDomElement, getRawType, strToHtml, key, updateDom } from './utils';

let context: ICreateEffectRunning[] = [];
const IS_REACTIVE_SYMBOL = Symbol('is-reactive');
const IS_COMPUTED_WRITABLE = Symbol('memo');

let batched: Set<ICreateEffectRunning> | null = null;

const runEffects = (effects: Set<ICreateEffectRunning>) => {
    [...effects].forEach((sub) => {
        if (!sub.toRun) return;
        const cleanUpFn = sub.execute();
        if (cleanUpFn) {
            sub.cleanup = cleanUpFn;
        }
    });
};

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

const runOrQueueUpdates = (subscriptions: Map<string | symbol, ISubscription>, field: string | symbol) => {
    const effects = subscriptions.get(field);
    if (!effects) return;
    if (batched !== null) {
        effects.forEach((effect) => batched!.add(effect));
        return;
    }
    runEffects(effects);
};

const defCreateVariable = <T extends object>(value: T, eq?: IEqualFunctionMap<T>) => {
    // if the value is already reactive we simply return the value
    if ((value as any)[IS_REACTIVE_SYMBOL]) return value;
    if (typeof value !== 'object') throw new Error("It's not possible to create a variable from a primitive value...you can use createRef");
    const keys = Object.keys(value || {});
    keys.forEach((keyString) => {
        const keyStr = keyString as keyof T;
        if (!!value[keyStr] && typeof value[keyStr] === 'object' && (getRawType(value[keyStr]) === 'Object' || Array.isArray(value[keyStr]))) {
            value[keyStr] = createVariable(value[keyStr] as unknown as object, (eq?.[keyStr] as any)) as unknown as T[keyof T];
        }
    });
    const subscriptions: Map<string | symbol, ISubscription> = new Map<string, ISubscription>();
    const variable = new Proxy(value, {
        get: (...props) => {
            // using IS_REACTIVE_SYMBOL to differenciate between normal values and
            // reactive values to avoid
            // recreating the proxy if a value is already reactive
            if (props[1] === IS_REACTIVE_SYMBOL) return true;
            const running = context[context.length - 1];
            if (running) subscribe(props[1], running, subscriptions);
            return Reflect.get(...props);
        },
        set: (target, field, val) => {
            if ((target as any)[IS_COMPUTED_WRITABLE] === false && field !== IS_COMPUTED_WRITABLE) return true;
            // cast the field to a keyof T
            const fieldCast = field as keyof T;
            // get the equality function, if it's not defined default it to Object.is
            const equality = eq?.[fieldCast] ?? Object.is as any;
            let varValue = val;
            // if the passed in value is already reactive no need to create
            // a new reactive variable from it otherwise the effect will run twice every time
            if (!!val && typeof val === 'object' && (getRawType(val) === 'Object' || Array.isArray(val)) && !val[IS_REACTIVE_SYMBOL]) {
                varValue = createVariable(val, equality);
            }
            // check if the current value is equal to the new value
            const isEqual = equality(target[fieldCast], val);
            // update the value
            const ok = Reflect.set(target, field, varValue);
            // if it's not equal run the updates
            if (!isEqual) {
                runOrQueueUpdates(subscriptions, field);
            }
            return ok;
        },
    });
    return variable;
};

const createCssVariable = <T extends ICssVariable, E extends HTMLOrSVGElement = HTMLHtmlElement>(value: T, eq?: IEqualFunctionMap<T>, root: IStringOrDomElement<E> = ':root') => {
    const variable = createVariable(value, eq);
    let domElement = getDomElement(root);
    if (!domElement) {
        console.warn('Impossible to find the right html element, attaching the variables to the root.');
        domElement = document.querySelector(':root');
    }
    createEffect(() => {
        const keys = Object.keys(variable);

        keys.forEach((objKey) => {
            domElement!.style.setProperty(`--${objKey}`, variable[objKey]?.toString());
        });
    });
    return variable;
};

const defCreateComputed = <T>(fn: () => T, eq?: IEqualFunction<T>) => {
    const value = { value: fn(), [IS_COMPUTED_WRITABLE]: false };
    const computed = createVariable(value, eq ? { value: eq } : undefined);
    createEffect(() => {
        computed[IS_COMPUTED_WRITABLE] = true;
        computed.value = fn();
        computed[IS_COMPUTED_WRITABLE] = false;
    });
    return computed;
};

const createStored = <T extends Object>(storageKey: string, value: T, eq?: IEqualFunctionMap<T>, storage: Storage = window.localStorage) => {
    if (typeof value !== 'object') throw new Error("It's not possible to create a variable from a primitive value...you can use createRef");
    let existingValue: T | null = null;
    try {
        const storedValue = storage.getItem(storageKey);
        if (storedValue) {
            existingValue = JSON.parse(storedValue);
        } else {
            storage.setItem(storageKey, JSON.stringify(value));
        }
    } catch (e) {
        throw new Error('The specified key is associated with a non Object-like element');
    }
    const variable = createVariable(existingValue ?? value, eq);
    createEffect(() => {
        storage.setItem(storageKey, JSON.stringify(variable));
    });
    window.addEventListener('storage', (e) => {
        if (e.storageArea === storage && e.key === storageKey) {
            try {
                if (e.newValue) {
                    const newObj: T = JSON.parse(e.newValue);
                    const keys = Object.keys(newObj) as any as (keyof T)[];
                    keys.forEach((keyStr) => {
                        variable[keyStr] = newObj[keyStr];
                    });
                }
            } catch (error) {
                console.warn('The storage was modified but the resulting object is not parsable...the variable was not updated.');
            }
        }
    });
    return variable;
};

const createRef = <T extends Primitive>(ref: T, eq?: IEqualFunction<T>) => createVariable({ value: ref }, eq ? { value: eq } : undefined);

const cleanEffect = (running: ICreateEffectRunning) => {
    running.owned.forEach((owned) => {
        owned.toRun = false;
        cleanEffect(owned);
    });
    running.dependencies.forEach((dep) => {
        dep.delete(running);
    });
    running.dependencies.clear();
};

const defCreateEffect: ICreateEffect = (fn) => {
    const execute: ICreateEffectExecute = () => {
        if (!running.toRun) return;
        running?.owner?.owned?.push?.(running);
        if (running.cleanup && typeof running.cleanup === 'function') {
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

const DEFAULT_CORE_FUNCTIONS = {
    createVariable: defCreateVariable,
    createEffect: defCreateEffect,
    createComputed: defCreateComputed,
};

let CORE_FUNCTIONS = { ...DEFAULT_CORE_FUNCTIONS };

const createVariable = <T extends object>(value: T, eq?: IEqualFunctionMap<T>) => CORE_FUNCTIONS.createVariable(value, eq);

const createEffect: ICreateEffect = (fn) => CORE_FUNCTIONS.createEffect(fn);

const createComputed = <T>(fn: () => T, eq?: IEqualFunction<T>) => CORE_FUNCTIONS.createComputed(fn, eq);

const setup = (options: ISetupOptions = DEFAULT_CORE_FUNCTIONS) => {
    Object.keys(options).forEach((optionKey) => {
        CORE_FUNCTIONS[(optionKey as keyof ISetupOptions)] = options[(optionKey as keyof ISetupOptions)] as any;
    });
    return () => {
        CORE_FUNCTIONS = DEFAULT_CORE_FUNCTIONS;
    };
};

const untrack = (fn: () => any) => {
    const oldContext = context;
    context = [];
    const retval = fn();
    context = oldContext;
    return retval;
};

const bindTextContent = <TElement extends HTMLOrSVGElement = HTMLOrSVGElement>(domElement: IStringOrDomElement<TElement>, fn: IEffect<string, TElement>) => {
    const elem = getDomElement(domElement);
    createEffect(() => {
        if (elem) {
            elem.textContent = fn(elem);
        }
    });
    return elem;
};

const bindInnerHTML = <TElement extends HTMLOrSVGElement = HTMLOrSVGElement>(domElement: IStringOrDomElement<TElement>, fn: IEffect<string, TElement>) => {
    const elem = getDomElement(domElement);
    createEffect(() => {
        if (elem) {
            elem.innerHTML = fn(elem);
        }
    });
    return elem;
};

const bindClass = <TElement extends HTMLOrSVGElement = HTMLOrSVGElement>(domElement: IStringOrDomElement<TElement>, className: string, fn: IEffect<boolean, TElement>) => {
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

const bindClasses = <TElement extends HTMLOrSVGElement = HTMLOrSVGElement>(domElement: IStringOrDomElement<TElement>, fn: IEffect<{ [key: string]: boolean; }, TElement>) => {
    const elem = getDomElement(domElement);
    createEffect(() => {
        if (elem) {
            const classesObj = fn(elem);
            const classList = Object.keys(classesObj || {});
            classList.forEach((className) => {
                if (classesObj[className]) {
                    elem.classList.add(className);
                } else {
                    elem.classList.remove(className);
                }
            });
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

const bindDom = <TElement extends HTMLOrSVGElement = HTMLOrSVGElement>(domElement: IStringOrDomElement<TElement>, fn: IEffect<DOMUpdate<TElement>, TElement>) => {
    const elem = getDomElement(domElement);
    createEffect(() => updateDom(elem, fn(elem)));
    return elem;
};

const bindStyle = <TElement extends HTMLOrSVGElement = HTMLOrSVGElement>(domElement: IStringOrDomElement<TElement>, fn: IEffect<CSSStyles<TElement>, TElement>) => {
    const elem = getDomElement(domElement);
    if (!elem) return;
    bindDom(elem, () => ({ style: fn(elem) as any }));
    return elem;
};

const replaceFunctions = (element: ElementWithListeners, functions: Function[], components: IComponents) => {
    if (element instanceof Text) {
        let startingText = element.textContent ?? '';
        const regex = /\{\{fn:(?<index>\d+)\}\}/g;
        let matches;
        // eslint-disable-next-line no-cond-assign
        while (matches = regex.exec(element.textContent ?? '')) {
            if (!matches?.groups?.['index']) continue;
            const result = functions[+matches.groups['index']]();
            startingText = startingText.replace(matches[0], result);
        }
        element.textContent = startingText;
    } else if (element instanceof HTMLElement) {
        const match = element.tagName.match(/to-replace-(?<index>\d+)/i);
        // eslint-disable-next-line eqeqeq
        if (match?.groups?.['index'] != undefined) {
            element.replaceWith(components[+match.groups['index']]);
        }
    }
    for (let i = 0; i < element.childNodes.length; i += 1) {
        const child = element.childNodes[i] as ElementWithListeners;
        replaceFunctions(child, functions, components);
    }
    if (element instanceof Element && element.attributes) {
        for (let i = 0; i < element.attributes.length; i += 1) {
            const attr = element.attributes[i];
            const [on, listener] = attr.name.split(':');
            if (on === 'on' && listener) {
                const match = attr.value.match(/\{\{fn:(?<index>\d+)\}\}/);
                // eslint-disable-next-line eqeqeq
                if (match?.groups?.['index'] != undefined) {
                    element.addEventListener(listener as unknown as keyof HTMLElementEventMap, functions[+match.groups['index']] as any);
                    element.removeAttribute(attr.name);
                    if (!element.listeners) {
                        element.listeners = new Map();
                    }
                    if (!element.listeners.has(listener)) {
                        element.listeners.set(listener, new Set());
                    }
                    element.listeners.get(listener)!.add(functions[+match.groups['index']] as any);
                }
            }
        }
    }
};

type IComponents = ReturnType<typeof html>[];

const populateStringFunctionsAndComponents = (el: string, functions: Function[], components: IComponents, els: any) => {
    // eslint-disable-next-line eqeqeq
    if (els == undefined) return el;
    if (typeof els === 'function') {
        el += `{{fn:${functions.length}}}`;
        functions.push(els);
    } else if (els[FROM_H]) {
        el += `<to-replace-${components.length}></to-replace-${components.length}>`;
        components.push(els);
    } else if (Array.isArray(els)) {
        for (let i = 0; i < els.length; i += 1) {
            const newEls = els[i];
            el = populateStringFunctionsAndComponents(el, functions, components, newEls);
        }
    } else {
        el += els;
    }
    return el;
};

const FROM_H = Symbol('from_h');

const html = (strings: TemplateStringsArray, ...els: any[]) => {
    let el = '';
    const functions: Function[] = [];
    const components: IComponents = [];
    for (let i = 0; i < strings.length; i += 1) {
        el += strings[i];
        el = populateStringFunctionsAndComponents(el, functions, components, els[i]);
    }
    const elements: DocumentFragment & {
        [FROM_H]?: boolean;
    } = strToHtml(el);
    for (let i = 0; i < elements.children.length; i += 1) {
        const element = elements.children[i];
        replaceFunctions(element as ElementWithListeners, functions, components);
    }
    elements[FROM_H] = true;
    return elements;
};

const fixListeners = (toAdd: ElementWithListeners, toRemove: ElementWithListeners) => {
    toRemove.listeners?.forEach((listeners, listenerKey) => {
        listeners.forEach((handler) => {
            toRemove.removeEventListener(listenerKey, handler);
        });
    });
    toAdd.listeners?.forEach((listeners, listenerKey) => {
        listeners.forEach((handler) => {
            toRemove.addEventListener(listenerKey, handler);
        });
    });
};

const updateChildren = (elem: HTMLOrSVGElement, elements: NodeListOf<ChildNode>, safeSetElement: Function) => {
    if (elem?.children?.length && elem.children.length === 0) {
        const toAppend = Array.from(elements);
        elem.append(...toAppend);
        toAppend.forEach((appended) => safeSetElement(appended));
        return;
    }
    const differentElements = diff(Array.from((elem.childNodes)), Array.from(elements), (a, b) => (key(a) != null && key(b) != null ? key(a) === key(b) : a === b));
    let nextEqual = differentElements.find((element) => element.type === '=');
    let index = 0;
    const toFurtherDiff: { new: any, old: any; }[] = [];
    differentElements.forEach((element) => {
        if (element.type === '+') {
            const nextRemoved = findNext(differentElements, (el) => el.type === '-' && key(el.value) === key(element.value), index);
            if (nextRemoved) {
                toFurtherDiff.push({
                    new: element.value,
                    old: nextRemoved.value,
                });
                fixListeners(element.value as ElementWithListeners, nextRemoved.value as ElementWithListeners);
                element.value = nextRemoved.value;
                nextRemoved.skip = true;
            }
            if (!nextEqual) {
                elem.append(element.value);
                safeSetElement(element.value);
                index += 1;
                return;
            }
            nextEqual.value.before(element.value);
            safeSetElement(element.value);
        } else if (element.type === '-') {
            if (element.skip) { index += 1; return; }
            elem.removeChild(element.value);
            const nextAdded = findNext(differentElements, (el) => el.type === '+' && key(el.value) === key(element.value), index);
            if (nextAdded) {
                toFurtherDiff.push({
                    new: nextAdded.value,
                    old: element.value,
                });
                fixListeners(nextAdded.value as ElementWithListeners, element.value as ElementWithListeners);
                nextAdded.value = element.value;
            }
        } else {
            const old = Array.from(elements).find((oldEl) => key(oldEl) === key(element.value));
            toFurtherDiff.push({
                new: element.value,
                old,
            });
            fixListeners(old as ElementWithListeners, element.value as ElementWithListeners);
            nextEqual = findNext(differentElements, (elementToFind) => elementToFind.type === '=', index);
            safeSetElement(element.value, false);
        }
        index += 1;
    });
    toFurtherDiff.forEach((values) => {
        updateChildren(values.new, values.old.childNodes, safeSetElement);
    });
};

const bindChildren = <TElement extends HTMLOrSVGElement = HTMLOrSVGElement>(domElement: IStringOrDomElement<TElement>, fn: IEffect<ReturnType<typeof html>, TElement>, afterDiff?: ((root: TElement, elements: Map<string, DiffedElements>) => void)) => {
    const elem = getDomElement(domElement);
    createEffect(() => {
        if (elem === null) return;
        const elementsHtml = fn(elem);
        const elements = elementsHtml.childNodes;
        const mapped = new Map<string, DiffedElements>();
        const safeSetElement = (element: Node, isNew: boolean = true) => {
            const elementKey = key(element);
            if (elementKey !== null && elementKey !== undefined && !(element instanceof Text)) {
                const toAdd: DiffedElements = element as DiffedElements;
                toAdd.isNew = isNew;
                mapped.set(elementKey, toAdd);
            }
        };
        updateChildren(elem, elements, safeSetElement);
        if (typeof afterDiff === 'function') {
            createEffect(() => {
                afterDiff(elem, mapped);
            });
        }
    });
    return elem;
};

type IDeprecated = <T extends (...args: any[]) => any>(api: T, msg: string, url?: URL) => T;

const deprecated: IDeprecated = <T extends (...args: any) => any>(api: T, msg: string, url?: URL) => {
    const retval = ((...args: Parameters<T>) => {
        console.warn(`${msg}${url ? `See more at ${url}` : ''}`);
        return api(...args);
    }) as unknown as T;
    return retval;
};

const bindChildrens = deprecated(
    bindChildren,
    '\'bindChildrens\' is deprecated: please use \'bindChildren\' instead.',
    new URL('https://github.com/paoloricciuti/sprinkle-js/issues/3'),
);

export {
    batch,
    bindChildren,
    bindChildrens,
    bindClass,
    bindClasses,
    bindDom,
    bindInnerHTML,
    bindInputValue,
    bindStyle,
    bindTextContent,
    createComputed,
    createCssVariable,
    createEffect,
    createRef,
    createStored,
    createVariable,
    setup,
    untrack,
    html,
};
