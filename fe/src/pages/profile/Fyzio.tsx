import '../login/Login.css'
import './ProfileEdit.css'

import LinkIcon from '../../components/LinkIcon';
import { useForm, SubmitHandler } from "react-hook-form";
import { useRef, useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import client from '../../axios/client';
import { ApiResponse } from 'shared/types';
import validateApiResponse from '../../utils/validateApiResponse';
import { processApiErrorSimple } from '../../utils/processApiError.ts';
import { userApi } from 'shared/api';

import { Fyzio as FyzioType } from 'shared/types';


function Fyzio() {
    const [showSubmited, setShowSubmited] = useState(false);
    const hideSubmitedTime = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    //// post data
    const postSubmitData = async (submitData: FyzioType): Promise<undefined> => {
        const response = await client.post<ApiResponse<userApi.setFyzio.Result>>('/user/fyzio', submitData);
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

            if (!fyzioQuery.isSuccess) {
                queryClient.invalidateQueries(['loggedIn', 'fyzio']);
                return
            }

            queryClient.setQueryData(['loggedIn', 'fyzio'], ( oldData: FyzioType | undefined ) => {
                if (oldData === undefined) {
                    return undefined;
                } else {
                    return newData;
                }

            });
        }
    });

    // runs after the validation
    const funcOnSubmit: SubmitHandler<FyzioType> = (newData: FyzioType) => {
        submitMutation.mutate(newData);
    };


    //// get data
    const queryClient = useQueryClient();

    const getFyzio = async (): Promise<FyzioType> => {      
        const response = await client.get<ApiResponse<userApi.getFyzio.Result>>('/user/fyzio')
        const apiResponse = response.data;
        validateApiResponse(apiResponse);
        return processApiErrorSimple(apiResponse);
    };

    const fyzioQuery = useQuery(['loggedIn', 'fyzio'], {
        queryFn: getFyzio,
    });

    if (fyzioQuery.isError) {
        throw fyzioQuery.error;
    }

    //// validation
    const { register, handleSubmit, formState: { errors } } = useForm<FyzioType>({
            resolver: zodResolver(userApi.setFyzio.schema.body), 
            values: fyzioQuery.data,
        });
    
    return (
        <div className='profile-edit-background'>
            <LinkIcon className='back-icon' path_to_page='/profile/settings' path_to_image='/static/icons/go_back.svg'/>
            
            <form className="profile-edit-form" onSubmit={handleSubmit(funcOnSubmit)}>
                <label className="label-flex">
                    <h6 className="form-text">Age:</h6>
                    <input className= "form-inputbox" type="number" {...register("age", {valueAsNumber: true})} />
                    {errors.age && <span className="form-inputbox__errormessage">{errors.age.message}</span>}
                </label>
                <label className="label-flex">
                    <h6 className="form-text">Weight:</h6>
                    <input className="form-inputbox" type="number" {...register("weight", {valueAsNumber: true})}/>
                    {errors.weight && <span className="form-inputbox__errormessage">{errors.weight.message}</span>}
                </label>
                <label className="label-flex">
                    <h6 className="form-text">Height:</h6>
                    <input className="form-inputbox" type="number" {...register("height", {valueAsNumber: true})}/>
                    {errors.height && <span className="form-inputbox__errormessage">{errors.height.message}</span>}
                </label>
                <input className="form-logbutton" type="submit" value="Submit" />
                {showSubmited && <span className='form-inputbox__errormessage'>Submitted!</span>}
            </form>
        </div>
    )
}

export default Fyzio;