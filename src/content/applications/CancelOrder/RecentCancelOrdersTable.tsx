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
import cancelOrderApi from 'src/services/API/CancelOrderApi';
import TableListCancelOrder from './TableListCancelOrder';

interface RecentCancelOrdersTableProps {
  listCancelOrders: any[];
  totalRecord: number;
  onClickPagination: (page: number, limit: number, status?: string) => void;
  loading?: boolean;
}

const CancelOrderContext = createContext(null);

const statusOptions = [
  { id: -1, name: 'Tất cả' },
  { id: 'PENDING', name: 'Chờ duyệt' },
  { id: 'APPROVED', name: 'Đã duyệt' },
  { id: 'REJECTED', name: 'Từ chối' }
];

const RecentCancelOrdersTable = ({
  listCancelOrders,
  totalRecord,
  onClickPagination,
  loading = false
}: RecentCancelOrdersTableProps) => {
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [statusValue, setStatusValue] = useState<number>(-1);
  const [valueSearch, setValueSearch] = useState('');

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleStatusChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setStatusValue(Number(e.target.value));
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLimit(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    const status = statusValue === -1 ? undefined : statusOptions.find(s => s.id === statusValue)?.name;
    onClickPagination(page + 1, limit, status);
  }, [page, statusValue]);

  useEffect(() => {
    onClickPagination(1, limit);
    setPage(0);
  }, [limit]);

  const handleApproveCancelOrder = (id: number, adminNotes?: string) => {
    cancelOrderApi.approveCancelRequest(id, { admin_notes: adminNotes })
      .then((response) => {
        const status = statusValue === -1 ? undefined : statusOptions.find(s => s.id === statusValue)?.name;
        onClickPagination(page + 1, limit, status);
        toast.success('Duyệt yêu cầu hủy đơn hàng thành công!');
      })
      .catch((error) => {
        console.error('Error approving cancel order:', error);
        toast.error(error?.message || 'Đã có lỗi xảy ra khi duyệt yêu cầu hủy đơn hàng!');
      });
  };

  const handleRejectCancelOrder = (id: number, adminNotes?: string) => {
    cancelOrderApi.rejectCancelRequest(id, { admin_notes: adminNotes })
      .then((response) => {
        const status = statusValue === -1 ? undefined : statusOptions.find(s => s.id === statusValue)?.name;
        onClickPagination(page + 1, limit, status);
        toast.success('Từ chối yêu cầu hủy đơn hàng thành công!');
      })
      .catch((error) => {
        console.error('Error rejecting cancel order:', error);
        toast.error(error?.message || 'Đã có lỗi xảy ra khi từ chối yêu cầu hủy đơn hàng!');
      });
  };

  const handleDeleteCancelOrder = (id: number) => {
    cancelOrderApi.deleteCancelRequest(id)
      .then((response) => {
        const status = statusValue === -1 ? undefined : statusOptions.find(s => s.id === statusValue)?.name;
        onClickPagination(page + 1, limit, status);
        toast.success('Xóa yêu cầu hủy đơn hàng thành công!');
      })
      .catch((error) => {
        console.error('Error deleting cancel order:', error);
        toast.error(error?.message || 'Đã có lỗi xảy ra khi xóa yêu cầu hủy đơn hàng!');
      });
  };

  const handleSubmitSearch = () => {
    const status = statusValue === -1 ? undefined : statusOptions.find(s => s.id === statusValue)?.name;
    onClickPagination(1, limit, status);
    setPage(0);
  };

  const onChangeValue = () => {
    const status = statusValue === -1 ? undefined : statusOptions.find(s => s.id === statusValue)?.name;
    onClickPagination(page + 1, limit, status);
  };

  return (
    <CancelOrderContext.Provider value={{ onChangeValue }}>
      <Card>
        <ToastContainer />
        <CardHeader
          action={
            <Box
              width={600}
              sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}
            >
              <Search
                valueSearch={valueSearch}
                setValueSearch={setValueSearch}
                handleSubmitSearch={handleSubmitSearch}
                label="Tìm kiếm yêu cầu hủy đơn"
              />
              <DropDownComponent
                arr={statusOptions}
                label="Trạng thái"
                value={statusValue}
                handleStatusChange={handleStatusChange}
                type={0}
              />
            </Box>
          }
          title="Danh sách yêu cầu hủy đơn hàng"
        />

        <Divider />
        
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" p={5}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableListCancelOrder
              listCancelOrders={listCancelOrders}
              onApprove={handleApproveCancelOrder}
              onReject={handleRejectCancelOrder}
              onDelete={handleDeleteCancelOrder}
            />

            {listCancelOrders.length > 0 ? (
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
    </CancelOrderContext.Provider>
  );
};

export default RecentCancelOrdersTable; 