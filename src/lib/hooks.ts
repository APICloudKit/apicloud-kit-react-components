import { useEffect, useState } from 'react';

export const useClientInit = (cb: () => void) => {
    useEffect(() => {
        cb();
    }, []);
};

export const useTitle = (defaultTitle = '') => {
    const [title, setTitle] = useState(defaultTitle);
    useEffect(() => {
        document.title = title;
    }, [title]);
    return setTitle;
};
