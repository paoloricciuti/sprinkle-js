import { bindChildrens, bindDom, bindStyle, bindTextContent, createVariable } from "./dist/sprinkle-js.es.js";
import examples from "./examples.js";

const getStartedSection = document.getElementById("get-started");
if (window.__CPEmbed) {
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
} else {
    const article = document.createElement("article");
    article.classList.add("no-examples");
    article.innerHTML = `
        There should have been Codepen examples there but apperently there's no Codepen script in the page. Try to reload the page or visit <a href="https://codepen.io/paoloricciuti">@paoloricciuti</a> for some examples.
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 138 26" fill="none" stroke="#000" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
  <path d="M80 6h-9v14h9 M114 6h-9 v14h9 M111 13h-6 M77 13h-6 M122 20V6l11 14V6 M22 16.7L33 24l11-7.3V9.3L33 2L22 9.3V16.7z M44 16.7L33 9.3l-11 7.4 M22 9.3l11 7.3 l11-7.3 M33 2v7.3 M33 16.7V24 M88 14h6c2.2 0 4-1.8 4-4s-1.8-4-4-4h-6v14 M15 8c-1.3-1.3-3-2-5-2c-4 0-7 3-7 7s3 7 7 7 c2 0 3.7-0.8 5-2 M64 13c0 4-3 7-7 7h-5V6h5C61 6 64 9 64 13z"/>
</svg>
    `;
    getStartedSection.append(article);
}

const state = createVariable({
    logoRotation: 0,
    title: "well nothing!",
    mineBitcoin: true,
    bitcoinRate: 10,
    bitcoinMined: 0,
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
            state.bitcoinMined++;
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
    let label = document.createElement("label");
    label.textContent = `"${key}":`;
    label.htmlFor = key;
    let spanVal = document.createElement("span");
    const type = typeof state[key];
    if (type === "string" || type === "number") {
        const first = document.createTextNode("\"");
        const last = document.createTextNode("\"");
        const input = document.createElement("input");
        input.type = type === "string" ? "text" : "number";
        input.className = "mod-value";
        input.id = key;
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
        bindChildrens(spanVal, () => `${state[key]}<input type="checkbox" key="${key}" id="${key}" />`, (_, objects) => {
            const checkbox = objects.get(key);
            if (checkbox) {
                bindDom(checkbox.element, () => ({
                    checked: state[key],
                }));
                if (checkbox.isNew) {
                    checkbox.element.addEventListener("change", (e) => {
                        const modifier = stateModifiers[key] ?? ((val) => val);
                        state[key] = modifier(e.target.checked);
                    });
                }
            }

        });
    }
    label.className = "key";
    spanVal.className = "value";
    div.append(label);
    div.append(spanVal);
    df.append(div);
}
const closePar = document.createTextNode("}");
df.append(closePar);
document.querySelector("code").append(df);