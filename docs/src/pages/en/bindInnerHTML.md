---
title: bindInnerHTML
description: bindInnerHTML
layout: ../../layouts/MainLayout.astro
header: API Reference
order: 110
---

> **Warning** Sprinkle JS does not sanitize the content of the innerHTML. If you
> use this function with user input make sure to sanitize it first to avoid
> expose yourself to XSS attacks.

This function is used to bind a string value to the innerHTML of an element. It
takes a dom element or a selector as the first argument and a function returning
the value to bind to the innerHTML as the second argument.

```typescript
const variable = createVariable({ whosCool: "you" });
const ref = createRef(1);

bindInnerHTML(
  "#div-to-bind",
  () => `<span>${ref.value} <strong>${variable.whosCool}</strong></span>`,
);
//the innerhtml of the div with the id div-to-bind will be "<span>1 <strong>you</strong></span>"

ref.value++;
//the innerhtml of the div with the id div-to-bind will be "<span>2 <strong>you</strong></span>"

variable.whosCool = "whoever uses Sprinkle JS";
//the innerhtml of the div with the id div-to-bind will be "<span>2 <strong>whoever uses Sprinkle JS</strong></span>"
```

The callback you pass in also takes the element as the first argument, in
Typescript you can pass a generic type specifying what kind of element you are
expecting

```typescript
const variable = createVariable({ whosCool: "you" });
const ref = createRef(1);

bindInnerHTML<HTMLDivElement>(
  "#div-to-bind",
  (element: HTMLDivElement) =>
    `<span>${element?.textContent} ${ref.value} <strong>${variable.whosCool}</strong></span>`,
);
//the innerhtml of the div with the id div-to-bind will be "<span>1 <strong>you</strong></span>"

ref.value++;
//the innerhtml of the div with the id div-to-bind will be "<span>1 you 2 <strong>you</strong></span>"

variable.whosCool = "whoever uses Sprinkle JS";
//the innerhtml of the div with the id div-to-bind will be "<span>1 you 2 you 2 <strong>whoever uses Sprinkle JS</strong></span>"
```

If you need to have access to the selected element (to add event listeners for
example), the element is returned from the function.

```typescript
//this will bind the variables to the textContent and you'll have access to the element itself inside the variable divToBind
const divToBind = bindInnerHTML<HTMLDivElement>(
  "#div-to-bind",
  (element: HTMLDivElement) =>
    `${element?.textContent} ${ref.value} ${variable.whosCool}`,
);
```

