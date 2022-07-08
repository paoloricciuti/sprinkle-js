import { createVariable, bindInputValue, bindClass, bindDom, bindTextContent, bindStyle, createEffect } from "https://cdn.skypack.dev/sprinkle-js";
import examples from "./examples.js";

const getStartedSection = document.getElementById("get-started");

examples.forEach(example => {
    const article = document.createElement("article");
    article.classList.add("code-example");
    article.innerHTML = `<p class="codepen" data-border="none" data-height="300" data-theme-id="dark" data-default-tab="js,result"
    data-slug-hash="${example.pen}" data-editable="true" data-user="paoloricciuti"
    style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
    <span>See the Pen <a href="https://codepen.io/paoloricciuti/pen/${example.pen}">
            Bubbles</a> by paoloricciuti (<a href="https://codepen.io/paoloricciuti">@paoloricciuti</a>)
        on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<p>
${example.description}
</p>`;
    getStartedSection.append(article);
});

window.__CPEmbed();

const state = createVariable({
    logoRotation: 0,
    title: "well nothing!",
    theme: "auto",
    mineBitcoin: true,
    bitcoinRate: 10,
}, {
    bitcoinRate: () => false,
});

const stateModifiers = {
    bitcoinRate: (val) => Math.min(Math.max(val, 0), 100),
};

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
            const modifier = stateModifiers[key] ?? ((val) => val);
            state[key] = type === "string" ? modifier(e.target.value) : modifier(+e.target.value);
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
            const modifier = stateModifiers[key] ?? ((val) => val);
            state[key] = modifier(e.target.checked);
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