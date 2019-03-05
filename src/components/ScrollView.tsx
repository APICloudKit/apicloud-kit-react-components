import * as React from 'react';
import { v } from '../styles/styledMixins';

interface Props {
    height?: number;
    onScroll?: (scrollTop: number) => void;
    onBottom?: () => void;
    isAutoCalcHeight?: boolean;
    style?: React.CSSProperties;
    hasPaddingTop?: boolean;
}

interface State {
    height: string;
    scrollTop: number;
}

export const ScrollTopContext = React.createContext(0);

export class ScrollViewComponent extends React.Component<Props, State> {
    state = {
        height: 'auto',
        scrollTop: 0,
    };

    ref = React.createRef<HTMLDivElement>();

    render() {
        return (
            <div
                className="scroll-view"
                style={{
                    height: this.state.height,
                    WebkitOverflowScrolling: 'touch',
                    position: 'relative',
                    boxSizing: 'border-box',
                    paddingTop: this.props.hasPaddingTop ? v(152) : 0,
                    ...this.props.style,
                }}
                ref={this.ref}
            >
                <ScrollTopContext.Provider value={this.state.scrollTop}>
                    {this.props.children}
                </ScrollTopContext.Provider>
            </div>
        );
    }

    getHeight = () => {
        if (this.props.isAutoCalcHeight) {
            return this.getAutoHeight() + 'px';
        }
        return this.props.height ? this.props.height + 'px' : '100vh';
    };

    getAutoHeight = () => {
        const el = this.ref.current!;
        const prevEl = el.previousElementSibling!;
        const prevElBottom = prevEl.getBoundingClientRect().bottom;
        const windowHeight = document.documentElement!.clientHeight;
        return windowHeight - prevElBottom;
    };

    /**
     * @todo
     * use _.debounce
     */
    onScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const el = e.currentTarget;
        const { scrollTop } = el;
        const { props } = this;
        const height = el.scrollHeight;
        const containerHeight = document.documentElement!.clientHeight!;
        const distance = height - scrollTop;
        const isTrigger = distance - containerHeight < 20;
        if (props.onScroll) {
            props.onScroll(scrollTop);
            this.setState({ scrollTop });
        }
        if (isTrigger && props.onBottom) {
            props.onBottom();
        }
    };

    componentDidMount() {
        // this.ref.current!.addEventListener('scroll', this.onScroll);
        // this.setState({ height: this.getHeight() });
        window.onscroll = () => {
            const { props } = this;
            const { scrollY } = window;
            const height = this.ref.current!.scrollHeight;
            const containerHeight = document.documentElement!.clientHeight!;
            const distance = height - scrollY;
            const isTrigger = distance - containerHeight < 20;
            if (props.onScroll) {
                props.onScroll(scrollY);
                this.setState({ scrollTop: scrollY });
            }
            if (isTrigger && props.onBottom) {
                props.onBottom();
            }
        };
    }

    componentWillUnmount() {
        // this.ref.current!.removeEventListener('scroll', this.onScroll);
        window.onscroll = null;
    }
}
