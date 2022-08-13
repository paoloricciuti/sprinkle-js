export declare type IEffect<TReturn, TElement extends HTMLElement = HTMLElement> = (elem?: TElement | null) => TReturn;
export declare type Primitive = string | number | boolean;
export declare type ICssVariable = Record<string | symbol | number, string | number>;
export declare type OnlyNonPrimitiveKey<T> = keyof {
    [P in keyof T as T[P] extends Primitive ? never : P]: T[P];
};
export declare type IEqualFunction<T> = T extends Primitive | Array<Primitive> ? (before: T, after: T) => boolean : IEqualFunctionMap<T> | ((before: T, after: T) => boolean);
export declare type IEqualFunctionMap<T extends Object> = {
    [key in keyof T]?: IEqualFunction<T[key]>;
};
export declare type ICreateEffect = (fn: IEffect<any>) => void;
export declare type ICreateEffectExecute = () => (() => void) | void;
export declare type ISubscription = Set<ICreateEffectRunning>;
export interface ICreateEffectRunning {
    execute: ICreateEffectExecute;
    dependencies: Set<ISubscription>;
    cleanup?: () => void;
    owner: ICreateEffectRunning | null | undefined;
    owned: ICreateEffectRunning[];
    toRun: boolean;
    id?: string;
}
export declare type IStringOrDomElement<T extends HTMLElement> = string | T;
export declare type IGetDomElementFn = <T extends HTMLElement>(domElement: IStringOrDomElement<T>) => T | null;
export declare type DiffedElements = {
    element: Node;
    isNew: boolean;
};
export declare type DOMUpdate<T extends HTMLElement = HTMLElement> = {
    [key in keyof T]?: Partial<T[key]> | Omit<T[key], any>;
};
export declare type CSSStyles<T extends HTMLElement = HTMLElement> = Partial<T["style"]> | Omit<Partial<T["style"]>, any>;
