/* eslint-disable @typescript-eslint/no-unused-expressions */
/**
 * @vitest-environment jsdom
 */

import { afterEach, beforeEach, afterAll, describe, expect, it, vi } from 'vitest';
import { batch, setup, bindChildren, bindClass, bindClasses, bindDom, bindInnerHTML, bindInputValue, bindStyle, bindTextContent, createComputed, createCssVariable, createEffect, createRef, createStored, createVariable, untrack, html } from '../src/index';
import { DiffedElements } from '../src/types';

describe('createRef', () => {
    it('create a variable with a value property set to the passed in value', () => {
        const ref = createRef(1);
        expect(ref).toHaveProperty('value');
        expect(ref.value).toBe(1);
    });
});

describe('setup', () => {
    let resetSetup: () => void;
    it('uses createVariable and createEffect defined in the setup function', () => {
        const createVariableFn = vi.fn((obj) => obj);
        const createEffectFn = vi.fn(() => { });
        const createComputedFn = vi.fn((fn) => ({ value: fn() }));
        resetSetup = setup({
            createVariable: createVariableFn,
            createEffect: createEffectFn,
            createComputed: createComputedFn,
        });

        createVariable({ test: true });
        createEffect(() => { });
        createComputed(() => true);

        expect(createVariableFn).toBeCalled();
        expect(createEffectFn).toBeCalled();
        expect(createComputedFn).toBeCalled();
    });
    afterAll(() => {
        resetSetup();
    });
});

describe('createVariable', () => {
    it('throws if you try to pass a non-object like element', () => {
        expect(() => {
            // @ts-expect-error
            createVariable(1);
        }).toThrow();
    });
    it('create a variable with the same properties as the passed in object', () => {
        const ref = createVariable({ testOne: 'one', testTwo: 2, testThree: true });
        expect(ref).toMatchObject({ testOne: 'one', testTwo: 2, testThree: true });
    });
    it('is still reactive if i reassign a nested object with an object like value', () => {
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
    it('does not create a double proxied value if i pass in a reactive varible to it', () => {
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

describe('createCssVariable', () => {
    it('create a variable and bind every property to a css variable on the root', () => {
        const variable = createCssVariable({
            x: 0,
            y: 0,
        });
        const root = document.querySelector(':root') as HTMLElement;
        let computedStyle = getComputedStyle(root);
        expect(computedStyle.getPropertyValue('--x')).toBe(variable.x.toString());
        expect(computedStyle.getPropertyValue('--y')).toBe(variable.y.toString());
        variable.x += 1;
        computedStyle = getComputedStyle(root);
        expect(computedStyle.getPropertyValue('--x')).toBe(variable.x.toString());
        variable.y += 1;
        computedStyle = getComputedStyle(root);
        expect(computedStyle.getPropertyValue('--y')).toBe(variable.y.toString());
    });

    it('create a variable and bind every property to a css variable on the passed in element', () => {
        document.body.innerHTML = '<div id="to-bind"></div>';
        const toBindDiv = document.querySelector('#to-bind') as HTMLElement;
        const variable = createCssVariable({
            x: 0,
            y: 0,
        }, undefined, toBindDiv);
        let computedStyle = getComputedStyle(toBindDiv);
        expect(computedStyle.getPropertyValue('--x')).toBe(variable.x.toString());
        expect(computedStyle.getPropertyValue('--y')).toBe(variable.y.toString());
        variable.x += 1;
        computedStyle = getComputedStyle(toBindDiv);
        expect(computedStyle.getPropertyValue('--x')).toBe(variable.x.toString());
        variable.y += 1;
        computedStyle = getComputedStyle(toBindDiv);
        expect(computedStyle.getPropertyValue('--y')).toBe(variable.y.toString());
    });

    it('create a variable and bind every property to a css variable on the root if the passed in element is null', () => {
        const variable = createCssVariable({
            x: 0,
            y: 0,
        }, undefined, '#non-existent-id');
        const root = document.querySelector(':root') as HTMLElement;
        let computedStyle = getComputedStyle(root);
        expect(computedStyle.getPropertyValue('--x')).toBe(variable.x.toString());
        expect(computedStyle.getPropertyValue('--y')).toBe(variable.y.toString());
        variable.x += 1;
        computedStyle = getComputedStyle(root);
        expect(computedStyle.getPropertyValue('--x')).toBe(variable.x.toString());
        variable.y += 1;
        computedStyle = getComputedStyle(root);
        expect(computedStyle.getPropertyValue('--y')).toBe(variable.y.toString());
    });
});

describe('createComputed', () => {
    it('create a variable with the same properties as the return value of the function passed in as second argument', () => {
        const variable = createVariable({ testOne: 'one', testTwo: 2, testThree: true });
        const computed = createComputed(() => `${variable.testOne} ${variable.testTwo}`);
        expect(computed.value).toBe('one 2');
    });
    it("update it's value whenever one of the variables used in the init function changes", () => {
        const variable = createVariable({ testOne: 'one', testTwo: 2, testThree: true });
        const computed = createComputed(() => `${variable.testOne} ${variable.testTwo}`);
        expect(computed.value).toBe('one 2');
        variable.testOne = 'changed';
        expect(computed.value).toBe('changed 2');
        variable.testTwo += 1;
        expect(computed.value).toBe('changed 3');
    });
    it('cannot be updated directly', () => {
        const variable = createVariable({ testOne: 'one', testTwo: 2, testThree: true });
        const computed = createComputed(() => `${variable.testOne} ${variable.testTwo}`);
        expect(computed.value).toBe('one 2');
        computed.value = 'something else';
        expect(computed.value).toBe('one 2');
    });
});

describe('createStored', () => {
    it('throws if you try to pass a non-object like element', () => {
        expect(() => {
            createStored('key', 1);
        }).toThrow();
    });
    it('create a variable with the same properties as the passed in object and it store it in the local storage if the storage had no object with the same key', () => {
        expect(window.localStorage.getItem('key')).toBeNull();
        const ref = createStored('key', { testOne: 'one', testTwo: 2, testThree: true });
        expect(ref).toMatchObject({ testOne: 'one', testTwo: 2, testThree: true });
        expect(window.localStorage.getItem('key')).toBe(JSON.stringify(ref));
    });
    it("load the variable from the localstorage if there's an object with the same key ignoring the passed in value", () => {
        window.localStorage.setItem('key', JSON.stringify({ testOne: 'new-item', testTwo: 5, testThree: false, testFour: 'from-storage' }));
        expect(window.localStorage.getItem('key')).not.toBeNull();
        const ref = createStored('key', { testOne: 'one', testTwo: 2, testThree: true });
        expect(ref).not.toMatchObject({ testOne: 'one', testTwo: 2, testThree: true });
        expect(ref).toMatchObject({ testOne: 'new-item', testTwo: 5, testThree: false, testFour: 'from-storage' });
        expect(window.localStorage.getItem('key')).toBe(JSON.stringify(ref));
    });
    it("update the storage when the variable get's updated", () => {
        const ref = createStored('key', { testOne: 'one', testTwo: 2, testThree: true });
        expect(window.localStorage.getItem('key')).toBe(JSON.stringify(ref));
        ref.testOne = 'new-item';
        expect(window.localStorage.getItem('key')).toBe(JSON.stringify(ref));
    });
    it("update the variable when the storage get's updated", () => {
        const ref = createStored('key', { testOne: 'one', testTwo: 2, testThree: true });
        expect(window.localStorage.getItem('key')).toBe(JSON.stringify(ref));
        const currentValue = window.localStorage.getItem('key') as string;
        const objectValue = JSON.parse(currentValue);
        objectValue.testOne = 'new-item';
        window.localStorage.setItem('key', JSON.stringify(objectValue));
        expect(window.localStorage.getItem('key')).toBe(JSON.stringify(ref));
    });
});

describe('createEffect', () => {
    afterEach(() => {
        window.localStorage.removeItem('stored');
    });

    it('create a function that automatically reruns whenever a dependency (a createRef or createVariable or createStored or createComputed) changes', () => {
        const ref = createRef(1);
        const variable = createVariable({ test: 'a' });
        const stored = createStored('stored', { testStored: 'stored' });
        const computed = createComputed(() => `${ref.value} ${variable.test} ${stored.testStored}`);
        const logSpy = vi.spyOn(console, 'log');
        const fnToRun = vi.fn(() => console.log(ref.value, variable.test, stored.testStored, computed.value));
        createEffect(fnToRun);
        expect(logSpy).toHaveBeenCalledWith(1, 'a', 'stored', '1 a stored');
        ref.value += 1;
        expect(logSpy).toHaveBeenCalledWith(2, 'a', 'stored', '2 a stored');
        variable.test = 'b';
        expect(logSpy).toHaveBeenCalledWith(2, 'b', 'stored', '2 b stored');
        stored.testStored = 'stored changed';
        expect(logSpy).toHaveBeenCalledWith(2, 'b', 'stored changed', '2 b stored changed');
    });

    it('not re-run if the value is set but is equal to the old value without passing an object of equalities functions', () => {
        const ref = createRef(1);
        const variable = createVariable({ test: 'a' });
        const stored = createStored('stored', { testStored: 'stored' });
        const computed = createComputed(() => `${ref.value} ${variable.test} ${stored.testStored}`);
        const fnToRun = vi.fn(() => console.log(ref.value, variable.test, stored.testStored, computed.value));
        createEffect(fnToRun);
        expect(fnToRun).toHaveBeenCalledTimes(1);
        ref.value = 1;
        expect(fnToRun).toHaveBeenCalledTimes(1);
        variable.test = 'a';
        expect(fnToRun).toHaveBeenCalledTimes(1);
        stored.testStored = 'stored';
        expect(fnToRun).toHaveBeenCalledTimes(1);
    });

    it('rerun if a nested object in a variable changes [no equality functions]', () => {
        const variable = createVariable({ nested: { test: 'a' } });
        const logSpy = vi.spyOn(console, 'log');
        createEffect(() => console.log(variable.nested.test));
        expect(logSpy).toHaveBeenCalledWith('a');
        variable.nested.test = 'b';
        expect(logSpy).toHaveBeenCalledWith('b');
    });

    it('rerun if a nested object in a variable changes [with partial equality functions]', () => {
        const variable = createVariable({ test: 'a', nested: { test: 'a' } }, {
            test: (before: string, after: string) => before.length === after.length,
        });
        const logSpy = vi.spyOn(console, 'log');
        const fnToRun = vi.fn(() => console.log(variable.test, variable.nested.test));
        createEffect(fnToRun);
        expect(logSpy).toHaveBeenCalledWith('a', 'a');
        variable.test = 'b';
        // it will not be called again because b has the same length
        expect(fnToRun).toBeCalledTimes(1);
        variable.test = 'bb';
        expect(logSpy).toHaveBeenCalledWith('bb', 'a');
        variable.nested.test = 'b';
        // it will be called because nested doesn't have a particular equality specified
        expect(logSpy).toHaveBeenCalledWith('bb', 'b');
    });

    it('rerun if a nested object in a variable changes [with non reactive variables at the end] [with custom equality functions]', () => {
        const variable = createVariable<{ test: string, nested: HTMLElement; }>({ test: 'a', nested: document.createElement('div') }, {
            test: (before: string, after: string) => before.length === after.length,
            nested: (before, after) => before.tagName === after.tagName,
        });
        const logSpy = vi.spyOn(console, 'log');
        const fnToRun = vi.fn(() => console.log(variable.test, variable.nested.tagName));
        createEffect(fnToRun);
        expect(logSpy).toHaveBeenCalledWith('a', 'DIV');
        variable.test = 'b';
        // it will not be called again because b has the same length
        expect(fnToRun).toBeCalledTimes(1);
        variable.test = 'bb';
        expect(logSpy).toHaveBeenCalledWith('bb', 'DIV');
        variable.nested = document.createElement('div');
        // it will not be called again because the two divs have the same tagName
        expect(fnToRun).toBeCalledTimes(2);
        variable.nested = document.createElement('span');
        expect(logSpy).toHaveBeenCalledWith('bb', 'SPAN');
    });

    it('rerun if a nested object in a variable changes [with equality functions]', () => {
        const variable = createVariable({ nested: { test: 'a' } }, {
            nested: {
                // it will be equal if the leght is the same
                test: (before: string, after: string) => before.length === after.length,
            },
        });
        const logSpy = vi.spyOn(console, 'log');
        const fnToRun = vi.fn(() => console.log(variable.nested.test));
        createEffect(fnToRun);
        expect(logSpy).toHaveBeenCalledWith('a');
        variable.nested.test = 'b';
        // it will not be called again because b has the same length
        expect(fnToRun).toBeCalledTimes(1);
        variable.nested.test = 'bb';
        expect(logSpy).toHaveBeenCalledWith('bb');
    });

    it('not re-run if the value is set but is equal to the old value passing an object of equalities functions', () => {
        // custom equality check, before has to be lower than after
        const ref = createRef<number>(1, (before, after) => after > before);
        const variable = createVariable({ test: 'a' }, {
            // custom equality check, is equal if they have the same length
            test: (before, after) => before.length === after.length,
        });
        const stored = createStored('stored', { testStored: 'stored' }, {
            // custom equality check, is equal but case insensitive
            testStored: (before, after) => before.toLowerCase() === after.toLowerCase(),
        });
        // custom equality for computed value, only if it's the same starting character
        const computed = createComputed(() => `${ref.value} ${variable.test} ${stored.testStored}`, (before, after) => before.charAt(0) === after.charAt(0));
        const fnToRun = vi.fn(() => console.log(ref.value, variable.test, stored.testStored, computed.value));
        createEffect(fnToRun);
        expect(fnToRun).toHaveBeenCalledTimes(1);
        ref.value = 2;
        expect(fnToRun).toHaveBeenCalledTimes(1);
        ref.value = 1;
        expect(fnToRun).toHaveBeenCalledTimes(2);
        variable.test = 'b';
        // no rerun since it has the same lenght
        expect(fnToRun).toHaveBeenCalledTimes(2);
        variable.test = 'bb';
        expect(fnToRun).toHaveBeenCalledTimes(3);
        stored.testStored = 'STORED';
        // no rerun since it's the same in uppercase
        expect(fnToRun).toHaveBeenCalledTimes(3);
        stored.testStored = 'stored changed';
        expect(fnToRun).toHaveBeenCalledTimes(4);
    });

    it('not run multiple times in case there are nested createEffect calls', () => {
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

    it('runs the cleanup function returned from the create effect before rerunning', () => {
        const variable = createRef<number>(0);
        const cleanupFn = vi.fn(() => { });
        const effectFn = vi.fn(() => {
            variable.value;
            return cleanupFn;
        });
        createEffect(effectFn);
        expect(effectFn).toHaveBeenCalledTimes(1);
        variable.value += 1;
        expect(cleanupFn).toHaveBeenCalledTimes(1);
        expect(effectFn).toHaveBeenCalledTimes(2);
    });

    it('does not rerun if a variable used inside untrack changes (and can access the return value of untrack)', () => {
        const variable = createRef<number>(0);
        const effectFn = vi.fn(() => {
            const varValue = untrack(() => variable.value);
            expect(varValue).toBe(0);
        });
        createEffect(effectFn);
        expect(effectFn).toHaveBeenCalledTimes(1);
        variable.value += 1;
        expect(effectFn).toHaveBeenCalledTimes(1);
    });
});

describe('DOM manipulation by bindind', () => {
    let toBindDiv: HTMLElement;
    beforeEach(() => {
        document.body.innerHTML = '<div id="to-bind"></div>';
        toBindDiv = document.querySelector('#to-bind') as HTMLElement;
    });
    describe('bindTextContent ', () => {
        it('bind a value of a ref or a variable to the textContent of an element', () => {
            const ref = createRef(1);
            bindTextContent('#to-bind', () => ref.value.toString());
            expect(toBindDiv.textContent).toBe('1');
            ref.value += 1;
            expect(toBindDiv.textContent).toBe('2');
        });
    });

    describe('bindInputValue ', () => {
        it('bind a value of a ref or a variable to the inputValue of an input element', () => {
            const inputToBind = document.createElement('input');
            const ref = createRef(1);
            bindInputValue(inputToBind, () => ref.value.toString());
            expect(inputToBind.value).toBe('1');
            ref.value += 1;
            expect(inputToBind.value).toBe('2');
        });
    });

    describe('bindInnerHTML ', () => {
        it('bind a value of a ref or a variable to the innerHTML of an input element', () => {
            const ref = createRef(1);
            bindInnerHTML('#to-bind', () => `<span>${ref.value.toString()}</span>`);
            expect(toBindDiv.firstChild).toBeInstanceOf(HTMLSpanElement);
            expect(toBindDiv.firstChild?.textContent).toBe('1');
            ref.value += 1;
            expect(toBindDiv.firstChild).toBeInstanceOf(HTMLSpanElement);
            expect(toBindDiv.firstChild?.textContent).toBe('2');
        });
    });

    describe('bindDom', () => {
        it('update the attributes of a dom element merging it with the passed in object', () => {
            const variable = createVariable({
                label: 'test-aria',
                background: '#BADA55',
                data: 'testing dataset',
                classes: 'class1 class2',
            });
            bindDom('#to-bind', () => ({
                ariaLabel: variable.label,
                style: {
                    backgroundColor: variable.background,
                    '--bg': variable.background,
                },
                'data-test': variable.data,
                className: variable.classes,
            }));

            expect(toBindDiv.ariaLabel).toBe('test-aria');
            expect(toBindDiv.style.backgroundColor).toBe('rgb(186, 218, 85)');
            expect(toBindDiv.dataset['test']).toBe('testing dataset');
            expect(toBindDiv.className).toBe('class1 class2');

            variable.label = 'test-aria-changed';
            expect(toBindDiv.ariaLabel).toBe('test-aria-changed');
            variable.background = '#C0FFEE';
            expect(toBindDiv.style.backgroundColor).toBe('rgb(192, 255, 238)');
            variable.data = 'testing dataset change';
            expect(toBindDiv.dataset['test']).toBe('testing dataset change');
            variable.classes = 'class1 class2 class3';
            expect(toBindDiv.className).toBe('class1 class2 class3');
        });

        it('update the attributes of a dom element merging it with the passed in object (with SVGs)', () => {
            document.body.innerHTML = '<svg id="to-bind"></svg>';
            const toBindSvg = document.querySelector('#to-bind') as SVGElement;
            const variable = createVariable({
                label: 'test-aria',
                background: '#BADA55',
                data: 'testing dataset',
                classes: 'class1 class2',
                test: {
                    test2: true,
                },
            });
            bindDom(toBindSvg, () => ({
                ariaLabel: variable.label,
                style: {
                    backgroundColor: variable.background,
                },
                'data-test': variable.data,
                className: variable.classes,
            }));

            expect(toBindSvg.ariaLabel).toBe('test-aria');
            expect(toBindSvg.style.backgroundColor).toBe('rgb(186, 218, 85)');
            expect(toBindSvg.dataset['test']).toBe('testing dataset');
            expect(toBindSvg.getAttribute('class')).toBe('class1 class2');

            variable.label = 'test-aria-changed';
            expect(toBindSvg.ariaLabel).toBe('test-aria-changed');
            variable.background = '#C0FFEE';
            expect(toBindSvg.style.backgroundColor).toBe('rgb(192, 255, 238)');
            variable.data = 'testing dataset change';
            expect(toBindSvg.dataset['test']).toBe('testing dataset change');
            variable.classes = 'class1 class2 class3';
            expect(toBindSvg.getAttribute('class')).toBe('class1 class2 class3');
        });
    });

    describe('bindStyle', () => {
        it('bind the style passed in as an object to the element', () => {
            const variable = createVariable({
                background: '#BADA55',
            });

            bindStyle('#to-bind', () => ({
                backgroundColor: variable.background,
            }));
            expect(toBindDiv.style.backgroundColor).toBe('rgb(186, 218, 85)');
            variable.background = '#C0FFEE';
            expect(toBindDiv.style.backgroundColor).toBe('rgb(192, 255, 238)');
        });
    });

    describe('bindClass', () => {
        it('bind a class to an element based on the boolean value returned by a function', () => {
            const ref = createRef<boolean>(false);
            bindClass('#to-bind', 'test-class', () => ref.value);
            expect(toBindDiv.classList.contains('test-class')).toBe(false);
            ref.value = !ref.value;
            expect(toBindDiv.classList.contains('test-class')).toBe(true);
        });
    });

    describe('bindClasses ', () => {
        it('bind a set of classes represented by an object of booleans to the classname of an element', () => {
            const ref = createRef<number>(1);
            bindClasses('#to-bind', () => ({
                one: ref.value === 1,
                two: ref.value === 2,
                three: ref.value === 3,
                lessThanFive: ref.value < 5,
            }));
            expect(toBindDiv.classList.contains('one')).toBe(true);
            expect(toBindDiv.classList.contains('two')).toBe(false);
            expect(toBindDiv.classList.contains('three')).toBe(false);
            expect(toBindDiv.classList.contains('lessThanFive')).toBe(true);
            ref.value += 1;
            expect(toBindDiv.classList.contains('one')).toBe(false);
            expect(toBindDiv.classList.contains('two')).toBe(true);
            expect(toBindDiv.classList.contains('three')).toBe(false);
            expect(toBindDiv.classList.contains('lessThanFive')).toBe(true);
            ref.value += 1;
            expect(toBindDiv.classList.contains('one')).toBe(false);
            expect(toBindDiv.classList.contains('two')).toBe(false);
            expect(toBindDiv.classList.contains('three')).toBe(true);
            expect(toBindDiv.classList.contains('lessThanFive')).toBe(true);
            ref.value += 1;
            expect(toBindDiv.classList.contains('one')).toBe(false);
            expect(toBindDiv.classList.contains('two')).toBe(false);
            expect(toBindDiv.classList.contains('three')).toBe(false);
            expect(toBindDiv.classList.contains('lessThanFive')).toBe(true);
            ref.value += 1;
            expect(toBindDiv.classList.contains('one')).toBe(false);
            expect(toBindDiv.classList.contains('two')).toBe(false);
            expect(toBindDiv.classList.contains('three')).toBe(false);
            expect(toBindDiv.classList.contains('lessThanFive')).toBe(false);
        });
    });

    describe('batch', () => {
        it('batch updates to variables togheter without triggering the effects before the end of the batch', () => {
            const variable = createVariable({ test: 0, test2: 0 });

            const fn = vi.fn(() => {
                variable.test;
                variable.test2;
            });

            createEffect(fn);

            batch(() => {
                variable.test += 1;
                variable.test2 += 1;
            });

            expect(fn).toBeCalledTimes(2);
        });

        it('batch updates to variables togheter without triggering the effects before the end of the batch (works with computed)', () => {
            const variable = createVariable({ test: 0, test2: 0 });

            const computed = createComputed(() => `${variable.test} ${variable.test2}`);

            const fn = vi.fn(() => {
                console.log('Line 399, Tests function effect', computed.value);
            });

            createEffect(fn);

            batch(() => {
                variable.test += 1;
                variable.test2 += 1;
            });

            expect(fn).toBeCalledTimes(2);
        });
    });

    describe('bindChildren', () => {
        it("bind a string representing html as the children of an element. (elements with the same key does not get's replaced)", () => {
            const variable = createVariable({ array: [1, 2, 3] });
            bindChildren('#to-bind', () => html`${variable.array.map((el) => html`<li key="${el}">${el}</li>`)}`);
            expect(toBindDiv.children.length).toBe(3);
            Array.from(toBindDiv.children).forEach((li, i) => {
                expect(li.tagName).toBe('LI');
                expect(li.textContent).toBe(variable.array[i].toString());
            });
        });
        it("bind a string representing html as the children of an element. (an element swapped before still get's rendered)", () => {
            const variable = createVariable({ array: [1, 2, 3] });
            bindChildren('#to-bind', () => html`${variable.array.map((el) => html`<li key="${el}">${el}</li>`)}`);
            expect(toBindDiv.children.length).toBe(3);
            Array.from(toBindDiv.children).forEach((li, i) => {
                expect(li.tagName).toBe('LI');
                expect(li.textContent).toBe(variable.array[i].toString());
            });
            variable.array = [3, 1, 2];
            Array.from(toBindDiv.children).forEach((li, i) => {
                expect(li.tagName).toBe('LI');
                expect(li.textContent).toBe(variable.array[i].toString());
            });
        });
        it("bind a string representing html as the children of an element and run an after run function givind the user a map key -> element on the page. (elements with the same key does not get's replaced)", () => {
            const variable = createVariable({ array: [1, 2, 3] });
            const equalsNodes: { keyIndex: number, node: Node; }[] = [];
            const afterRun = vi.fn((element, elements: Map<string, DiffedElements>) => {
                expect(element).toBe(toBindDiv);
                elements.forEach((node, key) => {
                    if (key !== 'element') { expect(key).toBe(node.textContent); }
                });
                equalsNodes.forEach((oldNode) => {
                    const actualElement = elements.get(variable.array[oldNode.keyIndex].toString());
                    if (oldNode.keyIndex !== 0) {
                        expect(actualElement?.isNew).toBe(false);
                        expect(oldNode.node).toBe(actualElement);
                    } else {
                        expect(actualElement?.isNew).toBe(true);
                        expect(oldNode.node).not.toBe(actualElement);
                    }
                });
            });
            bindChildren('#to-bind', () => html`${variable.array.map((el) => html`<li key="${el}">${el}</li>`)}`, afterRun);
            expect(toBindDiv.children.length).toBe(3);
            Array.from(toBindDiv.children).forEach((li, i) => {
                expect(li.tagName).toBe('LI');
                expect(li.textContent).toBe(variable.array[i].toString());
                equalsNodes.push({ keyIndex: i, node: li });
            });
            expect(afterRun).toHaveBeenCalledTimes(1);

            variable.array[0] = 4;

            expect(toBindDiv.children.length).toBe(3);
            Array.from(toBindDiv.children).forEach((li, i) => {
                expect(li.tagName).toBe('LI');
                expect(li.textContent).toBe(variable.array[i].toString());
            });
            expect(afterRun).toHaveBeenCalledTimes(2);
        });

        it('bind let bind the childrens again in the after run function', () => {
            const variable = createVariable({ numberOfUl: 1, array: [1, 2, 3] });

            bindChildren('#to-bind', () => html`${[...Array(variable.numberOfUl).keys()].map((num) => html`<ul key="${num}"></ul>`)}`, (_elem, elems) => {
                elems.forEach((elem) => {
                    bindChildren(elem as unknown as HTMLUListElement, () => html`${variable.array.map((num) => html`<li key="${num}">${num}</li>`)}`);
                });
            });

            expect(toBindDiv.children.length).toBe(1);
            Array.from(toBindDiv.children).forEach((ul) => {
                expect(ul.tagName).toBe('UL');
                Array.from(ul.children).forEach((li, i) => {
                    expect(li.tagName).toBe('LI');
                    expect(li.textContent).toBe(variable.array[i].toString());
                });
            });

            variable.array[0] = 4;
            expect(toBindDiv.children.length).toBe(1);
            Array.from(toBindDiv.children).forEach((ul) => {
                expect(ul.tagName).toBe('UL');
                Array.from(ul.children).forEach((li, i) => {
                    expect(li.tagName).toBe('LI');
                    expect(li.textContent).toBe(variable.array[i].toString());
                });
            });

            variable.numberOfUl += 1;
            expect(toBindDiv.children.length).toBe(2);
            Array.from(toBindDiv.children).forEach((ul) => {
                expect(ul.tagName).toBe('UL');
                Array.from(ul.children).forEach((li, i) => {
                    expect(li.tagName).toBe('LI');
                    expect(li.textContent).toBe(variable.array[i].toString());
                });
            });

            variable.array = [...variable.array, 7];
            expect(toBindDiv.children.length).toBe(2);
            Array.from(toBindDiv.children).forEach((ul) => {
                expect(ul.tagName).toBe('UL');
                Array.from(ul.children).forEach((li, i) => {
                    expect(li.tagName).toBe('LI');
                    expect(li.textContent).toBe(variable.array[i].toString());
                });
            });
        });
    });
});
