declare const createVariable: <T extends Object>(value: T) => T;
declare const createRef: (ref: any) => {
    value: any;
};
declare const createEffect: ICreateEffect;
declare const bindTextContent: (domElement: IStringOrDomElement<HTMLElement>, fn: IEffect<string>) => void;
declare const bindInputValue: (domElement: IStringOrDomElement<HTMLInputElement>, fn: IEffect<string>) => void;
declare const bindDom: (domElement: IStringOrDomElement<HTMLElement>, fn: IEffect<any>) => void;
declare const bindStyle: (domElement: IStringOrDomElement<HTMLElement>, fn: IEffect<any>) => void;
declare const bindChildrens: <T extends ChildNode>(domElement: IStringOrDomElement<HTMLElement>, fn: IEffect<NodeListOf<AppendNode<T>>>) => void;
export { createEffect, createRef, createVariable, bindInputValue, bindTextContent, bindDom, bindStyle, bindChildrens };
