/**
 * @vitest-environment jsdom
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { bindChildrens, bindClasses, bindInnerHTML, bindTextContent, createComputed, createEffect, createRef, createStored, createVariable } from "../src/index";
import { DiffedElements } from '../src/types';

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
    it("is still reactive if i reassign a nested object with an object like value", () => {
        const variable = createVariable({ nested: [[0, 1, 2], [3, 4, 5]] });
        expect(variable).toMatchObject({ nested: [[0, 1, 2], [3, 4, 5]] });
        const logSpy = vi.spyOn(console, 'log');
        createEffect(() => console.log(variable.nested[0][0]));
        expect(logSpy).toHaveBeenCalledWith(0);
        variable.nested = [[6, 7, 8], [9, 10, 11]];
        expect(logSpy).toHaveBeenCalledWith(6);
        variable.nested[0] = [12, 13, 14];
        expect(logSpy).toHaveBeenCalledWith(12);
        variable.nested[0][0] = 15;
        expect(logSpy).toHaveBeenCalledWith(15);
    });
    it("does not create a double proxied value if i pass in a reactive varible to it", () => {
        const variable = createVariable({ matrix: [[0, 1, 2], [3, 4, 5]] });
        const fnToCall = vi.fn(() => console.log(variable.matrix?.[0]?.[0]));
        createEffect(fnToCall);
        expect(fnToCall).toHaveBeenCalledTimes(1);
        variable.matrix = [...variable.matrix, [7, 8, 9]];
        expect(fnToCall).toHaveBeenCalledTimes(2);
        variable.matrix[0][0] = Math.random();
        expect(fnToCall).toHaveBeenCalledTimes(3);
    });
});

describe("createComputed", () => {
    it("create a variable with the same properties as the return value of the function passed in as second argument", () => {
        const variable = createVariable({ testOne: "one", testTwo: 2, testThree: true });
        const computed = createComputed(() => `${variable.testOne} ${variable.testTwo}`);
        expect(computed.value).toBe("one 2");
    });
    it("update it's value whenever one of the variables used in the init function changes", () => {
        const variable = createVariable({ testOne: "one", testTwo: 2, testThree: true });
        const computed = createComputed(() => `${variable.testOne} ${variable.testTwo}`);
        expect(computed.value).toBe("one 2");
        variable.testOne = "changed";
        expect(computed.value).toBe("changed 2");
        variable.testTwo++;
        expect(computed.value).toBe("changed 3");
    });
    it("cannot be updated directly", () => {
        const variable = createVariable({ testOne: "one", testTwo: 2, testThree: true });
        const computed = createComputed(() => `${variable.testOne} ${variable.testTwo}`);
        expect(computed.value).toBe("one 2");
        computed.value = "something else";
        expect(computed.value).toBe("one 2");
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

    afterEach(() => {
        window.localStorage.removeItem("stored");
    });

    it("create a function that automatically reruns whenever a dependency (a createRef or createVariable or createStored or createComputed) changes", () => {
        const ref = createRef(1);
        const variable = createVariable({ test: "a" });
        const stored = createStored("stored", { testStored: "stored" });
        const computed = createComputed(() => `${ref.value} ${variable.test} ${stored.testStored}`);
        const logSpy = vi.spyOn(console, 'log');
        const fnToRun = vi.fn(() => console.log(ref.value, variable.test, stored.testStored, computed.value));
        createEffect(fnToRun);
        expect(logSpy).toHaveBeenCalledWith(1, "a", "stored", "1 a stored");
        ref.value++;
        expect(logSpy).toHaveBeenCalledWith(2, "a", "stored", "2 a stored");
        variable.test = "b";
        expect(logSpy).toHaveBeenCalledWith(2, "b", "stored", "2 b stored");
        stored.testStored = "stored changed";
        expect(logSpy).toHaveBeenCalledWith(2, "b", "stored changed", "2 b stored changed");
    });

    it("not re-run if the value is set but is equal to the old value without passing an object of equalities functions", () => {
        const ref = createRef(1);
        const variable = createVariable({ test: "a" });
        const stored = createStored("stored", { testStored: "stored" });
        const computed = createComputed(() => `${ref.value} ${variable.test} ${stored.testStored}`);
        const fnToRun = vi.fn(() => console.log(ref.value, variable.test, stored.testStored, computed.value));
        createEffect(fnToRun);
        expect(fnToRun).toHaveBeenCalledTimes(1);
        ref.value = 1;
        expect(fnToRun).toHaveBeenCalledTimes(1);
        variable.test = "a";
        expect(fnToRun).toHaveBeenCalledTimes(1);
        stored.testStored = "stored";
        expect(fnToRun).toHaveBeenCalledTimes(1);
    });

    it("rerun if a nested object in a variable changes [no equality functions]", () => {
        const variable = createVariable({ nested: { test: "a" } });
        const logSpy = vi.spyOn(console, 'log');
        createEffect(() => console.log(variable.nested.test));
        expect(logSpy).toHaveBeenCalledWith("a");
        variable.nested.test = "b";
        expect(logSpy).toHaveBeenCalledWith("b");
    });

    it("rerun if a nested object in a variable changes [with partial equality functions]", () => {
        const variable = createVariable({ test: "a", nested: { test: "a" } }, {
            test: (before: string, after: string) => before.length === after.length,
        });
        const logSpy = vi.spyOn(console, 'log');
        const fnToRun = vi.fn(() => console.log(variable.test, variable.nested.test));
        createEffect(fnToRun);
        expect(logSpy).toHaveBeenCalledWith("a", "a");
        variable.test = "b";
        //it will not be called again because b has the same length
        expect(fnToRun).toBeCalledTimes(1);
        variable.test = "bb";
        expect(logSpy).toHaveBeenCalledWith("bb", "a");
        variable.nested.test = "b";
        //it will be called because nested doesn't have a particular equality specified
        expect(logSpy).toHaveBeenCalledWith("bb", "b");
    });

    it("rerun if a nested object in a variable changes [with non reactive variables at the end] [with custom equality functions]", () => {
        const variable = createVariable<{ test: string, nested: HTMLElement; }>({ test: "a", nested: document.createElement("div") }, {
            test: (before: string, after: string) => before.length === after.length,
            nested: (before, after) => before.tagName === after.tagName,
        });
        const logSpy = vi.spyOn(console, 'log');
        const fnToRun = vi.fn(() => console.log(variable.test, variable.nested.tagName));
        createEffect(fnToRun);
        expect(logSpy).toHaveBeenCalledWith("a", "DIV");
        variable.test = "b";
        //it will not be called again because b has the same length
        expect(fnToRun).toBeCalledTimes(1);
        variable.test = "bb";
        expect(logSpy).toHaveBeenCalledWith("bb", "DIV");
        variable.nested = document.createElement("div");
        //it will not be called again because the two divs have the same tagName
        expect(fnToRun).toBeCalledTimes(2);
        variable.nested = document.createElement("span");
        expect(logSpy).toHaveBeenCalledWith("bb", "SPAN");
    });

    it("rerun if a nested object in a variable changes [with equality functions]", () => {
        const variable = createVariable({ nested: { test: "a" } }, {
            nested: {
                //it will be equal if the leght is the same
                test: (before: string, after: string) => before.length === after.length
            }
        });
        const logSpy = vi.spyOn(console, 'log');
        const fnToRun = vi.fn(() => console.log(variable.nested.test));
        createEffect(fnToRun);
        expect(logSpy).toHaveBeenCalledWith("a");
        variable.nested.test = "b";
        //it will not be called again because b has the same length
        expect(fnToRun).toBeCalledTimes(1);
        variable.nested.test = "bb";
        expect(logSpy).toHaveBeenCalledWith("bb");
    });

    it("not re-run if the value is set but is equal to the old value passing an object of equalities functions", () => {
        //custom equality check, before has to be lower than after
        const ref = createRef<number>(1, (before, after) => {
            return after > before;
        });
        const variable = createVariable({ test: "a" }, {
            //custom equality check, is equal if they have the same length
            test: (before, after) => before.length === after.length
        });
        const stored = createStored("stored", { testStored: "stored" }, {
            //custom equality check, is equal but case insensitive
            testStored: (before, after) => {
                return before.toLowerCase() === after.toLowerCase();
            }
        });
        const computed = createComputed(() => `${ref.value} ${variable.test} ${stored.testStored}`, (before, after) => {
            //custom equality for computed value, only if it's the same starting character
            return before.charAt(0) === after.charAt(0);
        });
        const fnToRun = vi.fn(() => console.log(ref.value, variable.test, stored.testStored, computed.value));
        createEffect(fnToRun);
        expect(fnToRun).toHaveBeenCalledTimes(1);
        ref.value = 2;
        expect(fnToRun).toHaveBeenCalledTimes(1);
        ref.value = 1;
        expect(fnToRun).toHaveBeenCalledTimes(2);
        variable.test = "b";
        //no rerun since it has the same lenght
        expect(fnToRun).toHaveBeenCalledTimes(2);
        variable.test = "bb";
        expect(fnToRun).toHaveBeenCalledTimes(3);
        stored.testStored = "STORED";
        //no rerun since it's the same in uppercase
        expect(fnToRun).toHaveBeenCalledTimes(3);
        stored.testStored = "stored changed";
        expect(fnToRun).toHaveBeenCalledTimes(4);
    });

    it("not run multiple times in case there are nested createEffect calls", () => {

        const variable = createVariable({ test: true, test2: true, skip: false });

        const nestedEffect = vi.fn(() => {
            variable.test;
            variable.test2;
        });
        const firstEffect = vi.fn(() => {
            variable.test;
            if (!variable.skip) {
                createEffect(nestedEffect);
            }
        });
        createEffect(firstEffect);

        expect(firstEffect).toHaveBeenCalledTimes(1);
        expect(nestedEffect).toHaveBeenCalledTimes(1);

        variable.test = !variable.test;

        expect(firstEffect).toHaveBeenCalledTimes(2);
        expect(nestedEffect).toHaveBeenCalledTimes(2);

        variable.test2 = !variable.test2;

        expect(firstEffect).toHaveBeenCalledTimes(2);
        expect(nestedEffect).toHaveBeenCalledTimes(3);

        variable.skip = !variable.skip;

        expect(firstEffect).toHaveBeenCalledTimes(3);
        expect(nestedEffect).toHaveBeenCalledTimes(3);

        variable.test2 = !variable.test2;

        expect(firstEffect).toHaveBeenCalledTimes(3);
        expect(nestedEffect).toHaveBeenCalledTimes(3);

        variable.test = !variable.test;

        expect(firstEffect).toHaveBeenCalledTimes(4);
        expect(nestedEffect).toHaveBeenCalledTimes(3);

        variable.skip = !variable.skip;

        expect(firstEffect).toHaveBeenCalledTimes(5);
        expect(nestedEffect).toHaveBeenCalledTimes(4);

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
            bindTextContent("#to-bind", () => ref.value.toString());
            expect(toBindDiv.textContent).toBe("1");
            ref.value++;
            expect(toBindDiv.textContent).toBe("2");
        });
    });

    describe("bindInnerHTML ", () => {
        it("bind a value of a ref or a variable to the innerHTML of an input element", () => {
            const ref = createRef(1);
            bindInnerHTML("#to-bind", () => `<span>${ref.value.toString()}</span>`);
            expect(toBindDiv.firstChild).toBeInstanceOf(HTMLSpanElement);
            expect(toBindDiv.firstChild?.textContent).toBe("1");
            ref.value++;
            expect(toBindDiv.firstChild).toBeInstanceOf(HTMLSpanElement);
            expect(toBindDiv.firstChild?.textContent).toBe("2");
        });
    });

    describe("bindClasses ", () => {
        it("bind a set of classes represented by an object of booleans to the classname of an element", () => {
            const ref = createRef<number>(1);
            bindClasses("#to-bind", () => ({
                one: ref.value === 1,
                two: ref.value === 2,
                three: ref.value === 3,
                lessThanFive: ref.value < 5,
            }));
            expect(toBindDiv.classList.contains("one")).toBe(true);
            expect(toBindDiv.classList.contains("two")).toBe(false);
            expect(toBindDiv.classList.contains("three")).toBe(false);
            expect(toBindDiv.classList.contains("lessThanFive")).toBe(true);
            ref.value++;
            expect(toBindDiv.classList.contains("one")).toBe(false);
            expect(toBindDiv.classList.contains("two")).toBe(true);
            expect(toBindDiv.classList.contains("three")).toBe(false);
            expect(toBindDiv.classList.contains("lessThanFive")).toBe(true);
            ref.value++;
            expect(toBindDiv.classList.contains("one")).toBe(false);
            expect(toBindDiv.classList.contains("two")).toBe(false);
            expect(toBindDiv.classList.contains("three")).toBe(true);
            expect(toBindDiv.classList.contains("lessThanFive")).toBe(true);
            ref.value++;
            expect(toBindDiv.classList.contains("one")).toBe(false);
            expect(toBindDiv.classList.contains("two")).toBe(false);
            expect(toBindDiv.classList.contains("three")).toBe(false);
            expect(toBindDiv.classList.contains("lessThanFive")).toBe(true);
            ref.value++;
            expect(toBindDiv.classList.contains("one")).toBe(false);
            expect(toBindDiv.classList.contains("two")).toBe(false);
            expect(toBindDiv.classList.contains("three")).toBe(false);
            expect(toBindDiv.classList.contains("lessThanFive")).toBe(false);
        });
    });

    describe("bindChildrens", () => {
        it("bind a string representing html as the children of an element. (elements with the same key does not get's replaced)", () => {
            const variable = createVariable({ array: [1, 2, 3] });
            bindChildrens("#to-bind", () => `
            <ul>
                ${variable.array.map(el => `<li key="${el}">${el}</li>`).join('')}
            </ul>
            `);
            const ul = toBindDiv.children[0];
            expect(ul.tagName).toBe("UL");
            expect(ul.children.length).toBe(3);
            Array.from(ul.children).forEach((li, i) => {
                expect(li.tagName).toBe("LI");
                expect(li.textContent).toBe(variable.array[i].toString());
            });
        });
        it("bind a string representing html as the children of an element and run an after run function givind the user a map key -> element on the page. (elements with the same key does not get's replaced)", () => {
            const variable = createVariable({ array: [1, 2, 3] });
            let equalsNodes: { keyIndex: number, node: Node; }[] = [];
            const afterRun = vi.fn((element, elements: Map<string, DiffedElements>) => {
                expect(element).toBe(toBindDiv);
                elements.forEach((node, key) => {
                    if (key !== "element")
                        expect(key).toBe(node.element.textContent);
                });
                equalsNodes.forEach(oldNode => {
                    const actualElement = elements.get(variable.array[oldNode.keyIndex].toString());
                    if (oldNode.keyIndex !== 0) {
                        expect(actualElement?.isNew).toBe(false);
                        expect(oldNode.node).toBe(actualElement?.element);
                    } else {
                        expect(actualElement?.isNew).toBe(true);
                        expect(oldNode.node).not.toBe(actualElement?.element);
                    }
                });
            });
            bindChildrens("#to-bind", () => `${variable.array.map(el => `<li key="${el}">${el}</li>`).join('')}`, afterRun);
            expect(toBindDiv.children.length).toBe(3);
            Array.from(toBindDiv.children).forEach((li, i) => {
                expect(li.tagName).toBe("LI");
                expect(li.textContent).toBe(variable.array[i].toString());
                equalsNodes.push({ keyIndex: i, node: li });
            });
            expect(afterRun).toHaveBeenCalledTimes(1);

            variable.array[0] = 4;

            expect(toBindDiv.children.length).toBe(3);
            Array.from(toBindDiv.children).forEach((li, i) => {
                expect(li.tagName).toBe("LI");
                expect(li.textContent).toBe(variable.array[i].toString());
            });
            expect(afterRun).toHaveBeenCalledTimes(2);
        });
    });
});