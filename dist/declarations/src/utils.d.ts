import { IGetDomElementFn } from "./types/index";
declare const getDomElement: IGetDomElementFn;
declare const updateDom: (domElement: any, properties: any, namespace?: string[]) => void;
declare const diff: <T>(arr?: T[], arr2?: T[], eq?: (a: T, b: T) => boolean) => {
    type: string;
    value: T;
    skip: boolean;
}[];
declare const findNext: <T>(arr: T[], eq: (element: T, index: number, array: T[]) => boolean, index?: number) => T | undefined;
declare const getRawType: (obj: unknown) => string;
declare const html: (innerHTML: string) => DocumentFragment;
declare const attribute: (element: Element, attribute: string) => string | null;
declare const key: (element: Node) => string | null;
export { getDomElement, findNext, diff, updateDom, getRawType, html, attribute, key, };
