---
title: untrack
description: untrack
layout: ../../layouts/MainLayout.astro
header: API Reference
order: 107
---


This function can be used inside a createEffect to untrack a dependency. This
way you can use a reactive variable inside a create effect without triggering
the re-run when that variable changes. It takes a function as input and it
return anything returned from that function.

```typescript
const variable = createVariable({ whosCool: "you" });
const ref = createRef(1);

createEffect(() => {
  const refValue = untrack(() => ref.value);
  console.log(variable.whosCool, refValue);
});
//will log (you, 1) the first time

ref.value++;
//the effect will not run again because ref.value has been accessed inside the untrack

variable.whosCool = "whoever uses Sprinkle JS";
//the effect run again logging  (whoever uses Sprinkle JS, 2)
```


