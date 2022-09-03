---
title: bindStyle
description: bindStyle
layout: ../../layouts/MainLayout.astro
header: API Reference
order: 114
---

This function is used to bind an object that describe the style of an element to the actual element style. It takes a dom element or a selector as the first argument and a function returning the object as the second argument.

The following code will bind color property and the backgroundColor property value to the `variable.color` and `variable.bg` field.

```typescript
const variable = createVariable({ color: "black", bg: "#BADA55" });

bindStyle("#div-to-bind", (element)=> ({
    color: variable.color,
    backgroundColor: variable.bg,
}));

variable.bg="#C0FFEE"; //the div will now have #C0FFEE as backgroundColor
variable.color="white"; //the div will now have white as the color

```

