import { default as React } from 'react';
export interface ImgProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    /** When true, block browser context menu and discourage drag/select. */
    preventRightClick?: boolean;
}
/**
 * 기본 이미지 컴포넌트
 */
export declare const Img: React.FC<ImgProps>;
