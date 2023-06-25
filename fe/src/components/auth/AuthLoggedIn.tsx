import { Navigate, Outlet } from "react-router-dom";

import Auth from "./Auth";
import LoggedInContextProvider from "../../contexts/loggedIn/LoggedInContextProvider";



const AuthLoggedIn = () => {
    return (
        <Auth loggedIn={ true } whileRefetching='loading' fallback={ <Navigate to={ '/profile/login' } /> }>
            <LoggedInContextProvider>
                <Outlet />
            </LoggedInContextProvider>
        </Auth>
    );
}



export default AuthLoggedIn;