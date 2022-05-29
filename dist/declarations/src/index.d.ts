import { AppendNode, ICreateEffect, IEffect, IStringOrDomElement } from "./types/index";
declare const createVariable: <T extends Object>(value: T) => T;
declare const createRef: (ref: any) => {
    value: any;
};
declare const createEffect: ICreateEffect;
declare const untrack: (fn: () => any) => any;
declare const bindTextContent: (domElement: IStringOrDomElement<HTMLElement>, fn: IEffect<string>) => void;
declare const bindClass: (domElement: IStringOrDomElement<HTMLElement>, className: string, fn: IEffect<boolean>) => void;
declare const bindInputValue: (domElement: IStringOrDomElement<HTMLInputElement>, fn: IEffect<string>) => void;
declare const bindDom: (domElement: IStringOrDomElement<HTMLElement>, fn: IEffect<any>) => void;
declare const bindStyle: (domElement: IStringOrDomElement<HTMLElement>, fn: IEffect<any>) => void;
declare const bindChildrens: (domElement: IStringOrDomElement<HTMLElement>, fn: IEffect<NodeListOf<AppendNode>>) => void;
export { createEffect, untrack, createRef, createVariable, bindInputValue, bindTextContent, bindDom, bindClass, bindStyle, bindChildrens };
