import { Outlet } from "react-router-dom";

import Auth from "./Auth";
import LoggedInMessage from "./LoggedInMessage";



const AuthLoggedInMessage = () => {
    return (
        <Auth loggedIn={ true } whileRefetching='loading' fallback={ <LoggedInMessage /> }>
            <Outlet/>
        </Auth>
    );
}



export default AuthLoggedInMessage;