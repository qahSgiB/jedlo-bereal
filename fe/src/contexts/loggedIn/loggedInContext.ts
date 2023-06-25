import { createContext } from "react";

import { IdModel } from "shared/types";



const LoggedInContext = createContext<IdModel | undefined>(undefined);



export default LoggedInContext;