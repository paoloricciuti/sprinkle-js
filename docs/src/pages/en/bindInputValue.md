---
title: bindInputValue
description: bindInputValue
layout: ../../layouts/MainLayout.astro
---

This function is used to bind a string value to the value of an input element. It takes an input dom element or a selector as the first argument and a function returning the value to bind to the input value as the second argument.

The following code will bind the input value to the `variable.whosCool` field. Note that is a one-way binding so make sure to also add an event listener on the input to complete the flow. We are saving the return value of the function into `bindInputValue` to later add the event listener to it.

```typescript
const variable = createVariable({ whosCool: "you" });

const inputToBind = bindInputValue("#input-to-bind", ()=> variable.whosCool);

inputToBind.addEventListener("input", (e)=>{
    variable.whosCool=e.target.value;
})
```

The callback you pass in also takes the element as the first argument.

```typescript
const variable = createVariable({ whosCool: "you" });

const inputToBind = bindInputValue("#input-to-bind", (element)=> element.innerText + " " +variable.whosCool);

inputToBind.addEventListener("input", (e)=>{
    variable.whosCool=e.target.value;
})
```

