export type IEffect<T> = () => T;

export type ICreateEffect = (fn: IEffect<any>) => void;

export type ICreateEffectExecute = () => void;

export type ISubscription = Set<ICreateEffectRunning>;

export interface ICreateEffectRunning {
    execute: ICreateEffectExecute;
    dependencies: Set<ISubscription>;
}

export type IStringOrDomElement<T extends HTMLElement> = string | T;

export type IGetDomElementFn = <T extends HTMLElement>(domElement: IStringOrDomElement<T>) => T | null;

export type AppendNode<T extends ChildNode = ChildNode> = T & { key?: any; };