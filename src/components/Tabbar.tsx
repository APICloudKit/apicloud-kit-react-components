import { cl } from '@dingdang/util';
import { TabbarDiv, IconTabbar } from '../styles/components/TabbarStyled';

interface Props {
    activeIndex: number;
    onIndexChange(index: number): void;
    style: React.CSSProperties;
    isFixedBottom?: boolean;
    config: any[];
    // @todo icon tabbar
}

export function TabbarComponent(props: Props) {
    const onChange = (index: number) => props.onIndexChange(index);

    return (
        <TabbarDiv
            className={cl('tabbar', {
                'is-fixed-bottom': props.isFixedBottom,
            })}
            style={props.style}
        >
            {props.config.map((el, index) => (
                <div
                    className="item"
                    key={el.path}
                    onClick={_ => onChange(index)}
                >
                    <IconTabbar
                        w={45}
                        icon={el.icon}
                        activeIcon={el.activeIcon}
                        index={index + 1}
                        isActive={props.activeIndex === index}
                    />
                    <div
                        className={cl('text', {
                            'is-active': props.activeIndex === index,
                        })}
                    >
                        {el.text || ''}
                    </div>
                </div>
            ))}
        </TabbarDiv>
    );
}
