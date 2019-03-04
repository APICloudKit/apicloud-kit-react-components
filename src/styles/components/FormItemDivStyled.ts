import styled from 'styled-components';
import { borderColor } from '../styledColors';
import { flexStyled, v } from '../styledMixins';

export const FormItemDiv = styled.div`
    padding: ${v(34)} 0;
    border-bottom: ${v(1)} solid ${borderColor};
    font-size: ${v(28)};
    color: #000;
    ${flexStyled('space-between')}
    &:last-child {
        border-bottom: 0;
    }
    .left {
        white-space: nowrap;
    }
    .right {
        width: 100%;
        text-align: right;
        input {
            text-align: right;
            font-size: ${v(28)};
            color: #000;
            outline: 0;
            border: 0;
            width: 100%;
            background-color: #fff;
        }
    }
`;
