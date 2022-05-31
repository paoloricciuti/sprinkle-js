const fs = require("fs").promises;
const path = require("path");
const packageJson = require("../package.json");
const NAMESPACE = "SprinkleJS";
(async () => {
    try {
        const esmPath = path.join("dist", "sprinkle-js.esm.js");
        const browserPath = path.join("dist", "sprinkle-js.js");
        const esmDeclarationPath = path.join("dist", "sprinkle-js.esm.d.ts");
        const cjsDeclarationPath = path.join("dist", "sprinkle-js.cjs.d.ts");
        const packageJsonPath = path.join("package.json");
        const content = (await fs.readFile(esmPath))?.toString();
        const newContent = `const ${NAMESPACE}=(()=>{${content}})();`.replace("export {", "return {");
        await fs.writeFile(browserPath, newContent);
        await fs.rename(cjsDeclarationPath, esmDeclarationPath);
        packageJson.main = "dist/sprinkle-js.esm.js";
        const packageNewContent = JSON.stringify(packageJson, null, 4);
        await fs.writeFile(packageJsonPath, packageNewContent);
    } catch (e) {
        console.error(e);
    }
})();