import React from 'react';

export interface ImgProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /** When true, block browser context menu and discourage drag/select. */
  preventRightClick?: boolean;
}

/**
 * 기본 이미지 컴포넌트
 */
export const Img: React.FC<ImgProps> = ({
  className = '',
  alt = '',
  preventRightClick = false,
  onContextMenu,
  draggable,
  style,
  ...props
}) => {
  return (
    <img
      className={`${className}${preventRightClick ? ' select-none' : ''}`.trim()}
      alt={alt}
      draggable={preventRightClick ? false : draggable}
      style={
        preventRightClick
          ? ({
              ...(style ?? {}),
              userSelect: 'none',
              WebkitUserSelect: 'none',
              WebkitUserDrag: 'none',
            } as React.CSSProperties)
          : style
      }
      onContextMenu={
        preventRightClick
          ? (e) => {
              e.preventDefault();
              onContextMenu?.(e);
            }
          : onContextMenu
      }
      {...props}
    />
  );
};
