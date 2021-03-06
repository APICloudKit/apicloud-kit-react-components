import { ak, Navigation, akUtil } from 'apicloud-kit-2';
import { Component, CSSProperties, ReactNode } from 'react';
import { NavbarComponent } from './components/Navbar';
import { TabbarComponent } from './components/Tabbar';
import { parseUrl } from '@dingdang/util';
import debounce from 'lodash/debounce';
import { v } from './styles/styledMixins';

interface State {
    title: string;
    isInit: boolean;
    navbarQuery: Navigation.INavbarFrameQuery | null;
    curFrameGroupIndex: number | null;
    tabbarStyle: CSSProperties;
    navbarStyle: CSSProperties;
    hasNavbar: boolean;
    hasTabbar: boolean;
}

interface Props {
    navigateBack: any;
    tabbarConfig: any;
    homeNavbarTypes: any;
    bgColor?: string;
    color?: string;
    navbarAddOn?: ReactNode;
    defaultNavbarStyle?: 'dark' | 'light';
}

export class Win extends Component<Props, State> {
    state: State = {
        title: '',
        isInit: false,
        navbarQuery: null,
        curFrameGroupIndex: null,
        tabbarStyle: {},
        navbarStyle: {},
        hasNavbar: true,
        hasTabbar: false,
    };

    render() {
        return (
            <div>
                {this.state.hasNavbar && (
                    <NavbarComponent
                        color={this.props.color}
                        bgColor={this.props.bgColor}
                        isInit={this.state.isInit}
                        query={this.state.navbarQuery}
                        curFrameGroupIndex={this.state.curFrameGroupIndex || 0}
                        onIndexChange={i =>
                            this.onIndexChange('OrderFrameGroup', i)
                        }
                        style={this.state.navbarStyle}
                        navigateBack={this.props.navigateBack}
                        addOn={this.props.navbarAddOn}
                    />
                )}
                {this.state.hasTabbar && (
                    <TabbarComponent
                        isFixedBottom
                        activeIndex={this.state.curFrameGroupIndex || 0}
                        onIndexChange={i =>
                            this.onIndexChange('HomeFrameGroup', i)
                        }
                        style={this.state.tabbarStyle}
                        config={this.props.tabbarConfig}
                    />
                )}
            </div>
        );
    }

    onIndexChange = (name: string, index: number) => {
        ak.setFrameGroupIndex({
            name,
            index,
        });
        this.setState({ curFrameGroupIndex: index });
    };

    componentDidMount() {
        akUtil.clientDidInit(() => {
            const paddingTop = v(ak.getSafeArea()!.top * 2);

            this.setState({ isInit: true, navbarStyle: { paddingTop } });

            const pageParam = ak.getPageParam<
                Navigation.WinPageParam<string>
            >();

            if (pageParam) {
                const {
                    frames,
                    name,
                    hasNavbar,
                    hasTabbar,
                    cannotClose,
                    isClickBackToLauncher,
                    statusBarStyle,
                } = pageParam;

                ak.setStatusBarStyle(
                    statusBarStyle || this.props.defaultNavbarStyle || 'dark',
                );

                // 设置网页的 title
                this.setState({
                    title: name,
                    hasNavbar,
                    hasTabbar,
                });

                if (ak.getSystemType() === 'android') {
                    if (isClickBackToLauncher) {
                        let keyBackFlag = false;
                        ak.on<any>('keyback', () => {
                            if (!keyBackFlag) {
                                ak.toast({
                                    msg: '再按一次退出',
                                    location: 'bottom',
                                });
                                keyBackFlag = true;
                                setTimeout(() => (keyBackFlag = false), 1000);
                            } else {
                                ak.toLauncher();
                            }
                        });
                    }
                    // 处理禁用返回的窗口
                    else if (cannotClose) {
                        ak.on('keyback', () => {});
                    }
                }

                if (frames) {
                    frames.forEach(f => {
                        if (!f.frameGroup) {
                            return ak.openFrame({
                                ...f,
                                url: f.url!,
                                // @todo 这里把 query 赋值给每一个 frame
                                query: pageParam.query,
                            });
                        }

                        type OnFrameGroupChangeParam = { index: number };

                        const onFrameGroupChange = ({
                            index,
                        }: OnFrameGroupChangeParam) =>
                            this.onFrameGroupChange({ index, f, pageParam });

                        ak.openFrameGroup(
                            {
                                ...f,
                                frames: f.frameGroup,
                            },

                            // 当 FrameGroup 改变 Index
                            // 由于始终会执行一次该回调，当使用 `setFrameGroupIndex` 时应避免它自动执行的
                            // iOS 不会默认执行一次
                            ak.getSystemType() === 'ios'
                                ? onFrameGroupChange
                                : debounce(onFrameGroupChange, 80, {
                                      leading: true,
                                      trailing: false,
                                  }),
                        );
                    });
                }

                const navbarQuery = parseUrl(
                    location.pathname + location.search,
                ).query as any;

                this.setState({ navbarQuery });

                if (pageParam.name === 'Home') {
                    this.setState({
                        tabbarStyle: {
                            paddingBottom: akUtil.getSafeAreaBottom(),
                        },
                    });
                }

                // 监听 navbar 更改
                ak.on<Navigation.NavbarQueryEvent>(
                    'navbarQueryEvent',
                    ({ pageName, query }) => {
                        const { navbarQuery } = this.state;
                        if (navbarQuery && pageName === navbarQuery.pageName) {
                            Object.assign(navbarQuery, query);
                            this.setState(s => ({ ...s, navbarQuery }));
                        }
                    },
                );
            }
        });
    }

    onFrameGroupChange = ({
        index,
        pageParam,
        f,
    }: {
        index: number;
        pageParam: any;
        f: any;
    }) => {
        this.setState({
            curFrameGroupIndex: index,
        });
        // 首页
        if (pageParam.name === 'Home') {
            this.setState({
                navbarQuery: this.props.homeNavbarTypes[index],
            });
            if (index > 0) {
                ak.sendEvent('refresh', {
                    ctxName: f.frameGroup![index].name,
                });
            }
        } else if (pageParam.name === 'Order') {
        }
    };
}
