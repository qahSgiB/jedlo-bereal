import '../login/Login.css'
import './ProfileEdit.css'

import LinkIcon from '../../components/LinkIcon';
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import client from '../../axios/client';
import { ApiResponse } from 'shared/types';
import validateApiResponse from '../../utils/validateApiResponse';
import { processApiErrorSimple } from '../../utils/processApiError.ts';
import { userApi } from 'shared/api';

import { Social } from 'shared/types';
import { prepareUploadFileWithData } from '../../utils/prepareFormData.ts';
import { useMemo, useRef, useState } from 'react';



type SocialInput = Omit<Social, 'picture'> & {
    picture: FileList | undefined
}

type SocialPicture = {
    picture: string | null | undefined,
}


// const socialInputSchema = userApi.setSocial.schema.body.innerType().shape.



function ProfileEdit() {
    const [showSubmited, setShowSubmited] = useState(false);
    const hideSubmitedTime = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    //// post data
    const postSubmitData = async (submitData: SocialInput): Promise<SocialPicture> => {
        const response = await client.post<ApiResponse<userApi.setSocial.Result>>(
            '/user/social',
            prepareUploadFileWithData(submitData, 'picture', submitData.picture?.item(0)),
            { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        validateApiResponse(response.data);
        return processApiErrorSimple(response.data);
    };
    
    const submitMutation = useMutation({
        mutationFn: postSubmitData,
        onSuccess: ({ picture: newPicture }, newData ) => {  
            setShowSubmited(true);
            if (hideSubmitedTime.current !== undefined) {
                clearTimeout(hideSubmitedTime.current);
            }
            hideSubmitedTime.current = setTimeout(() => setShowSubmited(false), 2500);
  
            if (!socialQuery.isSuccess) {
                queryClient.invalidateQueries(['loggedIn', 'social']);
                return;
            }

            queryClient.setQueryData(['loggedIn', 'social'], (oldData: Social | undefined) => {
                if (oldData === undefined) {
                    return undefined;
                } else {
                    return {
                        bio: newData.bio,
                        email: newData.email,
                        picture: (newPicture === undefined ? oldData.picture : newPicture),
                    };
                }
            });
        },
        useErrorBoundary: true,
    });

    const funcOnSubmit: SubmitHandler<SocialInput> = (newData: SocialInput) => {
        submitMutation.mutate(newData);
    };

    //// get data
    const queryClient = useQueryClient();

    const getSocial = async (): Promise<Social> => {      
        const response = await client.get<ApiResponse<userApi.getSocial.Result>>('/user/social')
        const apiResponse = response.data;
        validateApiResponse(apiResponse);
        return {
            ...processApiErrorSimple(apiResponse),
        }
    };

    const socialQuery = useQuery(['loggedIn', 'social'], {
        queryFn: getSocial,
    });

    if (socialQuery.isError) {
        throw socialQuery.error;
    }

    const formValues = useMemo(() => (socialQuery.data === undefined ? undefined :{
        bio: socialQuery.data?.bio,
        email: socialQuery.data?.email,
        picture: undefined,
    }), [socialQuery.data]);

    //// form
    const { register, handleSubmit, formState: { errors } } = useForm<SocialInput>({
        resolver: zodResolver(userApi.setSocial.schema.body), 
        values: formValues,
    });
    
    return (
        <div className='profile-edit-background'>
            <LinkIcon className='back-icon' path_to_page='/profile/settings' path_to_image='/static/icons/go_back.svg'/>
            
            <form className="profile-edit-form" onSubmit={handleSubmit(funcOnSubmit)}>
                <label className="label-flex">  
                    <h6 className="form-text">Email:</h6>
                    <input className="form-inputbox" type="email" {...register("email")}/>
                    {errors.email && <span className="form-inputbox__errormessage">{errors.email.message}</span>}
                </label>
                <label className="label-flex">  
                    <h6 className="form-text">Bio:</h6>
                    <textarea className="form-inputbox profile-edit-textarea" {...register("bio")}/>
                    {errors.bio && <span className="form-inputbox__errormessage">{errors.bio.message}</span>}
                </label>
                <label className="file-input-label">
                    <h6 className="form-text">Profile picture:</h6>
                    <input className="profile-edit-fileinput" type="file" accept="image/*" {...register("picture")}/>
                    {errors.picture && <span className="form-inputbox__errormessage">{errors.picture.message}</span>}
                </label>
                <input className="form-logbutton" type="submit" value="Submit" />
                {showSubmited && <span className='form-inputbox__errormessage'>Submitted!</span>}
            </form>
        </div>
    )
}

export default ProfileEdit;