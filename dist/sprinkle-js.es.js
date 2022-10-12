const E = (e) => typeof e == "string" ? document.querySelector(e) : e, A = (e, t, n = []) => {
  Object.entries(t).forEach(([i, c]) => {
    if (typeof c == "object") {
      A(e, c, [...n, i]);
      return;
    }
    let o = e;
    if (n.forEach((f) => {
      o = o[f];
    }), n[n.length - 1] === "style" && i.startsWith("--")) {
      o.setProperty(i, c);
      return;
    }
    if (i === "className" && e instanceof SVGElement) {
      o.setAttribute("class", c.toString());
      return;
    }
    if (n.length === 0 && i.startsWith("data-")) {
      e.setAttribute(i, c);
      return;
    }
    o[i] = c;
  });
}, I = (e, t) => [...Array(e).keys()].map(() => Array(t).fill(0)), L = (e = [], t = [], n = (s, i) => s === i) => {
  var f, u, d, h, l, a;
  const s = I(e.length + 1, t.length + 1);
  for (let r = 0; r < e.length + 1; r += 1)
    s[r][0] = r;
  for (let r = 0; r < t.length + 1; r += 1)
    s[0][r] = r;
  for (let r = 0; r < e.length; r += 1)
    for (let m = 0; m < t.length; m += 1)
      if (n(e[r], t[m]))
        s[r + 1][m + 1] = s[r][m];
      else {
        const T = Math.min(s[r + 1][m], s[r][m + 1]) + 1;
        s[r + 1][m + 1] = T;
      }
  const i = [];
  let c = e.length, o = t.length;
  for (; c > 0 && o > 0; )
    n(e[c - 1], t[o - 1]) ? (i.unshift({ type: "=", value: e[c - 1], skip: !1 }), o -= 1, c -= 1) : s[c - 1][o] < s[c][o - 1] ? (i.unshift({ type: "-", value: e[c - 1], skip: !1 }), c -= 1) : (i.unshift({ type: "+", value: t[o - 1], skip: !1 }), o -= 1);
  return c > 0 ? i.unshift(...((d = (u = (f = e == null ? void 0 : e.slice) == null ? void 0 : f.call(e, 0, c)) == null ? void 0 : u.map) == null ? void 0 : d.call(u, (r) => ({ type: "-", value: r, skip: !1 }))) || []) : o > 0 && i.unshift(...((a = (l = (h = t == null ? void 0 : t.slice) == null ? void 0 : h.call(t, 0, o)) == null ? void 0 : l.map) == null ? void 0 : a.call(l, (r) => ({ type: "+", value: r, skip: !1 }))) || []), i;
}, S = (e, t, n = 0) => e.find((s, i, ...c) => i > n && t(s, i, ...c)), j = (e) => Object.prototype.toString.call(e).slice(8, -1), V = (e) => {
  const t = document.createElement("template");
  return Object.assign(t, { innerHTML: e }), t.content;
}, N = (e, t) => e.getAttribute(t), p = (e) => e instanceof Element ? N(e, "key") : e.textContent;
let b = [];
const C = Symbol("is-reactive"), k = Symbol("memo");
let v = null;
const x = (e) => {
  [...e].forEach((t) => {
    if (!t.toRun)
      return;
    const n = t.execute();
    n && (t.cleanup = n);
  });
}, H = (e) => {
  v = /* @__PURE__ */ new Set();
  try {
    e();
  } finally {
    const t = new Set(v);
    v = null, x(t);
  }
}, M = (e, t, n) => {
  let s = n.get(e);
  s || (s = /* @__PURE__ */ new Set(), n.set(e, s)), s.add(t), t.dependencies.add(s);
}, _ = (e, t) => {
  const n = e.get(t);
  if (!!n) {
    if (v !== null) {
      n.forEach((s) => v.add(s));
      return;
    }
    x(n);
  }
}, P = (e, t) => {
  if (e[C])
    return e;
  if (typeof e != "object")
    throw new Error("It's not possible to create a variable from a primitive value...you can use createRef");
  Object.keys(e || {}).forEach((c) => {
    const o = c;
    !!e[o] && typeof e[o] == "object" && (j(e[o]) === "Object" || Array.isArray(e[o])) && (e[o] = w(e[o], t == null ? void 0 : t[o]));
  });
  const s = /* @__PURE__ */ new Map();
  return new Proxy(e, {
    get: (...c) => {
      if (c[1] === C)
        return !0;
      const o = b[b.length - 1];
      return o && M(c[1], o, s), Reflect.get(...c);
    },
    set: (c, o, f) => {
      var r;
      if (c[k] === !1 && o !== k)
        return !0;
      const u = o, d = (r = t == null ? void 0 : t[u]) != null ? r : Object.is;
      let h = f;
      !!f && typeof f == "object" && (j(f) === "Object" || Array.isArray(f)) && !f[C] && (h = w(f, d));
      const l = d(c[u], f), a = Reflect.set(c, o, h);
      return l || _(s, o), a;
    }
  });
}, W = (e, t, n = ":root") => {
  const s = w(e, t);
  let i = E(n);
  return i || (console.warn("Impossible to find the right html element, attaching the variables to the root."), i = document.querySelector(":root")), y(() => {
    Object.keys(s).forEach((o) => {
      var f;
      i.style.setProperty(`--${o}`, (f = s[o]) == null ? void 0 : f.toString());
    });
  }), s;
}, U = (e, t) => {
  const n = { value: e(), [k]: !1 }, s = w(n, t ? { value: t } : void 0);
  return y(() => {
    s[k] = !0, s.value = e(), s[k] = !1;
  }), s;
}, B = (e, t, n, s = window.localStorage) => {
  if (typeof t != "object")
    throw new Error("It's not possible to create a variable from a primitive value...you can use createRef");
  let i = null;
  try {
    const o = s.getItem(e);
    o ? i = JSON.parse(o) : s.setItem(e, JSON.stringify(t));
  } catch {
    throw new Error("The specified key is associated with a non Object-like element");
  }
  const c = w(i != null ? i : t, n);
  return y(() => {
    s.setItem(e, JSON.stringify(c));
  }), window.addEventListener("storage", (o) => {
    if (o.storageArea === s && o.key === e)
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
}, D = (e, t) => w({ value: e }, t ? { value: t } : void 0), R = (e) => {
  e.owned.forEach((t) => {
    t.toRun = !1, R(t);
  }), e.dependencies.forEach((t) => {
    t.delete(e);
  }), e.dependencies.clear();
}, F = (e) => {
  const t = () => {
    var c, o, f;
    if (!n.toRun)
      return;
    (f = (o = (c = n == null ? void 0 : n.owner) == null ? void 0 : c.owned) == null ? void 0 : o.push) == null || f.call(o, n), n.cleanup && typeof n.cleanup == "function" && n.cleanup(), R(n), b.push(n);
    let i;
    try {
      i = e();
    } finally {
      b.pop();
    }
    return i;
  }, n = {
    execute: t,
    dependencies: /* @__PURE__ */ new Set(),
    owned: [],
    owner: b[b.length - 1],
    toRun: !0
  }, s = t();
  s && (n.cleanup = s);
}, g = {
  createVariable: P,
  createEffect: F,
  createComputed: U
};
let O = { ...g };
const w = (e, t) => O.createVariable(e, t), y = (e) => O.createEffect(e), G = (e, t) => O.createComputed(e, t), Q = (e = g) => (Object.keys(e).forEach((t) => {
  O[t] = e[t];
}), () => {
  O = g;
}), Y = (e) => {
  const t = b;
  b = [];
  const n = e();
  return b = t, n;
}, $ = (e, t) => {
  const n = E(e);
  return y(() => {
    n && (n.textContent = t(n));
  }), n;
}, z = (e, t) => {
  const n = E(e);
  return y(() => {
    n && (n.innerHTML = t(n));
  }), n;
}, X = (e, t, n) => {
  const s = E(e);
  return y(() => {
    s && (n(s) ? s.classList.add(t) : s.classList.remove(t));
  }), s;
}, Z = (e, t) => {
  const n = E(e);
  return y(() => {
    if (n) {
      const s = t(n);
      Object.keys(s || {}).forEach((c) => {
        s[c] ? n.classList.add(c) : n.classList.remove(c);
      });
    }
  }), n;
}, K = (e, t) => {
  const n = E(e);
  return y(() => {
    n && (n.value = t(n));
  }), n;
}, J = (e, t) => {
  const n = E(e);
  return y(() => A(n, t(n))), n;
}, q = (e, t) => {
  const n = E(e);
  if (!!n)
    return J(n, () => ({ style: t(n) })), n;
}, ee = (e, t, n) => {
  const s = E(e);
  return y(() => {
    if (s === null)
      return;
    const i = t(s), c = V(i).childNodes, o = /* @__PURE__ */ new Map(), f = (l, a = !0) => {
      const r = p(l);
      r != null && o.set(r, { element: l, isNew: a });
    };
    if (s.children.length === 0) {
      const l = Array.from(c);
      s.append(...l), l.forEach((a) => f(a)), typeof n == "function" && y(() => {
        n(s, o);
      });
      return;
    }
    const u = L(Array.from(s.childNodes), Array.from(c), (l, a) => p(l) != null && p(a) != null ? p(l) === p(a) : l === a);
    let d = u.find((l) => l.type === "="), h = 0;
    u.forEach((l) => {
      if (l.type === "+") {
        const a = S(u, (r) => r.type === "-" && p(r.value) === p(l.value), h);
        if (a && (l.value = a.value, a.skip = !0), !d) {
          s.append(l.value), f(l.value), h += 1;
          return;
        }
        d.value.before(l.value), f(l.value);
      } else if (l.type === "-") {
        if (l.skip) {
          h += 1;
          return;
        }
        s.removeChild(l.value);
        const a = S(u, (r) => r.type === "+" && p(r.value) === p(l.value), h);
        a && (a.value = l.value);
      } else
        d = S(u, (a) => a.type === "=", h), f(l.value, !1);
      h += 1;
    }), typeof n == "function" && y(() => {
      n(s, o);
    });
  }), s;
};
export {
  H as batch,
  ee as bindChildrens,
  X as bindClass,
  Z as bindClasses,
  J as bindDom,
  z as bindInnerHTML,
  K as bindInputValue,
  q as bindStyle,
  $ as bindTextContent,
  G as createComputed,
  W as createCssVariable,
  y as createEffect,
  D as createRef,
  B as createStored,
  w as createVariable,
  Q as setup,
  Y as untrack
};
