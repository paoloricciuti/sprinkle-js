import { createEffect, createVariable } from 'sprinkle-js';

const variable = createVariable({
    sprinkle: true,
});

createEffect(() => {
    console.log(variable.sprinkle);
});
