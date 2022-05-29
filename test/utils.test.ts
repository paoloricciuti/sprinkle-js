import { diff } from "../src/utils";

describe("the diff function is present in utils and works as expected", () => {

    it("is a function", () => {
        expect(typeof diff).toBe("function");
    });

    it(`return an array with an object with the type + and the actual element added
    when the first array is empty and the second contain a new value`, () => {
        const oldArray: number[] = [];
        const newArray: number[] = [0];
        const result = diff(oldArray, newArray);
        expect(result).toHaveLength(1);
        expect(result).toContainEqual({ type: "+", value: 0 });
    });
    it(`return an array with an object with the type - and the actual element removed
    when the second array is empty and the first contain a value`, () => {
        const oldArray: number[] = [0];
        const newArray: number[] = [];
        const result = diff(oldArray, newArray);
        expect(result).toHaveLength(1);
        expect(result).toContainEqual({ type: "-", value: 0 });
    });
    it(`return an array with the type = and the actual element removed
    when the two arrays are both with one equal element`, () => {
        const oldArray: number[] = [0];
        const newArray: number[] = [0];
        const result = diff(oldArray, newArray);
        expect(result).toHaveLength(1);
        expect(result).toContainEqual({ type: "=", value: 0 });
    });
});