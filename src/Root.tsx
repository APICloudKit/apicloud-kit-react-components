import { useState, CSSProperties, ChangeEvent, useRef } from 'react';
import { akEnv, ak } from 'apicloud-kit-2';
import { RootStyledDiv } from './styles/RootStyled';
import { keys } from '@dingdang/util';
import { SelectComponent } from './components/forms/Select';
import { InputComponent } from './components/forms/Input';
import { MyButton } from './components/forms/MyButton';
import { useClientInit } from './lib/hooks';
import update from 'immutability-helper';
import { v } from './styles/styledMixins';

type FormInputs = {
    clientEnv: akEnv.ClientEnv;
    serverEnv: akEnv.Env;
    isRemember: boolean;
};

interface Props {
    isProd: boolean;
    projectConfig: akEnv.ProjectConfig;
    navigateTo: any;
}

export function Root({ isProd, projectConfig, navigateTo }: Props) {
    const [formInputs, setFormInputs] = useState<FormInputs>({
        clientEnv: 'development',
        serverEnv: 'development',
        isRemember: false,
    });
    const [style, setStyle] = useState<CSSProperties>({});
    const onSave = async () => {
        const { clientEnv, serverEnv, isRemember } = formInputs;
        const envStore: akEnv.EnvStore = {
            client: clientEnv,
            server: serverEnv,
            isRemember,
        };
        await akEnv.setEnv(envStore);
        navigateTo('Home')();
    };

    const handleInput = (
        value: string | boolean,
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const key = e.currentTarget.name as keyof FormInputs;
        setFormInputs(update(formInputs, { [key]: { $set: value } }));
    };

    const addListenerToWindowChange = () => {
        windowsRef.current = ak.getWindows().map(el => el.name);
        // 监听 ak.windows
        setInterval(() => {
            const curWindows = ak.getWindows().map(el => el.name);
            let windows = windowsRef.current;
            const isEqual = curWindows.join('') === windows.join('');
            if (!isEqual) {
                const prev = windows[0];
                const cur = curWindows[0];
                ak.sendEvent('windowsChange', {
                    type: curWindows[1] === windows[0] ? 'hide' : 'show',
                    prev,
                    cur,
                });
                windows = curWindows;
            }
        }, 100);
    };

    const windowsRef = useRef<string[]>([]);

    useClientInit(async () => {
        const safeArea = ak.getSafeArea()!;

        setStyle({ paddingTop: v(safeArea.top + 100) });

        await ak.setPrefs({
            key: 'safeArea',
            value: safeArea,
        });

        addListenerToWindowChange();

        // env
        let envStore = await akEnv.getEnv();
        let formInputs: FormInputs;

        // 如果存在 env
        if (envStore) {
            const { client, server, isRemember } = envStore;
            if (isRemember) {
                // 直接跳转;
                return navigateTo('Home')();
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
        setFormInputs(formInputs);
    });

    const { client, server } = projectConfig;
    const { serverEnv, clientEnv } = formInputs;

    const clientOptions = keys(client).map(value => ({
        key: value,
        value,
    }));

    const serverOptions = keys(server).map(value => ({
        value,
        key: value,
    }));

    const openScanner = () => {};

    return (
        // 生产环境不显示
        isProd ? null : (
            <RootStyledDiv style={style}>
                <h1>Env Config</h1>
                <form className="container">
                    <h2>Client</h2>
                    <SelectComponent
                        name="clientEnv"
                        title="Select Client Entry"
                        options={clientOptions}
                        onChange={handleInput}
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
                        onChange={handleInput}
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
                                    handleInput(e.currentTarget.checked, e)
                                }
                            />
                            do not show again
                        </label>
                    </div>
                </form>
                <div className="btn">
                    <MyButton onClick={onSave}>Save & Start</MyButton>
                </div>
                <div className="btn">
                    <MyButton onClick={openScanner}>Scan</MyButton>
                </div>
            </RootStyledDiv>
        )
    );
}
