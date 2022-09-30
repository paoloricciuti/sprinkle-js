const E = (t) => typeof t == "string" ? document.querySelector(t) : t, j = (t, e, n = []) => {
  Object.entries(e).forEach(([i, c]) => {
    if (typeof c == "object") {
      j(t, c, [...n, i]);
      return;
    }
    let o = t;
    if (n.forEach((f) => {
      o = o[f];
    }), n[n.length - 1] === "style" && i.startsWith("--")) {
      o.setProperty(i, c);
      return;
    }
    if (i === "className" && t instanceof SVGElement) {
      o.setAttribute("class", c.toString());
      return;
    }
    if (n.length === 0 && i.startsWith("data-")) {
      t.setAttribute(i, c);
      return;
    }
    o[i] = c;
  });
}, C = (t, e) => [...Array(t).keys()].map(() => Array(e).fill(0)), L = (t = [], e = [], n = (s, i) => s === i) => {
  var f, a, d, y, r, u;
  const s = C(t.length + 1, e.length + 1);
  for (let l = 0; l < t.length + 1; l += 1)
    s[l][0] = l;
  for (let l = 0; l < e.length + 1; l += 1)
    s[0][l] = l;
  for (let l = 0; l < t.length; l += 1)
    for (let w = 0; w < e.length; w += 1)
      if (n(t[l], e[w]))
        s[l + 1][w + 1] = s[l][w];
      else {
        const R = Math.min(s[l + 1][w], s[l][w + 1]) + 1;
        s[l + 1][w + 1] = R;
      }
  const i = [];
  let c = t.length, o = e.length;
  for (; c > 0 && o > 0; )
    n(t[c - 1], e[o - 1]) ? (i.unshift({ type: "=", value: t[c - 1], skip: !1 }), o -= 1, c -= 1) : s[c - 1][o] < s[c][o - 1] ? (i.unshift({ type: "-", value: t[c - 1], skip: !1 }), c -= 1) : (i.unshift({ type: "+", value: e[o - 1], skip: !1 }), o -= 1);
  return c > 0 ? i.unshift(...((d = (a = (f = t == null ? void 0 : t.slice) == null ? void 0 : f.call(t, 0, c)) == null ? void 0 : a.map) == null ? void 0 : d.call(a, (l) => ({ type: "-", value: l, skip: !1 }))) || []) : o > 0 && i.unshift(...((u = (r = (y = e == null ? void 0 : e.slice) == null ? void 0 : y.call(e, 0, o)) == null ? void 0 : r.map) == null ? void 0 : u.call(r, (l) => ({ type: "+", value: l, skip: !1 }))) || []), i;
}, S = (t, e, n = 0) => t.find((s, i, ...c) => i > n && e(s, i, ...c)), O = (t) => Object.prototype.toString.call(t).slice(8, -1), T = (t) => {
  const e = document.createElement("template");
  return Object.assign(e, { innerHTML: t }), e.content;
}, I = (t, e) => t.getAttribute(e), p = (t) => t instanceof Element ? I(t, "key") : t.textContent;
let b = [];
const g = Symbol("is-reactive"), k = Symbol("memo");
let v = null;
const A = (t) => {
  [...t].forEach((e) => {
    if (!e.toRun)
      return;
    const n = e.execute();
    n && (e.cleanup = n);
  });
}, N = (t) => {
  v = /* @__PURE__ */ new Set();
  try {
    t();
  } finally {
    const e = new Set(v);
    v = null, A(e);
  }
}, M = (t, e, n) => {
  let s = n.get(t);
  s || (s = /* @__PURE__ */ new Set(), n.set(t, s)), s.add(e), e.dependencies.add(s);
}, V = (t, e) => {
  const n = t.get(e);
  if (!!n) {
    if (v !== null) {
      n.forEach((s) => v.add(s));
      return;
    }
    A(n);
  }
}, m = (t, e) => {
  if (t[g])
    return t;
  if (typeof t != "object")
    throw new Error("It's not possible to create a variable from a primitive value...you can use createRef");
  Object.keys(t || {}).forEach((c) => {
    const o = c;
    !!t[o] && typeof t[o] == "object" && (O(t[o]) === "Object" || Array.isArray(t[o])) && (t[o] = m(t[o], e == null ? void 0 : e[o]));
  });
  const s = /* @__PURE__ */ new Map();
  return new Proxy(t, {
    get: (...c) => {
      if (c[1] === g)
        return !0;
      const o = b[b.length - 1];
      return o && M(c[1], o, s), Reflect.get(...c);
    },
    set: (c, o, f) => {
      var l;
      if (c[k] === !1 && o !== k)
        return !0;
      const a = o, d = (l = e == null ? void 0 : e[a]) != null ? l : Object.is;
      let y = f;
      !!f && typeof f == "object" && (O(f) === "Object" || Array.isArray(f)) && !f[g] && (y = m(f, d));
      const r = d(c[a], f), u = Reflect.set(c, o, y);
      return r || V(s, o), u;
    }
  });
}, _ = (t, e, n = ":root") => {
  const s = m(t, e);
  let i = E(n);
  return i || (console.warn("Impossible to find the right html element, attaching the variables to the root."), i = document.querySelector(":root")), h(() => {
    Object.keys(s).forEach((o) => {
      var f;
      i.style.setProperty(`--${o}`, (f = s[o]) == null ? void 0 : f.toString());
    });
  }), s;
}, J = (t, e) => {
  const n = { value: t(), [k]: !1 }, s = m(n, e ? { value: e } : void 0);
  return h(() => {
    s[k] = !0, s.value = t(), s[k] = !1;
  }), s;
}, U = (t, e, n, s = window.localStorage) => {
  if (typeof e != "object")
    throw new Error("It's not possible to create a variable from a primitive value...you can use createRef");
  let i = null;
  try {
    const o = s.getItem(t);
    o ? i = JSON.parse(o) : s.setItem(t, JSON.stringify(e));
  } catch {
    throw new Error("The specified key is associated with a non Object-like element");
  }
  const c = m(i != null ? i : e, n);
  return h(() => {
    s.setItem(t, JSON.stringify(c));
  }), window.addEventListener("storage", (o) => {
    if (o.storageArea === s && o.key === t)
      try {
        if (o.newValue) {
          const f = JSON.parse(o.newValue);
          Object.keys(f).forEach((d) => {
            c[d] = f[d];
          });
        }
      } catch {
        console.warn("The storage was modified but the resulting object is not parsable...the variable was not updated.");
      }
  }), c;
}, H = (t, e) => m({ value: t }, e ? { value: e } : void 0), x = (t) => {
  t.owned.forEach((e) => {
    e.toRun = !1, x(e);
  }), t.dependencies.forEach((e) => {
    e.delete(t);
  }), t.dependencies.clear();
}, h = (t) => {
  const e = () => {
    var c, o, f;
    if (!n.toRun)
      return;
    (f = (o = (c = n == null ? void 0 : n.owner) == null ? void 0 : c.owned) == null ? void 0 : o.push) == null || f.call(o, n), n.cleanup && typeof n.cleanup == "function" && n.cleanup(), x(n), b.push(n);
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
  }, s = e();
  s && (n.cleanup = s);
}, W = (t) => {
  const e = b;
  b = [];
  const n = t();
  return b = e, n;
}, B = (t, e) => {
  const n = E(t);
  return h(() => {
    n && (n.textContent = e(n));
  }), n;
}, F = (t, e) => {
  const n = E(t);
  return h(() => {
    n && (n.innerHTML = e(n));
  }), n;
}, D = (t, e, n) => {
  const s = E(t);
  return h(() => {
    s && (n(s) ? s.classList.add(e) : s.classList.remove(e));
  }), s;
}, G = (t, e) => {
  const n = E(t);
  return h(() => {
    if (n) {
      const s = e(n);
      Object.keys(s || {}).forEach((c) => {
        s[c] ? n.classList.add(c) : n.classList.remove(c);
      });
    }
  }), n;
}, Q = (t, e) => {
  const n = E(t);
  return h(() => {
    n && (n.value = e(n));
  }), n;
}, P = (t, e) => {
  const n = E(t);
  return h(() => j(n, e(n))), n;
}, Y = (t, e) => {
  const n = E(t);
  if (!!n)
    return P(n, () => ({ style: e(n) })), n;
}, $ = (t, e, n) => {
  const s = E(t);
  return h(() => {
    if (s === null)
      return;
    const i = e(s), c = T(i).childNodes, o = /* @__PURE__ */ new Map(), f = (r, u = !0) => {
      const l = p(r);
      l != null && o.set(l, { element: r, isNew: u });
    };
    if (s.children.length === 0) {
      const r = Array.from(c);
      s.append(...r), r.forEach((u) => f(u)), typeof n == "function" && h(() => {
        n(s, o);
      });
      return;
    }
    const a = L(Array.from(s.childNodes), Array.from(c), (r, u) => p(r) != null && p(u) != null ? p(r) === p(u) : r === u);
    let d = a.find((r) => r.type === "="), y = 0;
    a.forEach((r) => {
      if (r.type === "+") {
        const u = S(a, (l) => l.type === "-" && p(l.value) === p(r.value), y);
        if (u && (r.value = u.value, u.skip = !0), !d) {
          s.append(r.value), f(r.value), y += 1;
          return;
        }
        d.value.before(r.value), f(r.value);
      } else if (r.type === "-") {
        if (r.skip) {
          y += 1;
          return;
        }
        s.removeChild(r.value);
        const u = S(a, (l) => l.type === "+" && p(l.value) === p(r.value), y);
        u && (u.value = r.value);
      } else
        d = S(a, (u) => u.type === "=", y), f(r.value, !1);
      y += 1;
    }), typeof n == "function" && h(() => {
      n(s, o);
    });
  }), s;
};
export {
  N as batch,
  $ as bindChildrens,
  D as bindClass,
  G as bindClasses,
  P as bindDom,
  F as bindInnerHTML,
  Q as bindInputValue,
  Y as bindStyle,
  B as bindTextContent,
  J as createComputed,
  _ as createCssVariable,
  h as createEffect,
  H as createRef,
  U as createStored,
  m as createVariable,
  W as untrack
};
