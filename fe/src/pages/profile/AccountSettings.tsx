import '../login/Login.css'
import './AccountSettings.css'
import LinkIcon from '../../components/LinkIcon';

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from 'shared/zod';

const em1 = "Username must contain at least 1 character";
const em2 = "Username is too long";
const em3 = "Password must contain at least 4 characters";
const em4 = "Password is too long";

const InputsSchema = z.object({
    name: z.union([z.string().min(1, em1).max(50, em2), z.string().length(0)]),
    password: z.union([z.string().min(4, em3).max(50, em4), z.string().length(0)]),
    password_repeat: z.union([z.string().min(4, em3).max(50, em4), z.string().length(0)]),
}).refine((data) => data.password === data.password_repeat, {
    message: "Passwords do not match",
    path: ["password_repeat"],
});

// generates type based on schema
type Inputs = z.infer<typeof InputsSchema>;


function AccountSettings() {
    const { register, handleSubmit, formState: { errors } } = 
        useForm<Inputs>({resolver: zodResolver(InputsSchema)});
    
    // runs after the validation
    const funcOnSubmit: SubmitHandler<Inputs> = data => console.log(data);
    // console.log(watch("name")) // watch input value by passing the name of it
    
    return (
        <div className="account-settings-background">
            <LinkIcon className='back-icon' path_to_page='/profile/settings' path_to_image='/static/icons/go_back.svg'/>
            <form className="account-settings-form" onSubmit={handleSubmit(funcOnSubmit)}>
                <label className="label-flex">
                    <h6 className="form-text">New username:</h6>
                    <input className= "form-inputbox" type="text" placeholder="Sam Anderson" {...register("name")} />
                    {errors.name && <span className="form-inputbox__errormessage">{errors.name.message}</span>}
                </label>
                <label className="label-flex">
                    <h6 className="form-text">New password:</h6>
                    <input className="form-inputbox" type="password" {...register("password")}/>
                    {errors.password && <span className="form-inputbox__errormessage">{errors.password.message}</span>}
                </label>
                <label className="label-flex">
                    <h6 className="form-text">Repeat new password:</h6>
                    <input className="form-inputbox" type="password" {...register("password_repeat")}/>
                    {errors.password_repeat && <span className="form-inputbox__errormessage">{errors.password_repeat.message}</span>}
                </label>
                <input className="form-logbutton" type="submit" value="Submit changes" />
            </form>
        </div>
    )
}

export default AccountSettings;
