import { useEffect, useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';

import { clientStatusError } from '../axios/client.ts';

import { Food } from '../../../be/src/types/food.ts' // [todo] shared

import './FoodList.css';
import useUser from '../contexts/user/hooks/user.ts';


function FoodList() {
  const userId = useUser().user?.id || null;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [query, setQuery] = useState('');

  // eee loading foods
  const [data, setData] = useState<Food[]>([]); // qqq

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await clientStatusError.get('/food');
        setData(response.data.data);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    }

    fetchData();
  }, [isDialogOpen]) // qqq useQuery

  // eee form
  const onSubmit: SubmitHandler<FieldValues> = async (formData) => {
    try {
      formData.userId = userId;
      await clientStatusError.post('/food', formData);
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
          onChange={ (event) => setQuery(event.target.value) }
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
        {data.filter((item: Food) => {
            if (query === '') {
              return item;
            } else if (
               (item.name.toLowerCase().includes(query.toLowerCase()) || ((item.description != null) && item.description.toLowerCase().includes(query.toLowerCase())))
            ) {
              return item;
            }
          }).map((item: Food) => (
          <li key={item.id}>
            <div>
              <h4> {item.name} </h4>
              <p> <b>kCal:</b> {item.kCal} | <b>fat:</b> {item.fat}g | <b>carbs:</b> {item.carbs}g | <b>protein:</b> {item.protein}g </p>
              <p>{ item.description }</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}



export default FoodList;