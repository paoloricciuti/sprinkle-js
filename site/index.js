import { createVariable, createRef, bindInputValue, bindTextContent, bindDom, bindStyle, bindChildrens } from "https://cdn.skypack.dev/sprinkle-js";

const x = createRef(1);
const y = createRef(1);
const bool = createRef(false);

const ul = createRef([]);
bindChildrens("#list", () => ul.value.map(val => {
    const li = document.createElement("li");
    li.innerText = val;
    li.key = val;
    li.addEventListener("click", () => {
        ul.value = ul.value.filter(elem => elem !== val);
    });
    bindStyle(li, () => ({
        color: x.value % 2 === 0 ? "red" : "green",
    }));
    return li;
}));

bindDom("#boolVal", () => ({
    checked: bool.value,
}));

bindDom("#num", () => ({
    className: bool.value ? "hidden" : "",
}));

const pos = createVariable({
    x: 0,
    y: 0,
});
window.ul = ul;
window.pos = pos;

bindTextContent("span", () => pos.text);

const div = document.createElement("div");
document.body.append(div);
bindTextContent(div, () => "Il conto è " + (x.value + y.value));

btnX.addEventListener("click", () => {
    x.value += 1;
});

btnY.addEventListener("click", () => {
    y.value += 1;
});

btnFlip.addEventListener("click", () => {
    bool.value = !bool.value;
});

num.addEventListener("input", (e) => {
    y.value = +e.target.value;
});

boolVal.addEventListener("input", (e) => {
    bool.value = e.target.checked;
});

btnBoth.addEventListener("click", () => {
    y.value += 1;
    x.value++;
});

btnAddlist.addEventListener("click", () => {
    ul.value = [...ul.value, Math.random()];
});

btnShufflelist.addEventListener("click", () => {
    ul.value = ul.value.sort(() => Math.random() - .5);
});

btnSortlist.addEventListener("click", () => {
    ul.value = ul.value.sort((a, b) => a - b);
});

bindInputValue(num, () => y.value);

bindStyle(num, () => ({
    width: `${x.value}rem`,
    color: y.value % 2 === 0 ? "red" : "blue",
}));

bindStyle("#movable", () => ({
    backgroundColor: "green",
    "--top": `${pos.y}px`,
    "--left": `${pos.x}px`,
    width: `${pos.x / 10}px`,
    height: `${pos.x / 10}px`,
    opacity: bool.value ? .3 : 1,
}));

window.addEventListener("mousemove", ({ clientX, clientY }) => {
    pos.x = clientX;
    pos.y = clientY;
});