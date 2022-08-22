---
title: bindChildrens
description: bindChildrens
layout: ../../layouts/MainLayout.astro
---

This function is used to bind html as the children of an element. How is this different than bindInnerHTML? Each item can have a key attribute and if the key attribute does not change the element will not change either (it will have the same reference in the dom). It takes a dom element or a selector as the first argument, a function returning the html string as the second argument and an option function to run after the diffing as the third parameter.

The third argument can be useful to attach events or to bind something to the newly created element. It takes the root element and a Map object as parameter where the keys are all the keys you've specified in the template and the values are objects containing the element that is on the DOM and a isNew flag that specifies if it's a newly added element or an old one (to conditionally add event listeners for example).

```typescript
const variable = createVariable({
    listOfCoolThings: [
        "you",
        "sprinkle-js",
        "javascript",
    ]
});

bindChildrens("#ul-to-bind", (element)=> variable.listOfCoolThings.map(coolThing => `<li key="${coolThing}">${coolThing}</li>`), (element, elements)=>{
    const youElement=elements.get("you");
    if(youElement?.isNew){
        youElement?.addEventListener("click", ()=> console.log("You pressed the you element"))
    }
});
variable.listOfCoolThings = [...variable.listOfCoolThings, "npm"]; //this will add a new li element to the ul
```
A small caveat is that only the top level childrens get's diffed. You can overcome this by binding the childrens again in the third parameter.

> **Warning**
> The following code is only valid if you are using version 0.1.20 or below.
>
> This function is used to bind an array of childrens to a dom element. It takes a dom element or a selector as the first argument and a function returning an array of `AppendNode<T>` or a `NodeListOf<AppendNode<T>>` (the type is declared in the library) as the second argument.
>
> The type `AppendNode<T>` is defined as such
>
> ```typescript
> type AppendNode<T extends ChildNode = ChildNode> = T & { key?: any };
> ```
> and basically it expect the return value to be an extension of ChildNode and you can pass a key parameter optionally.
> 
> In typescript you can declare the variable like this
> ```typescript
> const elementToReturn: AppendNode<LiElement> = document.createElement("li") as AppendNode<LiElement>;
> ```
> This will give you intellisense for the LiElement you have created and will not yell at you if you try to assign the key field.
> 
> If you want to return a `NodeListOf<AppendNode<T>>` you can create a document fragment and append the newly created element to it before returning documentFragment.childNodes.
> ```typescript
> const variable = createVariable({
>     listOfCoolThings: [
>         "you",
>         "sprinkle-js",
>         "javascript",
>     ]
> });
> 
> bindChildrens("#ul-to-bind", (element)=> {
>     const retval = [];
>     for(let coolThing of variable.listOfCoolThings){
>         const li = document.createElement("li");
>         li.innerText = coolThing;
>         li.key = coolThing;
>     }
>     return retval;
> };
> 
> variable.listOfCoolThings = [...variable.listOfCoolThings, "npm"]; //this will add a new li element to the ul
> ```
> The key field it's very important and it should be unique for each element: if an element the same key is already present in the father element it will be (when possible) just be moved around without actually recreating a new element.
> 
> Another intresting thing to note is that arrays works assignements. You can't push into an array but you need to reassign it to let the reactivity system react to it.
