import styled from 'styled-components';
import { v, flexStyled, iconStyled, StyledIconProps } from '../styledMixins';
import { borderColor, primaryColor } from '../styledColors';

interface IconTabarProps extends StyledIconProps {
    index: number;
    isActive: boolean;
    icon: string;
    activeIcon: string;
}

export const IconTabbar = styled.i`
    ${(p: IconTabarProps) => {
        return p.isActive
            ? iconStyled(p.activeIcon, p.w || '', p.h)
            : iconStyled(p.icon, p.w || '', p.h);
    }}
`;

export const TabbarDiv = styled.div`
    width: 100%;
    font-size: ${v(22)};
    color: #000;
    ${flexStyled()}
    background-color: #fff;
    padding: ${v(20)} 0;
    border-top: ${v(1)} solid ${borderColor};
    z-index: 999;
    &.is-fixed-bottom {
        position: fixed;
        bottom: 0;
    }
    &.is-iphone-x {
        padding-bottom: ${v(60)};
    }
    .item {
        flex: 1;
        text-align: center;
        i {
            margin: 0 auto;
            margin-bottom: ${v(18)};
        }
        .text {
            &.is-active {
                color: ${primaryColor};
            }
        }
    }
`;
