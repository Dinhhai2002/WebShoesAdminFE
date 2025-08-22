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
  Divider,
  useTheme
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import statisticalApi, { AmountStatisticalResponse } from 'src/services/API/StatisticalApi';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import StatisticsCharts from './components/StatisticsCharts';

const typeLabels = {
  1: 'Ngày',
  3: 'Tháng',
  4: 'Năm'
};

const periodLabels = {
  1: 'Giờ',
  3: 'Ngày',
  4: 'Tháng'
};

function StatisticalAmountView() {
  const theme = useTheme();
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

  const formatYAxisValue = (value: number) => {
    if (value >= 1000000000) {
      return `${(value / 1000000000).toFixed(1)}B`;
    }
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    return value.toLocaleString('vi-VN');
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
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
                        <MenuItem value={1}>Ngày</MenuItem>
                        <MenuItem value={3}>Tháng</MenuItem>
                        <MenuItem value={4}>Năm</MenuItem>
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
            {loading ? (
              <Card>
                <CardContent>
                  <Box height={400} display="flex" alignItems="center" justifyContent="center">
                    <Skeleton variant="rectangular" width="100%" height={400} />
                  </Box>
                </CardContent>
              </Card>
            ) : (
              <StatisticsCharts
                data={data}
                loading={loading}
                formatYAxis={formatYAxisValue}
                formatTooltip={formatCurrency}
              />
            )}
          </Grid>

          <Grid item xs={12}>
            <Box mb={3}>
              <Typography variant="h5" gutterBottom>
                Chi tiết theo {periodLabels[type as keyof typeof periodLabels].toLowerCase()}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                Tổng doanh thu: {formatCurrency(totalAmount)}
              </Typography>
            </Box>
            {loading ? (
              <Grid container spacing={2}>
                {[1,2,3,4].map((i) => (
                  <Grid item xs={12} sm={6} md={3} key={i}>
                    <Skeleton variant="rectangular" height={160} sx={{ borderRadius: 2 }} />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Grid container spacing={2}>
                {data.map((row, index) => {
                  const percentage = totalAmount ? (row.totalAmount / totalAmount) * 100 : 0;
                  const isHighest = row.totalAmount === Math.max(...data.map(d => d.totalAmount));
                  const isLowest = row.totalAmount === Math.min(...data.map(d => d.totalAmount));
                  
                  return (
                    <Grid item xs={12} sm={6} md={3} key={row.date}>
                      <Card
                        sx={{
                          p: 2,
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          position: 'relative',
                          cursor: 'pointer',
                          transition: 'transform 0.2s, box-shadow 0.2s',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: 6
                          },
                          ...(isHighest && {
                            bgcolor: 'success.lighter',
                            borderColor: 'success.light'
                          }),
                          ...(isLowest && {
                            bgcolor: 'error.lighter',
                            borderColor: 'error.light'
                          })
                        }}
                      >
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 12,
                            right: 12,
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: isHighest ? 'success.main' : isLowest ? 'error.main' : 'grey.300',
                            color: '#fff',
                            fontSize: '0.875rem',
                            fontWeight: 'bold'
                          }}
                        >
                          {index + 1}
                        </Box>

                        <Typography variant="h6" gutterBottom>
                          {row.date}
                        </Typography>

                        <Typography
                          variant="h4"
                          color={isHighest ? 'success.main' : isLowest ? 'error.main' : 'primary.main'}
                          sx={{ mb: 2, mt: 'auto' }}
                        >
                          {formatCurrency(row.totalAmount)}
                        </Typography>

                        <Box
                          sx={{
                            width: '100%',
                            height: 8,
                            bgcolor: 'background.default',
                            borderRadius: 4,
                            overflow: 'hidden',
                            position: 'relative'
                          }}
                        >
                          <Box
                            sx={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              height: '100%',
                              width: `${percentage}%`,
                              bgcolor: isHighest ? 'success.main' : isLowest ? 'error.main' : 'primary.main',
                              borderRadius: 4,
                              transition: 'width 1s ease-in-out'
                            }}
                          />
                        </Box>
                        
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          align="right"
                          sx={{ mt: 1 }}
                        >
                          {percentage.toFixed(1)}% tổng doanh thu
                        </Typography>
                      </Card>
                    </Grid>
                  );
                })}
                {data.length === 0 && (
                  <Grid item xs={12}>
                    <Card sx={{ p: 4, textAlign: 'center' }}>
                      <Typography variant="subtitle1" color="text.secondary">
                        Không có dữ liệu
                      </Typography>
                    </Card>
                  </Grid>
                )}
              </Grid>
            )}
          </Grid>
        </Grid>
      </Container>
    </LocalizationProvider>
  );
}

export default StatisticalAmountView;
