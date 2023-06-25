import { useRef, useState } from 'react';
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { z } from "shared/zod";
import { userApi } from 'shared/api';
import { ApiResponse } from 'shared/types';

import client from '../../axios/client';
import validateApiResponse from '../../utils/validateApiResponse';
import { processApiErrorSimple } from '../../utils/processApiError.ts';

import LinkIcon from '../../components/LinkIcon';

import '../login/Login.css'
import './Goals.css'

const em = "Enter realistic value";

const goalsInputsSchema = z.object({
    calories: z.coerce.number().gte(0, em).lte(25000, em),
    carbs: z.coerce.number().gte(0, em).lte(10000, em),
    fats: z.coerce.number().gte(0, em).lte(10000, em),
    proteins: z.coerce.number().gte(0, em).lte(10000, em),
});

// generates type based on schema
type Goals = z.infer<typeof goalsInputsSchema>;

function Goals() {
    const [showSubmited, setShowSubmited] = useState(false);
    const hideSubmitedTime = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    //// post data
    const postSubmitData = async (submitData: Goals): Promise<undefined> => {
        const response = await client.post<ApiResponse<userApi.setGoals.Result>>('/user/goals', submitData);
        validateApiResponse(response.data);
        processApiErrorSimple(response.data);
    };
    
    const submitMutation = useMutation({
        mutationFn: postSubmitData,
        onSuccess: ( _, newData ) => {
            setShowSubmited(true);
            if (hideSubmitedTime.current !== undefined) {
                clearTimeout(hideSubmitedTime.current);
            }

            hideSubmitedTime.current = setTimeout(() => setShowSubmited(false), 2500);
            if (!goalsQuery.isSuccess) {
                queryClient.invalidateQueries(['loggedIn', 'goals']);
                return
            }

            queryClient.setQueryData(['loggedIn', 'goals'], ( oldData: Goals | undefined ) => {
                if (oldData === undefined) {
                    return undefined;
                } else {
                    return newData;
                }
            });
        }
    });

    // runs after the validation
    const funcOnSubmit: SubmitHandler<Goals> = (newData: Goals) => {
        submitMutation.mutate(newData);
    };
    

    //// get data
    const queryClient = useQueryClient();

    const getGoals = async (): Promise<Goals> => {      
        const response = await client.get<ApiResponse<userApi.getGoals.Result>>('/user/goals')
        validateApiResponse(response.data);
        return processApiErrorSimple(response.data);
    };

    const goalsQuery = useQuery(['loggedIn', 'goals'], {
        queryFn: getGoals,
    });

    if (goalsQuery.isError) {
        throw goalsQuery.error;
    }


    //// validation
    const { register, handleSubmit, formState: { errors } } = useForm<Goals>({
        resolver: zodResolver(goalsInputsSchema), 
        values: goalsQuery.data,
    });

    return (
        <div className='goals-background'>
            <LinkIcon className='back-icon' path_to_page='/profile/settings' path_to_image='/static/icons/go_back.svg'/>
            
            <form className="goals-form" onSubmit={handleSubmit(funcOnSubmit)}>
                <label className="label-flex">
                    <h6 className="form-text">Kcals:</h6>
                    <input className= "form-inputbox" type="number" {...register("calories")} />
                    {errors.calories && <span className="form-inputbox__errormessage">{errors.calories.message}</span>}
                </label>
                <label className="label-flex">
                    <h6 className="form-text">Carbs:</h6>
                    <input className="form-inputbox" type="number" {...register("carbs")}/>
                    {errors.carbs && <span className="form-inputbox__errormessage">{errors.carbs.message}</span>}
                </label>
                <label className="label-flex">
                    <h6 className="form-text">Fats:</h6>
                    <input className="form-inputbox" type="number" {...register("fats")}/>
                    {errors.fats && <span className="form-inputbox__errormessage">{errors.fats.message}</span>}
                </label>
                <label className="label-flex">
                    <h6 className="form-text">Proteins:</h6>
                    <input className="form-inputbox" type="number" {...register("proteins")}/>
                    {errors.proteins && <span className="form-inputbox__errormessage">{errors.proteins.message}</span>}
                </label>
                <input className="form-logbutton" type="submit" value="Submit" />
                {showSubmited && <span className='form-inputbox__errormessage'>Submitted!</span>}
            </form>
        </div>
    );
}

export default Goals;