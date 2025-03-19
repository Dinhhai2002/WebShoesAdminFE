import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider/LocalizationProvider';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

export default function ChartMonth({ getDate }: any) {
  const [dateStart, setDateStart] = useState(new Date());

  useEffect(() => {
    getDate(dateStart);
  }, [dateStart]);

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={['DatePicker']}>
          <DatePicker
            label="Chọn tháng"
            // value={dateStart}
            onChange={(newValue: any) => setDateStart(newValue)}
            views={['year', 'month']}
            defaultValue={dayjs(new Date())}
          />
        </DemoContainer>
      </LocalizationProvider>
    </>
  );
}
