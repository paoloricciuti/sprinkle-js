---
title: setup
description: setup
layout: ../../layouts/MainLayout.astro
header: API Reference
order: 100
---

Given that Sprinkle JS uses the two core methods to do everything with this
method you can plug your own reactivity system inside Sprinkle JS. Why should
you do this? I don't know! For fun, or maybe because you already have
[@vue/reactivity](https://github.com/vuejs/core/tree/main/packages/reactivity)
in use in your application and you want to use it with Sprinkle JS methods.

To plug your own reactivity system into Sprinkle JS you need to provide a method
to createVariable and one for createEffect. Optionally you can provide an
override for createComputed. This will override the core functionalities and the
reactivity system of Sprinkle JS and every other method will use your reactivity
system instead.

Obviously there are constraints:

- `createEffect` needs to automatically check its own dependencies
- ideally you want to return an object or a Proxy from `createVariable`
- if you don't return a Proxy from `createVariable` you'll probably need to
  provide also a `createComputed` override

[@vue/reactivity](https://github.com/vuejs/core/tree/main/packages/reactivity)
provides a very similar set of core functionalities to Sprinkle JS so it's very
easy to plug it into it.

```typescript
import { effect, reactive } from "@vue/reactivity";
import { setup } from "sprinkle-js";

setup({
  createVariable: reactive,
  createEffect: effect,
});
```

And that's it...from this moment on all the methods of Sprinkle JS will use
[@vue/reactivity](https://github.com/vuejs/core/tree/main/packages/reactivity)
as their reactivity system.

> **Warning** while pretty similar the reactivity system of @vue/reactivity it's
> a bit different so you might found some differences in behavior for some of
> your applications.

The setup function returns a function to reset the setup.

```typescript
import { effect, reactive } from "@vue/reactivity";
import { createEffect, createVariable, setup } from "sprinkle-js";

const reset = setup({
  createVariable: reactive,
  createEffect: effect,
});

//this variable uses @vue/reactivity
const vueReactivityVar = createVariable({ whosCool: "you" });

createEffect(() => {
  console.log(vueReactivityVar.whosCool);
});

reset();

//this variable uses sprinkle-js
const sprinkleVar = createVariable({ whosCool: "you" });

createEffect(() => {
  console.log(sprinkleVar.whosCool);
});
```

> **N.B.** once created inside a reactivity system the variable will continue to
> use that reactivity system even after the reset.

While returning an object or a Proxy from `createVariable` is preferable it's
not required. This means that if you want to use signals from
[solid-js](https://github.com/solidjs/solid) you can do something like this

```typescript
import { createEffect as solidEffect, createSignal } from "solid-js";
import {
  bindTextContent,
  createEffect,
  createVariable,
  setup,
} from "sprinkle-js";

setup({
  createVariable: (...props) => {
    return createSignal(...props);
  },
  createEffect: (...props) => {
    solidEffect(...props);
  },
});

//note that the limit of passing an object to createVariable it's not present since we are using solid
//createSignal under the hood, also the returned value it's not a variable but an array with an
//accessor and a setter
const [state, setState] = createVariable(1);

createEffect(() => {
  //here we access the state like we would do in solid
  console.log(state());
});

//we need to use the same access method also inside the methods of Sprinkle JS
bindTextContent("#app", () => `The content of the state is ${state()}`);
```

