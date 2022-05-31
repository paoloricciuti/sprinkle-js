import { AppendNode, ICreateEffect, IEffect, IStringOrDomElement } from "./types/index";
declare const createVariable: <T extends Object>(value: T) => T;
declare const createRef: (ref: any) => {
    value: any;
};
declare const createEffect: ICreateEffect;
declare const untrack: (fn: () => any) => any;
declare const bindTextContent: <TElement extends HTMLElement = HTMLElement>(domElement: IStringOrDomElement<TElement>, fn: IEffect<string, TElement>) => void;
declare const bindClass: <TElement extends HTMLElement = HTMLElement>(domElement: IStringOrDomElement<TElement>, className: string, fn: IEffect<boolean, TElement>) => void;
declare const bindInputValue: (domElement: IStringOrDomElement<HTMLInputElement>, fn: IEffect<string, HTMLInputElement>) => void;
declare const bindDom: <TElement extends HTMLElement = HTMLElement>(domElement: IStringOrDomElement<TElement>, fn: IEffect<any, TElement>) => void;
declare const bindStyle: <TElement extends HTMLElement = HTMLElement>(domElement: IStringOrDomElement<TElement>, fn: IEffect<any, TElement>) => void;
declare const bindChildrens: <TElement extends HTMLElement = HTMLElement>(domElement: IStringOrDomElement<TElement>, fn: IEffect<NodeListOf<AppendNode<ChildNode>>, TElement>) => void;
export { createEffect, untrack, createRef, createVariable, bindInputValue, bindTextContent, bindDom, bindClass, bindStyle, bindChildrens };
