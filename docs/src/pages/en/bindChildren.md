---
title: bindChildren
description: bindChildren
layout: ../../layouts/MainLayout.astro
header: API Reference
order: 116
---


This function is used to bind html as the children of an element. How is this
different than bindInnerHTML? Each item can have a key attribute and if the key
attribute does not change the element will not change either (it will have the
same reference in the dom). It takes a dom element or a selector as the first
argument, a function returning the html string as the second argument and an
option function to run after the diffing as the third parameter.

The third argument can be useful to attach events or to bind something to the
newly created element. It takes the root element and a Map object as parameter
where the keys are all the keys you've specified in the template and the values
are objects containing the element that is on the DOM and a isNew flag that
specifies if it's a newly added element or an old one (to conditionally add
event listeners for example).

```typescript
const variable = createVariable({
  listOfCoolThings: [
    "you",
    "sprinkle-js",
    "javascript",
  ],
});

bindChildren(
  "#ul-to-bind",
  (element) =>
    variable.listOfCoolThings.map((coolThing) =>
      `<li key="${coolThing}">${coolThing}</li>`
    ),
  (element, elements) => {
    const youElement = elements.get("you");
    if (youElement?.isNew) {
      youElement?.addEventListener(
        "click",
        () => console.log("You pressed the you element"),
      );
    }
  },
);
variable.listOfCoolThings = [...variable.listOfCoolThings, "npm"]; //this will add a new li element to the ul
```

A small caveat is that only the top level childrens get's diffed. You can
overcome this by binding the childrens again in the third parameter.

> **Warning** bindChildren changed api's over time so make sure you are on the latest version o refer to previous versions of this readme for the old documentation.


