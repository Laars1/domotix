export interface Partner {
    id: number,
    title: string,
    subtitle?: string,
    headerImg: string,
    url: string,
    /** Pages whose partner strip shows this brand, e.g. ["gebaeude", "experience"]. */
    pages: string[]
}
