export declare type IEffect<TReturn, TElement extends HTMLElement = HTMLElement> = (elem?: TElement | null) => TReturn;
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
