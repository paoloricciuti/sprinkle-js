---
title: batch
description: batch
layout: ../../layouts/MainLayout.astro
header: API Reference
order: 108
---

This function can be used to avoid running effects multiple times when changing
multiple variables. It's as simple as calling batch and passing a function that
will change some variables.

```typescript
const variable = createVariable({ name: "John", lastName: "Doe" });

createEffect(() => {
  console.log(`The full name is ${variable.name} ${variable.lastName}`);
});
//the effect will still run the first time logging "The full name is John Doe"

batch(() => {
  variable.name = "Albert";
  variable.lastName = "Einstein";
});
//changin both variables without the batch would've run the effect twice
//in this case the effect will run a single time loggin "The full name is Albert Einstein"
```

