import { PieChart, Pie, Cell, ResponsiveContainer, Label } from 'recharts';
import { overallFatState, overallCarbsState, overallProteinsState, endDateState, startDateState  } from '../../state/atoms';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useQuery } from '@tanstack/react-query';
import { userApi } from 'shared/api';
import { Goals, ApiResponse } from 'shared/types';
import client from '../../axios/client';
import { processApiErrorSimple } from '../../utils/processApiError';
import validateApiResponse from '../../utils/validateApiResponse';



const getGoals = async (): Promise<Goals> => {      
  const response = await client.get<ApiResponse<userApi.getGoals.Result>>('/user/goals')
  validateApiResponse(response.data);
  return processApiErrorSimple(response.data);
};


const COLORS = ['var(--navigation)', 'var(--light-mint)'];

export function MacroGraphs() {
    const [overallFat] = useRecoilState(overallFatState);
    const [overallCarbs] = useRecoilState(overallCarbsState);
    const [overallProteins] = useRecoilState(overallProteinsState);

    const from: Date | null = useRecoilValue(startDateState);
    const to: Date | null = useRecoilValue(endDateState);

    const days = (from === null || to === null) ? 0 : Math.floor((Date.UTC(to.getFullYear(), to.getMonth(), to.getDate()) - Date.UTC(from.getFullYear(), from.getMonth(), from.getDate())) / (1000 * 60 * 60 * 24)) + 1;

    const goalsQuery = useQuery(['loggedIn', 'goals'], {
      queryFn: getGoals,
    });

    if (goalsQuery.isError) {
      throw goalsQuery.error;
    }

    const dataCarbs = [
      { name: 'EATEN', value: overallCarbs },
      { name: 'TO EAT', value: Math.max(0, (goalsQuery.data?.carbs ?? 0) * days - overallCarbs) },
    ];
    const dataFats = [
        { name: 'EATEN', value: overallFat },
        { name: 'TO EAT', value: Math.max(0, (goalsQuery.data?.fats ?? 0) * days - overallFat) },
    ];
    const dataProteins = [
        { name: 'EATEN', value: overallProteins },
        { name: 'TO EAT', value: Math.max(0, (goalsQuery.data?.proteins ?? 0) * days - overallProteins) },
    ];

    return (
      <div className='graph'>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={dataCarbs}
              cx="20%"
              cy="50%"
              innerRadius={30}
              outerRadius={50}
              fill="#8884d8"
              paddingAngle={5}
              startAngle={135}
              endAngle={495}
              dataKey="value"
              label>
              {dataCarbs.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}

              <Label value="Carbs" position="center" />
            </Pie>

            <Pie
              data={dataFats}
              cx="50%"
              cy="50%"
              innerRadius={30}
              outerRadius={50}
              fill="#8884d8"
              paddingAngle={5}
              startAngle={135}
              endAngle={495}
              dataKey="value"
              label>

              {dataFats.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}

              <Label value="Fat" position="center" />
            </Pie>

            <Pie
              data={dataProteins}
              cx="80%"
              cy="50%"
              innerRadius={30}
              outerRadius={50}
              fill="#8884d8"
              paddingAngle={5}
              startAngle={135}
              endAngle={495}
              dataKey="value"
              label>
              {dataProteins.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}

              <Label value="Proteins" position="center" />

            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    ); 
}