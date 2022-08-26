export const SITE = {
    title: 'Sprinkle JS',
    description: 'A drop in reactive library to sprinkle your code with reactivity.',
    defaultLanguage: 'en_US',
};

export const OPEN_GRAPH = {
    image: {
        src: 'https://raw.githubusercontent.com/paoloricciuti/sprinkle-js/master/docs/public/default-og-image.png',
        alt: 'sprinkle-js logo, a donut',
    },
    twitter: 'paoloricciuti',
};

export const KNOWN_LANGUAGES = {
    English: 'en',
};

// Uncomment this to add an "Edit this page" button to every page of documentation.
export const GITHUB_EDIT_URL = `https://github.com/paoloricciuti/sprinkle-js/blob/master/docs/`;

// Uncomment this to add an "Join our Community" button to every page of documentation.
// export const COMMUNITY_INVITE_URL = `https://astro.build/chat`;

// Uncomment this to enable site search.
// See "Algolia" section of the README for more information.
// export const ALGOLIA = {
//   indexName: 'XXXXXXXXXX',
//   appId: 'XXXXXXXXXX',
//   apiKey: 'XXXXXXXXXX',
// }









export const SIDEBAR = {
    en: [
        { text: 'Getting Started', header: true },
        { text: 'Introduction', link: 'en/introduction' },
        { text: 'Installation', link: 'en/installation' },
        { text: 'API', header: true },
        { text: 'createRef', link: 'en/createRef' },
        { text: 'createVariable', link: 'en/createVariable' },
        { text: 'createCssVariable', link: 'en/createCssVariable' },
        { text: 'createStored', link: 'en/createStored' },
        { text: 'createComputed', link: 'en/createComputed' },
        { text: 'createEffect', link: 'en/createEffect' },
        { text: 'untrack', link: 'en/untrack' },
        { text: 'batch', link: 'en/batch' },
        { text: 'bindTextContent', link: 'en/bindTextContent' },
        { text: 'bindInnerHTML', link: 'en/bindInnerHTML' },
        { text: 'bindInputValue', link: 'en/bindInputValue' },
        { text: 'bindDom', link: 'en/bindDom' },
        { text: 'bindClass', link: 'en/bindClass' },
        { text: 'bindClasses', link: 'en/bindClasses' },
        { text: 'bindStyle', link: 'en/bindStyle' },
        { text: 'bindChildrens', link: 'en/bindChildrens' }
    ],
};
