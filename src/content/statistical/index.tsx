import { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Grid
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import statisticalApi, { AmountStatisticalResponse } from 'src/services/API/StatisticalApi';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

function StatisticalAmountView() {
  const [data, setData] = useState<AmountStatisticalResponse[]>([]);
  const [type, setType] = useState<number>(1);
  const [date, setDate] = useState(dayjs());

  const [fromDate, setFromDate] = useState<string>(dayjs().format('DD/MM/YYYY'));
  const [toDate, setToDate] = useState<string>(dayjs().format('DD/MM/YYYY'));

  useEffect(() => {
    fetchStatistical();
  }, [type, fromDate, toDate]);

  const fetchStatistical = async () => {
    try {
      const res = await statisticalApi.getAmountStatistical({
        type,
        from_date: fromDate,
        to_date: toDate,
        number_week: 0
      });
      setData(res.data);
    } catch (err) {
      toast.error('Không thể tải dữ liệu thống kê');
    }
  };

  const handleDateChange = (newDate: dayjs.Dayjs | null) => {
    if (!newDate) return;
    setDate(newDate);

    switch (type) {
      case 1: // Giờ trong ngày => chọn ngày
      case 2: // Ngày trong tuần => chọn ngày
      case 3: // Ngày trong tháng => chọn ngày
        const selectedDay = newDate.format('DD/MM/YYYY');
        setFromDate(selectedDay);
        setToDate(selectedDay);
        break;
      case 4: // Tháng trong năm => chọn tháng
        const startMonth = newDate.startOf('month').format('DD/MM/YYYY');
        const endMonth = newDate.endOf('month').format('DD/MM/YYYY');
        setFromDate(startMonth);
        setToDate(endMonth);
        break;
      default:
        break;
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Thống kê doanh thu
        </Typography>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Thống kê theo</InputLabel>
              <Select value={type} label="Thống kê theo" onChange={(e) => setType(Number(e.target.value))}>
                <MenuItem value={1}>Giờ trong ngày</MenuItem>
                {/* <MenuItem value={2}>Ngày trong tuần</MenuItem> */}
                <MenuItem value={3}>Ngày trong tháng</MenuItem>
                <MenuItem value={4}>Tháng trong năm</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={3}>
            {type === 4 ? (
              <DatePicker
                views={["year", "month"]}
                label="Chọn tháng"
                value={date}
                onChange={handleDateChange}
                format="MM/YYYY"
                slotProps={{ textField: { fullWidth: true } }}
              />
            ) : (
              <DatePicker
                label="Chọn ngày"
                format="DD/MM/YYYY"
                value={date}
                onChange={handleDateChange}
                slotProps={{ textField: { fullWidth: true } }}
              />
            )}
          </Grid>
        </Grid>

        <Box height={400}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value: any) => `${Number(value).toLocaleString('vi-VN')}₫`} />
              <Line type="monotone" dataKey="totalAmount" stroke="#1976d2" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Container>
    </LocalizationProvider>
  );
}

export default StatisticalAmountView;
