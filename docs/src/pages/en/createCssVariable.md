---
title: createCssVariable
description: createCssVariable
layout: ../../layouts/MainLayout.astro
header: API Reference
order: 102
---
This method is used to create a reactive variable for an object and map every field to a css variable. It'll throw if you try to pass a primitive value to it. In typescript you can pass only string or numbers as values of the object but every value will be stringified before assigning it to the css variable so if you pass a complex object you'll get "[object Object]" instead.

```typescript
//this will create two css variable at the root level --x and --y with the values of 0 and 0
//you can use those variable inside your css
const variable = createCssVariable({ x: 0, y: 0 });

//setting this will also set the --x css variable to 200
variable.x=200;
```
if you use this variable inside a createEffect or inside another method whenever you'll update the value the method will re-run.

You can also pass an object containing an equality function for every field of the object that will determine how to check for equality for that field. By default it will use `Object.is`.
```typescript
const variable = createCssVariable({ whosCool: "you" }, { whosCool: (before, after) => before.length === after.length });
```
The above variable will not trigger an effect re-run if the previous value has the same length as the new value.

A third argument of this method is a selector or an HTMLElement of the element you want to apply the css variables to. It default to `:root`. If the provided selector does not select anything it will apply the css variable to the `:root`

