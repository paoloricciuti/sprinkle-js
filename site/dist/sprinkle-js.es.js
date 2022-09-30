const E = (t) => typeof t == "string" ? document.querySelector(t) : t, x = (t, e, n = []) => {
  Object.entries(e).forEach(([l, c]) => {
    if (typeof c == "object") {
      x(t, c, [...n, l]);
      return;
    }
    let o = t;
    if (n.forEach((i) => {
      o = o[i];
    }), n[n.length - 1] === "style" && l.startsWith("--")) {
      o.setProperty(l, c);
      return;
    }
    if (l === "className" && t instanceof SVGElement) {
      o.setAttribute("class", c.toString());
      return;
    }
    if (n.length === 0 && l.startsWith("data-")) {
      t.setAttribute(l, c);
      return;
    }
    o[l] = c;
  });
}, L = (t, e) => [...Array(t).keys()].map(() => Array(e).fill(0)), T = (t = [], e = [], n = (s, l) => s === l) => {
  var i, u, y, d, f, a;
  const s = L(t.length + 1, e.length + 1);
  for (let r = 0; r < t.length + 1; r += 1)
    s[r][0] = r;
  for (let r = 0; r < e.length + 1; r += 1)
    s[0][r] = r;
  for (let r = 0; r < t.length; r += 1)
    for (let p = 0; p < e.length; p += 1)
      if (n(t[r], e[p]))
        s[r + 1][p + 1] = s[r][p];
      else {
        const C = Math.min(s[r + 1][p], s[r][p + 1]) + 1;
        s[r + 1][p + 1] = C;
      }
  const l = [];
  let c = t.length, o = e.length;
  for (; c > 0 && o > 0; )
    n(t[c - 1], e[o - 1]) ? (l.unshift({ type: "=", value: t[c - 1], skip: !1 }), o -= 1, c -= 1) : s[c - 1][o] < s[c][o - 1] ? (l.unshift({ type: "-", value: t[c - 1], skip: !1 }), c -= 1) : (l.unshift({ type: "+", value: e[o - 1], skip: !1 }), o -= 1);
  return c > 0 ? l.unshift(...((y = (u = (i = t == null ? void 0 : t.slice) == null ? void 0 : i.call(t, 0, c)) == null ? void 0 : u.map) == null ? void 0 : y.call(u, (r) => ({ type: "-", value: r, skip: !1 }))) || []) : o > 0 && l.unshift(...((a = (f = (d = e == null ? void 0 : e.slice) == null ? void 0 : d.call(e, 0, o)) == null ? void 0 : f.map) == null ? void 0 : a.call(f, (r) => ({ type: "+", value: r, skip: !1 }))) || []), l;
}, m = (t, e, n = 0) => t.find((s, l, ...c) => l > n && e(s, l, ...c)), S = (t) => Object.prototype.toString.call(t).slice(8, -1), I = (t) => {
  const e = document.createElement("template");
  return Object.assign(e, { innerHTML: t }), e.content;
}, M = (t, e) => t.getAttribute(e), w = (t) => t instanceof Element ? M(t, "key") : t.textContent;
let h = [];
const j = Symbol("is-reactive");
let g = null;
const A = (t) => {
  [...t].forEach((e) => {
    if (!e.toRun)
      return;
    const n = e.execute();
    n && (e.cleanup = n);
  });
}, V = (t) => {
  g = /* @__PURE__ */ new Set();
  try {
    t();
  } finally {
    const e = new Set(g);
    g = null, A(e);
  }
}, v = (t, e, n) => {
  let s = n.get(t);
  s || (s = /* @__PURE__ */ new Set(), n.set(t, s)), s.add(e), e.dependencies.add(s);
}, O = (t, e) => {
  const n = t.get(e);
  if (!!n) {
    if (g !== null) {
      n.forEach((s) => g.add(s));
      return;
    }
    A(n);
  }
}, k = (t, e) => {
  if (t[j])
    return t;
  if (typeof t != "object")
    throw new Error("It's not possible to create a variable from a primitive value...you can use createRef");
  Object.keys(t || {}).forEach((c) => {
    const o = c;
    !!t[o] && typeof t[o] == "object" && (S(t[o]) === "Object" || Array.isArray(t[o])) && (t[o] = k(t[o], e == null ? void 0 : e[o]));
  });
  const s = /* @__PURE__ */ new Map();
  return new Proxy(t, {
    get: (...c) => {
      if (c[1] === j)
        return !0;
      const o = h[h.length - 1];
      return o && v(c[1], o, s), Reflect.get(...c);
    },
    set: (c, o, i) => {
      var r;
      const u = o, y = (r = e == null ? void 0 : e[u]) != null ? r : Object.is;
      let d = i;
      !!i && typeof i == "object" && (S(i) === "Object" || Array.isArray(i)) && !i[j] && (d = k(i, y));
      const f = y(c[u], i), a = Reflect.set(c, o, d);
      return f || O(s, o), a;
    }
  });
}, N = (t, e, n = ":root") => {
  const s = k(t, e);
  let l = E(n);
  return l || (console.warn("Impossible to find the right html element, attaching the variables to the root."), l = document.querySelector(":root")), b(() => {
    Object.keys(s).forEach((o) => {
      var i;
      l.style.setProperty(`--${o}`, (i = s[o]) == null ? void 0 : i.toString());
    });
  }), s;
}, J = (t, e) => {
  const n = { value: t() };
  let s = !1;
  const l = /* @__PURE__ */ new Map(), c = new Proxy(n, {
    get: (...o) => {
      const i = h[h.length - 1];
      return i && v(o[1], i, l), Reflect.get(...o);
    },
    set: (o, i, u) => {
      if (!s)
        return !0;
      const y = i, f = (e != null ? e : Object.is)(o[y], u), a = Reflect.set(o, i, u);
      return f || O(l, i), a;
    }
  });
  return b(() => {
    s = !0, c.value = t(), s = !1;
  }), c;
}, H = (t, e, n, s = window.localStorage) => {
  if (typeof e != "object")
    throw new Error("It's not possible to create a variable from a primitive value...you can use createRef");
  const l = /* @__PURE__ */ new Map();
  let c = null;
  try {
    const i = s.getItem(t);
    i ? c = JSON.parse(i) : s.setItem(t, JSON.stringify(e));
  } catch {
    throw new Error("The specified key is associated with a non Object-like element");
  }
  const o = new Proxy(c != null ? c : e, {
    get: (...i) => {
      const u = h[h.length - 1];
      return u && v(i[1], u, l), Reflect.get(...i);
    },
    set: (i, u, y) => {
      var p;
      const d = u, a = ((p = n == null ? void 0 : n[d]) != null ? p : Object.is)(i[d], y), r = Reflect.set(i, u, y);
      return s.setItem(t, JSON.stringify(i)), a || O(l, u), r;
    }
  });
  return window.addEventListener("storage", (i) => {
    if (i.storageArea === s && i.key === t)
      try {
        if (i.newValue) {
          const u = JSON.parse(i.newValue);
          Object.keys(u).forEach((d) => {
            o[d] = u[d];
          });
        }
      } catch {
        console.warn("The storage was modified but the resulting object is not parsable...the variable was not updated.");
      }
  }), o;
}, U = (t, e) => k({ value: t }, e ? { value: e } : void 0), R = (t) => {
  t.owned.forEach((e) => {
    e.toRun = !1, R(e);
  }), t.dependencies.forEach((e) => {
    e.delete(t);
  }), t.dependencies.clear();
}, b = (t) => {
  const e = () => {
    var c, o, i;
    if (!n.toRun)
      return;
    (i = (o = (c = n == null ? void 0 : n.owner) == null ? void 0 : c.owned) == null ? void 0 : o.push) == null || i.call(o, n), n.cleanup && typeof n.cleanup == "function" && n.cleanup(), R(n), h.push(n);
    let l;
    try {
      l = t();
    } finally {
      h.pop();
    }
    return l;
  }, n = {
    execute: e,
    dependencies: /* @__PURE__ */ new Set(),
    owned: [],
    owner: h[h.length - 1],
    toRun: !0
  }, s = e();
  s && (n.cleanup = s);
}, W = (t) => {
  const e = h;
  h = [];
  const n = t();
  return h = e, n;
}, _ = (t, e) => {
  const n = E(t);
  return b(() => {
    n && (n.textContent = e(n));
  }), n;
}, F = (t, e) => {
  const n = E(t);
  return b(() => {
    n && (n.innerHTML = e(n));
  }), n;
}, B = (t, e, n) => {
  const s = E(t);
  return b(() => {
    s && (n(s) ? s.classList.add(e) : s.classList.remove(e));
  }), s;
}, G = (t, e) => {
  const n = E(t);
  return b(() => {
    if (n) {
      const s = e(n);
      Object.keys(s || {}).forEach((c) => {
        s[c] ? n.classList.add(c) : n.classList.remove(c);
      });
    }
  }), n;
}, Q = (t, e) => {
  const n = E(t);
  return b(() => {
    n && (n.value = e(n));
  }), n;
}, P = (t, e) => {
  const n = E(t);
  return b(() => x(n, e(n))), n;
}, Y = (t, e) => {
  const n = E(t);
  if (!!n)
    return P(n, () => ({ style: e(n) })), n;
}, $ = (t, e, n) => {
  const s = E(t);
  return b(() => {
    if (s === null)
      return;
    const l = e(s), c = I(l).childNodes, o = /* @__PURE__ */ new Map(), i = (f, a = !0) => {
      const r = w(f);
      r != null && o.set(r, { element: f, isNew: a });
    };
    if (s.children.length === 0) {
      const f = Array.from(c);
      s.append(...f), f.forEach((a) => i(a)), typeof n == "function" && b(() => {
        n(s, o);
      });
      return;
    }
    const u = T(Array.from(s.childNodes), Array.from(c), (f, a) => w(f) != null && w(a) != null ? w(f) === w(a) : f === a);
    let y = u.find((f) => f.type === "="), d = 0;
    u.forEach((f) => {
      if (f.type === "+") {
        const a = m(u, (r) => r.type === "-" && w(r.value) === w(f.value), d);
        if (a && (f.value = a.value, a.skip = !0), !y) {
          s.append(f.value), i(f.value), d += 1;
          return;
        }
        y.value.before(f.value), i(f.value);
      } else if (f.type === "-") {
        if (f.skip) {
          d += 1;
          return;
        }
        s.removeChild(f.value);
        const a = m(u, (r) => r.type === "+" && w(r.value) === w(f.value), d);
        a && (a.value = f.value);
      } else
        y = m(u, (a) => a.type === "=", d), i(f.value, !1);
      d += 1;
    }), typeof n == "function" && b(() => {
      n(s, o);
    });
  }), s;
};
export {
  V as batch,
  $ as bindChildrens,
  B as bindClass,
  G as bindClasses,
  P as bindDom,
  F as bindInnerHTML,
  Q as bindInputValue,
  Y as bindStyle,
  _ as bindTextContent,
  J as createComputed,
  N as createCssVariable,
  b as createEffect,
  U as createRef,
  H as createStored,
  k as createVariable,
  W as untrack
};
