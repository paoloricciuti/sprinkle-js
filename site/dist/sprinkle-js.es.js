const w = (e) => typeof e == "string" ? document.querySelector(e) : e, x = (e, t, n = []) => {
  const s = Object.entries(t);
  for (let [f, i] of s) {
    if (typeof i == "object") {
      x(e, i, [...n, f]);
      return;
    }
    let o = e;
    for (const c of n)
      o = o[c];
    n[n.length - 1] === "style" && o.setProperty(f, i), o[f] = i;
  }
}, L = (e, t) => [...Array(e).keys()].map(() => Array(t).fill(0)), T = (e = [], t = [], n = (s, f) => s === f) => {
  var c, u, p, y, r, a;
  const s = L(e.length + 1, t.length + 1);
  for (let l = 0; l < e.length + 1; l++)
    s[l][0] = l;
  for (let l = 0; l < t.length + 1; l++)
    s[0][l] = l;
  for (let l = 0; l < e.length; l++)
    for (let h = 0; h < t.length; h++)
      if (n(e[l], t[h]))
        s[l + 1][h + 1] = s[l][h];
      else {
        const C = Math.min(s[l + 1][h], s[l][h + 1]) + 1;
        s[l + 1][h + 1] = C;
      }
  const f = [];
  let i = e.length, o = t.length;
  for (; i > 0 && o > 0; )
    n(e[i - 1], t[o - 1]) ? (f.unshift({ type: "=", value: e[i - 1], skip: !1 }), o--, i--) : s[i - 1][o] < s[i][o - 1] ? (f.unshift({ type: "-", value: e[i - 1], skip: !1 }), i--) : (f.unshift({ type: "+", value: t[o - 1], skip: !1 }), o--);
  return i > 0 ? f.unshift(...((p = (u = (c = e == null ? void 0 : e.slice) == null ? void 0 : c.call(e, 0, i)) == null ? void 0 : u.map) == null ? void 0 : p.call(u, (l) => ({ type: "-", value: l, skip: !1 }))) || []) : o > 0 && f.unshift(...((a = (r = (y = t == null ? void 0 : t.slice) == null ? void 0 : y.call(t, 0, o)) == null ? void 0 : r.map) == null ? void 0 : a.call(r, (l) => ({ type: "+", value: l, skip: !1 }))) || []), f;
}, E = (e, t, n = 0) => e.find((s, f, ...i) => f > n && t(s, f, ...i)), S = (e) => Object.prototype.toString.call(e).slice(8, -1), I = (e) => {
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
    g = null, R(t);
  }
}, j = (e, t, n) => {
  let s = n.get(e);
  s || (s = /* @__PURE__ */ new Set(), n.set(e, s)), s.add(t), t.dependencies.add(s);
}, R = (e) => {
  [...e].forEach((t) => {
    if (!t.toRun)
      return;
    const n = t.execute();
    n && (t.cleanup = n);
  });
}, O = (e, t) => {
  const n = e.get(t);
  if (!!n) {
    if (g !== null) {
      n.forEach((s) => g.add(s));
      return;
    }
    R(n);
  }
}, v = (e, t) => {
  if (e[k])
    return e;
  if (typeof e != "object")
    throw new Error("It's not possible to create a variable from a primitive value...you can use createRef");
  const n = Object.keys(e || {});
  for (let i of n) {
    const o = i;
    !!e[o] && typeof e[o] == "object" && (S(e[o]) === "Object" || Array.isArray(e[o])) && (e[o] = v(e[o], t == null ? void 0 : t[o]));
  }
  const s = /* @__PURE__ */ new Map();
  return new Proxy(e, {
    get: (...i) => {
      if (i[1] === k)
        return !0;
      const o = d[d.length - 1];
      return o && j(i[1], o, s), Reflect.get(...i);
    },
    set: (i, o, c) => {
      var l;
      const u = o, p = (l = t == null ? void 0 : t[u]) != null ? l : Object.is;
      let y = c;
      !!c && typeof c == "object" && (S(c) === "Object" || Array.isArray(c)) && !c[k] && (y = v(c, p));
      const r = p(i[u], c), a = Reflect.set(i, o, y);
      return r || O(s, o), a;
    }
  });
}, V = (e, t, n = ":root") => {
  const s = v(e, t);
  let f = w(n);
  return f || (console.warn("Impossible to find the right html element, attaching the variables to the root."), f = document.querySelector(":root")), b(() => {
    Object.keys(s).forEach((o) => {
      var c;
      f.style.setProperty(`--${o}`, (c = s[o]) == null ? void 0 : c.toString());
    });
  }), s;
}, J = (e, t) => {
  const n = { value: e() };
  let s = !1;
  const f = /* @__PURE__ */ new Map(), i = new Proxy(n, {
    get: (...o) => {
      const c = d[d.length - 1];
      return c && j(o[1], c, f), Reflect.get(...o);
    },
    set: (o, c, u) => {
      if (!s)
        return !0;
      const p = c, r = (t != null ? t : Object.is)(o[p], u), a = Reflect.set(o, c, u);
      return r || O(f, c), a;
    }
  });
  return b(() => {
    s = !0, i.value = e(), s = !1;
  }), i;
}, H = (e, t, n, s = window.localStorage) => {
  if (typeof t != "object")
    throw new Error("It's not possible to create a variable from a primitive value...you can use createRef");
  const f = /* @__PURE__ */ new Map();
  let i = null;
  try {
    const c = s.getItem(e);
    c ? i = JSON.parse(c) : s.setItem(e, JSON.stringify(t));
  } catch {
    throw new Error("The specified key is associated with a non Object-like element");
  }
  const o = new Proxy(i != null ? i : t, {
    get: (...c) => {
      const u = d[d.length - 1];
      return u && j(c[1], u, f), Reflect.get(...c);
    },
    set: (c, u, p) => {
      var h;
      const y = u, a = ((h = n == null ? void 0 : n[y]) != null ? h : Object.is)(c[y], p), l = Reflect.set(c, u, p);
      return s.setItem(e, JSON.stringify(c)), a || O(f, u), l;
    }
  });
  return window.addEventListener("storage", (c) => {
    if (c.storageArea === s && c.key === e)
      try {
        if (c.newValue) {
          const u = JSON.parse(c.newValue);
          for (let p in u)
            o[p] = u[p];
        }
      } catch {
        console.warn("The storage was modified but the resulting object is not parsable...the variable was not updated.");
      }
  }), o;
}, U = (e, t) => v({ value: e }, t ? { value: t } : void 0), A = (e) => {
  e.owned.forEach((t) => {
    t.toRun = !1, A(t);
  });
  for (const t of e.dependencies)
    t.delete(e);
  e.dependencies.clear();
}, b = (e) => {
  const t = () => {
    var i, o, c;
    if (!n.toRun)
      return;
    (c = (o = (i = n == null ? void 0 : n.owner) == null ? void 0 : i.owned) == null ? void 0 : o.push) == null || c.call(o, n), n.cleanup && typeof n.cleanup == "function" && n.cleanup(), A(n), d.push(n);
    let f;
    try {
      f = e();
    } finally {
      d.pop();
    }
    return f;
  }, n = {
    execute: t,
    dependencies: /* @__PURE__ */ new Set(),
    owned: [],
    owner: d[d.length - 1],
    toRun: !0
  }, s = t();
  s && (n.cleanup = s);
}, _ = (e) => {
  const t = d;
  d = [];
  const n = e();
  return d = t, n;
}, F = (e, t) => {
  const n = w(e);
  return b(() => {
    n && (n.textContent = t(n));
  }), n;
}, B = (e, t) => {
  const n = w(e);
  return b(() => {
    n && (n.innerHTML = t(n));
  }), n;
}, K = (e, t, n) => {
  const s = w(e);
  return b(() => {
    s && (n(s) ? s.classList.add(t) : s.classList.remove(t));
  }), s;
}, Q = (e, t) => {
  const n = w(e);
  return b(() => {
    if (n) {
      const s = t(n), f = Object.keys(s || {});
      for (let i of f)
        s[i] ? n.classList.add(i) : n.classList.remove(i);
    }
  }), n;
}, W = (e, t) => {
  const n = w(e);
  return b(() => {
    n && (n.value = t(n));
  }), n;
}, N = (e, t) => {
  const n = w(e);
  return b(() => x(n, t(n))), n;
}, Y = (e, t) => {
  const n = w(e);
  if (!!n)
    return N(n, () => ({ style: t(n) })), n;
}, $ = (e, t, n) => {
  const s = w(e);
  return b(() => {
    if (s === null)
      return;
    const f = t(s), i = I(f).childNodes, o = /* @__PURE__ */ new Map(), c = (r, a = !0) => {
      const l = m(r);
      (l !== null || l != null) && o.set(l, { element: r, isNew: a });
    };
    if (s.children.length === 0) {
      const r = Array.from(i);
      s.append(...r), r.forEach((a) => c(a)), typeof n == "function" && b(() => {
        n(s, o);
      });
      return;
    }
    const u = T(Array.from(s.childNodes), Array.from(i), (r, a) => m(r) != null && m(a) != null ? m(r) === m(a) : r === a);
    let p = u.find((r) => r.type === "="), y = 0;
    for (let r of u) {
      if (r.type === "+") {
        const a = E(u, (l) => l.type === "-" && m(l.value) === m(r.value), y);
        if (a && (r.value = a.value, a.skip = !0), !p) {
          s.append(r.value), c(r.value), y++;
          continue;
        }
        p.value.before(r.value), c(r.value);
      } else if (r.type === "-") {
        if (r.skip) {
          y++;
          continue;
        }
        s.removeChild(r.value);
        const a = E(u, (l) => l.type === "+" && m(l.value) === m(r.value), y);
        a && (a.value = r.value);
      } else
        p = E(u, (a) => a.type === "=", y), c(r.value, !1);
      y++;
    }
    typeof n == "function" && b(() => {
      n(s, o);
    });
  }), s;
};
export {
  P as batch,
  $ as bindChildrens,
  K as bindClass,
  Q as bindClasses,
  N as bindDom,
  B as bindInnerHTML,
  W as bindInputValue,
  Y as bindStyle,
  F as bindTextContent,
  J as createComputed,
  V as createCssVariable,
  b as createEffect,
  U as createRef,
  H as createStored,
  v as createVariable,
  _ as untrack
};
