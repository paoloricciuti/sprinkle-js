---
title: Installation
description: Installation
layout: ../../layouts/MainLayout.astro
---

#### Installation
To install Sprinkle JS you can run
```bash
npm i sprinkle-js
```
This will install the npm package in your project and will let you import the various exported methods with
```typescript
import SprinkleJS from "sprinkle-js";
```
>**Tip**: it's better to actually import the naming exports to allow for tree shaking
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
