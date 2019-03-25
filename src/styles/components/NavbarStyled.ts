import styled from 'styled-components';
import { flexStyled, v, iconStyled, StyledIconProps } from '../styledMixins';

interface NavbarProps {
    isTransparent: boolean;
    backgroundColor?: string;
    color?: string;
    bgColor?: string;
}

export const IconArrowLeftWhite = styled.i`
    ${(p: StyledIconProps) =>
        iconStyled(
            require('static/iconArrowLeftWhite.png'),
            p.w || '',
            p.h,
            p.bw,
            p.bh,
        )}
`;

export const NavbarFrameDiv = styled.div`
    background-color: ${(p: NavbarProps) => p.bgColor || '#fff'};
    box-sizing: border-box;
    &.is-fixed {
        padding-top: 0;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        background-color: transparent;
    }
    .status-bar {
        height: ${v(40)};
        width: 100%;
    }
    .container {
        ${flexStyled()}
        padding: 0 ${v(42)};
        line-height: ${v(93)};
        > div {
            flex: 1;
            text-align: center;
        }
        .center {
            font-size: ${v(36)};
            color: ${(p: NavbarProps) => p.color || '#000'};
            white-space: nowrap;
            opacity: ${(p: NavbarProps) => (p.isTransparent ? 0 : 1)}
        }
        .right {
            text-align: right;
            position: relative;
            a {
                text-decoration: none;
                font-size: ${v(28)};
                color: ${(p: NavbarProps) => p.color || '#000'};
            }
        }
    }
    &.has-theme {
        background: linear-gradient(to right, #ff8e3e, #ff373e);
        border: 0;
        .center {
            color: #fff;
        }
    }
`;
