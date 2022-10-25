const E = (t) => typeof t == "string" ? document.querySelector(t) : t, L = (t, e, n = []) => {
  Object.entries(e).forEach(([r, c]) => {
    if (typeof c == "object") {
      L(t, c, [...n, r]);
      return;
    }
    let o = t;
    if (n.forEach((l) => {
      o = o[l];
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
}, U = (t, e) => [...Array(t).keys()].map(() => Array(e).fill(0)), $ = (t = [], e = [], n = (s, r) => s === r) => {
  var l, i, a, u, d, h;
  const s = U(t.length + 1, e.length + 1);
  for (let f = 0; f < t.length + 1; f += 1)
    s[f][0] = f;
  for (let f = 0; f < e.length + 1; f += 1)
    s[0][f] = f;
  for (let f = 0; f < t.length; f += 1)
    for (let g = 0; g < e.length; g += 1)
      if (n(t[f], e[g]))
        s[f + 1][g + 1] = s[f][g];
      else {
        const F = Math.min(s[f + 1][g], s[f][g + 1]) + 1;
        s[f + 1][g + 1] = F;
      }
  const r = [];
  let c = t.length, o = e.length;
  for (; c > 0 && o > 0; )
    n(t[c - 1], e[o - 1]) ? (r.unshift({ type: "=", value: t[c - 1], skip: !1 }), o -= 1, c -= 1) : s[c - 1][o] < s[c][o - 1] ? (r.unshift({ type: "-", value: t[c - 1], skip: !1 }), c -= 1) : (r.unshift({ type: "+", value: e[o - 1], skip: !1 }), o -= 1);
  return c > 0 ? r.unshift(...((a = (i = (l = t == null ? void 0 : t.slice) == null ? void 0 : l.call(t, 0, c)) == null ? void 0 : i.map) == null ? void 0 : a.call(i, (f) => ({ type: "-", value: f, skip: !1 }))) || []) : o > 0 && r.unshift(...((h = (d = (u = e == null ? void 0 : e.slice) == null ? void 0 : u.call(e, 0, o)) == null ? void 0 : d.map) == null ? void 0 : h.call(d, (f) => ({ type: "+", value: f, skip: !1 }))) || []), r;
}, O = (t, e, n = 0) => t.find((s, r, ...c) => r > n && e(s, r, ...c)), T = (t) => Object.prototype.toString.call(t).slice(8, -1), H = (t) => {
  const e = document.createElement("template");
  return Object.assign(e, { innerHTML: t }), e.content;
}, P = (t, e) => t.getAttribute(e), p = (t) => t instanceof Element ? P(t, "key") : `[[textNode:${t.textContent}]]`;
let b = [];
const A = Symbol("is-reactive"), x = Symbol("memo");
let C = null;
const N = (t) => {
  [...t].forEach((e) => {
    if (!e.toRun)
      return;
    const n = e.execute();
    n && (e.cleanup = n);
  });
}, X = (t) => {
  C = /* @__PURE__ */ new Set();
  try {
    t();
  } finally {
    const e = new Set(C);
    C = null, N(e);
  }
}, D = (t, e, n) => {
  let s = n.get(t);
  s || (s = /* @__PURE__ */ new Set(), n.set(t, s)), s.add(e), e.dependencies.add(s);
}, J = (t, e) => {
  const n = t.get(e);
  if (!!n) {
    if (C !== null) {
      n.forEach((s) => C.add(s));
      return;
    }
    N(n);
  }
}, W = (t, e) => {
  if (t[A])
    return t;
  if (typeof t != "object")
    throw new Error("It's not possible to create a variable from a primitive value...you can use createRef");
  Object.keys(t || {}).forEach((c) => {
    const o = c;
    !!t[o] && typeof t[o] == "object" && (T(t[o]) === "Object" || Array.isArray(t[o])) && (t[o] = v(t[o], e == null ? void 0 : e[o]));
  });
  const s = /* @__PURE__ */ new Map();
  return new Proxy(t, {
    get: (...c) => {
      if (c[1] === A)
        return !0;
      const o = b[b.length - 1];
      return o && D(c[1], o, s), Reflect.get(...c);
    },
    set: (c, o, l) => {
      var f;
      if (c[x] === !1 && o !== x)
        return !0;
      const i = o, a = (f = e == null ? void 0 : e[i]) != null ? f : Object.is;
      let u = l;
      !!l && typeof l == "object" && (T(l) === "Object" || Array.isArray(l)) && !l[A] && (u = v(l, a));
      const d = a(c[i], l), h = Reflect.set(c, o, u);
      return d || J(s, o), h;
    }
  });
}, Z = (t, e, n = ":root") => {
  const s = v(t, e);
  let r = E(n);
  return r || (console.warn("Impossible to find the right html element, attaching the variables to the root."), r = document.querySelector(":root")), y(() => {
    Object.keys(s).forEach((o) => {
      var l;
      r.style.setProperty(`--${o}`, (l = s[o]) == null ? void 0 : l.toString());
    });
  }), s;
}, B = (t, e) => {
  const n = { value: t(), [x]: !1 }, s = v(n, e ? { value: e } : void 0);
  return y(() => {
    s[x] = !0, s.value = t(), s[x] = !1;
  }), s;
}, m = (t, e, n, s = window.localStorage) => {
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
  return y(() => {
    s.setItem(t, JSON.stringify(c));
  }), window.addEventListener("storage", (o) => {
    if (o.storageArea === s && o.key === t)
      try {
        if (o.newValue) {
          const l = JSON.parse(o.newValue);
          Object.keys(l).forEach((a) => {
            c[a] = l[a];
          });
        }
      } catch {
        console.warn("The storage was modified but the resulting object is not parsable...the variable was not updated.");
      }
  }), c;
}, K = (t, e) => v({ value: t }, e ? { value: e } : void 0), I = (t) => {
  t.owned.forEach((e) => {
    e.toRun = !1, I(e);
  }), t.dependencies.forEach((e) => {
    e.delete(t);
  }), t.dependencies.clear();
}, G = (t) => {
  const e = () => {
    var c, o, l;
    if (!n.toRun)
      return;
    (l = (o = (c = n == null ? void 0 : n.owner) == null ? void 0 : c.owned) == null ? void 0 : o.push) == null || l.call(o, n), n.cleanup && typeof n.cleanup == "function" && n.cleanup(), I(n), b.push(n);
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
}, j = {
  createVariable: W,
  createEffect: G,
  createComputed: B
};
let k = { ...j };
const v = (t, e) => k.createVariable(t, e), y = (t) => k.createEffect(t), q = (t, e) => k.createComputed(t, e), tt = (t = j) => (Object.keys(t).forEach((e) => {
  k[e] = t[e];
}), () => {
  k = j;
}), et = (t) => {
  const e = b;
  b = [];
  const n = t();
  return b = e, n;
}, nt = (t, e) => {
  const n = E(t);
  return y(() => {
    n && (n.textContent = e(n));
  }), n;
}, st = (t, e) => {
  const n = E(t);
  return y(() => {
    n && (n.innerHTML = e(n));
  }), n;
}, ot = (t, e, n) => {
  const s = E(t);
  return y(() => {
    s && (n(s) ? s.classList.add(e) : s.classList.remove(e));
  }), s;
}, ct = (t, e) => {
  const n = E(t);
  return y(() => {
    if (n) {
      const s = e(n);
      Object.keys(s || {}).forEach((c) => {
        s[c] ? n.classList.add(c) : n.classList.remove(c);
      });
    }
  }), n;
}, it = (t, e) => {
  const n = E(t);
  return y(() => {
    n && (n.value = e(n));
  }), n;
}, Q = (t, e) => {
  const n = E(t);
  return y(() => L(n, e(n))), n;
}, rt = (t, e) => {
  const n = E(t);
  if (!!n)
    return Q(n, () => ({ style: e(n) })), n;
}, R = (t, e, n) => {
  var s, r, c, o, l;
  if (t instanceof Text) {
    let i = (s = t.textContent) != null ? s : "";
    const a = /\{\{fn:(?<index>\d+)\}\}/g;
    let u;
    for (; u = a.exec((r = t.textContent) != null ? r : ""); ) {
      if (!((c = u == null ? void 0 : u.groups) != null && c.index))
        continue;
      const d = e[+u.groups.index]();
      i = i.replace(u[0], d);
    }
    t.textContent = i;
  } else if (t instanceof HTMLElement) {
    const i = t.tagName.match(/to-replace-(?<index>\d+)/i);
    ((o = i == null ? void 0 : i.groups) == null ? void 0 : o.index) != null && t.replaceWith(n[+i.groups.index]);
  }
  for (let i = 0; i < t.childNodes.length; i += 1) {
    const a = t.childNodes[i];
    R(a, e, n);
  }
  if (t instanceof Element && t.attributes) {
    const i = Array.from(t.attributes);
    for (let a = 0; a < i.length; a += 1) {
      const u = i[a], [d, h] = u.name.split(":");
      if (d === "on" && h) {
        const f = u.value.match(/\{\{fn:(?<index>\d+)\}\}/);
        ((l = f == null ? void 0 : f.groups) == null ? void 0 : l.index) != null && (h !== "bind" && t.addEventListener(h.toLowerCase(), e[+f.groups.index]), t.removeAttribute(u.name), t.listeners || (t.listeners = /* @__PURE__ */ new Map()), t.listeners.has(h) || t.listeners.set(h, /* @__PURE__ */ new Set()), t.listeners.get(h).add(e[+f.groups.index]));
      }
    }
  }
}, M = (t, e, n, s) => {
  if (s == null)
    return t;
  if (typeof s == "function")
    t += `{{fn:${e.length}}}`, e.push(s);
  else if (s[V])
    t += `<to-replace-${n.length}></to-replace-${n.length}>`, n.push(s);
  else if (Array.isArray(s))
    for (let r = 0; r < s.length; r += 1) {
      const c = s[r];
      t = M(t, e, n, c);
    }
  else
    t += s;
  return t;
}, V = Symbol("from_h"), at = (t, ...e) => {
  let n = "";
  const s = [], r = [];
  for (let o = 0; o < t.length; o += 1)
    n += t[o], n = M(n, s, r, e[o]);
  const c = H(n);
  for (let o = 0; o < c.children.length; o += 1) {
    const l = c.children[o];
    R(l, s, r);
  }
  return c[V] = !0, c;
}, S = (t, e) => {
  var n, s;
  (n = e.listeners) == null || n.forEach((r, c) => {
    r.forEach((o) => {
      var l;
      e.removeEventListener(c, o), (l = e.listeners.get(c)) == null || l.delete(o);
    });
  }), (s = t.listeners) == null || s.forEach((r, c) => {
    r.forEach((o) => {
      var l;
      e.addEventListener(c, o), (l = e.listeners.get(c)) == null || l.add(o);
    });
  });
}, w = (t, e) => {
  var n, s;
  (s = (n = t.listeners) == null ? void 0 : n.get("bind")) == null || s.forEach((r) => {
    typeof r == "function" && r(t);
  }), e && t.childNodes.forEach((r) => w(r, e));
}, _ = (t, e, n) => {
  var l;
  if (((l = t == null ? void 0 : t.children) == null ? void 0 : l.length) !== void 0 && t.children.length === 0) {
    const i = Array.from(e);
    t.append(...i), i.forEach((a) => {
      n(a), w(a, !0);
    });
    return;
  }
  const s = $(Array.from(t.childNodes), Array.from(e), (i, a) => p(i) != null && p(a) != null ? p(i) === p(a) : i === a);
  let r = s.find((i) => i.type === "="), c = 0;
  const o = [];
  s.forEach((i) => {
    if (i.type === "+") {
      const a = O(s, (u) => u.type === "-" && p(u.value) === p(i.value), c);
      if (a && (o.push({
        new: a.value,
        old: i.value
      }), S(i.value, a.value), i.value = a.value, a.skip = !0), !r) {
        t.append(i.value), w(i.value, !a), n(i.value), c += 1;
        return;
      }
      r.value.before(i.value), w(i.value, !a), n(i.value);
    } else if (i.type === "-") {
      if (i.skip) {
        c += 1;
        return;
      }
      t.removeChild(i.value);
      const a = O(s, (u) => u.type === "+" && p(u.value) === p(i.value), c);
      a && (o.push({
        new: i.value,
        old: a.value
      }), S(a.value, i.value), a.value = i.value);
    } else {
      const a = Array.from(e).find((u) => p(u) === p(i.value));
      o.push({
        new: i.value,
        old: a
      }), S(a, i.value), w(i.value), r = O(s, (u) => u.type === "=", c), n(i.value, !1);
    }
    c += 1;
  }), o.forEach((i) => {
    _(i.new, i.old.childNodes, n);
  });
}, Y = (t, e, n) => {
  const s = E(t);
  return y(() => {
    if (s === null)
      return;
    const c = e(s).childNodes, o = /* @__PURE__ */ new Map();
    _(s, c, (i, a = !0) => {
      const u = p(i);
      if (u != null && !(i instanceof Text)) {
        const d = i;
        d.isNew = a, o.set(u, d);
      }
    }), typeof n == "function" && y(() => {
      n(s, o);
    });
  }), s;
}, z = (t, e, n) => (...r) => (console.warn(`${e}${n ? `See more at ${n}` : ""}`), t(...r)), lt = z(
  Y,
  "'bindChildrens' is deprecated: please use 'bindChildren' instead.",
  new URL("https://github.com/paoloricciuti/sprinkle-js/issues/3")
);
export {
  X as batch,
  Y as bindChildren,
  lt as bindChildrens,
  ot as bindClass,
  ct as bindClasses,
  Q as bindDom,
  st as bindInnerHTML,
  it as bindInputValue,
  rt as bindStyle,
  nt as bindTextContent,
  q as createComputed,
  Z as createCssVariable,
  y as createEffect,
  K as createRef,
  m as createStored,
  v as createVariable,
  at as html,
  tt as setup,
  et as untrack
};
