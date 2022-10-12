---
title: bindClasses
description: bindClasses
layout: ../../layouts/MainLayout.astro
header: API Reference
order: 114
---

This function is used to bind multiple classes to the actual element. It takes a
dom element or a selector as the first argument, and an object containing the
classes that you want to apply as the keys and a boolean as the value. Each
class will be applied only if the corrispondent value is true.

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

