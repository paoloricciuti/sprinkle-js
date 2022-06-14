export const documents = {
    starter_index_html:
        CodeMirror.Doc(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SprinkleJS - starter pack</title>
    <script src="index.js" type="module"></script>
</head>
<body>
    <div id="app"></div>
</body>
</html>`, "xml"),
    starter_index_js: CodeMirror.Doc(`import { createVariable, bindTextContent } from "https://cdn.skypack.dev/sprinkle-js";

const variable = createVariable({ isCool: true });

bindTextContent("#app", () => variable.isCool ? "😎" : "😢");

window.addEventListener("click", () => variable.isCool = !variable.isCool);`, "javascript")
};