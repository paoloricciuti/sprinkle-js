const E = (t) => typeof t == "string" ? document.querySelector(t) : t, T = (t, e, n = []) => {
  Object.entries(e).forEach(([r, c]) => {
    if (typeof c == "object") {
      T(t, c, [...n, r]);
      return;
    }
    let o = t;
    if (n.forEach((a) => {
      o = o[a];
    }), n[n.length - 1] === "style" && r.startsWith("--")) {
      o.setProperty(r, c);
      return;
    }
    if (r === "className" && t instanceof SVGElement) {
      o.setAttribute("class", c.toString());
      return;
    }
    if (n.length === 0 && r.startsWith("data-")) {
      t.setAttribute(r, c);
      return;
    }
    o[r] = c;
  });
}, F = (t, e) => [...Array(t).keys()].map(() => Array(e).fill(0)), U = (t = [], e = [], n = (s, r) => s === r) => {
  var a, i, l, f, d, y;
  const s = F(t.length + 1, e.length + 1);
  for (let u = 0; u < t.length + 1; u += 1)
    s[u][0] = u;
  for (let u = 0; u < e.length + 1; u += 1)
    s[0][u] = u;
  for (let u = 0; u < t.length; u += 1)
    for (let g = 0; g < e.length; g += 1)
      if (n(t[u], e[g]))
        s[u + 1][g + 1] = s[u][g];
      else {
        const _ = Math.min(s[u + 1][g], s[u][g + 1]) + 1;
        s[u + 1][g + 1] = _;
      }
  const r = [];
  let c = t.length, o = e.length;
  for (; c > 0 && o > 0; )
    n(t[c - 1], e[o - 1]) ? (r.unshift({ type: "=", value: t[c - 1], skip: !1 }), o -= 1, c -= 1) : s[c - 1][o] < s[c][o - 1] ? (r.unshift({ type: "-", value: t[c - 1], skip: !1 }), c -= 1) : (r.unshift({ type: "+", value: e[o - 1], skip: !1 }), o -= 1);
  return c > 0 ? r.unshift(...((l = (i = (a = t == null ? void 0 : t.slice) == null ? void 0 : a.call(t, 0, c)) == null ? void 0 : i.map) == null ? void 0 : l.call(i, (u) => ({ type: "-", value: u, skip: !1 }))) || []) : o > 0 && r.unshift(...((y = (d = (f = e == null ? void 0 : e.slice) == null ? void 0 : f.call(e, 0, o)) == null ? void 0 : d.map) == null ? void 0 : y.call(d, (u) => ({ type: "+", value: u, skip: !1 }))) || []), r;
}, k = (t, e, n = 0) => t.find((s, r, ...c) => r > n && e(s, r, ...c)), j = (t) => Object.prototype.toString.call(t).slice(8, -1), $ = (t) => {
  const e = document.createElement("template");
  return Object.assign(e, { innerHTML: t }), e.content;
}, H = (t, e) => t.getAttribute(e), h = (t) => t instanceof Element ? H(t, "key") : `[[textNode:${t.textContent}]]`;
let b = [];
const O = Symbol("is-reactive"), w = Symbol("memo");
let x = null;
const L = (t) => {
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
    x = null, L(e);
  }
}, P = (t, e, n) => {
  let s = n.get(t);
  s || (s = /* @__PURE__ */ new Set(), n.set(t, s)), s.add(e), e.dependencies.add(s);
}, D = (t, e) => {
  const n = t.get(e);
  if (!!n) {
    if (x !== null) {
      n.forEach((s) => x.add(s));
      return;
    }
    L(n);
  }
}, J = (t, e) => {
  if (t[O])
    return t;
  if (typeof t != "object")
    throw new Error("It's not possible to create a variable from a primitive value...you can use createRef");
  Object.keys(t || {}).forEach((c) => {
    const o = c;
    !!t[o] && typeof t[o] == "object" && (j(t[o]) === "Object" || Array.isArray(t[o])) && (t[o] = v(t[o], e == null ? void 0 : e[o]));
  });
  const s = /* @__PURE__ */ new Map();
  return new Proxy(t, {
    get: (...c) => {
      if (c[1] === O)
        return !0;
      const o = b[b.length - 1];
      return o && P(c[1], o, s), Reflect.get(...c);
    },
    set: (c, o, a) => {
      var u;
      if (c[w] === !1 && o !== w)
        return !0;
      const i = o, l = (u = e == null ? void 0 : e[i]) != null ? u : Object.is;
      let f = a;
      !!a && typeof a == "object" && (j(a) === "Object" || Array.isArray(a)) && !a[O] && (f = v(a, l));
      const d = l(c[i], a), y = Reflect.set(c, o, f);
      return d || D(s, o), y;
    }
  });
}, z = (t, e, n = ":root") => {
  const s = v(t, e);
  let r = E(n);
  return r || (console.warn("Impossible to find the right html element, attaching the variables to the root."), r = document.querySelector(":root")), p(() => {
    Object.keys(s).forEach((o) => {
      var a;
      r.style.setProperty(`--${o}`, (a = s[o]) == null ? void 0 : a.toString());
    });
  }), s;
}, W = (t, e) => {
  const n = { value: t(), [w]: !1 }, s = v(n, e ? { value: e } : void 0);
  return p(() => {
    s[w] = !0, s.value = t(), s[w] = !1;
  }), s;
}, X = (t, e, n, s = window.localStorage) => {
  if (typeof e != "object")
    throw new Error("It's not possible to create a variable from a primitive value...you can use createRef");
  let r = null;
  try {
    const o = s.getItem(t);
    o ? r = JSON.parse(o) : s.setItem(t, JSON.stringify(e));
  } catch {
    throw new Error("The specified key is associated with a non Object-like element");
  }
  const c = v(r != null ? r : e, n);
  return p(() => {
    s.setItem(t, JSON.stringify(c));
  }), window.addEventListener("storage", (o) => {
    if (o.storageArea === s && o.key === t)
      try {
        if (o.newValue) {
          const a = JSON.parse(o.newValue);
          Object.keys(a).forEach((l) => {
            c[l] = a[l];
          });
        }
      } catch {
        console.warn("The storage was modified but the resulting object is not parsable...the variable was not updated.");
      }
  }), c;
}, Z = (t, e) => v({ value: t }, e ? { value: e } : void 0), N = (t) => {
  t.owned.forEach((e) => {
    e.toRun = !1, N(e);
  }), t.dependencies.forEach((e) => {
    e.delete(t);
  }), t.dependencies.clear();
}, B = (t) => {
  const e = () => {
    var c, o, a;
    if (!n.toRun)
      return;
    (a = (o = (c = n == null ? void 0 : n.owner) == null ? void 0 : c.owned) == null ? void 0 : o.push) == null || a.call(o, n), n.cleanup && typeof n.cleanup == "function" && n.cleanup(), N(n), b.push(n);
    let r;
    try {
      r = t();
    } finally {
      b.pop();
    }
    return r;
  }, n = {
    execute: e,
    dependencies: /* @__PURE__ */ new Set(),
    owned: [],
    owner: b[b.length - 1],
    toRun: !0
  }, s = e();
  s && (n.cleanup = s);
}, A = {
  createVariable: J,
  createEffect: B,
  createComputed: W
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
  const s = E(t);
  return p(() => {
    s && (n(s) ? s.classList.add(e) : s.classList.remove(e));
  }), s;
}, ot = (t, e) => {
  const n = E(t);
  return p(() => {
    if (n) {
      const s = e(n);
      Object.keys(s || {}).forEach((c) => {
        s[c] ? n.classList.add(c) : n.classList.remove(c);
      });
    }
  }), n;
}, ct = (t, e) => {
  const n = E(t);
  return p(() => {
    n && (n.value = e(n));
  }), n;
}, m = (t, e) => {
  const n = E(t);
  return p(() => T(n, e(n))), n;
}, it = (t, e) => {
  const n = E(t);
  if (!!n)
    return m(n, () => ({ style: e(n) })), n;
}, I = (t, e, n) => {
  var s, r, c, o, a;
  if (t instanceof Text) {
    let i = (s = t.textContent) != null ? s : "";
    const l = /\{\{fn:(?<index>\d+)\}\}/g;
    let f;
    for (; f = l.exec((r = t.textContent) != null ? r : ""); ) {
      if (!((c = f == null ? void 0 : f.groups) != null && c.index))
        continue;
      const d = e[+f.groups.index]();
      i = i.replace(f[0], d);
    }
    t.textContent = i;
  } else if (t instanceof HTMLElement) {
    const i = t.tagName.match(/to-replace-(?<index>\d+)/i);
    ((o = i == null ? void 0 : i.groups) == null ? void 0 : o.index) != null && t.replaceWith(n[+i.groups.index]);
  }
  for (let i = 0; i < t.childNodes.length; i += 1) {
    const l = t.childNodes[i];
    I(l, e, n);
  }
  if (t instanceof Element && t.attributes)
    for (let i = 0; i < t.attributes.length; i += 1) {
      const l = t.attributes[i], [f, d] = l.name.split(":");
      if (f === "on" && d) {
        const y = l.value.match(/\{\{fn:(?<index>\d+)\}\}/);
        ((a = y == null ? void 0 : y.groups) == null ? void 0 : a.index) != null && (t.addEventListener(d, e[+y.groups.index]), t.removeAttribute(l.name), t.listeners || (t.listeners = /* @__PURE__ */ new Map()), t.listeners.has(d) || t.listeners.set(d, /* @__PURE__ */ new Set()), t.listeners.get(d).add(e[+y.groups.index]));
      }
    }
}, R = (t, e, n, s) => {
  if (s == null)
    return t;
  if (typeof s == "function")
    t += `{{fn:${e.length}}}`, e.push(s);
  else if (s[M])
    t += `<to-replace-${n.length}></to-replace-${n.length}>`, n.push(s);
  else if (Array.isArray(s))
    for (let r = 0; r < s.length; r += 1) {
      const c = s[r];
      t = R(t, e, n, c);
    }
  else
    t += s;
  return t;
}, M = Symbol("from_h"), rt = (t, ...e) => {
  let n = "";
  const s = [], r = [];
  for (let o = 0; o < t.length; o += 1)
    n += t[o], n = R(n, s, r, e[o]);
  const c = $(n);
  for (let o = 0; o < c.children.length; o += 1) {
    const a = c.children[o];
    I(a, s, r);
  }
  return c[M] = !0, c;
}, S = (t, e) => {
  var n, s;
  (n = e.listeners) == null || n.forEach((r, c) => {
    r.forEach((o) => {
      var a;
      e.removeEventListener(c, o), (a = e.listeners.get(c)) == null || a.delete(o);
    });
  }), (s = t.listeners) == null || s.forEach((r, c) => {
    r.forEach((o) => {
      var a;
      e.addEventListener(c, o), (a = e.listeners.get(c)) == null || a.add(o);
    });
  });
}, V = (t, e, n) => {
  var a;
  if (((a = t == null ? void 0 : t.children) == null ? void 0 : a.length) && t.children.length === 0) {
    const i = Array.from(e);
    t.append(...i), i.forEach((l) => n(l));
    return;
  }
  const s = U(Array.from(t.childNodes), Array.from(e), (i, l) => h(i) != null && h(l) != null ? h(i) === h(l) : i === l);
  let r = s.find((i) => i.type === "="), c = 0;
  const o = [];
  s.forEach((i) => {
    if (i.type === "+") {
      const l = k(s, (f) => f.type === "-" && h(f.value) === h(i.value), c);
      if (l && (o.push({
        new: i.value,
        old: l.value
      }), S(i.value, l.value), i.value = l.value, l.skip = !0), !r) {
        t.append(i.value), n(i.value), c += 1;
        return;
      }
      r.value.before(i.value), n(i.value);
    } else if (i.type === "-") {
      if (i.skip) {
        c += 1;
        return;
      }
      t.removeChild(i.value);
      const l = k(s, (f) => f.type === "+" && h(f.value) === h(i.value), c);
      l && (o.push({
        new: l.value,
        old: i.value
      }), S(l.value, i.value), l.value = i.value);
    } else {
      const l = Array.from(e).find((f) => h(f) === h(i.value));
      o.push({
        new: i.value,
        old: l
      }), S(l, i.value), r = k(s, (f) => f.type === "=", c), n(i.value, !1);
    }
    c += 1;
  }), o.forEach((i) => {
    V(i.new, i.old.childNodes, n);
  });
}, G = (t, e, n) => {
  const s = E(t);
  return p(() => {
    if (s === null)
      return;
    const c = e(s).childNodes, o = /* @__PURE__ */ new Map();
    V(s, c, (i, l = !0) => {
      const f = h(i);
      if (f != null && !(i instanceof Text)) {
        const d = i;
        d.isNew = l, o.set(f, d);
      }
    }), typeof n == "function" && p(() => {
      n(s, o);
    });
  }), s;
}, Q = (t, e, n) => (...r) => (console.warn(`${e}${n ? `See more at ${n}` : ""}`), t(...r)), at = Q(
  G,
  "'bindChildrens' is deprecated: please use 'bindChildren' instead.",
  new URL("https://github.com/paoloricciuti/sprinkle-js/issues/3")
);
export {
  Y as batch,
  G as bindChildren,
  at as bindChildrens,
  st as bindClass,
  ot as bindClasses,
  m as bindDom,
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
