import { createVariable, createEffect, bindDom, bindTextContent, bindStyle, untrack } from "https://cdn.skypack.dev/sprinkle-js";

const state = createVariable({
    logoRotation: 0,
    title: "well nothing!",
    theme: "auto",
    mineBitcoin: true,
    bitcoinRate: 10,
});

window.state = state;

bindTextContent(".to-the-moon", () => state.title);
bindStyle(".logo > img", () => ({
    "--logo-rotation": state.logoRotation,
}));

bindStyle(".footer", () => ({
    "--animation-state": state.mineBitcoin ? "running" : "paused",
}));

const arms = document.querySelector("#arms");

let iterationCount = 0;

arms.addEventListener("animationiteration", () => {
    if (iterationCount % 2 === 1) {
        const chance = Math.floor(Math.random() * 100);

        if (chance <= state.bitcoinRate) {
            const bitcoinElem = document.createElement("img");
            bitcoinElem.src = "./assets/bitcoin.svg";
            bitcoinElem.classList.add("bitcoin");
            bitcoinElem.addEventListener("animationend", () => {
                bitcoinElem.remove();
            });
            document.querySelector(".footer").append(bitcoinElem);
        }
    }
    iterationCount++;
});

window.addEventListener("scroll", (e) => {
    state.logoRotation = Math.floor(window.scrollY);
});

const openPar = document.createTextNode("{");
const keys = Object.keys(state);
const df = document.createDocumentFragment();
df.append(openPar);
for (let key of keys) {
    let div = document.createElement("div");
    let span = document.createElement("span");
    span.textContent = `"${key}":`;
    let spanVal = document.createElement("span");
    const type = typeof state[key];
    if (type === "string" || type === "number") {
        const first = document.createTextNode("\"");
        const last = document.createTextNode("\"");
        const input = document.createElement("input");
        input.type = type === "string" ? "text" : "number";
        input.className = "mod-value";
        bindDom(input, () => ({
            value: state[key],
            style: {
                "--chars": state[key].toString().length + (type === "string" ? 0 : 2),
            }
        }));
        input.addEventListener("input", (e) => {
            state[key] = type === "string" ? e.target.value : +e.target.value;
        });
        if (type === "string") {
            spanVal.append(first, input, last);
        } else {
            spanVal.append(input);
        }
    } else if (type === "boolean") {
        spanVal.textContent = state[key];
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        bindDom(checkbox, () => ({
            checked: state[key],
        }));
        checkbox.addEventListener("change", (e) => {
            state[key] = e.target.checked;
        });
        spanVal.append(checkbox);
    }
    span.className = "key";
    spanVal.className = "value";
    div.append(span);
    div.append(spanVal);
    df.append(div);
}
const closePar = document.createTextNode("}");
df.append(closePar);
document.querySelector("code").append(df);
