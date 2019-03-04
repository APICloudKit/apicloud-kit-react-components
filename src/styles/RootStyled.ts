import styled from 'styled-components';
import { v } from './styledMixins';
import { primaryColor } from './styledColors';

export const RootStyledDiv = styled.div`
    padding: ${v(40)};
    h1,
    h2 {
        color: ${primaryColor};
    }
    select {
        appearance: none;
        border: 0;
        text-align: right;
        background-color: #fff;
    }
    .btn {
        margin-top: ${v(80)};
        height: ${v(66)};
    }
    .remember {
        margin-top: ${v(80)};
        input {
            margin-right: ${v(20)};
        }
    }
`;
