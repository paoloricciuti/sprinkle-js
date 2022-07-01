import { IGetDomElementFn } from "./types/index";
declare const getDomElement: IGetDomElementFn;
declare const updateDom: (domElement: any, properties: any, namespace?: string[]) => void;
declare const diff: <T>(arr?: T[], arr2?: T[], eq?: (a: T, b: T) => boolean) => {
    type: string;
    value: T;
}[];
declare const findNext: <T>(arr: T[], eq: (element: T, index: number, array: T[]) => boolean, index?: number) => T | undefined;
declare const getRawType: (obj: unknown) => string;
export { getDomElement, findNext, diff, updateDom, getRawType, };
