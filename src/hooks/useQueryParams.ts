import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export const useQueryParams = (initialState = {}) => {
    const router = useRouter();
    const [queryParams, setState] = useState(initialState);

    useEffect(() => {
        setState(router.query);
    }, [router.query]);

    const setQueryParams = (query = {}) => {
        router.push({ pathname: router.pathname, query }, undefined, {
            shallow: true,
        });
    };

    return { queryParams, setQueryParams };
};
