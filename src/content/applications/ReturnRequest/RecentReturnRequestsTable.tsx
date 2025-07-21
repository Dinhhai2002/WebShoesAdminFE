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
import returnRequestApi from 'src/services/API/ReturnRequestApi';
import exchangeRequestApi from 'src/services/API/ExchangeRequestApi';
import {
  getReturnStatusLabel,
  getReturnStatusColor,
  ReturnStatus,
  canAdminApproveReject,
  canAdminProcess,
  canAdminComplete,
  isExchangeType
} from 'src/constants/ReturnRequestConstants';
import TableListReturnRequest from './TableListReturnRequest';

interface RecentReturnRequestsTableProps {
  listReturnRequests: any[];
  totalRecord: number;
  onClickPagination: (status?: string) => void;
  loading?: boolean;
}

const ReturnRequestContext = createContext(null);

const statusOptions = [
  { id: -1, name: 'Tất cả' },
  { id: ReturnStatus.PENDING, name: 'Chờ duyệt' },
  { id: ReturnStatus.APPROVED, name: 'Đã duyệt' },
  { id: ReturnStatus.REJECTED, name: 'Từ chối' },
  { id: ReturnStatus.PROCESSING, name: 'Đang xử lý' },
  { id: ReturnStatus.COMPLETED, name: 'Hoàn thành' },
  { id: ReturnStatus.CANCELLED, name: 'Đã hủy' }
];

const RecentReturnRequestsTable = ({
  listReturnRequests,
  totalRecord,
  onClickPagination,
  loading = false
}: RecentReturnRequestsTableProps) => {
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
    onClickPagination(status);
  }, [page, statusValue]);

  useEffect(() => {
    onClickPagination();
  }, [limit]);

  const handleApproveReturnRequest = (id: number, adminNotes?: string) => {
    returnRequestApi.approveReturnRequest(id, { admin_notes: adminNotes })
      .then((response) => {
        onClickPagination();
        toast.success('Duyệt yêu cầu đổi trả hàng thành công!');
      })
      .catch((error) => {
        console.error('Error approving return request:', error);
        toast.error(error?.message || 'Đã có lỗi xảy ra khi duyệt yêu cầu đổi trả hàng!');
      });
  };

  const handleRejectReturnRequest = (id: number, adminNotes?: string) => {
    returnRequestApi.rejectReturnRequest(id, { admin_notes: adminNotes })
      .then((response) => {
        onClickPagination();
        toast.success('Từ chối yêu cầu đổi trả hàng thành công!');
      })
      .catch((error) => {
        console.error('Error rejecting return request:', error);
        toast.error(error?.message || 'Đã có lỗi xảy ra khi từ chối yêu cầu đổi trả hàng!');
      });
  };

  const handleProcessReturnRequest = (id: number) => {
    returnRequestApi.processReturnRequest(id)
      .then((response) => {
        onClickPagination();
        toast.success('Bắt đầu xử lý yêu cầu đổi trả hàng thành công!');
      })
      .catch((error) => {
        console.error('Error processing return request:', error);
        toast.error(error?.message || 'Đã có lỗi xảy ra khi xử lý yêu cầu đổi trả hàng!');
      });
  };

  const handleCompleteReturnRequest = (id: number) => {
    returnRequestApi.completeReturnRequest(id)
      .then((response) => {
        onClickPagination();
        toast.success('Hoàn thành yêu cầu đổi trả hàng thành công!');
      })
      .catch((error) => {
        console.error('Error completing return request:', error);
        toast.error(error?.message || 'Đã có lỗi xảy ra khi hoàn thành yêu cầu đổi trả hàng!');
      });
  };

  const handleDeleteReturnRequest = (id: number) => {
    returnRequestApi.deleteReturnRequest(id)
      .then((response) => {
        onClickPagination();
        toast.success('Xóa yêu cầu đổi trả hàng thành công!');
      })
      .catch((error) => {
        console.error('Error deleting return request:', error);
        toast.error(error?.message || 'Đã có lỗi xảy ra khi xóa yêu cầu đổi trả hàng!');
      });
  };

  const handleApproveExchangeRequest = (id: number, exchangeProducts: any[], adminNotes?: string, priceDifference?: number) => {
    // Tạo yêu cầu đổi hàng mới
    const exchangeRequest = {
      return_request_id: id,
      exchange_reason: `Đổi hàng theo yêu cầu #${id}`,
      price_difference: priceDifference,
      details: exchangeProducts.map(product => ({
        old_product_id: product.old_product_id,
        old_product_detail_id: product.old_product_detail_id,
        new_product_id: product.new_product_id,
        new_product_detail_id: product.new_product_detail_id,
        quantity: product.quantity,
        exchange_reason: product.exchange_reason,
        condition_description: 'Sản phẩm đổi theo yêu cầu',
        images: []
      }))
    };

    exchangeRequestApi.createExchangeRequest(exchangeRequest)
      .then((response) => {
        // Sau khi tạo yêu cầu đổi hàng, duyệt nó
        const approveRequest = {
          admin_notes: adminNotes,
          price_difference: priceDifference,
          exchange_products: exchangeProducts.map(product => ({
            old_product_id: product.old_product_id,
            old_product_detail_id: product.old_product_detail_id,
            new_product_id: product.new_product_id,
            new_product_detail_id: product.new_product_detail_id,
            quantity: product.quantity,
            exchange_reason: product.exchange_reason
          }))
        };

        return exchangeRequestApi.approveExchangeRequest(response.data.id, approveRequest);
      })
      .then((response) => {
        // Cập nhật trạng thái yêu cầu đổi trả hàng gốc
        return returnRequestApi.approveReturnRequest(id, { admin_notes: adminNotes });
      })
      .then((response) => {
        onClickPagination();
        toast.success('Duyệt yêu cầu đổi hàng thành công!');
      })
      .catch((error) => {
        console.error('Error approving exchange request:', error);
        toast.error(error?.message || 'Đã có lỗi xảy ra khi duyệt yêu cầu đổi hàng!');
      });
  };

  const handleChangeStatusReturnRequest = (id: number, status: string, notes?: string) => {
    // Implement custom status change logic here
    // For now, we'll use the existing API methods based on status
    switch (status) {
      case ReturnStatus.APPROVED:
        returnRequestApi.approveReturnRequest(id, { admin_notes: notes })
          .then((response) => {
            onClickPagination();
            toast.success('Thay đổi trạng thái thành công!');
          })
          .catch((error) => {
            console.error('Error changing status:', error);
            toast.error(error?.message || 'Đã có lỗi xảy ra khi thay đổi trạng thái!');
          });
        break;
      case ReturnStatus.REJECTED:
        returnRequestApi.rejectReturnRequest(id, { admin_notes: notes })
          .then((response) => {
            onClickPagination();
            toast.success('Thay đổi trạng thái thành công!');
          })
          .catch((error) => {
            console.error('Error changing status:', error);
            toast.error(error?.message || 'Đã có lỗi xảy ra khi thay đổi trạng thái!');
          });
        break;
      case ReturnStatus.PROCESSING:
        returnRequestApi.processReturnRequest(id)
          .then((response) => {
            onClickPagination();
            toast.success('Thay đổi trạng thái thành công!');
          })
          .catch((error) => {
            console.error('Error changing status:', error);
            toast.error(error?.message || 'Đã có lỗi xảy ra khi thay đổi trạng thái!');
          });
        break;
      case ReturnStatus.COMPLETED:
        returnRequestApi.completeReturnRequest(id)
          .then((response) => {
            onClickPagination();
            toast.success('Thay đổi trạng thái thành công!');
          })
          .catch((error) => {
            console.error('Error changing status:', error);
            toast.error(error?.message || 'Đã có lỗi xảy ra khi thay đổi trạng thái!');
          });
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
    <ReturnRequestContext.Provider value={{ onChangeValue }}>
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
                label="Tìm kiếm yêu cầu đổi trả"
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
          title="Danh sách yêu cầu đổi trả hàng"
        />

        <Divider />
        
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" p={5}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableListReturnRequest
              listReturnRequests={listReturnRequests}
              onApprove={handleApproveReturnRequest}
              onReject={handleRejectReturnRequest}
              onProcess={handleProcessReturnRequest}
              onComplete={handleCompleteReturnRequest}
              onDelete={handleDeleteReturnRequest}
              onChangeStatus={handleChangeStatusReturnRequest}
              onApproveExchange={handleApproveExchangeRequest}
            />

            {listReturnRequests.length > 0 ? (
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
    </ReturnRequestContext.Provider>
  );
};

export default RecentReturnRequestsTable; 