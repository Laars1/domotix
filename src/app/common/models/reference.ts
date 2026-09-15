import { ReferenceContent } from "./reference-content";

export interface Reference {
    /** URL segment, identical across all languages so hreflang stays consistent. */
    slug: string,
    title: string,
    subtitle: string,
    /**
     * Plain-text summary for <meta description>, Open Graph and JSON-LD.
     * The prose itself lives in assets/referenzen/<lang>/<slug>.md and is
     * Markdown, which is no good for those.
     */
    description: string,
    /** Lead image – used for the teaser, the detail hero and as OG image. */
    headerImg: string,
    /**
     * Hidden from the overview, the prev/next navigation and the ItemList when
     * true. The detail page still renders it for a direct-URL preview, but
     * marks it noindex. Omit or set false to publish.
     */
    draft?: boolean,
    content: ReferenceContent
}
