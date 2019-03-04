import styled from 'styled-components';

export interface StyledIconProps {
    w?: string | number;
    h?: string | number;
    bw?: string | number;
    bh?: string | number;
}

export const iconStyled = (
    url: string,
    width: string | number,
    height?: string | number,
    bgWidth?: string | number,
    bgHeight?: string | number,
) => {
    const getVal = (val: string | number | undefined) =>
        typeof val === 'string'
            ? val
            : typeof val === 'number'
            ? `${v(val)}`
            : void 0;
    width = getVal(width)!;
    height = getVal(height);
    bgWidth = getVal(bgWidth);
    bgHeight = getVal(bgHeight);
    const backgroundSize =
        bgWidth && bgHeight ? `${bgWidth} ${bgHeight}` : 'contain';
    return `background-image: url(${url});
        width: ${width};
        height: ${height || width};
        background-size: ${backgroundSize};
        background-repeat: no-repeat;
        background-position: center;
        display: block;
    `;
};

export const flexStyled = (
    justifyContent:
        | 'center'
        | 'space-between'
        | 'space-around'
        | 'flex-end'
        | 'flex-start' = 'flex-start',
) => {
    return `display: flex;
    align-items: center;
    justify-content: ${justifyContent};
    `;
};

export const fontStyled = (fontSize: string, color: string) => {
    return `font-size: ${fontSize};
    color: ${color};
    `;
};

export const TwoLineDiv = styled.div({
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
});

// export const v = (px: number) => (100 / 375) * px + 'vw';

export const v = (s: number) => `${s / 2}px`;
