import { default as React } from 'react';
import { EditorAttrs } from '../../types';
/** home.top 등 광고 슬롯 아이템 (레거시·신규 이미지 필드 병행) */
export interface AdHeroItem {
    id?: string | number;
    title?: string;
    link_url?: string;
    image_url?: string;
    image_desktop?: string;
    image_mobile?: string;
    image_url_desktop?: string;
    image_url_mobile?: string;
    bg_color?: string;
    type?: string;
    /** When true, block context menu on slide images */
    prevent_right_click?: boolean;
    preventRightClick?: boolean;
    /** When true (default), external links open in a new tab */
    open_in_new_tab?: boolean;
    openInNewTab?: boolean;
}
export interface AdHeroCarouselProps {
    items?: AdHeroItem[] | null;
    /** 자동재생 간격(ms). 기본 4000 */
    intervalMs?: number;
    className?: string;
    id?: string;
    editorAttrs?: EditorAttrs;
}
/**
 * Bunjang-style full-width ad hero carousel for `home.top`.
 *
 * Filters to static items with at least one image. Supports legacy `image_url`
 * and upcoming desktop/mobile fields. External http(s) links honor
 * `open_in_new_tab` (default true → new tab); relative paths use G7Core navigate.
 */
export declare const AdHeroCarousel: React.FC<AdHeroCarouselProps>;
export default AdHeroCarousel;
