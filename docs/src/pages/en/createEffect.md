---
title: createEffect
description: createEffect
layout: ../../layouts/MainLayout.astro
header: API Reference
order: 105
---
This method is used to create an effect that will keep track of it's dependencies and re-run every time they changed

```typescript
const variable = createVariable({ whosCool: "you" });
const ref = createRef(1);

createEffect(()=>{
    console.log(variable.whosCool, ref.value);
}) 
//will log (you, 1) the first time

ref.value++;
//the effect run again logging (you, 2)

variable.whosCool="whoever uses Sprinkle JS"
//the effect run again logging (whoever uses Sprinkle JS, 2)

```

You can also return a function that will be run before the new function to clean up the previous effect.

```typescript
const variable = createVariable({ whosCool: "you" });
const ref = createRef(1);

createEffect(()=>{
    console.log(variable.whosCool, ref.value);

    return ()=>{
        console.log("cleaning up");
    }
}) 
//will log (you, 1) the first time

ref.value++;
//the effect run again logging first "cleaning up" and then (you, 2)

variable.whosCool="whoever uses Sprinkle JS"
//the effect run again logging first "cleaning up" and then (whoever uses Sprinkle JS, 2)

```

