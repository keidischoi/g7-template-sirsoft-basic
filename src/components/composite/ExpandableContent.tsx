import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Div } from '../basic/Div';
import { Button } from '../basic/Button';
import { Span } from '../basic/Span';
import type { EditorAttrs } from '../../types';

/**
 * G7Core 다국어 헬퍼
 *
 * @param key 다국어 키
 * @return 번역된 문자열
 */
const t = (key: string): string =>
  (window as any).G7Core?.t?.(key) ?? key;

export interface ExpandableContentProps {
  /**
   * 접힌 상태의 최대 높이 (px). useViewportHeight 가 true 이면 뷰포트 기준이 우선한다.
   * @default 500
   */
  maxHeight?: number;

  /**
   * true 이면 접힌 높이를 대략 한 화면(뷰포트)으로 잡는다.
   * @default false
   */
  useViewportHeight?: boolean;

  /**
   * 뷰포트 대비 비율 (useViewportHeight 일 때). 헤더·탭 여유를 두고 0.85 기본.
   * @default 0.85
   */
  viewportRatio?: number;

  /**
   * 펼치기 버튼 텍스트
   */
  expandText?: string;

  /**
   * 접기 버튼 텍스트
   */
  collapseText?: string;

  /**
   * 사용자 정의 클래스
   */
  className?: string;

  /**
   * children 렌더링
   */
  children?: React.ReactNode;

  /**
   * DOM id 속성 (레이아웃 편집기 코어 일괄 ID)
   */
  id?: string;

  /**
   * 레이아웃 편집기 주입 속성 (편집 모드 전용, 루트에 spread)
   */
  editorAttrs?: EditorAttrs;
}

/**
 * ExpandableContent 컴포넌트
 *
 * 콘텐츠가 maxHeight를 초과하면 그라데이션 오버레이와 펼치기/접기 버튼을 표시합니다.
 * 콘텐츠가 짧으면 버튼/그라데이션 없이 전체 콘텐츠를 그대로 표시합니다.
 *
 * @example
 * // 레이아웃 JSON에서 사용
 * {
 *   "type": "composite",
 *   "name": "ExpandableContent",
 *   "props": { "maxHeight": 500 },
 *   "children": [
 *     {
 *       "type": "composite",
 *       "name": "HtmlContent",
 *       "props": { "content": "{{product.data?.description_localized ?? ''}}" }
 *     }
 *   ]
 * }
 */
export const ExpandableContent: React.FC<ExpandableContentProps> = ({
  maxHeight = 500,
  useViewportHeight = false,
  viewportRatio = 0.85,
  expandText,
  collapseText,
  className = '',
  children,
  id,
  editorAttrs,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [needsExpand, setNeedsExpand] = useState(false);
  const [effectiveMaxHeight, setEffectiveMaxHeight] = useState(maxHeight);
  const contentRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  // 뷰포트(한 화면) 기준 접힌 높이 계산
  useEffect(() => {
    const updateLimit = () => {
      if (useViewportHeight && typeof window !== 'undefined') {
        const vh = Math.round(window.innerHeight * viewportRatio);
        setEffectiveMaxHeight(Math.max(280, vh));
      } else {
        setEffectiveMaxHeight(maxHeight);
      }
    };
    updateLimit();
    if (!useViewportHeight) return;
    window.addEventListener('resize', updateLimit);
    return () => window.removeEventListener('resize', updateLimit);
  }, [useViewportHeight, viewportRatio, maxHeight]);

  /**
   * 콘텐츠 높이를 측정하여 펼치기 버튼 필요 여부를 결정합니다.
   */
  const checkHeight = useCallback(() => {
    if (contentRef.current) {
      const scrollHeight = contentRef.current.scrollHeight;
      setNeedsExpand(scrollHeight > effectiveMaxHeight + 8);
    }
  }, [effectiveMaxHeight]);

  useEffect(() => {
    checkHeight();

    const container = contentRef.current;
    if (!container) return;

    const images = container.querySelectorAll('img');
    images.forEach((img) => {
      if (!img.complete) {
        img.addEventListener('load', checkHeight);
      }
    });

    let observer: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(checkHeight);
      observer.observe(container);
    }

    return () => {
      images.forEach((img) => {
        img.removeEventListener('load', checkHeight);
      });
      observer?.disconnect();
    };
  }, [checkHeight, children]);

  const toggleExpand = () => {
    setIsExpanded((prev) => {
      const next = !prev;
      // 접을 때 상품정보 시작 위치로 스크롤
      if (prev && rootRef.current) {
        requestAnimationFrame(() => {
          rootRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      }
      return next;
    });
  };

  const resolvedExpandText = expandText || t('shop.product.expand_detail');
  const resolvedCollapseText = collapseText || t('shop.product.collapse_detail');

  return (
    <Div ref={rootRef} className={className} id={id} {...editorAttrs}>
      {/* 콘텐츠 컨테이너 */}
      <Div className="relative">
        <Div
          ref={contentRef}
          className={
            !isExpanded && needsExpand
              ? 'overflow-hidden transition-[max-height] duration-300 ease-in-out'
              : 'transition-[max-height] duration-300 ease-in-out'
          }
          style={
            !isExpanded && needsExpand
              ? { maxHeight: `${effectiveMaxHeight}px` }
              : undefined
          }
        >
          {children}
        </Div>

        {/* 그라데이션 오버레이 */}
        {!isExpanded && needsExpand && (
          <Div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white dark:from-gray-900 to-transparent pointer-events-none" />
        )}
      </Div>

      {/* 펼치기 / 접기 — 펼친 뒤에는 콘텐츠 하단에 접기 버튼 */}
      {needsExpand && (
        <Button
          type="button"
          onClick={toggleExpand}
          className="flex items-center justify-center w-full mt-2 py-3.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer gap-1.5 shadow-sm"
        >
          <Span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {isExpanded ? resolvedCollapseText : resolvedExpandText}
          </Span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-500 dark:text-gray-400"
            aria-hidden="true"
          >
            {isExpanded ? (
              <polyline points="18 15 12 9 6 15" />
            ) : (
              <polyline points="6 9 12 15 18 9" />
            )}
          </svg>
        </Button>
      )}
    </Div>
  );
};

export default ExpandableContent;
