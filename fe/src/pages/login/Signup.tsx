import { Link, useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from '@tanstack/react-query';

import { z } from 'shared/zod';
import { ApiResponse, IdModel } from 'shared/types';
import { authApi } from 'shared/api';

import client from '../../axios/client';
import validateApiResponse from '../../utils/validateApiResponse';
import { processApiError } from '../../utils/processApiError';
import useSetUser from '../../contexts/user/hooks/setUser';

import './Login.css'



// const em1 = "Username must contain at least 1 character";
// const em2 = "Username is too long";
// const em3 = "Password must contain at least 4 characters";
// const em4 = "Password is too long";
// const em5 = "Email is too long";
// const em6 = "Email address is not valid"

// const InputsSchema = z.object({
//   name: z.string().min(1, em1).max(50, em2),
//   password: z.string().min(4, em3).max(50, em4),
//   password_repeat: z.string().min(4, em3).max(50, em4),
//   email: z.string().email(em6).max(50, em5),
// }).refine((data) => data.password === data.password_repeat, {
//     message: "Passwords do not match",
//     path: ["password_repeat"],
// });

// type Inputs = z.infer<typeof InputsSchema>;

const signupInputSchema = authApi.signup.schema.body.extend({
    passwordRepeat: z.string(),
}).refine(
    signupInput => signupInput.password === signupInput.passwordRepeat,
    {
        path: ['passwordRepeat'],
        message: 'Passwords do not match'
    }
);



type SignupInput = {
    username: string,
    password: string,
    passwordRepeat: string,
    email: string
}



const Signup = () => {
    const postSignup = async (signupInput: SignupInput): Promise<IdModel | undefined> => {
        const response = await client.post<ApiResponse<authApi.signup.Result>>('/auth/signup', {
            username: signupInput.username,
            password: signupInput.password,
            email: signupInput.email,
        });

        validateApiResponse(response.data);
        const data = response.data;

        return processApiError(data, signupForm.setError, {
            'signup-2': { field: 'username', message: 'username is already taken' }
        }, { 'username': 'username', 'password': 'password', 'email': 'email' });
    }

    const navigate = useNavigate();
    const setUser = useSetUser();

    const signupMutation = useMutation({
        mutationFn: postSignup,
        onSuccess: (signupSuccess) => {
            if (signupSuccess !== undefined) {
                setUser(signupSuccess);
                navigate('/profile');
            }
        }
    });

    if (signupMutation.isError) {
        throw signupMutation.error;
    }

    const signupForm = useForm<SignupInput>({ resolver: zodResolver(signupInputSchema) });
    const signupFormErrors = signupForm.formState.errors;

    const onSignup: SubmitHandler<SignupInput> = signupInput => {
        signupMutation.mutate(signupInput);
    };
    
    return (
        <div className="login-background">
            <form className="login-form" onSubmit={ signupForm.handleSubmit(onSignup) }>
                <h4 className='app-name app-name__text'>Welcome to</h4>
                <h3 className="app-name">CalorieS!</h3>
                <label className="label-flex">
                    <h6 className="form-text">Username:</h6>
                    <input className= "form-inputbox" type="text" {...signupForm.register("username")} />
                    { signupFormErrors.username && <span className="form-inputbox__errormessage">{ signupFormErrors.username.message }</span> }
                </label>
                <label className="label-flex">
                    <h6 className="form-text">Password:</h6>
                    <input className="form-inputbox" type="password" {...signupForm.register("password")}/>
                    { signupFormErrors.password && <span className="form-inputbox__errormessage">{ signupFormErrors.password.message }</span> }
                </label>
                <label className="label-flex">
                    <h6 className="form-text">Repeat password:</h6>
                    <input className="form-inputbox" type="password" {...signupForm.register("passwordRepeat")}/>
                    { signupFormErrors.passwordRepeat && <span className="form-inputbox__errormessage">{ signupFormErrors.passwordRepeat.message }</span> }
                </label>
                <label className="label-flex">  
                    <h6 className="form-text">Email:</h6>
                    <input className="form-inputbox" type="email" {...signupForm.register("email")}/>
                    { signupFormErrors.email && <span className="form-inputbox__errormessage">{ signupFormErrors.email.message }</span> }
                </label>
                <input className="form-logbutton" type="submit" value="Register!" disabled={ signupMutation.isLoading } />
                
                <div className="form-signup">
                    <span className="form-signup__text">Already have an account?</span>
                    <Link className="form-signup__link" to="/profile/login">Log in</Link>
                </div>
            </form>
        </div>
    )
}



export default Signup;