---
title: createRef
description: createRef
layout: ../../layouts/MainLayout.astro
---

#### createRef
This method is used to create a reactive variable for a primitive. It wraps the primitive in an object with a value property.

```typescript
const ref = createRef(1);
console.log(ref.value) // 1
```

if you use this variable inside a createEffect or inside another method whenever you'll update the value the method will re-run.

You can also pass an equality function that will determine how to check for equality for this ref. By default it will use `Object.is`.

```typescript
const ref = createRef(1, (before, after) => before > after);
console.log(ref.value) // 1
```
The above ref will not trigger an effect re-run if the previous value is greater than the new value.

Please note: if you are using typescript you can't pass something different than a primitive value to the ref and if you pass an equality function is recommended to also use the generic version of the fucntion `createRef<number>(1, (before, after)=> before > after)` otherwise Typescript will narrow the type to a constant. If you are using this in Javascript you are allowed to pass object to the ref (although is not recommended since you'll have to access it unnecessarly via the `.value` property), the object passed will be deeply reactive.
