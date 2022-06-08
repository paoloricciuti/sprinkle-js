/**
 * @jest-environment jsdom
 */

import { createRef, bindTextContent, createVariable, createStored, createEffect } from "../src/index";

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

describe("createStored", () => {
    it("throws if you try to pass a non-object like element", () => {
        expect(() => {
            createStored("key", 1);
        }).toThrow();
    });
    it("create a variable with the same properties as the passed in object and it store it in the local storage if the storage had no object with the same key", () => {
        expect(window.localStorage.getItem("key")).toBeNull();
        const ref = createStored("key", { testOne: "one", testTwo: 2, testThree: true });
        expect(ref).toMatchObject({ testOne: "one", testTwo: 2, testThree: true });
        expect(window.localStorage.getItem("key")).toBe(JSON.stringify(ref));
    });
    it("load the variable from the localstorage if there's an object with the same key ignoring the passed in value", () => {
        window.localStorage.setItem("key", JSON.stringify({ testOne: "new-item", testTwo: 5, testThree: false, testFour: "from-storage" }));
        expect(window.localStorage.getItem("key")).not.toBeNull();
        const ref = createStored("key", { testOne: "one", testTwo: 2, testThree: true });
        expect(ref).not.toMatchObject({ testOne: "one", testTwo: 2, testThree: true });
        expect(ref).toMatchObject({ testOne: "new-item", testTwo: 5, testThree: false, testFour: "from-storage" });
        expect(window.localStorage.getItem("key")).toBe(JSON.stringify(ref));
    });
    it("update the storage when the variable get's updated", () => {
        const ref = createStored("key", { testOne: "one", testTwo: 2, testThree: true });
        expect(window.localStorage.getItem("key")).toBe(JSON.stringify(ref));
        ref.testOne = "new-item";
        expect(window.localStorage.getItem("key")).toBe(JSON.stringify(ref));
    });
    it("update the variable when the storage get's updated", () => {
        const ref = createStored("key", { testOne: "one", testTwo: 2, testThree: true });
        expect(window.localStorage.getItem("key")).toBe(JSON.stringify(ref));
        let currentValue = window.localStorage.getItem("key") as string;
        const objectValue = JSON.parse(currentValue);
        objectValue.testOne = "new-item";
        window.localStorage.setItem("key", JSON.stringify(objectValue));
        expect(window.localStorage.getItem("key")).toBe(JSON.stringify(ref));
    });
});

describe("createEffect", () => {
    it("create a function that automatically reruns whenever a dependency (a createRef or createVariable or createSTored) changes", () => {
        const ref = createRef(1);
        const variable = createVariable({ test: "a" });
        const stored = createStored("stored", { testStored: "stored" });
        const logSpy = jest.spyOn(console, 'log');
        const fnToRun = jest.fn(() => console.log(ref.value, variable.test, stored.testStored));
        createEffect(fnToRun);
        expect(logSpy).toHaveBeenCalledWith(1, "a", "stored");
        ref.value++;
        expect(logSpy).toHaveBeenCalledWith(2, "a", "stored");
        variable.test = "b";
        expect(logSpy).toHaveBeenCalledWith(2, "b", "stored");
        stored.testStored = "stored changed";
        expect(logSpy).toHaveBeenCalledWith(2, "b", "stored changed");
    });

    it.todo("runs the cleanup function returned from the create effect before rerunning");
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