const E = (e) => typeof e == "string" ? document.querySelector(e) : e, A = (e, t, n = []) => {
  Object.entries(t).forEach(([i, c]) => {
    if (typeof c == "object") {
      A(e, c, [...n, i]);
      return;
    }
    let o = e;
    if (n.forEach((a) => {
      o = o[a];
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
}, L = (e, t) => [...Array(e).keys()].map(() => Array(t).fill(0)), I = (e = [], t = [], n = (s, i) => s === i) => {
  var a, u, d, h, l, f;
  const s = L(e.length + 1, t.length + 1);
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
  return c > 0 ? i.unshift(...((d = (u = (a = e == null ? void 0 : e.slice) == null ? void 0 : a.call(e, 0, c)) == null ? void 0 : u.map) == null ? void 0 : d.call(u, (r) => ({ type: "-", value: r, skip: !1 }))) || []) : o > 0 && i.unshift(...((f = (l = (h = t == null ? void 0 : t.slice) == null ? void 0 : h.call(t, 0, o)) == null ? void 0 : l.map) == null ? void 0 : f.call(l, (r) => ({ type: "+", value: r, skip: !1 }))) || []), i;
}, v = (e, t, n = 0) => e.find((s, i, ...c) => i > n && t(s, i, ...c)), j = (e) => Object.prototype.toString.call(e).slice(8, -1), V = (e) => {
  const t = document.createElement("template");
  return Object.assign(t, { innerHTML: e }), t.content;
}, N = (e, t) => e.getAttribute(t), y = (e) => e instanceof Element ? N(e, "key") : e.textContent;
let b = [];
const O = Symbol("is-reactive"), k = Symbol("memo");
let C = null;
const x = (e) => {
  [...e].forEach((t) => {
    if (!t.toRun)
      return;
    const n = t.execute();
    n && (t.cleanup = n);
  });
}, W = (e) => {
  C = /* @__PURE__ */ new Set();
  try {
    e();
  } finally {
    const t = new Set(C);
    C = null, x(t);
  }
}, M = (e, t, n) => {
  let s = n.get(e);
  s || (s = /* @__PURE__ */ new Set(), n.set(e, s)), s.add(t), t.dependencies.add(s);
}, U = (e, t) => {
  const n = e.get(t);
  if (!!n) {
    if (C !== null) {
      n.forEach((s) => C.add(s));
      return;
    }
    x(n);
  }
}, _ = (e, t) => {
  if (e[O])
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
      if (c[1] === O)
        return !0;
      const o = b[b.length - 1];
      return o && M(c[1], o, s), Reflect.get(...c);
    },
    set: (c, o, a) => {
      var r;
      if (c[k] === !1 && o !== k)
        return !0;
      const u = o, d = (r = t == null ? void 0 : t[u]) != null ? r : Object.is;
      let h = a;
      !!a && typeof a == "object" && (j(a) === "Object" || Array.isArray(a)) && !a[O] && (h = w(a, d));
      const l = d(c[u], a), f = Reflect.set(c, o, h);
      return l || U(s, o), f;
    }
  });
}, B = (e, t, n = ":root") => {
  const s = w(e, t);
  let i = E(n);
  return i || (console.warn("Impossible to find the right html element, attaching the variables to the root."), i = document.querySelector(":root")), p(() => {
    Object.keys(s).forEach((o) => {
      var a;
      i.style.setProperty(`--${o}`, (a = s[o]) == null ? void 0 : a.toString());
    });
  }), s;
}, P = (e, t) => {
  const n = { value: e(), [k]: !1 }, s = w(n, t ? { value: t } : void 0);
  return p(() => {
    s[k] = !0, s.value = e(), s[k] = !1;
  }), s;
}, D = (e, t, n, s = window.localStorage) => {
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
  return p(() => {
    s.setItem(e, JSON.stringify(c));
  }), window.addEventListener("storage", (o) => {
    if (o.storageArea === s && o.key === e)
      try {
        if (o.newValue) {
          const a = JSON.parse(o.newValue);
          Object.keys(a).forEach((d) => {
            c[d] = a[d];
          });
        }
      } catch {
        console.warn("The storage was modified but the resulting object is not parsable...the variable was not updated.");
      }
  }), c;
}, G = (e, t) => w({ value: e }, t ? { value: t } : void 0), R = (e) => {
  e.owned.forEach((t) => {
    t.toRun = !1, R(t);
  }), e.dependencies.forEach((t) => {
    t.delete(e);
  }), e.dependencies.clear();
}, F = (e) => {
  const t = () => {
    var c, o, a;
    if (!n.toRun)
      return;
    (a = (o = (c = n == null ? void 0 : n.owner) == null ? void 0 : c.owned) == null ? void 0 : o.push) == null || a.call(o, n), n.cleanup && typeof n.cleanup == "function" && n.cleanup(), R(n), b.push(n);
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
  createVariable: _,
  createEffect: F,
  createComputed: P
};
let S = { ...g };
const w = (e, t) => S.createVariable(e, t), p = (e) => S.createEffect(e), Q = (e, t) => S.createComputed(e, t), Y = (e = g) => (Object.keys(e).forEach((t) => {
  S[t] = e[t];
}), () => {
  S = g;
}), z = (e) => {
  const t = b;
  b = [];
  const n = e();
  return b = t, n;
}, X = (e, t) => {
  const n = E(e);
  return p(() => {
    n && (n.textContent = t(n));
  }), n;
}, Z = (e, t) => {
  const n = E(e);
  return p(() => {
    n && (n.innerHTML = t(n));
  }), n;
}, K = (e, t, n) => {
  const s = E(e);
  return p(() => {
    s && (n(s) ? s.classList.add(t) : s.classList.remove(t));
  }), s;
}, q = (e, t) => {
  const n = E(e);
  return p(() => {
    if (n) {
      const s = t(n);
      Object.keys(s || {}).forEach((c) => {
        s[c] ? n.classList.add(c) : n.classList.remove(c);
      });
    }
  }), n;
}, ee = (e, t) => {
  const n = E(e);
  return p(() => {
    n && (n.value = t(n));
  }), n;
}, J = (e, t) => {
  const n = E(e);
  return p(() => A(n, t(n))), n;
}, te = (e, t) => {
  const n = E(e);
  if (!!n)
    return J(n, () => ({ style: t(n) })), n;
}, $ = (e, t, n) => {
  const s = E(e);
  return p(() => {
    if (s === null)
      return;
    const i = t(s), c = V(i).childNodes, o = /* @__PURE__ */ new Map(), a = (l, f = !0) => {
      const r = y(l);
      r != null && o.set(r, { element: l, isNew: f });
    };
    if (s.children.length === 0) {
      const l = Array.from(c);
      s.append(...l), l.forEach((f) => a(f)), typeof n == "function" && p(() => {
        n(s, o);
      });
      return;
    }
    const u = I(Array.from(s.childNodes), Array.from(c), (l, f) => y(l) != null && y(f) != null ? y(l) === y(f) : l === f);
    let d = u.find((l) => l.type === "="), h = 0;
    u.forEach((l) => {
      if (l.type === "+") {
        const f = v(u, (r) => r.type === "-" && y(r.value) === y(l.value), h);
        if (f && (l.value = f.value, f.skip = !0), !d) {
          s.append(l.value), a(l.value), h += 1;
          return;
        }
        d.value.before(l.value), a(l.value);
      } else if (l.type === "-") {
        if (l.skip) {
          h += 1;
          return;
        }
        s.removeChild(l.value);
        const f = v(u, (r) => r.type === "+" && y(r.value) === y(l.value), h);
        f && (f.value = l.value);
      } else
        d = v(u, (f) => f.type === "=", h), a(l.value, !1);
      h += 1;
    }), typeof n == "function" && p(() => {
      n(s, o);
    });
  }), s;
}, H = (e, t, n) => (console.warn(`${t}${n ? `See more at ${n}` : ""}`), e), ne = H(
  $,
  "'bindChildrens' is deprecated: please use 'bindChildren' instead.",
  new URL("https://github.com/paoloricciuti/sprinkle-js/issues/3")
);
export {
  W as batch,
  $ as bindChildren,
  ne as bindChildrens,
  K as bindClass,
  q as bindClasses,
  J as bindDom,
  Z as bindInnerHTML,
  ee as bindInputValue,
  te as bindStyle,
  X as bindTextContent,
  Q as createComputed,
  B as createCssVariable,
  p as createEffect,
  G as createRef,
  D as createStored,
  w as createVariable,
  Y as setup,
  z as untrack
};
