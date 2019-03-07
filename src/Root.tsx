import { Component, ChangeEvent, CSSProperties } from 'react';
import { akUtil, ak, akEnv } from 'apicloud-kit-2';
import { RootStyledDiv } from './styles/RootStyled';
import { InputComponent } from './components/forms/Input';
import { MyButton } from './components/forms/MyButton';
import { SelectComponent } from './components/forms/Select';
import update from 'immutability-helper';
import { v } from './styles/styledMixins';
import { keys } from '@dingdang/util';

type FormInputs = {
    clientEnv: akEnv.ClientEnv;
    serverEnv: akEnv.Env;
    isRemember: boolean;
};
interface State {
    formInputs: FormInputs;
    style: CSSProperties;
}

interface Props {
    isProd: boolean;
    navigateTo: any;
    projectConfig: akEnv.ProjectConfig;
    initialPage?: string;
}

export class Root extends Component<Props, State> {
    state: State = {
        formInputs: {
            clientEnv: 'development',
            serverEnv: 'development',
            isRemember: false,
        },
        style: {},
    };

    render() {
        const { projectConfig, isProd } = this.props;
        const { client, server } = projectConfig;
        const { serverEnv, clientEnv } = this.state.formInputs;

        const clientOptions = keys(client).map(value => ({
            key: value,
            value,
        }));

        const serverOptions = keys(server).map(value => ({
            value,
            key: value,
        }));

        return (
            // 生产环境不显示
            isProd || (
                <RootStyledDiv style={this.state.style}>
                    <h1>Env Config</h1>
                    <form className="container">
                        <h2>Client</h2>
                        <SelectComponent
                            name="clientEnv"
                            title="Select Client Entry"
                            options={clientOptions}
                            onChange={this.handleInput}
                            value={clientEnv}
                        />
                        <InputComponent
                            name="clientEntry"
                            title="Entry"
                            placeholder="client entry"
                            value={client[clientEnv]}
                            disabled
                        />
                        <h2>Server</h2>
                        <SelectComponent
                            name="serverEnv"
                            title="Select Server Env"
                            options={serverOptions}
                            value={serverEnv}
                            onChange={this.handleInput}
                        />
                        <InputComponent
                            name="businessUrl"
                            title="Business Url"
                            placeholder="client entry"
                            value={server[serverEnv].business.baseURL}
                            disabled
                        />
                        <InputComponent
                            name="authUrl"
                            title="Auth Url"
                            placeholder="client entry"
                            value={server[serverEnv].auth.baseURL}
                            disabled
                        />
                        <div className="remember">
                            <label htmlFor="is-remember">
                                <input
                                    name="isRemember"
                                    id="is-remember"
                                    type="checkbox"
                                    onChange={e =>
                                        this.handleInput(
                                            e.currentTarget.checked,
                                            e,
                                        )
                                    }
                                />
                                do not show again
                            </label>
                        </div>
                    </form>
                    <div className="btn">
                        <MyButton onClick={this.save}>Save & Start</MyButton>
                    </div>
                </RootStyledDiv>
            )
        );
    }

    save = async () => {
        const { clientEnv, serverEnv, isRemember } = this.state.formInputs;
        const envStore: akEnv.EnvStore = {
            client: clientEnv,
            server: serverEnv,
            isRemember,
        };
        await akEnv.setEnv(envStore);
        this.props.navigateTo(this.props.initialPage || 'Home')();
    };

    handleInput = (
        value: string | boolean,
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const key = e.currentTarget.name as keyof FormInputs;
        this.setState(
            update(this.state, {
                formInputs: {
                    [key]: {
                        $set: value,
                    },
                },
            }),
        );
    };

    windows: string[] = [];

    addListenerToWindowChange = () => {
        this.windows = ak.getWindows().map(el => el.name);
        // 监听 ak.windows
        setInterval(() => {
            const curWindows = ak.getWindows().map(el => el.name);
            const isEqual = curWindows.join('') === this.windows.join('');
            if (!isEqual) {
                const prev = this.windows[0];
                const cur = curWindows[0];
                ak.sendEvent('windowsChange', {
                    type: curWindows[1] === this.windows[0] ? 'hide' : 'show',
                    prev,
                    cur,
                });
                this.windows = curWindows;
            }
        }, 100);
    };

    componentDidMount() {
        akUtil.clientDidInit(async () => {
            const safeArea = ak.getSafeArea()!;

            this.setState({ style: { paddingTop: v(safeArea.top + 100) } });

            await ak.setPrefs({
                key: 'safeArea',
                value: safeArea,
            });

            this.addListenerToWindowChange();

            // env
            let envStore = await akEnv.getEnv();
            let formInputs: FormInputs;

            // 如果存在 env
            if (envStore) {
                const { client, server, isRemember } = envStore;
                if (isRemember) {
                    // 直接跳转;
                    return this.props.navigateTo('Home')();
                }
                formInputs = {
                    clientEnv: client,
                    serverEnv: server,
                    isRemember: false,
                };
            } else {
                // 默认测试环境
                formInputs = {
                    clientEnv: 'test',
                    serverEnv: 'test',
                    isRemember: false,
                };
            }

            // 显示设置;
            this.setState({ formInputs });
        });
    }
}
