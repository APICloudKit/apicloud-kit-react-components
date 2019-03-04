import { CSSProperties } from 'react';
import { cl } from '@dingdang/util';
import {
    NavbarFrameDiv,
    IconArrowLeftWhite,
} from '../styles/components/NavbarStyled';
import { Link } from './Link';
import { ak } from 'apicloud-kit-2';

export interface NavbarFrameQuery {
    type?: string;
    title?: string;
    pageName?: string;
    rightText?: string;
    height?: number;
    hasNoBack?: boolean;
    isTransparent?: boolean;
    icon?: 'message';
    isCustomizedBack?: boolean;
    [query: string]: string | number | boolean | undefined;
}

interface Props {
    isInit?: boolean;
    curFrameGroupIndex?: number;
    query: NavbarFrameQuery | null;
    onIndexChange?(index: number): void;
    style?: CSSProperties;
    navigateBack: any;
}

export function NavbarComponent(props: Props) {
    const { query } = props;

    const rightClick = () => {};
    const onBack = () => {
        ak.sendEvent('navBack');
    };

    return (
        query && (
            <NavbarFrameDiv
                isTransparent={!!query.isTransparent}
                className={cl({
                    'has-theme': false,
                })}
                style={props.style}
            >
                <div className="container">
                    <div
                        className="left"
                        style={{
                            visibility: query.hasNoBack ? 'hidden' : 'visible',
                        }}
                    >
                        <IconArrowLeftWhite
                            bw={17}
                            bh={31}
                            w={40}
                            h={40}
                            onClick={
                                query.isCustomizedBack
                                    ? onBack
                                    : props.navigateBack
                            }
                        />
                    </div>
                    <div className="center">{query.title || ''}</div>
                    <div className="right">
                        {query.rightText && (
                            <Link onClick={rightClick}>{query.rightText}</Link>
                        )}
                    </div>
                </div>
            </NavbarFrameDiv>
        )
    );
}
