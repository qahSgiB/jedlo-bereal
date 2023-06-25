import { PieChart, Pie, Cell, ResponsiveContainer, Label, Legend } from 'recharts';
import './Graphs.css'
import client from '../../axios/client';
import { useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { endDateState, startDateState, 
    overallKcalState, overallFatState, overallCarbsState, overallProteinsState, overallGramsState, showDialogState,  } from '../../state/atoms';
import { FoodDiary } from '../../../../be/src/types/fooddiary';
import { useQuery } from '@tanstack/react-query';
import { userApi } from 'shared/api';
import { Goals, ApiResponse } from 'shared/types';
import { processApiErrorSimple } from '../../utils/processApiError';
import validateApiResponse from '../../utils/validateApiResponse';

interface TableData {
    name: string,
    grams: number,
    kcal?: number,
    fat?: number,
    carbs?: number,
    protein?: number,
}

const COLORS = ['var(--navigation)', 'var(--light-mint)'];

const getGoals = async (): Promise<Goals> => {      
  const response = await client.get<ApiResponse<userApi.getGoals.Result>>('/user/goals')
  validateApiResponse(response.data);
  return processApiErrorSimple(response.data);
};

export function KcalGraph() {
    const from: Date | null = useRecoilValue(startDateState);
    const to: Date | null = useRecoilValue(endDateState);

    const showDialog = useRecoilValue(showDialogState);

    const [overallKcal, setOverallKcal] = useRecoilState(overallKcalState);
    const [, setOverallFat] = useRecoilState(overallFatState);
    const [, setOverallCarbs] = useRecoilState(overallCarbsState);
    const [, setOverallProteins] = useRecoilState(overallProteinsState);
    const [, setOverallGrams] = useRecoilState(overallGramsState);

    const days = (from === null || to === null) ? 0 : Math.floor((Date.UTC(to.getFullYear(), to.getMonth(), to.getDate()) - Date.UTC(from.getFullYear(), from.getMonth(), from.getDate())) / (1000 * 60 * 60 * 24)) + 1;

    const goalsQuery = useQuery(['loggedIn', 'goals'], {
      queryFn: getGoals,
    });

    if (goalsQuery.isError) {
      throw goalsQuery.error;
    }

    const data = [
        { name: 'EATEN', value: overallKcal },  // overallKcal are the same as grams now for it to work
        { name: 'TO EAT', value: Math.max(0, (goalsQuery.data?.calories ?? 0) * days - overallKcal) },
    ];

    useEffect(() => {
        const fetchMacrosData = async () => {
            try {         
              const foodResponse = await client.get('/food');
              const foodData: TableData[] = foodResponse.data.data;

              const foodDiaryResponse = await client.get('/fooddiary');
              const foodDiaryData: FoodDiary[] = foodDiaryResponse.data.data;
          
              const enrichedFoodData = foodDiaryData.map((foodDiaryEntry) => {
                const matchingFood = foodData.find((food) => food.name === foodDiaryEntry.name);
                return { ...foodDiaryEntry, ...matchingFood };
              });
              const filteredFoodData = enrichedFoodData.filter((food) => {
                food.kcal = food.kcal !== undefined ? (food.grams * food.kcal / 100) : food.grams ;
                food.fat = food.fat !== undefined ? (food.grams * food.fat / 100) : food.grams ;
                food.carbs = food.carbs !== undefined ? (food.grams * food.carbs / 100) : food.grams ;
                food.protein = food.protein !== undefined ? (food.grams * food.protein / 100) : food.grams ;
                const dateEaten = new Date((food.dateEaten))
              
                return (
                  (from === null || from <= dateEaten) && (to === null || to >= dateEaten)
                );
              });

            let sumKcal = 0;
            let sumFat = 0;
            let sumCarbs = 0;
            let sumProteins = 0;
            let sumGrams = 0;

            filteredFoodData.forEach((food) => {
                sumFat += food.fat || 0;
                sumCarbs += food.carbs || 0;
                sumProteins += food.protein || 0;
                sumKcal += food.kcal || 0;
                sumGrams += food.grams;
            });

            setOverallKcal(Math.round(sumKcal * 100) / 100);
            setOverallFat(Math.round(sumFat * 100) / 100);
            setOverallCarbs(Math.round(sumCarbs * 100) / 100);
            setOverallProteins(Math.round(sumProteins * 100) / 100);
            setOverallGrams(Math.round(sumGrams * 100) / 100); 

            } catch (error) {
              console.error('Error fetching food data:', error);
            }
        };
        fetchMacrosData();
    }, [from, to, setOverallKcal, setOverallFat, setOverallCarbs, setOverallProteins, setOverallGrams, showDialog]);

    return (
      <div className='kcal-graph'>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={30}
              outerRadius={60}
              fill="#8884d8"
              paddingAngle={5}
              startAngle={135}
              endAngle={495}
              dataKey="value"
              label>

              {data.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
               <Label value="kCal" position="center" />
            </Pie>
            <Legend layout="vertical" verticalAlign="middle" align="right" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    )
}