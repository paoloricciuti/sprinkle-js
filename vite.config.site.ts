import { defineConfig } from 'vitest/config';
import { resolve } from "path";


export default defineConfig({
    test: {
        coverage: {
            reporter: ['text', 'json', 'html'],
        },
    },
    build: {
        lib: {
            entry: resolve(__dirname, "src/index.ts"),
            name: "SprinkleJS",
            fileName: (format) => `sprinkle-js.${format}.js`,
            formats: ["es"],
        },
        outDir: "site/dist"
    },
});