const fs = require("fs").promises;
const path = require("path");
const packageJson = require("../package.json");
(async () => {
    try {
        const packageJsonPath = path.join("package.json");
        packageJson.main = "dist/sprinkle-js.cjs.js";
        const packageNewContent = JSON.stringify(packageJson, null, 4);
        await fs.writeFile(packageJsonPath, packageNewContent);
    } catch (e) {
        console.error(e);
    }
})();