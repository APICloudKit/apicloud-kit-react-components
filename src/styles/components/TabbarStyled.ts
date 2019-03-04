import styled from 'styled-components';
import { v, flexStyled, iconStyled, StyledIconProps } from '../styledMixins';
import { borderColor, primaryColor } from '../styledColors';

interface IconTabarProps extends StyledIconProps {
    index: number;
    isActive: boolean;
}

export const IconTabbar = styled.i`
    ${(p: IconTabarProps) => {
        switch (p.index) {
            case 1:
                return p.isActive
                    ? iconStyled(require('static/13@2x.png'), p.w || '', p.h)
                    : iconStyled(require('static/12@2x.png'), p.w || '', p.h);
            case 2:
                return p.isActive
                    ? iconStyled(require('static/10@2x.png'), p.w || '', p.h)
                    : iconStyled(require('static/11@2x.png'), p.w || '', p.h);
            case 3:
                return p.isActive
                    ? iconStyled(require('static/8@2x.png'), p.w || '', p.h)
                    : iconStyled(require('static/9@2x.png'), p.w || '', p.h);
        }
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
