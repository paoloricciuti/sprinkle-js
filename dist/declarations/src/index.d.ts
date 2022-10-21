import { CSSStyles, DiffedElements, DOMUpdate, HTMLOrSVGElement, ICreateEffect, ICssVariable, IEffect, IEqualFunction, IEqualFunctionMap, ISetupOptions, IStringOrDomElement, Primitive } from './types/index';
declare const IS_COMPUTED_WRITABLE: unique symbol;
declare const batch: (fn: Function) => void;
declare const createCssVariable: <T extends ICssVariable, E extends HTMLOrSVGElement = HTMLHtmlElement>(value: T, eq?: IEqualFunctionMap<T>, root?: IStringOrDomElement<E>) => T;
declare const createStored: <T extends Object>(storageKey: string, value: T, eq?: IEqualFunctionMap<T>, storage?: Storage) => T;
declare const createRef: <T extends Primitive>(ref: T, eq?: IEqualFunction<T>) => {
    value: T;
};
declare const createVariable: <T extends object>(value: T, eq?: IEqualFunctionMap<T>) => T;
declare const createEffect: ICreateEffect;
declare const createComputed: <T>(fn: () => T, eq?: IEqualFunction<T>) => {
    value: T;
    [IS_COMPUTED_WRITABLE]: boolean;
};
declare const setup: (options?: ISetupOptions) => () => void;
declare const untrack: (fn: () => any) => any;
declare const bindTextContent: <TElement extends HTMLOrSVGElement = HTMLOrSVGElement>(domElement: IStringOrDomElement<TElement>, fn: IEffect<string, TElement>) => TElement;
declare const bindInnerHTML: <TElement extends HTMLOrSVGElement = HTMLOrSVGElement>(domElement: IStringOrDomElement<TElement>, fn: IEffect<string, TElement>) => TElement;
declare const bindClass: <TElement extends HTMLOrSVGElement = HTMLOrSVGElement>(domElement: IStringOrDomElement<TElement>, className: string, fn: IEffect<boolean, TElement>) => TElement;
declare const bindClasses: <TElement extends HTMLOrSVGElement = HTMLOrSVGElement>(domElement: IStringOrDomElement<TElement>, fn: IEffect<{
    [key: string]: boolean;
}, TElement>) => TElement;
declare const bindInputValue: (domElement: IStringOrDomElement<HTMLInputElement>, fn: IEffect<string, HTMLInputElement>) => HTMLInputElement;
declare const bindDom: <TElement extends HTMLOrSVGElement = HTMLOrSVGElement>(domElement: IStringOrDomElement<TElement>, fn: IEffect<DOMUpdate<TElement>, TElement>) => TElement;
declare const bindStyle: <TElement extends HTMLOrSVGElement = HTMLOrSVGElement>(domElement: IStringOrDomElement<TElement>, fn: IEffect<CSSStyles<TElement>, TElement>) => TElement;
declare const FROM_H: unique symbol;
declare const html: (strings: TemplateStringsArray, ...els: any[]) => DocumentFragment & {
    [FROM_H]?: boolean;
};
declare const bindChildren: <TElement extends HTMLOrSVGElement = HTMLOrSVGElement>(domElement: IStringOrDomElement<TElement>, fn: IEffect<DocumentFragment & {
    [FROM_H]?: boolean;
}, TElement>, afterDiff?: (root: TElement, elements: Map<string, DiffedElements>) => void) => TElement;
declare const bindChildrens: <TElement extends HTMLOrSVGElement = HTMLOrSVGElement>(domElement: IStringOrDomElement<TElement>, fn: IEffect<DocumentFragment & {
    [FROM_H]?: boolean;
}, TElement>, afterDiff?: (root: TElement, elements: Map<string, DiffedElements>) => void) => TElement;
export { batch, bindChildren, bindChildrens, bindClass, bindClasses, bindDom, bindInnerHTML, bindInputValue, bindStyle, bindTextContent, createComputed, createCssVariable, createEffect, createRef, createStored, createVariable, setup, untrack, html, };
