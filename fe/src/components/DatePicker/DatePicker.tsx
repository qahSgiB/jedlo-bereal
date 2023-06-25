import './DatePicker.css'
import { startDateState, endDateState } from '../../state/atoms'
import { useRecoilState } from 'recoil';

export default function DatePicker() {
    const [, setStartDate] = useRecoilState(startDateState);
    const [, setEndDate] = useRecoilState(endDateState);

    const handleStartDateChange = (event: { target: { value: string; }; }) => {
        const { value } = event.target;
        setStartDate(new Date(Date.parse(value)));

    };

    const handleEndDateChange = (event: { target: { value: string; }; }) => {
        const { value } = event.target;
        setEndDate(new Date(Date.parse(value)));
    };

    return (
      <div className='datePicker'>
          <div className='date-picker-item'>
            <input type="date" id="from"
            onChange={handleStartDateChange}
            />
          </div>
          <div className='date-picker-item'>
            <input type='date' id="to" 
            onChange={handleEndDateChange}
            />
          </div>
      </div>
    );
  }
  