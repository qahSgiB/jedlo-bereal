import { Navigate, Outlet } from "react-router-dom";

import Auth from "./Auth";



const AuthLoggedOut = () => {
    return (
        <Auth loggedIn={ false } whileRefetching='loading' fallback={ <Navigate to={ '/profile' } /> }>
            <Outlet/>
        </Auth>
    );
}



export default AuthLoggedOut;