import { default as React } from 'react';
type FooterIconKind = 'home' | 'flame' | 'layout' | 'building' | 'help' | 'message' | 'file' | 'shield' | 'refresh';
interface SocialLinks {
    github?: string;
    twitter?: string;
    discord?: string;
    facebook?: string;
    instagram?: string;
}
interface FooterLink {
    label: string;
    href: string;
    /** Optional; inferred from href when omitted */
    icon?: FooterIconKind;
}
interface FooterLinkGroup {
    title: string;
    links: FooterLink[];
}
interface BusinessInfo {
    /** 상호 */
    companyName?: string;
    /** 대표자 이름 */
    representative?: string;
    /** 사업자등록번호 */
    businessNumber?: string;
    /** 통신판매업신고 번호 */
    mailOrderNumber?: string;
    /** 사업장 주소 */
    address?: string;
    /** 대표 전화 */
    phone?: string;
    /** 대표 이메일 */
    email?: string;
}
interface FooterProps {
    /** 사이트 이름 */
    siteName?: string;
    /** 사이트 설명 */
    siteDescription?: string;
    /** 저작권 텍스트 */
    copyrightText?: string;
    /** 소셜 미디어 링크 */
    socialLinks?: SocialLinks;
    /** 링크 그룹 (미지정 시 기본값 사용) */
    linkGroups?: FooterLinkGroup[];
    /**
     * 전자상거래 사업자 고지 (이커머스 설정).
     * 값이 있는 항목만 왼쪽 정렬로 | 구분 표기 (번개장터형).
     */
    businessInfo?: BusinessInfo;
    /** 추가 CSS 클래스 */
    className?: string;
    /** 레이아웃 편집기 식별 속성(data-editor-*) — 시각적 루트에 spread */
    editorAttrs?: Record<string, unknown>;
}
/**
 * 사이트 푸터 컴포넌트
 *
 * @example
 * ```json
 * // 레이아웃 JSON에서 사용
 * {
 *   "type": "composite",
 *   "name": "Footer",
 *   "props": {
 *     "siteName": "{{_global.settings.site_name}}",
 *     "siteDescription": "{{_global.settings.site_description}}",
 *     "copyrightText": "{{_global.settings.copyright_text}}",
 *     "socialLinks": {
 *       "github": "https://github.com/...",
 *       "twitter": "https://twitter.com/...",
 *       "discord": "https://discord.gg/..."
 *     }
 *   }
 * }
 * ```
 */
declare const Footer: React.FC<FooterProps>;
export default Footer;
