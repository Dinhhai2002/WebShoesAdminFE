import {
  Box,
  Card,
  CardContent,
  useTheme,
  alpha,
  Typography
} from '@mui/material';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip
} from 'recharts';

interface StatisticsChartsProps {
  data: any[];
  loading: boolean;
  formatYAxis: (value: number) => string;
  formatTooltip: (value: any) => string;
}

const StatisticsCharts = ({
  data,
  loading,
  formatYAxis,
  formatTooltip
}: StatisticsChartsProps) => {
  const theme = useTheme();
  const maxValue = Math.max(...data.map(item => item.totalAmount));
  const minValue = Math.min(...data.map(item => item.totalAmount));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      const isMax = value === maxValue;
      const isMin = value === minValue;
      
      return (
        <Card sx={{ 
          p: 2,
          boxShadow: theme.shadows[3],
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: isMax ? 'success.main' : isMin ? 'error.main' : 'divider'
        }}>
          <Typography variant="subtitle2" color="text.secondary">
            {label}
          </Typography>
          <Typography 
            variant="h6" 
            color={isMax ? 'success.main' : isMin ? 'error.main' : 'primary.main'}
            sx={{ mt: 1 }}
          >
            {formatTooltip(value)}
          </Typography>
        </Card>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardContent>
        <Box height={400}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={theme.colors.primary.main}
                    stopOpacity={0.1}
                  />
                  <stop
                    offset="95%"
                    stopColor={theme.colors.primary.main}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={alpha(theme.colors.alpha.black[100], 0.1)}
                vertical={false}
              />
              <XAxis
                dataKey="date"
                stroke={theme.colors.alpha.black[70]}
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis
                tickFormatter={formatYAxis}
                stroke={theme.colors.alpha.black[70]}
                tickLine={false}
                axisLine={false}
                dx={-10}
              />
              <RechartsTooltip
                content={<CustomTooltip />}
                cursor={{
                  stroke: theme.colors.primary.main,
                  strokeWidth: 2,
                  strokeDasharray: '3 3'
                }}
              />
              <Area
                type="monotone"
                dataKey="totalAmount"
                stroke={theme.colors.primary.main}
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorRevenue)"
                dot={{
                  r: 4,
                  fill: theme.colors.primary.main,
                  strokeWidth: 2,
                  stroke: theme.palette.background.paper
                }}
                activeDot={{
                  r: 6,
                  fill: theme.colors.primary.main,
                  strokeWidth: 2,
                  stroke: theme.palette.background.paper
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatisticsCharts;