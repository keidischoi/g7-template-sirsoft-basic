import React, { useState, useEffect, useRef } from 'react';
import { Div } from '../basic/Div';
import { Button } from '../basic/Button';
import { Span } from '../basic/Span';
import type { EditorAttrs } from '../../types';

/**
 * 테마 모드 타입
 */
export type ThemeMode = 'auto' | 'light' | 'dark';

/**
 * ThemeToggle Props
 */
export interface ThemeToggleProps {
  /** 테마 변경 콜백 */
  onThemeChange?: (theme: ThemeMode) => void;
  /** 추가 CSS 클래스 */
  className?: string;
  /** 자동 모드 텍스트 (다국어 키 사용 권장) */
  autoText?: string;
  /** 라이트 모드 텍스트 (다국어 키 사용 권장) */
  lightText?: string;
  /** 다크 모드 텍스트 (다국어 키 사용 권장) */
  darkText?: string;
  /** DOM id 속성 (레이아웃 편집기 코어 일괄 ID) */
  id?: string;
  /** 레이아웃 편집기 주입 속성 (편집 모드 전용, 루트에 spread) */
  editorAttrs?: EditorAttrs;
}

/**
 * ThemeToggle 컴포넌트
 *
 * 다크/라이트 모드 전환 버튼
 * - 3가지 모드: 자동(시스템 설정 따름), 라이트, 다크
 * - localStorage에 'g7_color_scheme' 키로 저장 (admin 템플릿과 동일)
 * - 시스템 prefers-color-scheme 감지 지원
 *
 * @example
 * ```json
 * {
 *   "type": "composite",
 *   "name": "ThemeToggle",
 *   "props": {
 *     "autoText": "$t:common.theme.auto",
 *     "lightText": "$t:common.theme.light",
 *     "darkText": "$t:common.theme.dark"
 *   }
 * }
 * ```
 */

/**
 * 실제 적용될 테마 결정 (auto인 경우 시스템 설정 반영)
 */
const getEffectiveTheme = (mode: ThemeMode): 'light' | 'dark' => {
  if (mode === 'auto') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }
  return mode;
};

/**
 * 테마 적용
 */
const applyTheme = (mode: ThemeMode) => {
  const effectiveTheme = getEffectiveTheme(mode);
  document.documentElement.setAttribute('data-theme', effectiveTheme);

  // dark 클래스 토글 (Tailwind CSS dark: 모드 지원)
  if (effectiveTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

/**
 * 초기 테마 로드 및 적용 (즉시 실행)
 * admin 템플릿과 동일한 localStorage 키 사용: 'g7_color_scheme'
 */
const getInitialTheme = (): ThemeMode => {
  const savedTheme = localStorage.getItem('g7_color_scheme') as ThemeMode | null;
  if (savedTheme && ['auto', 'light', 'dark'].includes(savedTheme)) {
    return savedTheme;
  }
  return 'auto';
};


/** FA 의존 없는 인라인 SVG (검색/장바구니/벨과 동일) */
const SvgIcon: React.FC<{
  kind: 'sun' | 'moon' | 'settings' | 'check';
  className?: string;
  size?: number;
}> = ({ kind, className = '', size = 20 }) => {
  const common = {
    xmlns: 'http://www.w3.org/2000/svg',
    width: size,
    height: size,
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
  if (kind === 'sun') {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
    );
  }
  if (kind === 'moon') {
    return (
      <svg {...common}>
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    );
  }
  if (kind === 'settings') {
    return (
      <svg {...common}>
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
};

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  onThemeChange,
  className = '',
  autoText = 'System',
  lightText = 'Light',
  darkText = 'Dark',
  id,
  editorAttrs,
}) => {
  // 초기 테마를 즉시 로드하고 적용
  const initialTheme = getInitialTheme();
  const [currentMode, setCurrentMode] = useState<ThemeMode>(initialTheme);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  /**
   * 컴포넌트 마운트 시 즉시 테마 적용
   */
  useEffect(() => {
    applyTheme(currentMode);
  }, []);

  /**
   * 시스템 테마 변경 감지
   */
  useEffect(() => {
    if (currentMode !== 'auto') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      applyTheme('auto');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [currentMode]);

  /**
   * 외부 클릭 감지
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /**
   * 테마 변경 핸들러
   * admin 템플릿과 동일한 localStorage 키 사용: 'g7_color_scheme'
   */
  const handleThemeChange = (mode: ThemeMode) => {
    setCurrentMode(mode);
    localStorage.setItem('g7_color_scheme', mode);
    applyTheme(mode);
    setShowMenu(false);
    onThemeChange?.(mode);
  };

  /**
   * 현재 표시할 아이콘 결정
   */
  const getCurrentIcon = (): 'sun' | 'moon' => {
    const effectiveTheme = getEffectiveTheme(currentMode);
    return effectiveTheme === 'dark' ? 'moon' : 'sun';
  };

  return (
    <Div ref={menuRef} className={`relative ${className}`} id={id} {...editorAttrs}>
      {/* 테마 토글 버튼 */}
      <Button
        onClick={() => setShowMenu(!showMenu)}
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-600 dark:text-gray-400"
        aria-label="Toggle theme"
      >
        <SvgIcon kind={getCurrentIcon()} className="w-5 h-5" />
      </Button>

      {/* 테마 선택 드롭다운 */}
      {showMenu && (
        <Div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
          <Div className="py-2">
            {/* 자동 모드 */}
            <Button
              onClick={() => handleThemeChange('auto')}
              className={`
                w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors
                ${currentMode === 'auto' ? 'bg-gray-50 dark:bg-gray-700' : ''}
              `}
            >
              <SvgIcon kind="settings" className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <Span className="flex-1 text-left text-gray-900 dark:text-white">{autoText}</Span>
              {currentMode === 'auto' && (
                <SvgIcon kind="check" size={16} className="w-4 h-4 text-blue-600 dark:text-blue-400 ml-auto" />
              )}
            </Button>

            {/* 라이트 모드 */}
            <Button
              onClick={() => handleThemeChange('light')}
              className={`
                w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors
                ${currentMode === 'light' ? 'bg-gray-50 dark:bg-gray-700' : ''}
              `}
            >
              <SvgIcon kind="sun" className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <Span className="flex-1 text-left text-gray-900 dark:text-white">{lightText}</Span>
              {currentMode === 'light' && (
                <SvgIcon kind="check" size={16} className="w-4 h-4 text-blue-600 dark:text-blue-400 ml-auto" />
              )}
            </Button>

            {/* 다크 모드 */}
            <Button
              onClick={() => handleThemeChange('dark')}
              className={`
                w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors
                ${currentMode === 'dark' ? 'bg-gray-50 dark:bg-gray-700' : ''}
              `}
            >
              <SvgIcon kind="moon" className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <Span className="flex-1 text-left text-gray-900 dark:text-white">{darkText}</Span>
              {currentMode === 'dark' && (
                <SvgIcon kind="check" size={16} className="w-4 h-4 text-blue-600 dark:text-blue-400 ml-auto" />
              )}
            </Button>
          </Div>
        </Div>
      )}
    </Div>
  );
};

export default ThemeToggle;
