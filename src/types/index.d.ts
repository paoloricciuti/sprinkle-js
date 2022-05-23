type IEffect<T> = () => T;

type ICreateEffect = (fn: IEffect<any>) => void;

type ICreateEffectExecute = () => void;

type ISubscription = Set<ICreateEffectRunning>;

interface ICreateEffectRunning {
    execute: ICreateEffectExecute;
    dependencies: Set<ISubscription>;
}

type IStringOrDomElement<T extends HTMLElement> = string | T;

type IGetDomElementFn = <T extends HTMLElement>(domElement: IStringOrDomElement<T>) => T | null;

interface AppendNode extends ChildNode {
    key?: any;
}