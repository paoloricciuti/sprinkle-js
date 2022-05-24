const fs = require("fs").promises;
const path = require("path");
const NAMESPACE = "SprinkleJS";
(async () => {
    try {
        const content = (await fs.readFile(path.join("dist", "sprinkle-js.esm.js")))?.toString();
        const newContent = `const ${NAMESPACE}=(()=>{${content}})();`.replace("export {", "return {");
        await fs.writeFile(path.join("dist", "sprinkle-js.js"), newContent);
    } catch (e) {
        console.error(e);
    }
})();