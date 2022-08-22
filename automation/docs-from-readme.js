const fs = require("fs").promises;
const path = require("path");

const getMapFromString = (string, regex) => {
    const splittedString = string.split(regex);
    const retval = new Map();
    for (let i = 1; i < splittedString.length; i += 2) {
        const title = splittedString[i];
        const content = splittedString[i + 1];
        retval.set(title, content);
    }
    return retval;
};

(async () => {
    try {
        const readMePath = path.join("../", "README.md");
        const readMe = await (await fs.readFile(readMePath)).toString();
        const readMeMap = getMapFromString(readMe, /\r\n\#\#\s(.+)\r\n/);
        const usageAndExamples = readMeMap.get("Usage/Examples");
        const usageMap = getMapFromString(usageAndExamples, /\r\n\#\#\#\#\s(.+)\r\n/);
        for (let [page, content] of usageMap.entries()) {
            let toWrite = `---
title: ${page}
description: ${page}
layout: ../../layouts/MainLayout.astro
---
${content}
`;
            const pathToWrite = path.join("../", "docs", "src", "pages", "en", `${page}.md`);
            await fs.writeFile(pathToWrite, toWrite);
        }
        const configTsPath = path.join("../", "docs", "src", "config.ts");
        const configTs = await (await fs.readFile(configTsPath)).toString();
        const configTsNoSidebarVar = configTs.substring(0, configTs.indexOf("export const SIDEBAR"));
        const configToWrite = `${configTsNoSidebarVar}
export const SIDEBAR = {
    en: [
        { text: 'Getting Started', header: true },
        { text: 'Introduction', link: 'en/introduction' },
        { text: 'API', header: true },
        ${[...usageMap.keys()].map(page => {
            return `{ text: '${page}', link: 'en/${page}' }`;
        }).join(",\n        ")
            }
    ],
};
`;
        await fs.writeFile(configTsPath, configToWrite);
    } catch (e) {
        console.error(e);
    }
})();