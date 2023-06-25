import './Form.css'

import { FoodDiary } from '../../../../be/src/types/fooddiary'
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Food } from '../../../../be/src/types/food'
import client, { clientStatusError } from '../../axios/client';
import { useMutation } from '@tanstack/react-query';
import { ApiResponse } from 'shared/types';
import { postApi } from 'shared/api';
import { prepareUploadFileWithData } from '../../utils/prepareFormData';
import validateApiResponse from '../../utils/validateApiResponse';
import { processApiErrorSimple } from '../../utils/processApiError';
import useUser from '../../contexts/user/hooks/user';
import { useRecoilState } from 'recoil';
import { showDialogState } from '../../state/atoms';



type FormImput = {
  name: string,
  grams: number,
  dateEaten: Date,
  picture: FileList | undefined,
}



export default function FoodDiaryForm() {
  const user = useUser();

  const [showDialog, setShowDialog] = useRecoilState(showDialogState);

  const [, setData] = useState<FoodDiary[]>([]);
  const addFoodDiary = useForm<FormImput>();
  const [foodNames, setFoodNames] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await clientStatusError.get('/food');
        const foodNames = response.data.data.map((food: Food) => food.name);
        setFoodNames(foodNames);
        setData(response.data.data);
      } catch (error) {
        console.error('Error fetching food names: ', error);
      }
    }

    fetchData();
  }, []);

  // create post
  const postCreatePost = async (data: { picture: FileList }): Promise<undefined> => {
    const response = await client.post<ApiResponse<postApi.create.Result>>(
        '/post',
        prepareUploadFileWithData(data, 'picture', data.picture.item(0)),
        { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    validateApiResponse(response.data);
    return processApiErrorSimple(response.data);
  }

  const createPostMutation = useMutation({
    mutationFn: postCreatePost,
    useErrorBoundary: true,
  });

  const onSubmit: SubmitHandler<FormImput> = async (formData: FormImput) => {
    setShowDialog(false);
    try {
      await clientStatusError.post('/fooddiary', {
        name: formData.name,
        grams: formData.grams,
        dateEaten: formData.dateEaten,
      });
    } catch (error) {
      console.log(formData);
      console.error('Error creating new food: ', error);
    }

    if (formData.picture !== undefined && formData.picture.length > 0 && user.user !== null) {
      createPostMutation.mutate({
        picture: formData.picture
      })
    }
  }

  return (showDialog && (
    <div className='dialog-overlay-form'>
      <div className='dialog-content-form'>
        <form onSubmit={ addFoodDiary.handleSubmit(onSubmit) }>
          <div>
            <label htmlFor="name"> Food </label>
            <select id="name" {...addFoodDiary.register("name")} autoComplete="off" required>
                <option value="Select food" selected disabled hidden>--select--</option>
                {foodNames.map((foodName, index) => (
                  <option key={index} value={foodName}>{foodName}</option>
                ))}
            </select>
          </div>
          <div>
            <label htmlFor="grams"> Grams </label>
            <input id="grams" type="number" placeholder='g' {...addFoodDiary.register("grams", {valueAsNumber: true})} required/>
          </div>

          <div>
            <label htmlFor="dateEaten"> Date </label>
            <input id="dateEaten" type="date" {...addFoodDiary.register("dateEaten")} required/>
          </div>

          <div>
            <label htmlFor="image"> Image </label>
            <input id="image" type="file" accept="image/*" {...addFoodDiary.register("picture")}/>
          </div>

          <div>
            <p className='imageNote'>image will show in your friends' feed (optional)</p>
          </div>

          <div className='dialog_buttons-form'>
            <button type="submit"> Add </button>
          </div>
            
        </form>
      </div>
    </div>
    )
  )
    
}