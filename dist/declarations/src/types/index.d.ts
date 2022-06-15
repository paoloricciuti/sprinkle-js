export declare type IEffect<TReturn, TElement extends HTMLElement = HTMLElement> = (elem?: TElement | null) => TReturn;
export declare type Primitive = string | number | boolean;
export declare type OnlyNonPrimitiveKey<T> = keyof {
    [P in keyof T as T[P] extends Primitive ? never : P]: T[P];
};
export declare type IEqualFunction<T> = T extends Primitive | Array<Primitive> ? (before: T, after: T) => boolean : IEqualFunctionMap<T>;
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
}
export declare type IStringOrDomElement<T extends HTMLElement> = string | T;
export declare type IGetDomElementFn = <T extends HTMLElement>(domElement: IStringOrDomElement<T>) => T | null;
export declare type AppendNode<T extends ChildNode = ChildNode> = T & {
    key?: any;
};
