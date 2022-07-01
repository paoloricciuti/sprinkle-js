import { IGetDomElementFn, IStringOrDomElement } from "./types/index";

const getDomElement: IGetDomElementFn = <T extends HTMLElement>(domElement: IStringOrDomElement<T>) => {
    return typeof domElement === "string" ? document.querySelector<T>(domElement) : domElement;
};

const updateDom = (domElement: any, properties: any, namespace: string[] = []) => {
    const entries = Object.entries(properties);
    for (let [property, value] of entries) {
        if (typeof value === "object") {
            updateDom(domElement, value, [...namespace, property]);
            return;
        }
        let toUpdate = domElement;
        for (const ns of namespace) {
            toUpdate = toUpdate[ns];
        }
        if (namespace[namespace.length - 1] === "style") {
            toUpdate.setProperty(property, value);
        }
        toUpdate[property] = value;
    }
};

//method to create a x times y matrix filled with 0s
const createMatrix = (x: number, y: number): number[][] => [...Array(x).keys()].map(() => Array(y).fill(0));

const diff = <T>(arr: T[] = [], arr2: T[] = [], eq = ((a: T, b: T) => a === b)) => {
    //create a matrix with the two lengths +1
    const matrix = createMatrix(arr.length + 1, arr2.length + 1);
    //initialize the first row
    for (let x = 0; x < arr.length + 1; x++) {
        matrix[x][0] = x;
    }
    //initialize the first column
    for (let y = 0; y < arr2.length + 1; y++) {
        matrix[0][y] = y;
    }
    //cicle through the two arrays
    for (let x = 0; x < arr.length; x++) {
        for (let y = 0; y < arr2.length; y++) {
            //if the two elements are equal
            if (eq(arr[x], arr2[y])) {
                //set the diagonal element equal to the current one
                matrix[x + 1][y + 1] = matrix[x][y];
            } else {
                //else set the diagonal element to the min between the bottom and right element
                const min = Math.min(matrix[x + 1][y], matrix[x][y + 1]) + 1;
                matrix[x + 1][y + 1] = min;
            }
        }
    }
    //inizialize the stack
    const stack = [];
    //get the lenghts of the arrays
    let i = arr.length;
    let j = arr2.length;
    //while one of the two lengths is greater than 0
    while (i > 0 && j > 0) {
        //if the inth and jnth elements of the array are equals
        if (eq(arr[i - 1], arr2[j - 1])) {
            //prepend the current value with a type of equal
            stack.unshift({ type: "=", value: arr[i - 1] });
            j--;
            i--;
        } else {
            //else we check the best spot base on the matrix
            if (matrix[i - 1][j] < matrix[i][j - 1]) {
                stack.unshift({ type: "-", value: arr[i - 1] });
                i--;
            } else {
                stack.unshift({ type: "+", value: arr2[j - 1] });
                j--;
            }
        }
    }
    if (i > 0) {
        stack.unshift(...(arr?.slice?.(0, i)?.map?.(value => ({ type: "-", value })) || []));
    } else if (j > 0) {
        stack.unshift(...(arr2?.slice?.(0, j)?.map?.(value => ({ type: "+", value })) || []));
    }
    return stack;
};

const findNext = <T>(arr: T[], eq: (element: T, index: number, array: T[]) => boolean, index: number = 0) => arr.find((element, i, ...props) => i > index && eq(element, i, ...props));

const getRawType = (obj: unknown) => Object.prototype.toString.call(obj).slice(8, -1);

export {
    getDomElement,
    findNext,
    diff,
    updateDom,
    getRawType,
};