/**
 * Footer 컴포넌트
 *
 * 사이트 하단 푸터 컴포넌트입니다.
 * 사이트 정보, 링크 그룹, 소셜 링크, 저작권 표시를 포함합니다.
 *
 * @see 화면 구성:
 * ┌─────────────────────────────────────────────────────────────────┐
 * │ [사이트명]                                                       │
 * │ 상호 | 대표 | 사업자번호 | …   ← 사이트명 바로 아래(왼쪽 컬럼)     │
 * │ 링크 그룹 …                                                      │
 * │ © …                                                              │
 * └─────────────────────────────────────────────────────────────────┘
 */

import React from 'react';

// 기본 컴포넌트 import
import { Div } from '../basic/Div';
import { A } from '../basic/A';
import { Button } from '../basic/Button';
import { H3 } from '../basic/H3';
import { H4 } from '../basic/H4';
import { P } from '../basic/P';
import { Ul } from '../basic/Ul';
import { Li } from '../basic/Li';
import { Footer as FooterBasic } from '../basic/Footer';
import { Icon } from '../basic/Icon';

// G7Core.t() 번역 함수 참조
const t = (key: string, params?: Record<string, string | number>) =>
  (window as any).G7Core?.t?.(key, params) ?? key;

// G7 표준 반응형 breakpoint — 모바일(< 768) / 데스크톱(>= 1024).
// 레이아웃 편집기 프리뷰 호환을 위해 Tailwind md:/lg:/sm: 미디어쿼리 대신
// G7Core.useResponsive() width 기반 분기 사용 (편집 가능 템플릿은 G7 표준
// responsive 만 허용 — viewport 미디어쿼리는 프리뷰 overrideWidth 를 무시).
const TABLET_BREAKPOINT = 768;
const DESKTOP_BREAKPOINT = 1024;

// G7Core.dispatch() navigate 헬퍼
const navigate = (path: string) => {
  (window as any).G7Core?.dispatch?.({
    handler: 'navigate',
    params: { path },
  });
};

type FooterIconKind =
  | 'home'
  | 'flame'
  | 'layout'
  | 'building'
  | 'help'
  | 'message'
  | 'file'
  | 'shield'
  | 'refresh';

/** 푸터 메뉴용 작은 인라인 SVG (muted currentColor) */
const FooterIcon: React.FC<{ kind: FooterIconKind; className?: string }> = ({
  kind,
  className = 'w-3.5 h-3.5 shrink-0',
}) => {
  const common = {
    xmlns: 'http://www.w3.org/2000/svg',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className,
    'aria-hidden': true,
    focusable: false as const,
  };
  switch (kind) {
    case 'home':
      return (
        <svg {...common}>
          <path d="M3 10.5 12 3l9 7.5" />
          <path d="M5 10v10h14V10" />
          <path d="M10 20v-6h4v6" />
        </svg>
      );
    case 'flame':
      return (
        <svg {...common}>
          <path d="M12 3c2 3 1 5 1 7 0 1.5-1 2.5-1 2.5S10 11.5 10 10c0-2 1-4 2-7z" />
          <path d="M8.5 12.5C7 14 6.5 16 7.5 18A4.5 4.5 0 0 0 12 21a4.5 4.5 0 0 0 4.5-3c1-2 .5-4-1-5.5" />
        </svg>
      );
    case 'layout':
      return (
        <svg {...common}>
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      );
    case 'building':
      return (
        <svg {...common}>
          <path d="M4 21V5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v16" />
          <path d="M15 10h4a1 1 0 0 1 1 1v10" />
          <path d="M8 8h2M8 12h2M8 16h2M4 21h16" />
        </svg>
      );
    case 'help':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.8.4-1.5 1-1.5 2.2" />
          <path d="M12 17h.01" />
        </svg>
      );
    case 'message':
      return (
        <svg {...common}>
          <path d="M21 12a8 8 0 0 1-8 8H7l-4 3V12a8 8 0 0 1 8-8h2a8 8 0 0 1 8 8z" />
        </svg>
      );
    case 'file':
      return (
        <svg {...common}>
          <path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6" />
          <path d="M9 13h6M9 17h6" />
        </svg>
      );
    case 'shield':
      return (
        <svg {...common}>
          <path d="M12 3 5 6v6c0 5 3.5 8.5 7 9 3.5-.5 7-4 7-9V6l-7-3z" />
        </svg>
      );
    case 'refresh':
      return (
        <svg {...common}>
          <path d="M21 12a9 9 0 1 1-2.6-6.3" />
          <path d="M21 3v6h-6" />
        </svg>
      );
    default:
      return null;
  }
};

const iconForHref = (href: string): FooterIconKind | null => {
  const pathOnly = (href || '').split('?')[0].replace(/\/$/, '') || '/';
  const map: Record<string, FooterIconKind> = {
    '/': 'home',
    '/boards/popular': 'flame',
    '/boards': 'layout',
    '/page/about': 'building',
    '/faq': 'help',
    '/board/inquiry': 'message',
    '/page/terms': 'file',
    '/page/privacy': 'shield',
    '/page/refund': 'refresh',
  };
  return map[pathOnly] ?? null;
};

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
const Footer: React.FC<FooterProps> = ({
  siteName = '그누보드7',
  siteDescription,
  copyrightText,
  socialLinks = {},
  linkGroups,
  businessInfo,
  className = '',
  editorAttrs,
}) => {
  void copyrightText; // layout prop kept; marketplace disclaimer replaces copyright row
  const currentYear = new Date().getFullYear();

  // G7 표준 반응형 — useResponsive() 로 프리뷰 overrideWidth 수신 (편집기 디바이스
  // 전환에 정상 반응). hook 미주입 시 window.innerWidth fallback.
  const G7Core = (window as any).G7Core;
  const useResponsive = G7Core?.useResponsive as (() => { width: number }) | undefined;
  const responsiveValue = useResponsive?.();
  const width =
    responsiveValue?.width ??
    (typeof window !== 'undefined' ? window.innerWidth : DESKTOP_BREAKPOINT);
  const isMobile = width < TABLET_BREAKPOINT;
  const isDesktop = width >= DESKTOP_BREAKPOINT;
  // 링크 그룹 그리드 컬럼 — 모바일 1열 / 태블릿 2열 / 데스크톱 5열.
  const gridColumns = isMobile ? 1 : isDesktop ? 5 : 2;

  // 기본 링크 그룹
  const defaultLinkGroups: FooterLinkGroup[] = [
    {
      title: t('footer.community'),
      links: [
        { label: t('nav.home'), href: '/', icon: 'home' },
        { label: t('nav.popular'), href: '/boards/popular', icon: 'flame' },
        { label: t('footer.all_boards'), href: '/boards', icon: 'layout' },
      ],
    },
    {
      title: t('footer.info'),
      links: [
        { label: t('footer.about'), href: '/page/about', icon: 'building' },
        { label: t('footer.faq'), href: '/faq', icon: 'help' },
        { label: t('footer.contact'), href: '/board/inquiry', icon: 'message' },
      ],
    },
    {
      title: t('footer.policy'),
      links: [
        { label: t('footer.terms'), href: '/page/terms', icon: 'file' },
        { label: t('footer.privacy'), href: '/page/privacy', icon: 'shield' },
        { label: t('footer.refund'), href: '/page/refund', icon: 'refresh' },
      ],
    },
  ];


  const groups = linkGroups || defaultLinkGroups;

  /** 번개장터형: 값이 있는 사업자 고지만 왼쪽 정렬 + | 구분 */
  const businessParts: string[] = [];
  const bi = businessInfo ?? {};
  if (bi.companyName) businessParts.push(String(bi.companyName));
  if (bi.representative) businessParts.push(`대표 ${bi.representative}`);
  if (bi.businessNumber) businessParts.push(`사업자등록번호 ${bi.businessNumber}`);
  if (bi.mailOrderNumber) businessParts.push(`통신판매업신고 ${bi.mailOrderNumber}`);
  if (bi.address) businessParts.push(String(bi.address));
  if (bi.phone) businessParts.push(`전화 ${bi.phone}`);
  if (bi.email) businessParts.push(`이메일 ${bi.email}`);

  // 소셜 아이콘 이름 매핑
  const socialIconMap: Record<keyof SocialLinks, string> = {
    github: 'github',
    twitter: 'twitter',
    discord: 'discord',
    facebook: 'facebook',
    instagram: 'instagram',
  };

  return (
    <FooterBasic
      {...((editorAttrs ?? {}) as Record<string, never>)}
      className={`bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 ${className}`}
    >
      <Div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Div
          className="grid gap-8"
          style={{ gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))` }}
        >
          {/* 사이트 정보 — 데스크톱(5열)에서만 2칸 차지 */}
          <Div style={isDesktop ? { gridColumn: 'span 2 / span 2' } : undefined}>
            <H3 className="text-lg font-bold text-gray-900 dark:text-white">{siteName}</H3>
            {siteDescription && (
              <P className="mt-2 text-sm text-gray-600 dark:text-gray-400">{siteDescription}</P>
            )}

            {/* 전자상거래 사업자 고지 — 사이트명(3D Store) 바로 아래, 왼쪽 정렬 */}
            {businessParts.length > 0 && (
              <P className="mt-3 text-xs leading-relaxed text-gray-500 dark:text-gray-400 text-left">
                {businessParts.join('  |  ')}
              </P>
            )}

            {/* 소셜 링크 */}
            <Div className="mt-4 flex items-center gap-4">
              {Object.entries(socialLinks).map(([type, url]) =>
                url ? (
                  <A
                    key={type}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    aria-label={type}
                  >
                    <Icon name={socialIconMap[type as keyof SocialLinks]} className="w-5 h-5" />
                  </A>
                ) : null
              )}
            </Div>
          </Div>

          {/* 링크 그룹 */}
          {groups.map((group, index) => (
            <Div key={index}>
              <H4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
                {group.title}
              </H4>
              <Ul className="mt-4 space-y-2">
                {group.links.map((link, linkIndex) => {
                  const icon = link.icon ?? iconForHref(link.href);
                  return (
                    <Li key={linkIndex}>
                      <Button
                        onClick={() => navigate(link.href)}
                        className="inline-flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer"
                      >
                        {icon ? (
                          <FooterIcon
                            kind={icon}
                            className="w-3.5 h-3.5 shrink-0 opacity-70"
                          />
                        ) : null}
                        {link.label}
                      </Button>
                    </Li>
                  );
                })}
              </Ul>
            </Div>
          ))}
        </Div>

      </Div>

        {/* 마켓플레이스 고지 (저작권/파워드바이 대체) — 진한 회색 배경 */}
        <Div className="bg-gray-200 dark:bg-gray-700 border-t border-gray-300 dark:border-gray-600">
          <Div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-left">
            <P className="text-xs leading-relaxed text-gray-600 dark:text-gray-300">
              {`사이버몰 내 판매되는 디자인은 대부분 자체 제품이지만 상품 중에는 개별 판매자가 판매하는 마켓플레이스(오픈마켓) 상품이 포함되어 있을 수 있습니다.`}
            </P>
            <P className="mt-2 text-xs leading-relaxed text-gray-600 dark:text-gray-300">
              {`마켓플레이스(오픈마켓) 상품의 경우 ${siteName}는 통신판매중개자이며 통신판매의 당사자가 아닙니다.`}
            </P>
            <P className="mt-2 text-xs leading-relaxed text-gray-600 dark:text-gray-300">
              {`${siteName}는 마켓플레이스(오픈마켓) 상품, 거래정보 및 거래 등에 대하여 책임을 지지 않습니다.`}
            </P>
            <P className="mt-2 text-xs leading-relaxed text-gray-600 dark:text-gray-300">
              {`${siteName}는 소비자 보호와 안전거래를 위해 상담 서비스를 운영하고 있으며, 관련 분쟁이 발생할 경우 별도의 분쟁 처리절차에 의거 분쟁이 처리됩니다.`}
            </P>
            <P className="mt-3 text-xs leading-relaxed text-gray-600 dark:text-gray-300">
              {`Copyright © ${siteName}. ${currentYear} All Rights Reserved.`}
            </P>
          </Div>
        </Div>
    </FooterBasic>
  );
};

export default Footer;
