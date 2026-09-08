import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Div } from '../basic/Div';
import { Button } from '../basic/Button';
import { A } from '../basic/A';
import { Img } from '../basic/Img';
import type { EditorAttrs } from '../../types';

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
}

export interface AdHeroCarouselProps {
  items?: AdHeroItem[] | null;
  /** 자동재생 간격(ms). 기본 4000 */
  intervalMs?: number;
  className?: string;
  id?: string;
  editorAttrs?: EditorAttrs;
}

const navigate = (path: string) => {
  (window as any).G7Core?.dispatch?.({
    handler: 'navigate',
    params: { path },
  });
};

const isExternalUrl = (url: string) => /^https?:\/\//i.test(url);

const resolveDesktopSrc = (ad: AdHeroItem): string | undefined =>
  ad.image_desktop ?? ad.image_url_desktop ?? ad.image_url;

const resolveMobileSrc = (ad: AdHeroItem): string | undefined =>
  ad.image_mobile ?? ad.image_url_mobile ?? ad.image_url;

const hasAnyImage = (ad: AdHeroItem): boolean =>
  !!(resolveDesktopSrc(ad) || resolveMobileSrc(ad));

const ChevronLeft = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5"
    aria-hidden="true"
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ChevronRight = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5"
    aria-hidden="true"
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

/**
 * Bunjang-style full-width ad hero carousel for `home.top`.
 *
 * Filters to static items with at least one image. Supports legacy `image_url`
 * and upcoming desktop/mobile fields. External http(s) links open in a new tab;
 * relative paths use G7Core navigate.
 */
export const AdHeroCarousel: React.FC<AdHeroCarouselProps> = ({
  items,
  intervalMs = 4000,
  className = '',
  id,
  editorAttrs,
}) => {
  const slides = useMemo(() => {
    const list = Array.isArray(items) ? items : [];
    return list.filter((ad) => {
      const t = ad?.type ?? 'static';
      return t === 'static' && hasAnyImage(ad);
    });
  }, [items]);

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Clamp index when slide count shrinks
  useEffect(() => {
    if (slides.length === 0) return;
    setIndex((i) => (i >= slides.length ? 0 : i));
  }, [slides.length]);

  const goTo = useCallback(
    (next: number) => {
      if (slides.length === 0) return;
      const n = ((next % slides.length) + slides.length) % slides.length;
      setIndex(n);
    },
    [slides.length],
  );

  const goPrev = useCallback(() => goTo(index - 1), [goTo, index]);
  const goNext = useCallback(() => goTo(index + 1), [goTo, index]);

  useEffect(() => {
    if (slides.length <= 1 || paused || intervalMs <= 0) return;
    const timer = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, intervalMs);
    return () => window.clearInterval(timer);
  }, [slides.length, paused, intervalMs]);

  if (slides.length === 0) {
    return null;
  }

  const current = slides[index];
  const desktopSrc = resolveDesktopSrc(current)!;
  const mobileSrc = resolveMobileSrc(current) ?? desktopSrc;
  const link = (current.link_url ?? '').trim();
  const bg = current.bg_color || undefined;
  const alt = current.title || 'ad';

  const blockContextMenu = !!(
    current.prevent_right_click ?? current.preventRightClick
  );

  const media = (
    <Div className="relative w-full h-full">
      <Img
        src={desktopSrc}
        alt={alt}
        className="hidden md:block absolute inset-0 w-full h-full object-cover"
        draggable={false}
        preventRightClick={blockContextMenu}
      />
      <Img
        src={mobileSrc}
        alt={alt}
        className="block md:hidden absolute inset-0 w-full h-full object-cover"
        draggable={false}
        preventRightClick={blockContextMenu}
      />
    </Div>
  );

  const handleInternalClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (link) navigate(link);
  };

  const slideBody = link ? (
    isExternalUrl(link) ? (
      <A
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        title={alt}
        className="absolute inset-0 block"
      >
        {media}
      </A>
    ) : (
      <Button
        type="button"
        onClick={handleInternalClick}
        title={alt}
        className="absolute inset-0 block w-full h-full p-0 m-0 bg-transparent border-0 cursor-pointer text-left"
        aria-label={alt}
      >
        {media}
      </Button>
    )
  ) : (
    <Div className="absolute inset-0">{media}</Div>
  );

  return (
    <Div
      id={id}
      className={`relative w-full overflow-hidden rounded-xl ${className}`.trim()}
      style={bg ? { backgroundColor: bg } : undefined}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(e) => {
        const start = touchStartX.current;
        touchStartX.current = null;
        if (start == null) return;
        const dx = (e.changedTouches[0]?.clientX ?? start) - start;
        if (Math.abs(dx) < 40) return;
        if (dx > 0) goPrev();
        else goNext();
      }}
      role="region"
      aria-roledescription="carousel"
      aria-label={alt}
      {...editorAttrs}
    >
      {/* aspect ~2/1 mobile, ~3/1 desktop */}
      <Div className="relative w-full aspect-[2/1] md:aspect-[3/1]">
        {slideBody}
      </Div>

      {slides.length > 1 && (
        <>
          <Button
            type="button"
            onClick={goPrev}
            aria-label="Previous"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-9 h-9 rounded-full bg-black/35 text-white hover:bg-black/50 border-0 cursor-pointer"
          >
            <ChevronLeft />
          </Button>
          <Button
            type="button"
            onClick={goNext}
            aria-label="Next"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-9 h-9 rounded-full bg-black/35 text-white hover:bg-black/50 border-0 cursor-pointer"
          >
            <ChevronRight />
          </Button>

          <Div className="absolute bottom-2 left-0 right-0 z-10 flex items-center justify-center gap-1.5">
            {slides.map((slide, i) => (
              <Button
                key={slide.id ?? i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Slide ${i + 1}`}
                aria-current={i === index ? 'true' : undefined}
                className={`p-0 m-0 border-0 cursor-pointer rounded-full transition-all ${
                  i === index
                    ? 'w-2.5 h-2.5 bg-white'
                    : 'w-2 h-2 bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </Div>
        </>
      )}
    </Div>
  );
};

export default AdHeroCarousel;
