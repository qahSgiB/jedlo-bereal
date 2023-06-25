import React from "react";

import useUser from "../../contexts/user/hooks/user";

import Loading from "../loading/Loading";



type AuthProps = {
    children?: React.ReactNode,
    fallback?: React.ReactNode,
    loggedIn?: boolean,
    whileRefetching?: 'none' | 'loading' | 'children',
}



const Auth = (props: AuthProps) => {
    const user = useUser();

    const loggedIn = props.loggedIn ?? true;
    const loggedInOk = loggedIn === (user.user !== null);

    if (loggedInOk) {
        return props.children;
    }

    if (props.whileRefetching === undefined || props.whileRefetching === 'none') {
        return props.fallback;
    } else if (props.whileRefetching === 'loading') {
        return user.refetching ? <Loading /> : props.fallback;
    } else {
        return user.refetching ? props.children : props.fallback;
    }
}



export default Auth;