import { AppendNode, ICreateEffect, IEffect, IStringOrDomElement } from "./types/index";
declare const createVariable: <T extends Object>(value: T) => T;
declare const createStored: <T extends Object>(key: string, value: T, storage?: Storage) => T;
declare const createRef: (ref: any) => {
    value: any;
};
declare const createEffect: ICreateEffect;
declare const untrack: (fn: () => any) => any;
declare const bindTextContent: <TElement extends HTMLElement = HTMLElement>(domElement: IStringOrDomElement<TElement>, fn: IEffect<string, TElement>) => TElement | null;
declare const bindClass: <TElement extends HTMLElement = HTMLElement>(domElement: IStringOrDomElement<TElement>, className: string, fn: IEffect<boolean, TElement>) => TElement | null;
declare const bindInputValue: (domElement: IStringOrDomElement<HTMLInputElement>, fn: IEffect<string, HTMLInputElement>) => HTMLInputElement | null;
declare const bindDom: <TElement extends HTMLElement = HTMLElement>(domElement: IStringOrDomElement<TElement>, fn: IEffect<any, TElement>) => TElement | null;
declare const bindStyle: <TElement extends HTMLElement = HTMLElement>(domElement: IStringOrDomElement<TElement>, fn: IEffect<any, TElement>) => TElement | undefined;
declare const bindChildrens: <TElement extends HTMLElement = HTMLElement>(domElement: IStringOrDomElement<TElement>, fn: IEffect<NodeListOf<AppendNode<ChildNode>> | AppendNode<ChildNode>[], TElement>) => TElement | null;
export { createEffect, untrack, createRef, createVariable, createStored, bindInputValue, bindTextContent, bindDom, bindClass, bindStyle, bindChildrens };
