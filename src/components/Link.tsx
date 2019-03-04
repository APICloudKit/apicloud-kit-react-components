import { Component } from 'react';

interface Props {
    onClick(e?: any): void;
}

export class Link extends Component<Props> {
    render() {
        return (
            <a href="javascript:;" onClick={e => this.props.onClick(e)}>
                {this.props.children}
            </a>
        );
    }
}
