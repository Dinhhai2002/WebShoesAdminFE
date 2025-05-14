import {
  Box,
  Card,
  CardHeader,
  Divider,
  useMediaQuery,
  useTheme,
  CircularProgress,
  TablePagination
} from '@mui/material';
import { ChangeEvent, createContext, useEffect, useState } from 'react';
import Empty from 'src/components/Empty/Empty';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DropDownComponent from 'src/components/DropDownComponent/DropDownComponent';
import Search from 'src/components/Search/Search';
import orderApi from 'src/services/API/OrderApi';
import { PAGE_DEFAULT } from 'src/utils/Constant';
import {
  labelTableOrder,
  statusOptionsOrder,
  paymentStatusOptions,
  paymentMethodOptions
} from 'src/utils/LabelTable';
import { EditSuccess } from 'src/utils/MessageToast';
import TableListOrder from './TableListOrder';

interface RecentOrdersTableProps {
  listOrder: any[];
  totalRecord: number;
  onClickPagination: (valueSearch: string, page: number, limit: number, statusValue: number, paymentStatusValue: number, paymentMethodValue: number) => void;
  loading?: boolean;
}

const OrderContext = createContext(null);

const RecentOrdersTable = ({
  listOrder,
  totalRecord,
  onClickPagination,
  loading = false
}: RecentOrdersTableProps) => {
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [statusValue, setStatusValue] = useState<number>(-1);
  const [paymentStatusValue, setPaymentStatusValue] = useState<number>(-1);
  const [paymentMethodValue, setPaymentMethodValue] = useState<number>(-1);
  const [valueSearch, setValueSearch] = useState('');

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleStatusChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setStatusValue(Number(e.target.value));
  };

  const handlePaymentStatusChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setPaymentStatusValue(Number(e.target.value));
  };
  const handlePaymentMethodChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setPaymentMethodValue(Number(e.target.value));
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLimit(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    onClickPagination(valueSearch, page + 1, limit, statusValue, paymentStatusValue, paymentMethodValue);
  }, [page]);

  useEffect(() => {
    onClickPagination(valueSearch, PAGE_DEFAULT, limit, statusValue, paymentStatusValue, paymentMethodValue);
  }, [limit, statusValue, paymentStatusValue, paymentMethodValue]);

  const handleChangeStatusOrder = (id: number, status: number) => {
    orderApi.changeStatus(id, status)
      .then((response) => {
        onClickPagination(valueSearch, page + 1, limit, statusValue, paymentStatusValue, paymentMethodValue);
        toast.success(EditSuccess);
      })
      .catch((error) => {
        console.error('Error changing order status:', error);
        toast.error(error?.message || 'Đã có lỗi xảy ra khi thay đổi trạng thái đơn hàng!');
      });
  };

  const handleSubmitSearch = () => {
    onClickPagination(valueSearch, PAGE_DEFAULT, limit, statusValue, paymentStatusValue, paymentMethodValue);
  };

  const onChangeValue = () => {
    onClickPagination(valueSearch, page + 1, limit, statusValue, paymentStatusValue, paymentMethodValue);
  };

  return (
    <OrderContext.Provider value={{ onChangeValue }}>
      <Card>
        <ToastContainer />
        <CardHeader
          action={
            <Box
              width={800}
              sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}
            >
              <Search
                valueSearch={valueSearch}
                setValueSearch={setValueSearch}
                handleSubmitSearch={handleSubmitSearch}
                label="Search order"
              />
              <DropDownComponent
                arr={statusOptionsOrder}
                label="Trạng thái đơn hàng"
                value={statusValue}
                handleStatusChange={handleStatusChange}
                type={0}
              />
              <DropDownComponent
                arr={paymentStatusOptions}
                label="Trạng thái thanh toán"
                value={paymentStatusValue}
                handleStatusChange={handlePaymentStatusChange}
                type={0}
              />
              <DropDownComponent
                arr={paymentMethodOptions}
                label="Phương thức thanh toán"
                value={paymentMethodValue}
                handleStatusChange={handlePaymentMethodChange}
                type={0}
              />
            </Box>
          }
          title="Danh sách đơn hàng"
        />

        <Divider />
        
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" p={5}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableListOrder
              listOrder={listOrder}
              labelTable={labelTableOrder}
              handleChangeStatusOrder={handleChangeStatusOrder}
            />

            {listOrder.length > 0 ? (
              <TablePagination
                component="div"
                count={totalRecord}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={limit}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 20, 30]}
                labelRowsPerPage="Số hàng mỗi trang:"
                labelDisplayedRows={({ from, to, count }) =>
                  `${from}-${to} trên ${count}`
                }
              />
            ) : (
              <Box p={2} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Empty />
              </Box>
            )}
          </>
        )}
      </Card>
    </OrderContext.Provider>
  );
};

export default RecentOrdersTable; 