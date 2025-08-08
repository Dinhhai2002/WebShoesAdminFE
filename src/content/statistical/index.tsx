import { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Grid,
  Card,
  CardContent,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import statisticalApi, { AmountStatisticalResponse } from 'src/services/API/StatisticalApi';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

const typeLabels = {
  1: 'Giờ trong ngày',
  3: 'Ngày trong tháng',
  4: 'Tháng trong năm'
};

const periodLabels = {
  1: 'Giờ',
  3: 'Ngày',
  4: 'Tháng'
};

function StatisticalAmountView() {
  const [data, setData] = useState<AmountStatisticalResponse[]>([]);
  const [type, setType] = useState<number>(1);
  const [date, setDate] = useState(dayjs());
  const [loading, setLoading] = useState(false);
  const [totalAmount, setTotalAmount] = useState<number>(0);

  const [fromDate, setFromDate] = useState<string>(dayjs().format('DD/MM/YYYY'));
  const [toDate, setToDate] = useState<string>(dayjs().format('DD/MM/YYYY'));

  useEffect(() => {
    fetchStatistical();
  }, [type, fromDate, toDate]);

  const fetchStatistical = async () => {
    try {
      setLoading(true);
      const res = await statisticalApi.getAmountStatistical({
        type,
        from_date: fromDate,
        to_date: toDate,
        number_week: 0
      });
      setData(res.data);
      // Lấy totalAmountAll từ bất kỳ record nào vì chúng giống nhau
      // Nếu null hoặc không hợp lệ thì set về 0
      setTotalAmount(res.data[0]?.totalAmountAll || 0);
    } catch (err) {
      toast.error('Không thể tải dữ liệu thống kê');
      setTotalAmount(0);
      setData([]);
    } finally {
      setLoading(false);
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

  const formatCurrency = (amount: number | null) => {
    if (amount === null || isNaN(Number(amount))) return '0 ₫';
    return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Thống kê doanh thu
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" color="textSecondary" gutterBottom>
                      Tổng doanh thu {typeLabels[type as keyof typeof typeLabels].toLowerCase()}
                    </Typography>
                    {loading ? (
                      <Skeleton variant="text" width={200} height={40} />
                    ) : (
                      <Typography variant="h3" color="primary">
                        {formatCurrency(totalAmount)}
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <FormControl fullWidth>
                      <InputLabel>Thống kê theo</InputLabel>
                      <Select 
                        value={type} 
                        label="Thống kê theo" 
                        onChange={(e) => setType(Number(e.target.value))}
                      >
                        <MenuItem value={1}>Giờ trong ngày</MenuItem>
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
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                {loading ? (
                  <Box height={400} display="flex" alignItems="center" justifyContent="center">
                    <Skeleton variant="rectangular" width="100%" height={400} />
                  </Box>
                ) : (
                  <Box height={400}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip formatter={(value: any) => formatCurrency(value)} />
                        <Line 
                          type="monotone" 
                          dataKey="totalAmount" 
                          name="Doanh thu"
                          stroke="#1976d2" 
                          strokeWidth={2} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Chi tiết doanh thu theo {periodLabels[type as keyof typeof periodLabels].toLowerCase()}
                </Typography>
                <Divider sx={{ my: 2 }} />
                {loading ? (
                  <Skeleton variant="rectangular" width="100%" height={300} />
                ) : (
                  <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
                    <Table stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell>
                            {periodLabels[type as keyof typeof periodLabels]}
                          </TableCell>
                          <TableCell align="right">Doanh thu</TableCell>
                          <TableCell align="right">Tỷ lệ</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {data.map((row) => (
                          <TableRow key={row.date}>
                            <TableCell>{row.date}</TableCell>
                            <TableCell align="right">
                              {formatCurrency(row.totalAmount)}
                            </TableCell>
                            <TableCell align="right">
                              {totalAmount ? 
                                `${((row.totalAmount / totalAmount) * 100).toFixed(1)}%` 
                                : '0%'
                              }
                            </TableCell>
                          </TableRow>
                        ))}
                        {data.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={3} align="center">
                              Không có dữ liệu
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </LocalizationProvider>
  );
}

export default StatisticalAmountView;
