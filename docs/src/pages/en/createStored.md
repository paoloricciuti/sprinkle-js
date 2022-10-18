---
title: createStored
description: createStored
layout: ../../layouts/MainLayout.astro
header: API Reference
order: 104
---


This method is used to create a reactive variable for an object also persisting
it in localStorage or sessionStorage. It'll throw if you try to pass a primitive
value to it. It will also automatically add a listener for the storage to update
the variable whenever the storage changes. It will take a key and an initial
value as input but will discard the initial value if the key is already present
in the storage. It will also throw if the object in the storage is not
Object-like

```typescript
const variable = createStored("cool-stored", { whosCool: "you" });
console.log(variable.whosCool); // you
console.log(window.localStorage.getItem("cool-stored")); // '{ "whosCool": "you" }'
```

if you use this variable inside a createEffect or inside another method whenever
you'll update the value the method will re-run.

You can also pass an object containing an equality function for every field of
the object that will determine how to check for equality for that field. By
default it will use `Object.is`.

```typescript
const variable = createStored("cool-stored", { whosCool: "you" }, {
  whosCool: (before, after) => before.length === after.length,
});
console.log(variable.whosCool); // you
```

The above variable will not trigger an effect re-run if the previous value has
the same length as the new value.

Differently from `createVariable` a stored object is not deeply reactive.


