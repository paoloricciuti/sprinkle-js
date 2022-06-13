export type IEffect<TReturn, TElement extends HTMLElement = HTMLElement> = (elem?: TElement | null) => TReturn;

export type IEqualFunction<T> = (before: T, after: T) => boolean;

export type IEqualFunctionMap<T extends Object> = {
    [key in keyof T]?: IEqualFunction<T[key]>;
};

export type ICreateEffect = (fn: IEffect<any>) => void;

export type ICreateEffectExecute = () => (() => void) | void;

export type ISubscription = Set<ICreateEffectRunning>;

export interface ICreateEffectRunning {
    execute: ICreateEffectExecute;
    dependencies: Set<ISubscription>;
    cleanup?: () => void;
}

export type IStringOrDomElement<T extends HTMLElement> = string | T;

export type IGetDomElementFn = <T extends HTMLElement>(domElement: IStringOrDomElement<T>) => T | null;

export type AppendNode<T extends ChildNode = ChildNode> = T & { key?: any; };