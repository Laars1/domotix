import { ReferenceContent } from "./reference-content";

export interface Reference {
    id: number,
    title: string,
    subtitle: string,
    headerImg: string,
    content: ReferenceContent
}
