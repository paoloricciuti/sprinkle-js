const w = (e) => typeof e == "string" ? document.querySelector(e) : e, x = (e, t, n = []) => {
  const s = Object.entries(t);
  for (let [l, c] of s) {
    if (typeof c == "object") {
      x(e, c, [...n, l]);
      continue;
    }
    let o = e;
    for (const i of n)
      o = o[i];
    if (n[n.length - 1] === "style" && l.startsWith("--")) {
      o.setProperty(l, c);
      continue;
    }
    if (l === "className" && e instanceof SVGElement) {
      o.setAttribute("class", c.toString());
      continue;
    }
    if (n.length === 0 && l.startsWith("data-")) {
      e.setAttribute(l, c);
      continue;
    }
    o[l] = c;
  }
}, L = (e, t) => [...Array(e).keys()].map(() => Array(t).fill(0)), T = (e = [], t = [], n = (s, l) => s === l) => {
  var i, u, p, y, f, a;
  const s = L(e.length + 1, t.length + 1);
  for (let r = 0; r < e.length + 1; r++)
    s[r][0] = r;
  for (let r = 0; r < t.length + 1; r++)
    s[0][r] = r;
  for (let r = 0; r < e.length; r++)
    for (let h = 0; h < t.length; h++)
      if (n(e[r], t[h]))
        s[r + 1][h + 1] = s[r][h];
      else {
        const C = Math.min(s[r + 1][h], s[r][h + 1]) + 1;
        s[r + 1][h + 1] = C;
      }
  const l = [];
  let c = e.length, o = t.length;
  for (; c > 0 && o > 0; )
    n(e[c - 1], t[o - 1]) ? (l.unshift({ type: "=", value: e[c - 1], skip: !1 }), o--, c--) : s[c - 1][o] < s[c][o - 1] ? (l.unshift({ type: "-", value: e[c - 1], skip: !1 }), c--) : (l.unshift({ type: "+", value: t[o - 1], skip: !1 }), o--);
  return c > 0 ? l.unshift(...((p = (u = (i = e == null ? void 0 : e.slice) == null ? void 0 : i.call(e, 0, c)) == null ? void 0 : u.map) == null ? void 0 : p.call(u, (r) => ({ type: "-", value: r, skip: !1 }))) || []) : o > 0 && l.unshift(...((a = (f = (y = t == null ? void 0 : t.slice) == null ? void 0 : y.call(t, 0, o)) == null ? void 0 : f.map) == null ? void 0 : a.call(f, (r) => ({ type: "+", value: r, skip: !1 }))) || []), l;
}, E = (e, t, n = 0) => e.find((s, l, ...c) => l > n && t(s, l, ...c)), O = (e) => Object.prototype.toString.call(e).slice(8, -1), I = (e) => {
  const t = document.createElement("template");
  return Object.assign(t, { innerHTML: e }), t.content;
}, M = (e, t) => e.getAttribute(t), m = (e) => e instanceof Element ? M(e, "key") : e.textContent;
let d = [];
const k = Symbol("is-reactive");
let g = null;
const P = (e) => {
  g = /* @__PURE__ */ new Set();
  try {
    e();
  } finally {
    const t = new Set(g);
    g = null, A(t);
  }
}, S = (e, t, n) => {
  let s = n.get(e);
  s || (s = /* @__PURE__ */ new Set(), n.set(e, s)), s.add(t), t.dependencies.add(s);
}, A = (e) => {
  [...e].forEach((t) => {
    if (!t.toRun)
      return;
    const n = t.execute();
    n && (t.cleanup = n);
  });
}, j = (e, t) => {
  const n = e.get(t);
  if (!!n) {
    if (g !== null) {
      n.forEach((s) => g.add(s));
      return;
    }
    A(n);
  }
}, v = (e, t) => {
  if (e[k])
    return e;
  if (typeof e != "object")
    throw new Error("It's not possible to create a variable from a primitive value...you can use createRef");
  const n = Object.keys(e || {});
  for (let c of n) {
    const o = c;
    !!e[o] && typeof e[o] == "object" && (O(e[o]) === "Object" || Array.isArray(e[o])) && (e[o] = v(e[o], t == null ? void 0 : t[o]));
  }
  const s = /* @__PURE__ */ new Map();
  return new Proxy(e, {
    get: (...c) => {
      if (c[1] === k)
        return !0;
      const o = d[d.length - 1];
      return o && S(c[1], o, s), Reflect.get(...c);
    },
    set: (c, o, i) => {
      var r;
      const u = o, p = (r = t == null ? void 0 : t[u]) != null ? r : Object.is;
      let y = i;
      !!i && typeof i == "object" && (O(i) === "Object" || Array.isArray(i)) && !i[k] && (y = v(i, p));
      const f = p(c[u], i), a = Reflect.set(c, o, y);
      return f || j(s, o), a;
    }
  });
}, V = (e, t, n = ":root") => {
  const s = v(e, t);
  let l = w(n);
  return l || (console.warn("Impossible to find the right html element, attaching the variables to the root."), l = document.querySelector(":root")), b(() => {
    Object.keys(s).forEach((o) => {
      var i;
      l.style.setProperty(`--${o}`, (i = s[o]) == null ? void 0 : i.toString());
    });
  }), s;
}, J = (e, t) => {
  const n = { value: e() };
  let s = !1;
  const l = /* @__PURE__ */ new Map(), c = new Proxy(n, {
    get: (...o) => {
      const i = d[d.length - 1];
      return i && S(o[1], i, l), Reflect.get(...o);
    },
    set: (o, i, u) => {
      if (!s)
        return !0;
      const p = i, f = (t != null ? t : Object.is)(o[p], u), a = Reflect.set(o, i, u);
      return f || j(l, i), a;
    }
  });
  return b(() => {
    s = !0, c.value = e(), s = !1;
  }), c;
}, H = (e, t, n, s = window.localStorage) => {
  if (typeof t != "object")
    throw new Error("It's not possible to create a variable from a primitive value...you can use createRef");
  const l = /* @__PURE__ */ new Map();
  let c = null;
  try {
    const i = s.getItem(e);
    i ? c = JSON.parse(i) : s.setItem(e, JSON.stringify(t));
  } catch {
    throw new Error("The specified key is associated with a non Object-like element");
  }
  const o = new Proxy(c != null ? c : t, {
    get: (...i) => {
      const u = d[d.length - 1];
      return u && S(i[1], u, l), Reflect.get(...i);
    },
    set: (i, u, p) => {
      var h;
      const y = u, a = ((h = n == null ? void 0 : n[y]) != null ? h : Object.is)(i[y], p), r = Reflect.set(i, u, p);
      return s.setItem(e, JSON.stringify(i)), a || j(l, u), r;
    }
  });
  return window.addEventListener("storage", (i) => {
    if (i.storageArea === s && i.key === e)
      try {
        if (i.newValue) {
          const u = JSON.parse(i.newValue);
          for (let p in u)
            o[p] = u[p];
        }
      } catch {
        console.warn("The storage was modified but the resulting object is not parsable...the variable was not updated.");
      }
  }), o;
}, U = (e, t) => v({ value: e }, t ? { value: t } : void 0), R = (e) => {
  e.owned.forEach((t) => {
    t.toRun = !1, R(t);
  });
  for (const t of e.dependencies)
    t.delete(e);
  e.dependencies.clear();
}, b = (e) => {
  const t = () => {
    var c, o, i;
    if (!n.toRun)
      return;
    (i = (o = (c = n == null ? void 0 : n.owner) == null ? void 0 : c.owned) == null ? void 0 : o.push) == null || i.call(o, n), n.cleanup && typeof n.cleanup == "function" && n.cleanup(), R(n), d.push(n);
    let l;
    try {
      l = e();
    } finally {
      d.pop();
    }
    return l;
  }, n = {
    execute: t,
    dependencies: /* @__PURE__ */ new Set(),
    owned: [],
    owner: d[d.length - 1],
    toRun: !0
  }, s = t();
  s && (n.cleanup = s);
}, W = (e) => {
  const t = d;
  d = [];
  const n = e();
  return d = t, n;
}, _ = (e, t) => {
  const n = w(e);
  return b(() => {
    n && (n.textContent = t(n));
  }), n;
}, F = (e, t) => {
  const n = w(e);
  return b(() => {
    n && (n.innerHTML = t(n));
  }), n;
}, B = (e, t, n) => {
  const s = w(e);
  return b(() => {
    s && (n(s) ? s.classList.add(t) : s.classList.remove(t));
  }), s;
}, G = (e, t) => {
  const n = w(e);
  return b(() => {
    if (n) {
      const s = t(n), l = Object.keys(s || {});
      for (let c of l)
        s[c] ? n.classList.add(c) : n.classList.remove(c);
    }
  }), n;
}, K = (e, t) => {
  const n = w(e);
  return b(() => {
    n && (n.value = t(n));
  }), n;
}, N = (e, t) => {
  const n = w(e);
  return b(() => x(n, t(n))), n;
}, Q = (e, t) => {
  const n = w(e);
  if (!!n)
    return N(n, () => ({ style: t(n) })), n;
}, Y = (e, t, n) => {
  const s = w(e);
  return b(() => {
    if (s === null)
      return;
    const l = t(s), c = I(l).childNodes, o = /* @__PURE__ */ new Map(), i = (f, a = !0) => {
      const r = m(f);
      (r !== null || r != null) && o.set(r, { element: f, isNew: a });
    };
    if (s.children.length === 0) {
      const f = Array.from(c);
      s.append(...f), f.forEach((a) => i(a)), typeof n == "function" && b(() => {
        n(s, o);
      });
      return;
    }
    const u = T(Array.from(s.childNodes), Array.from(c), (f, a) => m(f) != null && m(a) != null ? m(f) === m(a) : f === a);
    let p = u.find((f) => f.type === "="), y = 0;
    for (let f of u) {
      if (f.type === "+") {
        const a = E(u, (r) => r.type === "-" && m(r.value) === m(f.value), y);
        if (a && (f.value = a.value, a.skip = !0), !p) {
          s.append(f.value), i(f.value), y++;
          continue;
        }
        p.value.before(f.value), i(f.value);
      } else if (f.type === "-") {
        if (f.skip) {
          y++;
          continue;
        }
        s.removeChild(f.value);
        const a = E(u, (r) => r.type === "+" && m(r.value) === m(f.value), y);
        a && (a.value = f.value);
      } else
        p = E(u, (a) => a.type === "=", y), i(f.value, !1);
      y++;
    }
    typeof n == "function" && b(() => {
      n(s, o);
    });
  }), s;
};
export {
  P as batch,
  Y as bindChildrens,
  B as bindClass,
  G as bindClasses,
  N as bindDom,
  F as bindInnerHTML,
  K as bindInputValue,
  Q as bindStyle,
  _ as bindTextContent,
  J as createComputed,
  V as createCssVariable,
  b as createEffect,
  U as createRef,
  H as createStored,
  v as createVariable,
  W as untrack
};
