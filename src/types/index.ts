export type IEffect<TReturn, TElement extends HTMLElement = HTMLElement> = (elem?: TElement | null) => TReturn;

export type Primitive = string | number | boolean;

export type OnlyNonPrimitiveKey<T> = keyof { [P in keyof T as T[P] extends Primitive ? never : P]: T[P] };

export type IEqualFunction<T> = T extends Primitive | Array<Primitive> ? (before: T, after: T) => boolean : IEqualFunctionMap<T> | ((before: T, after: T) => boolean);

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
    owner: ICreateEffectRunning | null | undefined,
    owned: ICreateEffectRunning[],
    toRun: boolean,
    id?: string,
}

export type IStringOrDomElement<T extends HTMLElement> = string | T;

export type IGetDomElementFn = <T extends HTMLElement>(domElement: IStringOrDomElement<T>) => T | null;

export type DiffedElements = { element: Node, isNew: boolean; };

export type DOMUpdate<T extends HTMLElement = HTMLElement> = { [key in keyof T]?: Partial<T[key]> | Omit<T[key], any> };

export type CSSStyles<T extends HTMLElement = HTMLElement> = Partial<T["style"]> | Omit<Partial<T["style"]>, any>;