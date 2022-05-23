declare const createVariable: (value: Object) => Object;
declare const createRef: (ref: any) => Object;
declare const createEffect: ICreateEffect;
declare const bindTextContent: (domElement: IStringOrDomElement<HTMLElement>, fn: IEffect<string>) => void;
declare const bindInputValue: (domElement: IStringOrDomElement<HTMLInputElement>, fn: IEffect<string>) => void;
declare const bindDom: (domElement: IStringOrDomElement<HTMLElement>, fn: IEffect<any>) => void;
declare const bindStyle: (domElement: IStringOrDomElement<HTMLElement>, fn: IEffect<any>) => void;
declare const bindChildrens: (domElement: IStringOrDomElement<HTMLElement>, fn: IEffect<NodeListOf<AppendNode>>) => void;
export { createEffect, createRef, createVariable, bindInputValue, bindTextContent, bindDom, bindStyle, bindChildrens };
