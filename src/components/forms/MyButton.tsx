import { Component } from 'react';
import styled from 'styled-components';
import { v } from '../../styles/styledMixins';
import { primaryColor } from '../../styles/styledColors';

interface Props {
    onClick: () => void;
    type?: 'primary' | 'default';
}

const MyButtonDiv = styled.a`
    text-align: center;
    display: block;
    width: 100%;
    height: 100%;
    text-decoration: none;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: ${v(32)};
    border-radius: 5%/50%;
    background-color: ${primaryColor};
`;

export class MyButton extends Component<Props> {
    render() {
        return (
            <MyButtonDiv
                className="my-button"
                href="javascript:;"
                onClick={this.props.onClick}
                style={{
                    backgroundColor: this.getBackgroundColor(),
                    color: '#fff',
                }}
            >
                {this.props.children}
            </MyButtonDiv>
        );
    }

    getBackgroundColor = () => {
        switch (this.props.type) {
            case 'default':
                return '#666';
        }
        return '#f15b01';
    };
}
