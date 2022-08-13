
![Logo](https://sprinkle-js.netlify.app/assets/sprinkle-js.svg)

[![MIT License](https://img.shields.io/apm/l/atomic-design-ui.svg?)](https://github.com/tterb/atomic-design-ui/blob/master/LICENSEs)

![npm bundle size](https://img.shields.io/bundlephobia/minzip/sprinkle-js)

![npm](https://img.shields.io/npm/v/sprinkle-js)

![npm](https://img.shields.io/npm/dt/sprinkle-js)

![GitHub last commit](https://img.shields.io/github/last-commit/paoloricciuti/sprinkle-js)
# Sprinkle JS

Sprinkle JS is the open source alternative to...well nothing!

Joking aside, is a javascript library that let you sprinkle reactivity inside your vanilla imperative javascript. It uses a model very similar (yet far less powerful) than [SolidJS](https://github.com/solidjs/solid) to handle reactivity and it was heavily inspired by [this post](https://dev.to/ryansolid/building-a-reactive-library-from-scratch-1i0p) from Ryan Carniato the main developer behind it.

Before diving in the APIs and all the cool stuff it's useful to clarify what is Sprinkle JS philosophy and what Sprinkle JS is not.
## Philosophy

Have you ever been fiddling around in [Codepen](https://codepen.io/) or in a local html file and wondered "Man I wish I could have a bit of reactivity for this stupid app i'm messing with".

Well Sprinkle JS is exactly what you need!

The main philosophy behind is to build a supersmall library that requires no bundler that you can just drop in a script tag or import from a cdn and add a bit a reactivity to your app. We made a bunch of utility functions to bind your variables to your DOM in some way and that's all is needed. Open a new file, drop in Sprinkle JS, declare your variables, declare your bindings and than proceed to write your code without caring about updating the DOM...that's Sprinkle JS work!
## What is not

- **Sprinkle JS is not** the next big thing after React.
- **Sprinkle JS is not** for your big project...i mean if you want to use it feel free to do so but it's not what's meant to be.
- **Sprinkle JS is not** for perf aficionados: we as a community are trying to our best and maybe it will become the best version of itself but keep always keep in mind the main philosophy behind it.
## Demo

You can see this library in use [here](https://sprinkle-js.com).
## Authors

- [@paoloricciuti](https://www.github.com/paoloricciuti)


## Contributing

Any contribution is welcomed, you can either open a [New Issue](https://github.com/paoloricciuti/sprinkle-js/issues/new) or read the [list of the open ones](https://github.com/paoloricciuti/sprinkle-js/issues/) to work on them.

A Contributing guide will be up ASAP.

//⚠ WIP



## Documentation

//⚠ WIP For the moment you can refer to the **Usage/Examples** section of this README


## FAQ

#### Can i use Sprinkle JS in production?

Obviously you can...but i don't recommend it. The main focus of Sprinkle JS is not to give you a fully fledget, bleeding edge, blazingly fast framework. Is mainly to let you fiddle around in your fun little projects without the need to setup a bundler or importing a huge codebase just to get a bit of reactivity.

#### How can i create a component in Sprinkle JS?

You can't. You could, in theory write a function that returns an array of child nodes but components in the strict term are not part of the Sprinkle JS philosophy. We want to mantain a super small bundle size.

#### Why i can't create a variable that is not an Object?

Sprinkle uses javascript [Proxyes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) to handle reactivity and unfortunately you can't create a Proxy from a primitive value.

#### Why i need to wrap everything in a function to use Sprinkle JS?

Sprinkle JS uses the same model of Vue or Solid to handle the reactivity. To keep track of the dependencies of a function it saves that function in a stack before calling it. This allows every variable accessed in that function to know that it's used in that function. This has some drawbacks. If you don't wrap everything inside a function the variable will be accessed before the effect can save himself into the stack. If you want to understand this better you can check [this article](https://dev.to/ryansolid/building-a-reactive-library-from-scratch-1i0p) from Ryan Carniato or watch [this video](https://www.youtube.com/watch?v=7Cjb7Xj8fEI) from VueMastery on Vue reactivity.

#### Why my createEffect does not re-run? I've used a reactive variable inside it.

It could be a lot of different things but probably is because you are running asynchronous code inside of it. You can run asynchronous code inside a createEffect but for it to track your dependencies you have to make sure to use them before the async part. You can even just access it just by writing `variablename.fieldname;` and it will be correctly tracked.
## Usage/Examples

#### createRef
This method is used to create a reactive variable for a primitive. It wraps the primitive in an object with a value property.

```typescript
const ref = createRef(1);
console.log(ref.value) // 1
```

if you use this variable inside a createEffect or inside another method whenever you'll update the value the method will re-run.

You can also pass an equality function that will determine how to check for equality for this ref. By default it will use `Object.is`.

```typescript
const ref = createRef(1, (before, after) => before > after);
console.log(ref.value) // 1
```
The above ref will not trigger an effect re-run if the previous value is greater than the new value.

Please note: if you are using typescript you can't pass something different than a primitive value to the ref and if you pass an equality function is recommended to also use the generic version of the fucntion `createRef<number>(1, (before, after)=> before > after)` otherwise Typescript will narrow the type to a constant. If you are using this in Javascript you are allowed to pass object to the ref (although is not recommended since you'll have to access it unnecessarly via the `.value` property), the object passed will be deeply reactive.

#### createVariable
This method is used to create a reactive variable for an object. It'll throw if you try to pass a primitive value to it.

```typescript
const variable = createVariable({ whosCool: "you" });
console.log(variable.whosCool) // you
```
if you use this variable inside a createEffect or inside another method whenever you'll update the value the method will re-run.

You can also pass an object containing an equality function for every field of the object that will determine how to check for equality for that field. By default it will use `Object.is`.
```typescript
const variable = createVariable({ whosCool: "you" }, { whosCool: (before, after) => before.length === after.length });
console.log(variable.whosCool) // you
```
The above variable will not trigger an effect re-run if the previous value has the same length as the new value.

createVariable works with nested property too. You can pass object inside objects and updating a values inside those object will trigger the rerun of the effects where it's been used. To pass an equality function relative to a nested object you should pass an object containing the properties of the object you want a particular equality function. If you pass a built in object tho (like Set, Map or HTMLElement) it will not become reactive.
If you use a nested object you can pass an object with the same structure to the equality functions object to specify an equality function for every field. If you pass a function the equality function will not be applied to the nested object.
```typescript
//here the name field will use the custom equality function
const variable = createVariable({ whosCool: { name: "you" } }, { whosCool: { name: (before, after) => before.length === after.length } });

//here the equality function will be applied only to the whosCool object
const variable = createVariable({ whosCool: { name: "you" } }, { whosCool: (before, after) => before.length === after.length });
```

```typescript
const variable = createVariable({ whosCool: { pronoun: "you" } }, { whosCool: { pronoun: (before, after) => before.length === after.length }});
console.log(variable.whosCool.pronoun) // you
```
in the above example `variable.whosCool.pronoun` is still reactive.

#### createCssVariable
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

#### createStored
This method is used to create a reactive variable for an object also persisting it in localStorage or sessionStorage. It'll throw if you try to pass a primitive value to it. It will also automatically add a listener for the storage to update the variable whenever the storage changes. It will take a key and an initial value as input but will discard the initial value if the key is already present in the storage. It will also throw if the object in the storage is not Object-like

```typescript
const variable = createStored("cool-stored",{ whosCool: "you" });
console.log(variable.whosCool) // you
console.log(window.localStorage.getItem("cool-stored"))// '{ "whosCool": "you" }'
```
if you use this variable inside a createEffect or inside another method whenever you'll update the value the method will re-run.

You can also pass an object containing an equality function for every field of the object that will determine how to check for equality for that field. By default it will use `Object.is`.
```typescript
const variable = createStored("cool-stored",{ whosCool: "you" }, { whosCool: (before, after) => before.length === after.length });
console.log(variable.whosCool) // you
```
The above variable will not trigger an effect re-run if the previous value has the same length as the new value.

Differently from `createVariable` a stored object is not deeply reactive.

#### createComputed
This method is used to create a reactive computed variable. You need to pass a function that will return a value. The return value of the function will be inside of the `.value` field of the returned computed. If you use some other variable to compute the this value it will always be in sync.

```typescript
const variable = createVariable({ whosCool: "you" });
const computed = createComputed(()=> `${variable.whosCool} is cool!`);
console.log(computed.value) // you is cool!
variable.whosCool = "whoever uses SprinkleJS";
console.log(computed.value) // whoever uses SprinkleJS is cool!
```
if you use this variable inside a createEffect or inside another method it will be rerunned whenever this computed changes. You can't set the value of a computed value and trying would still result in the same value being inside that computed.

You can also pass an equality function that will determine how to check for equality for this computed. By default it will use `Object.is`.

```typescript
const variable = createVariable({ whosCool: "you" });
const computed = createComputed(()=> `${variable.whosCool} is cool!`, (before, after) => before.length === after.length);
console.log(computed.value) // you is cool!
variable.whosCool = "whoever uses SprinkleJS";
console.log(computed.value) // whoever uses SprinkleJS is cool!
```
The above ref will not trigger an effect re-run if the previous value has the same length as the new value.

Another simple way to create a computed value if by defining a function that return a value using a reactive variable like this
```typescript
const variable = createVariable({ whosCool: "you" });
const computed = ()=> `${variable.whosCool} is cool!`;
console.log(computed()) // you is cool!
variable.whosCool = "whoever uses SprinkleJS";
console.log(computed()) // whoever uses SprinkleJS is cool!
```
As you can see in the example, this require you to call the function to access the value (instead of accessing it by `.value`)

However this second method will rerun the effect it's used in even if it has the same value as before.

#### createEffect
This method is used to create an effect that will keep track of it's dependencies and re-run every time they changed

```typescript
const variable = createVariable({ whosCool: "you" });
const ref = createRef(1);

createEffect(()=>{
    console.log(variable.whosCool, ref.value);
}) 
//will log (you, 1) the first time

ref.value++;
//the effect run again logging (you, 2)

variable.whosCool="whoever uses Sprinkle JS"
//the effect run again logging (whoever uses Sprinkle JS, 2)

```

You can also return a function that will be run before the new function to clean up the previous effect.

```typescript
const variable = createVariable({ whosCool: "you" });
const ref = createRef(1);

createEffect(()=>{
    console.log(variable.whosCool, ref.value);

    return ()=>{
        console.log("cleaning up");
    }
}) 
//will log (you, 1) the first time

ref.value++;
//the effect run again logging first "cleaning up" and then (you, 2)

variable.whosCool="whoever uses Sprinkle JS"
//the effect run again logging first "cleaning up" and then (whoever uses Sprinkle JS, 2)

```

#### untrack

This function can be used inside a createEffect to untrack a dependency. This way you can use a reactive variable inside a create effect without triggering the re-run when that variable changes. It takes a function as input and it return anything returned from that function.

```typescript
const variable = createVariable({ whosCool: "you" });
const ref = createRef(1);

createEffect(()=>{
    const refValue = untrack(()=>ref.value);
    console.log(variable.whosCool, refValue);
}) 
//will log (you, 1) the first time

ref.value++;
//the effect will not run again because ref.value has been accessed inside the untrack

variable.whosCool="whoever uses Sprinkle JS"
//the effect run again logging  (whoever uses Sprinkle JS, 2)

```

#### batch

This function can be used to avoid running effects multiple times when changing multiple variables. It's as simple as calling batch and passing a function that will change some variables.

```typescript
const variable = createVariable({ name: "John", lastName: "Doe" });

createEffect(()=>{
    console.log(`The full name is ${variable.name} ${variable.lastName}`);
});
//the effect will still run the first time logging "The full name is John Doe"

batch(()=>{
    variable.name="Albert";
    variable.lastName="Einstein";
});
//changin both variables without the batch would've run the effect twice
//in this case the effect will run a single time loggin "The full name is Albert Einstein"

```

#### bindTextContent

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
#### bindInnerHTML
> **Warning**
> Sprinkle JS does not sanitize the content of the innerHTML. If you use this function with user input make sure to sanitize it first to avoid expose yourself to XSS attacks.
This function is used to bind a string value to the innerHTML of an element. It takes a dom element or a selector as the first argument and a function returning the value to bind to the innerHTML as the second argument.

```typescript
const variable = createVariable({ whosCool: "you" });
const ref = createRef(1);

bindInnerHTML("#div-to-bind", ()=> `<span>${ref.value} <strong>${variable.whosCool}</strong></span>`); 
//the innerhtml of the div with the id div-to-bind will be "<span>1 <strong>you</strong></span>"

ref.value++;
//the innerhtml of the div with the id div-to-bind will be "<span>2 <strong>you</strong></span>"

variable.whosCool="whoever uses Sprinkle JS"
//the innerhtml of the div with the id div-to-bind will be "<span>2 <strong>whoever uses Sprinkle JS</strong></span>"
```

The callback you pass in also takes the element as the first argument, in Typescript you can pass a generic type specifying what kind of element you are expecting

```typescript
const variable = createVariable({ whosCool: "you" });
const ref = createRef(1);

bindInnerHTML<HTMLDivElement>("#div-to-bind", (element:HTMLDivElement)=> `<span>${element?.textContent} ${ref.value} <strong>${variable.whosCool}</strong></span>`); 
//the innerhtml of the div with the id div-to-bind will be "<span>1 <strong>you</strong></span>"

ref.value++;
//the innerhtml of the div with the id div-to-bind will be "<span>1 you 2 <strong>you</strong></span>"

variable.whosCool="whoever uses Sprinkle JS"
//the innerhtml of the div with the id div-to-bind will be "<span>1 you 2 you 2 <strong>whoever uses Sprinkle JS</strong></span>"
```

If you need to have access to the selected element (to add event listeners for example), the element is returned from the function.

```typescript
//this will bind the variables to the textContent and you'll have access to the element itself inside the variable divToBind
const divToBind=bindInnerHTML<HTMLDivElement>("#div-to-bind", (element:HTMLDivElement)=> `${element?.textContent} ${ref.value} ${variable.whosCool}`);
```

#### bindInputValue

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

#### bindDom

This function is used to bind an object that describe some DOM properties to the actual DOM properties. It takes a dom element or a selector as the first argument and a function returning the object as the second argument.

The following code will bind the ariaLabel value to the `variable.whosCool` field and the checked value for the checkbox.

```typescript
const variable = createVariable({ whosCool: "you" });

bindDom("#checkbox", (element)=> ({
    ariaLabel: variable.whosCool,
    checked: variable.whosCool === "you",
}));
```
#### bindClass

This function is used to bind a class to the actual element. It takes a dom element or a selector as the first argument, the class that you want to apply and a function returning a boolean as the third argument.

```typescript
const variable = createVariable({ count: 0 });

bindClass("#div-to-bind", "dark", (element)=> variable.count % 2 === 0);
//the div will have the dark class set by default

//this will remove the class;
variable.count++;

//this will add the class again;
variable.count++;

```
#### bindClasses

This function is used to bind multiple classes to the actual element. It takes a dom element or a selector as the first argument, and an object containing the classes that you want to apply as the keys and a boolean as the value. Each class will be applied only if the corrispondent value is true.

```typescript
const variable = createVariable({ count: 1 });

bindClasses("#to-bind", () => ({
    one: variable.count === 1,
    two: variable.count === 2,
    three: variable.count === 3,
    lessThanFive: variable.count < 5,
}));
//the div will have the classes one and lessThanFive

//the div will have the classes two and lessThanFive
variable.count++;

//the div will have the classes three and lessThanFive
variable.count++;

//the div will have the class lessThanFive
variable.count++;

//the div will have no classes
variable.count++;

```

#### bindStyle

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

#### bindChildrens

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
## Running Tests

To run tests, run the following command

```bash
  yarn run test
```

