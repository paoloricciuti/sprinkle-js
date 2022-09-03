---
title: Introduction
description: Docs intro
layout: ../../layouts/MainLayout.astro
header: Getting Started
order: 1
---

## Getting started

#### What is SprinkleJs?

Sprinkle JS is a quick, drop-in, way to add reactivity to your imperative JS app. It uses a model very similar (yet far less powerful) than [SolidJS](https://github.com/solidjs/solid) to handle reactivity and it was heavily inspired by [this post](https://dev.to/ryansolid/building-a-reactive-library-from-scratch-1i0p) from Ryan Carniato the main developer behind it.

Before diving in the APIs and all the cool stuff it's useful to clarify what is Sprinkle JS philosophy and what Sprinkle JS is not.

#### Philosophy

The main philosophy behind Sprinkle JS is to build a supersmall library that requires no bundler that you can just drop in a script tag or import from a cdn and add a bit a reactivity to your app. We made a bunch of utility functions to bind your variables to your DOM in some way and that's all is needed. Open a new file, drop in Sprinkle JS, declare your variables, declare your bindings and than proceed to write your code without caring about updating the DOM...that's Sprinkle JS work!

#### What is not
- **Sprinkle JS is not** the next big thing after React.
- **Sprinkle JS is not** for your big project...i mean if you want to use it feel free to do so but it's not what's meant to be.
- **Sprinkle JS is not** for perf aficionados: we as a community are trying to our best and maybe it will become the best version of itself but keep always keep in mind the main philosophy behind it.
