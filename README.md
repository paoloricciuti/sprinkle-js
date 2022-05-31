
![Logo](https://sprinkle-js.netlify.app/assets/sprinkle-js.svg)
[![MIT License](https://img.shields.io/apm/l/atomic-design-ui.svg?)](https://github.com/tterb/atomic-design-ui/blob/master/LICENSEs)

![npm bundle size](https://img.shields.io/bundlephobia/minzip/sprinkle-js)

![npm](https://img.shields.io/npm/v/sprinkle-js)

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

You can see this library in use [here](https://sprinkle-js.netlify.app).
## Authors

- [@paoloricciuti](https://www.github.com/paoloricciuti)


## Contributing

//⚠ WIP

Contributions are always welcome!

See `contributing.md` for ways to get started.

Please adhere to this project's `code of conduct`.


## Documentation

//⚠ WIP


## FAQ

#### Can i use Sprinkle JS in production?

Obviously you can...but i don't recommend it. The main focus of Sprinkle JS is not to give you a fully fledget, bleeding edge, blazingly fast framework. Is mainly to let you fiddle around in your fun little projects without the need to setup a bundler or importing a huge codebase just to get a bit of reactivity.

#### How can i create a component in Sprinkle JS?

You can't. You could, in theory write a function that returns an array of child nodes but components in the strict term are not part of the Sprinkle JS philosophy. We want to mantain a super small bundle size.

#### Why i can't create a variable that is not an Object?

Sprinkle uses javascript [Proxyes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) to handle reactivity and unfortunately you can't create a Proxy from a primitive value.

#### Why i need to wrap everything in a function to use Sprinkle JS?

Sprinkle JS uses the same model of Vue or Solid to handle the reactivity. To keep track of the dependencies of a function it saves that function in a stack before calling it. This allows every variable accessed in that function to know that it's used in that function. This has some drawbacks. If you don't wrap everything inside a function the variable will be accessed before the effect can save himself into the stack. If you want to understand this better you can check [this article](https://dev.to/ryansolid/building-a-reactive-library-from-scratch-1i0p) from Ryan Carniato or watch [this video](https://www.youtube.com/watch?v=7Cjb7Xj8fEI) from VueMastery on Vue reactivity.
## Usage/Examples

#### createRef
This method is used to create a reactive variable for a primitive. It wraps the primitive in an object with a value property.

```typescript
const ref = createRef(1);
console.log(ref.value) // 1
```

if you use this variable inside a createEffect or inside another method whenever you'll update the value the method will re-run.

#### createVariable
This method is used to create a reactive variable for an object. It'll throw if you try to pass a primitive value to it.

```typescript
const variable = createVariable({ whosCool: "you" });
console.log(variable.whosCool) // you
```

if you use this variable inside a createEffect or inside another method whenever you'll update the value the method will re-run.

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

//⚠ WIP
## Running Tests

To run tests, run the following command

```bash
  npm run test
```

