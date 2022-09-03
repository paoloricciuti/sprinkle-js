export type IMDFrontmatter = {
    title: string;
    description: string;
    header: string;
    order: number;
    link: string;
};

const getSidebarFromGlob = async () => {
    const fm = (await import.meta.glob("../pages/**/*.md"));
    const frontmatters = await Promise.all(Object.values(fm).map(async (page) => {
        const info = await ((page as any)());
        return {
            link: `${info.url.substring(1)}`,
            ...info.frontmatter,
        };
    }));
    const retval = [];
    let currentHeader = "";
    frontmatters.sort((fmA, fmB) => fmA.order - fmB.order);
    for (let frontmatter of frontmatters) {
        if (currentHeader !== frontmatter.header) {
            currentHeader = frontmatter.header;
            retval.push({ header: true, text: currentHeader });
        }
        retval.push({ text: frontmatter.title, link: frontmatter.link });
    }
    return { en: retval };
};

export {
    getSidebarFromGlob,
};