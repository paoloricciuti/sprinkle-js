const E = (t) => typeof t == "string" ? document.querySelector(t) : t, L = (t, e, n = []) => {
  Object.entries(e).forEach(([i, c]) => {
    if (typeof c == "object") {
      L(t, c, [...n, i]);
      return;
    }
    let s = t;
    if (n.forEach((r) => {
      s = s[r];
    }), n[n.length - 1] === "style" && i.startsWith("--")) {
      s.setProperty(i, c);
      return;
    }
    if (i === "className" && t instanceof SVGElement) {
      s.setAttribute("class", c.toString());
      return;
    }
    if (n.length === 0 && i.startsWith("data-")) {
      t.setAttribute(i, c);
      return;
    }
    s[i] = c;
  });
}, V = (t, e) => [...Array(t).keys()].map(() => Array(e).fill(0)), _ = (t = [], e = [], n = (o, i) => o === i) => {
  var r, l, f, u, d, y;
  const o = V(t.length + 1, e.length + 1);
  for (let a = 0; a < t.length + 1; a += 1)
    o[a][0] = a;
  for (let a = 0; a < e.length + 1; a += 1)
    o[0][a] = a;
  for (let a = 0; a < t.length; a += 1)
    for (let g = 0; g < e.length; g += 1)
      if (n(t[a], e[g]))
        o[a + 1][g + 1] = o[a][g];
      else {
        const M = Math.min(o[a + 1][g], o[a][g + 1]) + 1;
        o[a + 1][g + 1] = M;
      }
  const i = [];
  let c = t.length, s = e.length;
  for (; c > 0 && s > 0; )
    n(t[c - 1], e[s - 1]) ? (i.unshift({ type: "=", value: t[c - 1], skip: !1 }), s -= 1, c -= 1) : o[c - 1][s] < o[c][s - 1] ? (i.unshift({ type: "-", value: t[c - 1], skip: !1 }), c -= 1) : (i.unshift({ type: "+", value: e[s - 1], skip: !1 }), s -= 1);
  return c > 0 ? i.unshift(...((f = (l = (r = t == null ? void 0 : t.slice) == null ? void 0 : r.call(t, 0, c)) == null ? void 0 : l.map) == null ? void 0 : f.call(l, (a) => ({ type: "-", value: a, skip: !1 }))) || []) : s > 0 && i.unshift(...((y = (d = (u = e == null ? void 0 : e.slice) == null ? void 0 : u.call(e, 0, s)) == null ? void 0 : d.map) == null ? void 0 : y.call(d, (a) => ({ type: "+", value: a, skip: !1 }))) || []), i;
}, k = (t, e, n = 0) => t.find((o, i, ...c) => i > n && e(o, i, ...c)), j = (t) => Object.prototype.toString.call(t).slice(8, -1), F = (t) => {
  const e = document.createElement("template");
  return Object.assign(e, { innerHTML: t }), e.content;
}, U = (t, e) => t.getAttribute(e), h = (t) => t instanceof Element ? U(t, "key") : t.textContent;
let b = [];
const S = Symbol("is-reactive"), w = Symbol("memo");
let x = null;
const T = (t) => {
  [...t].forEach((e) => {
    if (!e.toRun)
      return;
    const n = e.execute();
    n && (e.cleanup = n);
  });
}, Y = (t) => {
  x = /* @__PURE__ */ new Set();
  try {
    t();
  } finally {
    const e = new Set(x);
    x = null, T(e);
  }
}, H = (t, e, n) => {
  let o = n.get(t);
  o || (o = /* @__PURE__ */ new Set(), n.set(t, o)), o.add(e), e.dependencies.add(o);
}, P = (t, e) => {
  const n = t.get(e);
  if (!!n) {
    if (x !== null) {
      n.forEach((o) => x.add(o));
      return;
    }
    T(n);
  }
}, $ = (t, e) => {
  if (t[S])
    return t;
  if (typeof t != "object")
    throw new Error("It's not possible to create a variable from a primitive value...you can use createRef");
  Object.keys(t || {}).forEach((c) => {
    const s = c;
    !!t[s] && typeof t[s] == "object" && (j(t[s]) === "Object" || Array.isArray(t[s])) && (t[s] = v(t[s], e == null ? void 0 : e[s]));
  });
  const o = /* @__PURE__ */ new Map();
  return new Proxy(t, {
    get: (...c) => {
      if (c[1] === S)
        return !0;
      const s = b[b.length - 1];
      return s && H(c[1], s, o), Reflect.get(...c);
    },
    set: (c, s, r) => {
      var a;
      if (c[w] === !1 && s !== w)
        return !0;
      const l = s, f = (a = e == null ? void 0 : e[l]) != null ? a : Object.is;
      let u = r;
      !!r && typeof r == "object" && (j(r) === "Object" || Array.isArray(r)) && !r[S] && (u = v(r, f));
      const d = f(c[l], r), y = Reflect.set(c, s, u);
      return d || P(o, s), y;
    }
  });
}, z = (t, e, n = ":root") => {
  const o = v(t, e);
  let i = E(n);
  return i || (console.warn("Impossible to find the right html element, attaching the variables to the root."), i = document.querySelector(":root")), p(() => {
    Object.keys(o).forEach((s) => {
      var r;
      i.style.setProperty(`--${s}`, (r = o[s]) == null ? void 0 : r.toString());
    });
  }), o;
}, D = (t, e) => {
  const n = { value: t(), [w]: !1 }, o = v(n, e ? { value: e } : void 0);
  return p(() => {
    o[w] = !0, o.value = t(), o[w] = !1;
  }), o;
}, X = (t, e, n, o = window.localStorage) => {
  if (typeof e != "object")
    throw new Error("It's not possible to create a variable from a primitive value...you can use createRef");
  let i = null;
  try {
    const s = o.getItem(t);
    s ? i = JSON.parse(s) : o.setItem(t, JSON.stringify(e));
  } catch {
    throw new Error("The specified key is associated with a non Object-like element");
  }
  const c = v(i != null ? i : e, n);
  return p(() => {
    o.setItem(t, JSON.stringify(c));
  }), window.addEventListener("storage", (s) => {
    if (s.storageArea === o && s.key === t)
      try {
        if (s.newValue) {
          const r = JSON.parse(s.newValue);
          Object.keys(r).forEach((f) => {
            c[f] = r[f];
          });
        }
      } catch {
        console.warn("The storage was modified but the resulting object is not parsable...the variable was not updated.");
      }
  }), c;
}, Z = (t, e) => v({ value: t }, e ? { value: e } : void 0), R = (t) => {
  t.owned.forEach((e) => {
    e.toRun = !1, R(e);
  }), t.dependencies.forEach((e) => {
    e.delete(t);
  }), t.dependencies.clear();
}, J = (t) => {
  const e = () => {
    var c, s, r;
    if (!n.toRun)
      return;
    (r = (s = (c = n == null ? void 0 : n.owner) == null ? void 0 : c.owned) == null ? void 0 : s.push) == null || r.call(s, n), n.cleanup && typeof n.cleanup == "function" && n.cleanup(), R(n), b.push(n);
    let i;
    try {
      i = t();
    } finally {
      b.pop();
    }
    return i;
  }, n = {
    execute: e,
    dependencies: /* @__PURE__ */ new Set(),
    owned: [],
    owner: b[b.length - 1],
    toRun: !0
  }, o = e();
  o && (n.cleanup = o);
}, A = {
  createVariable: $,
  createEffect: J,
  createComputed: D
};
let C = { ...A };
const v = (t, e) => C.createVariable(t, e), p = (t) => C.createEffect(t), K = (t, e) => C.createComputed(t, e), q = (t = A) => (Object.keys(t).forEach((e) => {
  C[e] = t[e];
}), () => {
  C = A;
}), tt = (t) => {
  const e = b;
  b = [];
  const n = t();
  return b = e, n;
}, et = (t, e) => {
  const n = E(t);
  return p(() => {
    n && (n.textContent = e(n));
  }), n;
}, nt = (t, e) => {
  const n = E(t);
  return p(() => {
    n && (n.innerHTML = e(n));
  }), n;
}, st = (t, e, n) => {
  const o = E(t);
  return p(() => {
    o && (n(o) ? o.classList.add(e) : o.classList.remove(e));
  }), o;
}, ot = (t, e) => {
  const n = E(t);
  return p(() => {
    if (n) {
      const o = e(n);
      Object.keys(o || {}).forEach((c) => {
        o[c] ? n.classList.add(c) : n.classList.remove(c);
      });
    }
  }), n;
}, ct = (t, e) => {
  const n = E(t);
  return p(() => {
    n && (n.value = e(n));
  }), n;
}, W = (t, e) => {
  const n = E(t);
  return p(() => L(n, e(n))), n;
}, it = (t, e) => {
  const n = E(t);
  if (!!n)
    return W(n, () => ({ style: e(n) })), n;
}, m = (t, e, n) => {
  var o, i, c, s, r;
  if (t instanceof Text) {
    let l = (o = t.textContent) != null ? o : "";
    const f = /\{\{fn:(?<index>\d+)\}\}/g;
    let u;
    for (; u = f.exec((i = t.textContent) != null ? i : ""); ) {
      if (!((c = u == null ? void 0 : u.groups) != null && c.index))
        continue;
      const d = e[+u.groups.index]();
      l = l.replace(u[0], d);
    }
    t.textContent = l;
  } else if (t instanceof HTMLElement) {
    const l = t.tagName.match(/to-replace-(?<index>\d+)/i);
    ((s = l == null ? void 0 : l.groups) == null ? void 0 : s.index) != null && t.replaceWith(n[+l.groups.index]);
  }
  for (let l = 0; l < t.childNodes.length; l += 1) {
    const f = t.childNodes[l];
    m(f, e, n);
  }
  if (t instanceof Element && t.attributes)
    for (let l = 0; l < t.attributes.length; l += 1) {
      const f = t.attributes[l], [u, d] = f.name.split(":");
      if (u === "on" && d) {
        const y = f.value.match(/\{\{fn:(?<index>\d+)\}\}/);
        ((r = y == null ? void 0 : y.groups) == null ? void 0 : r.index) != null && (t.addEventListener(d, e[+y.groups.index]), t.removeAttribute(f.name), t.listeners || (t.listeners = /* @__PURE__ */ new Map()), t.listeners.has(d) || t.listeners.set(d, /* @__PURE__ */ new Set()), t.listeners.get(d).add(e[+y.groups.index]));
      }
    }
}, I = (t, e, n, o) => {
  if (o == null)
    return t;
  if (typeof o == "function")
    t += `{{fn:${e.length}}}`, e.push(o);
  else if (o[N])
    t += `<to-replace-${n.length}></to-replace-${n.length}>`, n.push(o);
  else if (Array.isArray(o))
    for (let i = 0; i < o.length; i += 1) {
      const c = o[i];
      t = I(t, e, n, c);
    }
  else
    t += o;
  return t;
}, N = Symbol("from_h"), rt = (t, ...e) => {
  let n = "";
  const o = [], i = [];
  for (let s = 0; s < t.length; s += 1)
    n += t[s], n = I(n, o, i, e[s]);
  const c = F(n);
  for (let s = 0; s < c.children.length; s += 1) {
    const r = c.children[s];
    m(r, o, i);
  }
  return o.forEach((s) => s()), c[N] = !0, c;
}, O = (t, e) => {
  var n, o;
  (n = e.listeners) == null || n.forEach((i, c) => {
    i.forEach((s) => {
      console.log("removing", s()), e.removeEventListener(c, s);
    });
  }), (o = t.listeners) == null || o.forEach((i, c) => {
    i.forEach((s) => {
      console.log("adding", s()), e.addEventListener(c, s);
    });
  });
}, B = (t, e, n) => {
  if (t.children.length === 0) {
    const s = Array.from(e);
    t.append(...s), s.forEach((r) => n(r));
    return;
  }
  const o = _(Array.from(t.childNodes), Array.from(e), (s, r) => h(s) != null && h(r) != null ? h(s) === h(r) : s === r);
  let i = o.find((s) => s.type === "="), c = 0;
  o.forEach((s) => {
    if (s.type === "+") {
      const r = k(o, (l) => l.type === "-" && h(l.value) === h(s.value), c);
      if (r && (O(s.value, r.value), s.value = r.value, r.skip = !0), !i) {
        t.append(s.value), n(s.value), c += 1;
        return;
      }
      i.value.before(s.value), n(s.value);
    } else if (s.type === "-") {
      if (s.skip) {
        c += 1;
        return;
      }
      t.removeChild(s.value);
      const r = k(o, (l) => l.type === "+" && h(l.value) === h(s.value), c);
      r && (O(r.value, s.value), r.value = s.value);
    } else
      O(Array.from(e).find((r) => h(r) === h(s.value)), s.value), i = k(o, (r) => r.type === "=", c), n(s.value, !1);
    c += 1;
  });
}, G = (t, e, n) => {
  const o = E(t);
  return p(() => {
    if (o === null)
      return;
    const c = e(o).childNodes, s = /* @__PURE__ */ new Map();
    B(o, c, (l, f = !0) => {
      const u = h(l);
      if (u != null) {
        const d = l;
        d.isNew = f, s.set(u, d);
      }
    }), typeof n == "function" && p(() => {
      n(o, s);
    });
  }), o;
}, Q = (t, e, n) => (...i) => (console.warn(`${e}${n ? `See more at ${n}` : ""}`), t(...i)), lt = Q(
  G,
  "'bindChildrens' is deprecated: please use 'bindChildren' instead.",
  new URL("https://github.com/paoloricciuti/sprinkle-js/issues/3")
);
export {
  Y as batch,
  G as bindChildren,
  lt as bindChildrens,
  st as bindClass,
  ot as bindClasses,
  W as bindDom,
  nt as bindInnerHTML,
  ct as bindInputValue,
  it as bindStyle,
  et as bindTextContent,
  K as createComputed,
  z as createCssVariable,
  p as createEffect,
  Z as createRef,
  X as createStored,
  v as createVariable,
  rt as html,
  q as setup,
  tt as untrack
};
