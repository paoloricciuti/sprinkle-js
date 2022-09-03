---
title: bindClass
description: bindClass
layout: ../../layouts/MainLayout.astro
header: API Reference
order: 112
---

This function is used to bind a class to the actual element. It takes a dom element or a selector as the first argument, the class that you want to apply and a function returning a boolean as the third argument.

```typescript
const variable = createVariable({ count: 0 });

bindClass("#div-to-bind", "dark", (element)=> variable.count % 2 === 0);
//the div will have the dark class set by default

//this will remove the class;
variable.count++;

//this will add the class again;
variable.count++;

```
