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

export type SidebarElement = {
    text: string;
    header: boolean;
    link?: undefined;
} | {
    text: string;
    link: string;
    header?: undefined;
};
