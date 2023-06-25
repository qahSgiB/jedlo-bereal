import { Link, useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from '@tanstack/react-query';

import { ApiResponse, IdModel } from 'shared/types';
import { authApi } from 'shared/api';

import client from '../../axios/client';
import validateApiResponse from '../../utils/validateApiResponse';
import { processApiError } from '../../utils/processApiError';
import useSetUser from '../../contexts/user/hooks/setUser';

import './Login.css'



type LoginInput = {
    username: string,
    password: string
}



const Login = () => {
    const postLogin = async (loginData: LoginInput): Promise<IdModel | undefined> => {
        const response = await client.post<ApiResponse<authApi.login.Result>>('/auth/login', loginData);

        validateApiResponse(response.data);
        const apiResponse = response.data;
    
        return processApiError(apiResponse, loginForm.setError, {
            'login-2': { field: 'username', message: 'username not found' },
            'login-3': { field: 'password', message: 'wrong password' },
        }, { 'username': 'username', 'password': 'password' });        
    }

    const navigate = useNavigate();
    const setUser = useSetUser();

    const loginMutation = useMutation({
        mutationFn: postLogin,
        onSuccess: (loginResult) => {
            if (loginResult !== undefined) {
                setUser(loginResult);
                navigate('/profile');
            }
        }
    });

    if (loginMutation.isError) {
        throw loginMutation.error;
    }

    const loginForm =  useForm<LoginInput>({ resolver: zodResolver(authApi.login.schema.body) });
    const loginFormErrors = loginForm.formState.errors;
    
    const onLogin: SubmitHandler<LoginInput> = loginInput => {
        loginMutation.mutate(loginInput);
    };

    return (
        <div className="login-background">
        <form className="login-form" onSubmit={ loginForm.handleSubmit(onLogin) }>
            <h2 className="app-name">CalorieS</h2>
            <label className="label-flex">
                <h6 className="form-text">Username:</h6>
                <input className= "form-inputbox" type="text" {...loginForm.register("username")} />
                { loginFormErrors.username && <span className="form-inputbox__errormessage">{ loginFormErrors.username.message }</span> }
            </label>
            <label className="label-flex">
                <h6 className="form-text">Password:</h6>
                <input className="form-inputbox" type="password" {...loginForm.register("password")} />
                { loginFormErrors.password && <span className="form-inputbox__errormessage">{ loginFormErrors.password.message }</span> }
            </label>
            <input className="form-logbutton" type="submit" value="Log in" disabled={ loginMutation.isLoading } />
            
            <div className="form-signup">
                <span className="form-signup__text">New to calories?</span>
                <Link className="form-signup__link" to="/profile/signup">Sign up!</Link>
            </div>
        </form>
        </div>
    )
}



export default Login;