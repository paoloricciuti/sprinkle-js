import { CSSStyles, DiffedElements, DOMUpdate, ICreateEffect, ICssVariable, IEffect, IEqualFunction, IEqualFunctionMap, IStringOrDomElement, Primitive } from "./types/index";
declare const batch: (fn: Function) => void;
declare const createVariable: <T extends object>(value: T, eq?: IEqualFunctionMap<T>) => T;
declare const createCssVariable: <T extends ICssVariable, E extends HTMLElement = HTMLHtmlElement>(value: T, eq?: IEqualFunctionMap<T>, root?: IStringOrDomElement<E>) => T;
declare const createComputed: <T>(fn: () => T, eq?: IEqualFunction<T>) => {
    value: T;
};
declare const createStored: <T extends Object>(key: string, value: T, eq?: IEqualFunctionMap<T>, storage?: Storage) => T;
declare const createRef: <T extends Primitive>(ref: T, eq?: IEqualFunction<T>) => {
    value: T;
};
declare const createEffect: ICreateEffect;
declare const untrack: (fn: () => any) => any;
declare const bindTextContent: <TElement extends HTMLElement = HTMLElement>(domElement: IStringOrDomElement<TElement>, fn: IEffect<string, TElement>) => TElement;
declare const bindInnerHTML: <TElement extends HTMLElement = HTMLElement>(domElement: IStringOrDomElement<TElement>, fn: IEffect<string, TElement>) => TElement;
declare const bindClass: <TElement extends HTMLElement = HTMLElement>(domElement: IStringOrDomElement<TElement>, className: string, fn: IEffect<boolean, TElement>) => TElement;
declare const bindClasses: <TElement extends HTMLElement = HTMLElement>(domElement: IStringOrDomElement<TElement>, fn: IEffect<{
    [key: string]: boolean;
}, TElement>) => TElement;
declare const bindInputValue: (domElement: IStringOrDomElement<HTMLInputElement>, fn: IEffect<string, HTMLInputElement>) => HTMLInputElement;
declare const bindDom: <TElement extends HTMLElement = HTMLElement>(domElement: IStringOrDomElement<TElement>, fn: IEffect<DOMUpdate<TElement>, TElement>) => TElement;
declare const bindStyle: <TElement extends HTMLElement = HTMLElement>(domElement: IStringOrDomElement<TElement>, fn: IEffect<CSSStyles<TElement>, TElement>) => TElement;
declare const bindChildrens: <TElement extends HTMLElement = HTMLElement>(domElement: IStringOrDomElement<TElement>, fn: IEffect<string, TElement>, afterDiff?: (root: TElement, elements: Map<string, DiffedElements>) => void) => TElement;
export { createEffect, untrack, batch, createRef, createVariable, createCssVariable, createComputed, createStored, bindInputValue, bindInnerHTML, bindTextContent, bindDom, bindClass, bindClasses, bindStyle, bindChildrens };
