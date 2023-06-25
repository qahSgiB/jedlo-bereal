import axios from "axios";

import getBeUrl from "../utils/getBeUrl";



const client = axios.create({
    baseURL: getBeUrl(),
    validateStatus: () => true,
    withCredentials: true,
});

export const clientStatusError = axios.create({
    baseURL: getBeUrl(),
    withCredentials: true,
});



export default client;