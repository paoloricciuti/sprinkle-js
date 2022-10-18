---
title: createComputed
description: createComputed
layout: ../../layouts/MainLayout.astro
header: API Reference
order: 105
---


This method is used to create a reactive computed variable. You need to pass a
function that will return a value. The return value of the function will be
inside of the `.value` field of the returned computed. If you use some other
variable to compute the this value it will always be in sync.

```typescript
const variable = createVariable({ whosCool: "you" });
const computed = createComputed(() => `${variable.whosCool} is cool!`);
console.log(computed.value); // you is cool!
variable.whosCool = "whoever uses SprinkleJS";
console.log(computed.value); // whoever uses SprinkleJS is cool!
```

if you use this variable inside a createEffect or inside another method it will
be rerunned whenever this computed changes. You can't set the value of a
computed value and trying would still result in the same value being inside that
computed.

You can also pass an equality function that will determine how to check for
equality for this computed. By default it will use `Object.is`.

```typescript
const variable = createVariable({ whosCool: "you" });
const computed = createComputed(
  () => `${variable.whosCool} is cool!`,
  (before, after) => before.length === after.length,
);
console.log(computed.value); // you is cool!
variable.whosCool = "whoever uses SprinkleJS";
console.log(computed.value); // whoever uses SprinkleJS is cool!
```

The above ref will not trigger an effect re-run if the previous value has the
same length as the new value.

Another simple way to create a computed value if by defining a function that
return a value using a reactive variable like this

```typescript
const variable = createVariable({ whosCool: "you" });
const computed = () => `${variable.whosCool} is cool!`;
console.log(computed()); // you is cool!
variable.whosCool = "whoever uses SprinkleJS";
console.log(computed()); // whoever uses SprinkleJS is cool!
```

As you can see in the example, this require you to call the function to access
the value (instead of accessing it by `.value`)

However this second method will rerun the effect it's used in even if it has the
same value as before.


