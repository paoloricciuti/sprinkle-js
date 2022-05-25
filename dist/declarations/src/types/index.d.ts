export declare type IEffect<T> = () => T;
export declare type ICreateEffect = (fn: IEffect<any>) => void;
export declare type ICreateEffectExecute = () => void;
export declare type ISubscription = Set<ICreateEffectRunning>;
export interface ICreateEffectRunning {
    execute: ICreateEffectExecute;
    dependencies: Set<ISubscription>;
}
export declare type IStringOrDomElement<T extends HTMLElement> = string | T;
export declare type IGetDomElementFn = <T extends HTMLElement>(domElement: IStringOrDomElement<T>) => T | null;
export declare type AppendNode<T extends ChildNode = ChildNode> = T & {
    key?: any;
};
