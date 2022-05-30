/**
 * @jest-environment jsdom
 */

import { createRef, bindTextContent, createVariable, createEffect } from "../dist/sprinkle-js.cjs";

describe("createRef", () => {
    it("create a variable with a value property set to the passed in value", () => {
        const ref = createRef(1);
        expect(ref).toHaveProperty("value");
        expect(ref.value).toBe(1);
    });
});

describe("createVariable", () => {
    it("throws if you try to pass a non-object like element", () => {
        expect(() => {
            createVariable(1);
        }).toThrow();
    });
    it("create a variable with the same properties as the passed in object", () => {
        const ref = createVariable({ testOne: "one", testTwo: 2, testThree: true });
        expect(ref).toMatchObject({ testOne: "one", testTwo: 2, testThree: true });
    });
});

describe("createEffect", () => {
    it("create a function that automatically reruns whenever a dependency (a createRef or createVariable) changes", () => {
        const ref = createRef(1);
        const variable = createVariable({ test: "a" });
        let variableToUpdate: string = "";
        createEffect(() => {
            variableToUpdate = ref.value + variable.test;
        });
        expect(variableToUpdate).toBe("1a");
        ref.value++;
        expect(variableToUpdate).toBe("2a");
        variable.test = "b";
        expect(variableToUpdate).toBe("2b");
    });
});

describe("DOM manipulation by bindind", () => {
    let toBindDiv: HTMLElement;
    beforeEach(() => {
        document.body.innerHTML = `<div id="to-bind"></div>`;
        toBindDiv = document.querySelector("#to-bind") as HTMLElement;
    });
    describe("bindTextContent ", () => {
        it("bind a value of a ref or a variable to the textContent of an input element", () => {
            const ref = createRef(1);
            bindTextContent("#to-bind", () => ref.value);
            expect(toBindDiv.textContent).toBe("1");
            ref.value++;
            expect(toBindDiv.textContent).toBe("2");
        });
    });
});