import React, { useState, useEffect } from 'react';
import { Div } from '../basic/Div';
import { Button } from '../basic/Button';
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
  /** 자동 모드 텍스트 (호환용, 미사용) */
  autoText?: string;
  /** 라이트 모드 텍스트 (호환용, 미사용) */
  lightText?: string;
  /** 다크 모드 텍스트 (호환용, 미사용) */
  darkText?: string;
  /** DOM id 속성 (레이아웃 편집기 코어 일괄 ID) */
  id?: string;
  /** 레이아웃 편집기 주입 속성 (편집 모드 전용, 루트에 spread) */
  editorAttrs?: EditorAttrs;
}

/**
 * ThemeToggle 컴포넌트
 *
 * 다크/라이트 모드 전환 버튼 (팝업 없음)
 * - 클릭 한 번으로 light ↔ dark 직접 토글
 * - localStorage에 'g7_color_scheme' 키로 저장 (admin 템플릿과 동일)
 * - 저장된 값이 auto면 시스템 설정을 읽어 반대 모드로 고정
 *
 * @example
 * ```json
 * {
 *   "type": "composite",
 *   "name": "ThemeToggle"
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
  kind: 'sun' | 'moon';
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
  return (
    <svg {...common}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
};

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  onThemeChange,
  className = '',
  id,
  editorAttrs,
}) => {
  // 초기 테마를 즉시 로드하고 적용
  const initialTheme = getInitialTheme();
  const [currentMode, setCurrentMode] = useState<ThemeMode>(initialTheme);

  /**
   * 컴포넌트 마운트 시 즉시 테마 적용
   */
  useEffect(() => {
    applyTheme(currentMode);
  }, []);

  /**
   * 시스템 테마 변경 감지 (auto 모드일 때만)
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
   * 클릭 시 light ↔ dark 직접 토글 (팝업 없음)
   */
  const handleToggle = () => {
    const effective = getEffectiveTheme(currentMode);
    const next: ThemeMode = effective === 'dark' ? 'light' : 'dark';
    setCurrentMode(next);
    localStorage.setItem('g7_color_scheme', next);
    applyTheme(next);
    onThemeChange?.(next);
  };

  /**
   * 현재 표시할 아이콘 결정
   */
  const getCurrentIcon = (): 'sun' | 'moon' => {
    const effectiveTheme = getEffectiveTheme(currentMode);
    return effectiveTheme === 'dark' ? 'moon' : 'sun';
  };

  return (
    <Div className={`relative ${className}`} id={id} {...editorAttrs}>
      <Button
        onClick={handleToggle}
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-600 dark:text-gray-400"
        aria-label="Toggle theme"
        type="button"
      >
        <SvgIcon kind={getCurrentIcon()} className="w-5 h-5" />
      </Button>
    </Div>
  );
};

export default ThemeToggle;
