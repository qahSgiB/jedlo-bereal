import { useEffect, useRef, useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';

import { ApiResponse, FoodsPaginated } from 'shared/types';
import { foodpApi } from 'shared/api';

import client, { clientStatusError } from '../axios/client.ts';
import validateApiResponse from '../utils/validateApiResponse.ts';
import { processApiErrorSimple } from '../utils/processApiError.ts';
import useUser from '../contexts/user/hooks/user.ts';

import './FoodList.css';


const getFoods = async (filter: string, { pageParam }: { pageParam?: number }): Promise<FoodsPaginated> => {
  const response = await client.get<ApiResponse<foodpApi.getAll.Result>>('/foodp', {
    params: {
      filter: (filter === '') ? undefined : filter,
      cursor: (pageParam === undefined) ? undefined : pageParam,
      ...((pageParam === undefined) ? { take: 7 } : {}),
    }
  });
  validateApiResponse(response.data);
  return processApiErrorSimple(response.data);
}



function FoodList() {
  const userId = useUser().user?.id || null;
  
  const queryClient = useQueryClient();

  // debounced query
  const [query, setQuery] = useState('');

  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const onType = (value: string) => {
    if (debounceTimeout !== undefined) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      setQuery(value);
    }, 250)
  }
  
  // loading foods
  const [lastRef, lastInView] = useInView();

  const foodsQuery = useInfiniteQuery(['foods', query], {
    queryFn: async (pageParams) => await getFoods(query, pageParams),
    getNextPageParam: lastPage => (lastPage.nextCursor === null) ? undefined : lastPage.nextCursor,
  });

  if (foodsQuery.isError) {
    throw foodsQuery.error;
  }

  const fetchNextPage = foodsQuery.fetchNextPage;

  useEffect(() => {
    if (lastInView) {
      fetchNextPage();
    }
  }, [lastInView, fetchNextPage]);

  // eee form
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const onSubmit: SubmitHandler<FieldValues> = async (formData) => {
    try {
      formData.userId = userId;
      await clientStatusError.post('/food', formData);
      queryClient.invalidateQueries(['foods']); // [todo] manually add food
    } catch (error) {
      console.error('Error creating new food: ', error);
    }
    setIsDialogOpen(false);
    createFoodForm.reset();
  }

  const createFoodForm = useForm();

  const errors = createFoodForm.formState.errors;

  const openDialog = () => {
    setIsDialogOpen(true);
  }

  const closeDialog = () => {
    setIsDialogOpen(false);
  }

  return (
    <div className='container'>
      <div className="searchBar">
        <input
          className=""
          placeholder="&#x1F50E; Search food"
          onChange={ (event) => onType(event.target.value) }
        />
        <button onClick={ openDialog }> + </button>
        {isDialogOpen && (
          <div className='dialog-overlay'>
            <div className='dialog-content'>
              <form onSubmit={ createFoodForm.handleSubmit(onSubmit) }>
                <div>
                  <label htmlFor="name"> Name </label>
                  <input id="name" type="text" {...createFoodForm.register("name")} required/>
                  {errors.name && <span>This field is required</span>}
                </div>
                <div>
                  <label htmlFor="kcal"> Calories </label>
                  <input id="kcal" type="number" placeholder='kCal/100g' {...createFoodForm.register("kCal", {valueAsNumber: true})} required/>
                  {errors.kCal && <span>This field is required</span>}
                </div>

                <div>
                  <label htmlFor="carbs"> Carbs </label>
                  <input id="carbs" type="number" placeholder='g/100g' {...createFoodForm.register("carbs", {valueAsNumber: true})} required/>
                  {errors.carbs && <span>This field is required</span>}
                </div>

                <div>
                  <label htmlFor="fat"> Fat </label>
                  <input id="fat" type="number" placeholder='g/100g' {...createFoodForm.register("fat", {valueAsNumber: true})} required/>
                  {errors.fat && <span>This field is required</span>}
                </div>

                <div>
                  <label htmlFor="protein"> Protein </label>
                  <input id="protein" type="number" placeholder='g/100g' {...createFoodForm.register("protein", {valueAsNumber: true})} required/>
                  {errors.protein && <span>This field is required</span>}
                </div>
                <div>
                  <label htmlFor="description"> Description </label>
                  <input id="description" type="string" {...createFoodForm.register("description")} />
                  {errors.description && <span>This field is required</span>}
                </div>
                <div className='dialog_buttons'>
                  <button onClick={ closeDialog }> Close </button>
                  <button type="submit"> Add </button>
                </div>
              </form>
            </div> 
          </div>
        )}
      </div>
      <ul>
        { foodsQuery.data && foodsQuery.data.pages.map((foodsGroup, gi) => foodsGroup.foods.map((food, i) => (
          <li key={food.id}>
            <div ref={ (gi === (foodsQuery.data.pages.length - 1) && i === foodsGroup.foods.length - 1) ? lastRef : undefined }>
              <h4> {food.name} </h4>
              <p> <b>kCal:</b> {food.kCal} | <b>fat:</b> {food.fat}g | <b>carbs:</b> {food.carbs}g | <b>protein:</b> {food.protein}g </p>
              <p>{ food.description }</p>
            </div>
          </li>
        )))}
      </ul>
      {/* <button onClick={ () => foodsQuery.fetchNextPage() } disabled={ foodsQuery.isFetchingNextPage || !foodsQuery.hasNextPage }>
        { foodsQuery.isFetchingNextPage ? 'loading' : (foodsQuery.hasNextPage ? 'load more' : 'nothing more to load') }
      </button> */}
    </div>
  )
}



export default FoodList;