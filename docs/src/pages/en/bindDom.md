---
title: bindDom
description: bindDom
layout: ../../layouts/MainLayout.astro
---

This function is used to bind an object that describe some DOM properties to the actual DOM properties. It takes a dom element or a selector as the first argument and a function returning the object as the second argument.

The following code will bind the ariaLabel value to the `variable.whosCool` field and the checked value for the checkbox.

```typescript
const variable = createVariable({ whosCool: "you" });

bindDom("#checkbox", (element)=> ({
    ariaLabel: variable.whosCool,
    checked: variable.whosCool === "you",
}));
```
