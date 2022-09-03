---
title: Installation
description: Installation
layout: ../../layouts/MainLayout.astro
header: Getting Started
order: 2
---

## Installation
To install Sprinkle JS you can run
```bash
npm i sprinkle-js
```
This will install the npm package in your project and will let you import the various exported methods with
```typescript
import SprinkleJS from "sprinkle-js";
```
>**Tip**: it's better to actually import the naming exports to allow for tree shaking 🌳
>```typescript
>import { createVariable } from "sprinkle-js";
>```

Installing the library from npm will download a copy into your `node_modules` and will be shipped together with your application when you publish it. This will kind of negate the meaning of this library but you are free to use it like this if you prefer.

To use the library for what is meant to be go on codepen or in a local html file and paste this in the JS tab:
```javascript
import { createVariable } from "https://cdn.skypack.com/sprinkle-js";
```

Sprinkle JS is available from all major cdn's

- https://unpkg.com/sprinkle-js
- https://cdn.jsdelivr.net/npm/sprinkle-js
- https://cdn.skypack.com/sprinkle-js

If you append `dist/sprinkle-js.iife.js` to each of those links you can also embed it in a script tag.

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sprinkle JS App</title>
    <!-- This will load the library in a SprinkleJS global variable -->
    <script src="https://unpkg.com/sprinkle-js/dist/sprinkle-js.iife.js"></script>
    <!-- You can reference that variable and destructure from it in
    your script tag or even in your js file-->
    <script>
        const { createVariable, createEffect } = SprinkleJS;
    </script>
</head>

<body>

</body>

</html>
```

## On Codepen

The easiest way to get started with Sprinkle JS is just by going on Codepen by <a href="https://codepen.io/pen?template=KKoQLRg" target="_blank">clicking this</a>.

This will bring you to codepen.io with the Sprinkle JS template.

## On Stackblitz

You can quickly initialize a Stackblitz project setup with typescript and Sprinkle JS by going to <a href="https://stackblitz.com/edit/sprinkle-js-template" target="_blank">this template</a>.

> **Tip:** we try to keep this templates up to date but it's safer to always update the dependencies as soon as you fork it.

## On Codesandbox

You can quickly initialize a Code Sandbox project setup with typescript and Sprinkle JS by going to <a href="https://codesandbox.io/s/sprinkle-js-typescript-rg0j4k" target="_blank">this template</a>.

> **Tip:** we try to keep this templates up to date but it's safer to always update the dependencies as soon as you fork it.