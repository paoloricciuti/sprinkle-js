---
title: bindTextContent
description: bindTextContent
layout: ../../layouts/MainLayout.astro
header: API Reference
order: 108
---

This function is used to bind a string value to the text content of an element. It takes a dom element or a selector as the first argument and a function returning the value to bind to the text content as the second argument.

```typescript
const variable = createVariable({ whosCool: "you" });
const ref = createRef(1);

bindTextContent("#div-to-bind", ()=> `${ref.value} ${variable.whosCool}`); 
//the text content of the div with the id div-to-bind will be "1 you"

ref.value++;
//the text content of the div with the id div-to-bind will be "2 you"

variable.whosCool="whoever uses Sprinkle JS"
//the text content of the div with the id div-to-bind will be "2 whoever uses Sprinkle JS"
```

The callback you pass in also takes the element as the first argument, in Typescript you can pass a generic type specifying what kind of element you are expecting

```typescript
const variable = createVariable({ whosCool: "you" });
const ref = createRef(1);

bindTextContent<HTMLDivElement>("#div-to-bind", (element:HTMLDivElement)=> `${element?.textContent} ${ref.value} ${variable.whosCool}`); 
//the text content of the div with the id div-to-bind will be "1 you"

ref.value++;
//the text content of the div with the id div-to-bind will be "1 you 2 you"

variable.whosCool="whoever uses Sprinkle JS"
//the text content of the div with the id div-to-bind will be "1 you 2 you 2 whoever uses Sprinkle JS"
```

If you need to have access to the selected element (to add event listeners for example), the element is returned from the function.

```typescript
//this will bind the variables to the textContent and you'll have access to the element itself inside the variable divToBind
const divToBind=bindTextContent<HTMLDivElement>("#div-to-bind", (element:HTMLDivElement)=> `${element?.textContent} ${ref.value} ${variable.whosCool}`);
```
