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
argument, a function returning a document fragment or a string or an array of document fragments of an array of strings as the second argument and an option function to run after the diffing as the third parameter.

The third argument can be useful to bind something to the newly created element. It takes the root element and a Map object as parameter where the keys are all the keys you've specified in the template and the values are the element associated with that key that is on the DOM. Every element has an isNew flag that specifies if it's a newly added element or an old one 

Given that sometimes is difficult to build a document fragment from scratch Sprinkle JS an `html` tagged template to transform your string into an actual document fragment. Inside this tagged template literal is possible to include events with the syntax `on:eventname` and there's a special event `on:bind` to run code whenever the element will be binded to the DOM by sprinkle JS. This event will get the actual element as the parameter and it's possible to use this to call other Sprinkle JS methods on that specific element. For example:

```typescript
const variable = createVariable({inputVal: ""});

bindChildren("#div-to-bind", ()=> html`
    <input
        on:bind=${(inputElement)=>{
            bindInputValue(inputElement, ()=> variable.inputVal)
        }}
        on:input=${(e)=>{
            variable.inputVal= e.target.value;
        }} />
`);
```

will bound to the div `#div-to-bind` an input as children and will bind the inputValue of it `variable.inputVal`.

> **Tip**: this is a better way than the afterRun function that bindChildren takes as a third argoument to bind something to an element.

Every array inside the tagged template literal will be treated as separate elements. So for example

```typescript
html`${[1,2,3,4].map(num => html`
<button>${num}</button>
`)}`
```
will return a fragment with 4 buttons.

As you've seen from this previous example one small caveat of this function is that you have to repeat the tag at each new "level" (you can skip the first one since everything you return will still get passed through the `html` function automatically but you have to include it inside the map function) but this allow for enaugh composability that you can actually start to create some sort of components.

A component it's simply a function that return the return value of an `html` tagged template literal. The above example could be rewritten like so

```typescript
const MagicButton = ({num})=>{
  return html`<button>${num}</button>`
}

html`${[1,2,3,4].map(num => MagicButton({num}))}`
```

Those are all small examples so here's a fully featured one

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
  (element) => variable.listOfCoolThings.map((coolThing) => html`
      <li key="${coolThing}">
        <button 
          key="${coolThing}-button"
          on:click=${()=>{
            console.log(`You've pressed the ${coolThing} button`);
          }}
          >Log ${coolThing}</button>
      </li>`
    ),
  (element, elements) => {
    const youElement = elements.get("you");
    //yeah i know this is a silly example
    bindClasses(youElement, ()=>({
      "classForYou": true,
    });
  },
);
variable.listOfCoolThings = [...variable.listOfCoolThings, "npm"];
//this will add a new li element to the ul
```

A small caveat is that given that every nested element get's diffed you should add a key to every element that you want to preserve the reference to.

> **Warning** bindChildren changed api's over time so make sure you are on the latest version o refer to previous versions of this readme for the old documentation.


