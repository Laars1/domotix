/**
 * A mosaic image. Plain string for the normal case; the object form only when
 * the default centre crop cuts off the subject.
 *
 * Tiles are always filled edge to edge (object-fit: cover). There is
 * deliberately no option to letterbox — a picture that does not fit should be
 * re-cropped at the source instead.
 */
export type ReferenceImageInput = string | ReferenceImage;

export interface ReferenceImage {
    src: string,
    /** CSS object-position, e.g. "center 30%" — steers what the crop keeps. */
    focus?: string
}

/** Normalises either form into the object form. */
export function toReferenceImage(input: ReferenceImageInput): ReferenceImage {
    return typeof input === 'string' ? { src: input } : input;
}

export interface ReferenceContent {
    date: string,
    /** Optional place, shown next to the year (e.g. "Bern"). */
    location?: string,
    /** Rendered as chips on the detail page and as JSON-LD keywords. */
    tags: string[],
    /** 2–6 images. The mosaic fills one row per image pair. */
    images: ReferenceImageInput[]
}
