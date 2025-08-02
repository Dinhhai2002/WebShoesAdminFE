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
import exchangeRequestApi from 'src/services/API/ExchangeRequestApi';
import {
  getExchangeStatusLabel,
  getExchangeStatusColor,
  ExchangeStatus,
  canAdminApproveReject,
  canAdminProcess,
  canAdminComplete
} from 'src/constants/ReturnRequestConstants';
import TableListExchangeRequest from './TableListExchangeRequest';

interface RecentExchangeRequestsTableProps {
  listExchangeRequests: any[];
  totalRecord: number;
  onClickPagination: () => void;
  loading?: boolean;
}

const ExchangeRequestContext = createContext(null);

const statusOptions = [
  { id: -1, name: 'Tất cả' },
  { id: ExchangeStatus.PENDING, name: 'Chờ xử lý' },
  { id: ExchangeStatus.APPROVED, name: 'Đã duyệt' },
  { id: ExchangeStatus.REJECTED, name: 'Đã từ chối' },
  { id: ExchangeStatus.PROCESSING, name: 'Đang xử lý' },
  { id: ExchangeStatus.COMPLETED, name: 'Hoàn thành' },
  { id: ExchangeStatus.CANCELLED, name: 'Đã hủy' }
];

const RecentExchangeRequestsTable = ({
  listExchangeRequests,
  totalRecord,
  onClickPagination,
  loading = false
}: RecentExchangeRequestsTableProps) => {
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
    onClickPagination();
  }, [page, statusValue, limit]);

  const handleApproveExchangeRequest = (id: number, adminNotes?: string, priceDifference?: number) => {
    const request = {
      admin_notes: adminNotes,
      price_difference: priceDifference,
      exchange_products: [] // Sẽ được điền từ dialog chọn sản phẩm
    };

    exchangeRequestApi.approveExchangeRequest(id, request)
      .then((response) => {
        onClickPagination();
      })
      .catch((error) => {
        console.error('Error approving exchange request:', error);
        toast.error(error?.message || 'Đã có lỗi xảy ra khi duyệt yêu cầu đổi hàng!');
      });
  };

  const handleRejectExchangeRequest = (id: number, adminNotes?: string) => {
    const request = { admin_notes: adminNotes };

    exchangeRequestApi.rejectExchangeRequest(id, request)
      .then((response) => {
        onClickPagination();
        toast.success('Từ chối yêu cầu đổi hàng thành công!');
      })
      .catch((error) => {
        console.error('Error rejecting exchange request:', error);
        toast.error(error?.message || 'Đã có lỗi xảy ra khi từ chối yêu cầu đổi hàng!');
      });
  };

  const handleProcessExchangeRequest = (id: number) => {
    exchangeRequestApi.processExchangeRequest(id)
      .then((response) => {
        onClickPagination();
        toast.success('Bắt đầu xử lý yêu cầu đổi hàng thành công!');
      })
      .catch((error) => {
        console.error('Error processing exchange request:', error);
        toast.error(error?.message || 'Đã có lỗi xảy ra khi xử lý yêu cầu đổi hàng!');
      });
  };

  const handleCompleteExchangeRequest = (id: number) => {
    exchangeRequestApi.completeExchangeRequest(id)
      .then((response) => {
        onClickPagination();
        toast.success('Hoàn thành yêu cầu đổi hàng thành công!');
      })
      .catch((error) => {
        console.error('Error completing exchange request:', error);
        toast.error(error?.message || 'Đã có lỗi xảy ra khi hoàn thành yêu cầu đổi hàng!');
      });
  };

  const handleDeleteExchangeRequest = (id: number) => {
    exchangeRequestApi.deleteExchangeRequest(id)
      .then((response) => {
        onClickPagination();
        toast.success('Xóa yêu cầu đổi hàng thành công!');
      })
      .catch((error) => {
        console.error('Error deleting exchange request:', error);
        toast.error(error?.message || 'Đã có lỗi xảy ra khi xóa yêu cầu đổi hàng!');
      });
  };

  const handleChangeStatusExchangeRequest = (id: number, status: string, notes?: string, priceDifference?: number) => {
    // Implement custom status change logic here
    switch (status) {
      case ExchangeStatus.APPROVED:
        handleApproveExchangeRequest(id, notes, priceDifference);
        break;
      case ExchangeStatus.REJECTED:
        handleRejectExchangeRequest(id, notes);
        break;
      case ExchangeStatus.PROCESSING:
        handleProcessExchangeRequest(id);
        break;
      case ExchangeStatus.COMPLETED:
        handleCompleteExchangeRequest(id);
        break;
      default:
        toast.error('Trạng thái không được hỗ trợ!');
    }
  };

  const handleSubmitSearch = () => {
    onClickPagination();
  };

  const onChangeValue = () => {
    onClickPagination();
  };

  return (
    <ExchangeRequestContext.Provider value={{ onChangeValue }}>
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
                label="Tìm kiếm yêu cầu đổi hàng"
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
          title="Danh sách yêu cầu đổi hàng"
        />

        <Divider />
        
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" p={5}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableListExchangeRequest
              listExchangeRequests={listExchangeRequests}
              onApprove={handleApproveExchangeRequest}
              onReject={handleRejectExchangeRequest}
              onProcess={handleProcessExchangeRequest}
              onComplete={handleCompleteExchangeRequest}
              onDelete={handleDeleteExchangeRequest}
              onChangeStatus={handleChangeStatusExchangeRequest}
            />

            {listExchangeRequests.length > 0 ? (
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
    </ExchangeRequestContext.Provider>
  );
};

export default RecentExchangeRequestsTable; 