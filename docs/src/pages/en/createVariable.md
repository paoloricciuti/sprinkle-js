---
title: createVariable
description: createVariable
layout: ../../layouts/MainLayout.astro
header: API Reference
order: 102
---


This method is used to create a reactive variable for an object. It'll throw if
you try to pass a primitive value to it.

```typescript
const variable = createVariable({ whosCool: "you" });
console.log(variable.whosCool); // you
```

if you use this variable inside a createEffect or inside another method whenever
you'll update the value the method will re-run.

You can also pass an object containing an equality function for every field of
the object that will determine how to check for equality for that field. By
default it will use `Object.is`.

```typescript
const variable = createVariable({ whosCool: "you" }, {
  whosCool: (before, after) => before.length === after.length,
});
console.log(variable.whosCool); // you
```

The above variable will not trigger an effect re-run if the previous value has
the same length as the new value.

createVariable works with nested property too. You can pass object inside
objects and updating a values inside those object will trigger the rerun of the
effects where it's been used. To pass an equality function relative to a nested
object you should pass an object containing the properties of the object you
want a particular equality function. If you pass a built in object tho (like
Set, Map or HTMLElement) it will not become reactive. If you use a nested object
you can pass an object with the same structure to the equality functions object
to specify an equality function for every field. If you pass a function the
equality function will not be applied to the nested object.

```typescript
//here the name field will use the custom equality function
const variable = createVariable({ whosCool: { name: "you" } }, {
  whosCool: { name: (before, after) => before.length === after.length },
});

//here the equality function will be applied only to the whosCool object
const variable = createVariable({ whosCool: { name: "you" } }, {
  whosCool: (before, after) => before.length === after.length,
});
```

```typescript
const variable = createVariable({ whosCool: { pronoun: "you" } }, {
  whosCool: { pronoun: (before, after) => before.length === after.length },
});
console.log(variable.whosCool.pronoun); // you
```

in the above example `variable.whosCool.pronoun` is still reactive.


