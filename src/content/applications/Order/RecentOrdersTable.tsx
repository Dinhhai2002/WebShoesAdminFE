import {
  Box,
  Card,
  CardHeader,
  Divider,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { ChangeEvent, createContext, useEffect, useState } from 'react';
import Empty from 'src/components/Empty/Empty';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DropDownComponent from 'src/components/DropDownComponent/DropDownComponent';
import PaginationComponent from 'src/components/Pagination/PaginationComponent';
import Search from 'src/components/Search/Search';
import orderApi from 'src/services/API/OrderApi';
import { PAGE_DEFAULT } from 'src/utils/Constant';
import {
  labelTableOrder,
  statusOptionsOrder,
  paymentStatusOptions
} from 'src/utils/LabelTable';
import { EditSuccess } from 'src/utils/MessageToast';
import TableListOrder from './TableListOrder';

interface RecentOrdersTableProps {
  listOrder: any[];
  totalRecord: number;
  onClickPagination: (valueSearch: string, page: number, limit: number, statusValue: number, paymentStatusValue: number) => void;
}

const OrderContext = createContext(null);

const RecentOrdersTable = ({
  listOrder,
  totalRecord,
  onClickPagination
}: RecentOrdersTableProps) => {
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [statusValue, setStatusValue] = useState<number>(-1);
  const [paymentStatusValue, setPaymentStatusValue] = useState<number>(-1);
  const [valueSearch, setValueSearch] = useState('');

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleStatusChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setStatusValue(Number(e.target.value));
  };

  const handlePaymentStatusChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setPaymentStatusValue(Number(e.target.value));
  };

  const handleChangePagination = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(Number(value));
  };

  const handleChangeLimit = (event: ChangeEvent<HTMLInputElement>) => {
    setLimit(Number(event.target.value));
  };

  useEffect(() => {
    onClickPagination(valueSearch, page, limit, statusValue, paymentStatusValue);
  }, [page]);

  useEffect(() => {
    onClickPagination(valueSearch, PAGE_DEFAULT, limit, statusValue, paymentStatusValue);
  }, [limit, statusValue, paymentStatusValue]);

  const handleChangeStatusOrder = (id: number, status: number) => {
    orderApi.changeStatus(id, status)
      .then((response) => {
        onClickPagination(valueSearch, page, limit, statusValue, paymentStatusValue);
        toast.success(EditSuccess);
      })
      .catch((error) => {
        toast.error(`${error.response?.data?.message}`);
      });
  };

  const handleSubmitSearch = () => {
    onClickPagination(valueSearch, PAGE_DEFAULT, limit, statusValue, paymentStatusValue);
  };

  const onChangeValue = () => {
    onClickPagination(valueSearch, page, limit, statusValue, paymentStatusValue);
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
            </Box>
          }
          title="Order List"
        />

        <Divider />

        <TableListOrder
          listOrder={listOrder}
          labelTable={labelTableOrder}
          handleChangeStatusOrder={handleChangeStatusOrder}
        />

        {listOrder.length > 0 ? (
          <PaginationComponent
            handleChangePagination={handleChangePagination}
            handleChangeLimit={handleChangeLimit}
            totalRecord={totalRecord}
            limit={limit}
          />
        ) : (
          <Box p={2} sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Empty />
          </Box>
        )}
      </Card>
    </OrderContext.Provider>
  );
};

export default RecentOrdersTable; 