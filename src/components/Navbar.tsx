import { CSSProperties, ReactNode } from 'react';
import { cl } from '@dingdang/util';
import {
    NavbarFrameDiv,
    IconArrowLeftWhite,
} from '../styles/components/NavbarStyled';
import { Link } from './Link';
import { ak, Navigation } from 'apicloud-kit-2';

interface Props {
    isInit?: boolean;
    curFrameGroupIndex?: number;
    query: Navigation.INavbarFrameQuery | null;
    onIndexChange?(index: number): void;
    style?: CSSProperties;
    navigateBack: any;
    color?: string;
    bgColor?: string;
    addOn?: ReactNode;
}

export function NavbarComponent(props: Props) {
    const { query, color, bgColor } = props;

    const rightClick = () => {};
    const onBack = () => {
        ak.sendEvent('navBack');
    };

    return (
        query && (
            <NavbarFrameDiv
                color={color}
                bgColor={bgColor}
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
                {props.addOn}
            </NavbarFrameDiv>
        )
    );
}
