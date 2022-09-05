export type HTMLOrSVGElement = HTMLElement | SVGElement;

export type IEffect<TReturn, TElement extends HTMLOrSVGElement = HTMLOrSVGElement> = (elem?: TElement | null) => TReturn;

export type Primitive = string | number | boolean;

export type ICssVariable = Record<string | symbol | number, string | number>;

export type OnlyNonPrimitiveKey<T> = keyof { [P in keyof T as T[P] extends Primitive ? never : P]: T[P] };

export type IEqualFunction<T> = T extends Primitive | Array<Primitive> ? (before: T, after: T) => boolean : T extends object ? IEqualFunctionMap<T> | ((before: T, after: T) => boolean) : never;

export type IEqualFunctionMap<T extends object> = {
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

export type IStringOrDomElement<T extends HTMLOrSVGElement> = string | T;

export type IGetDomElementFn = <T extends HTMLOrSVGElement>(domElement: IStringOrDomElement<T>) => T | null;

export type DiffedElements = { element: Node, isNew: boolean; };

export type DOMUpdate<T extends HTMLOrSVGElement = HTMLOrSVGElement> = { [key in keyof T]?: Partial<T[key]> | Omit<T[key], any> };

export type CSSStyles<T extends HTMLOrSVGElement = HTMLOrSVGElement> = Partial<T["style"]> | Omit<Partial<T["style"]>, any>;