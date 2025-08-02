import { FC, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Tooltip,
  Button,
  Box,
  TableContainer,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  SwapHoriz as SwapHorizIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  PlayArrow as PlayArrowIcon,
  Done as DoneIcon
} from '@mui/icons-material';
import { ReturnRequestResponse } from 'src/services/API/ReturnRequestApi';
import returnRequestApi from 'src/services/API/ReturnRequestApi';
import exchangeRequestApi from 'src/services/API/ExchangeRequestApi';
import { toast } from 'react-toastify';
import {
  getReturnStatusLabel,
  getReturnStatusColor,
  ReturnStatus,
  canAdminApproveReject,
  canAdminProcess,
  canAdminComplete,
  isExchangeType,
  getReturnTypeLabel,
  ReturnType,
  isReturnType
} from 'src/constants/ReturnRequestConstants';
import DialogReturnRequestDetails from './DialogReturnRequestDetails';
import DialogChangeStatus from './DialogChangeStatus';
import DialogDelete from './DialogDelete';
import DialogSelectExchangeProduct from './DialogSelectExchangeProduct';

interface TableListReturnRequestProps {
  listReturnRequests: ReturnRequestResponse[];
  onSuccess: () => void;
}

const TableListReturnRequest: FC<TableListReturnRequestProps> = ({
  listReturnRequests,
  onSuccess
}) => {
  const [selectedReturnRequest, setSelectedReturnRequest] = useState<ReturnRequestResponse | null>(null);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [openApproveDialog, setOpenApproveDialog] = useState(false);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [openChangeStatusDialog, setOpenChangeStatusDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openExchangeDialog, setOpenExchangeDialog] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');

  const handleViewDetails = (returnRequest: ReturnRequestResponse) => {
    setSelectedReturnRequest(returnRequest);
    setOpenDetailsDialog(true);
  };

  const handleApprove = (returnRequest: ReturnRequestResponse) => {
    setSelectedReturnRequest(returnRequest);
    setOpenApproveDialog(true);
  };

  const handleReject = (returnRequest: ReturnRequestResponse) => {
    setSelectedReturnRequest(returnRequest);
    setOpenRejectDialog(true);
  };

  const handleChangeStatus = (returnRequest: ReturnRequestResponse) => {
    setSelectedReturnRequest(returnRequest);
    setOpenChangeStatusDialog(true);
  };

  const handleDelete = (returnRequest: ReturnRequestResponse) => {
    setSelectedReturnRequest(returnRequest);
    setOpenDeleteDialog(true);
  };

  const handleSelectExchange = (returnRequest: ReturnRequestResponse) => {
    setSelectedReturnRequest(returnRequest);
    setOpenExchangeDialog(true);
  };

  const handleProcess = (returnRequestId: number) => {
    handleProcessReturnRequest(returnRequestId);
  };

  const handleComplete = (returnRequestId: number) => {
    handleCompleteReturnRequest(returnRequestId);
  };

  const handleApproveReturnRequest = (returnRequestId: number, notes?: string) => {
    returnRequestApi.approveReturnRequest(returnRequestId, { admin_notes: notes })
      .then(() => {
        toast.success('Duyệt yêu cầu đổi trả hàng thành công!');
        onSuccess();
        setOpenApproveDialog(false);
        setAdminNotes('');
      })
      .catch((error) => {
        console.error('Error approving return request:', error);
        toast.error(error?.message || 'Đã có lỗi xảy ra khi duyệt yêu cầu đổi trả hàng!');
      });
  };

  const handleRejectReturnRequest = (returnRequestId: number, notes?: string) => {
    returnRequestApi.rejectReturnRequest(returnRequestId, { admin_notes: notes })
      .then(() => {
        toast.success('Từ chối yêu cầu đổi trả hàng thành công!');
        onSuccess();
        setOpenRejectDialog(false);
        setAdminNotes('');
      })
      .catch((error) => {
        console.error('Error rejecting return request:', error);
        toast.error(error?.message || 'Đã có lỗi xảy ra khi từ chối yêu cầu đổi trả hàng!');
      });
  };

  const handleProcessReturnRequest = (returnRequestId: number) => {
    returnRequestApi.processReturnRequest(returnRequestId)
      .then(() => {
        toast.success('Bắt đầu xử lý yêu cầu đổi trả hàng thành công!');
        onSuccess();
      })
      .catch((error) => {
        console.error('Error processing return request:', error);
        toast.error(error?.message || 'Đã có lỗi xảy ra khi xử lý yêu cầu đổi trả hàng!');
      });
  };

  const handleCompleteReturnRequest = (returnRequestId: number) => {
    returnRequestApi.completeReturnRequest(returnRequestId)
      .then(() => {
        toast.success('Hoàn thành yêu cầu đổi trả hàng thành công!');
        onSuccess();
      })
      .catch((error) => {
        console.error('Error completing return request:', error);
        toast.error(error?.message || 'Đã có lỗi xảy ra khi hoàn thành yêu cầu đổi trả hàng!');
      });
  };

  const handleDeleteReturnRequest = () => {
    if (!selectedReturnRequest) return;
    
    returnRequestApi.deleteReturnRequest(selectedReturnRequest.id)
      .then(() => {
        toast.success('Xóa yêu cầu đổi trả hàng thành công!');
        onSuccess();
        setOpenDeleteDialog(false);
      })
      .catch((error) => {
        console.error('Error deleting return request:', error);
        toast.error(error?.message || 'Đã có lỗi xảy ra khi xóa yêu cầu đổi trả hàng!');
      });
  };

  const handleApproveExchangeRequest = (exchangeProducts: any[], notes?: string, priceDifference?: number) => {
    if (!selectedReturnRequest) return;

    // Tạo yêu cầu đổi hàng mới
    const exchangeRequest = {
      return_request_id: selectedReturnRequest.id,
      exchange_reason: `Đổi hàng theo yêu cầu #${selectedReturnRequest.id}`,
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
          admin_notes: notes,
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
      .then(() => {
        // Cập nhật trạng thái yêu cầu đổi trả hàng gốc
        return returnRequestApi.approveReturnRequest(selectedReturnRequest.id, { admin_notes: notes });
      })
      .then(() => {
        toast.success('Duyệt yêu cầu đổi hàng thành công!');
        onSuccess();
        setOpenExchangeDialog(false);
      })
      .catch((error) => {
        console.error('Error approving exchange request:', error);
        toast.error(error?.message || 'Đã có lỗi xảy ra khi duyệt yêu cầu đổi hàng!');
      });
  };

  const handleChangeStatusReturnRequest = (status: string, notes?: string) => {
    if (!selectedReturnRequest) return;
    
    switch (status) {
      case ReturnStatus.APPROVED:
        returnRequestApi.approveReturnRequest(selectedReturnRequest.id, { admin_notes: notes })
          .then(() => {
            toast.success('Thay đổi trạng thái thành công!');
            onSuccess();
            setOpenChangeStatusDialog(false);
          })
          .catch((error) => {
            console.error('Error changing status:', error);
            toast.error(error?.message || 'Đã có lỗi xảy ra khi thay đổi trạng thái!');
          });
        break;
      case ReturnStatus.REJECTED:
        returnRequestApi.rejectReturnRequest(selectedReturnRequest.id, { admin_notes: notes })
          .then(() => {
            toast.success('Thay đổi trạng thái thành công!');
            onSuccess();
            setOpenChangeStatusDialog(false);
          })
          .catch((error) => {
            console.error('Error changing status:', error);
            toast.error(error?.message || 'Đã có lỗi xảy ra khi thay đổi trạng thái!');
          });
        break;
      case ReturnStatus.PROCESSING:
        returnRequestApi.processReturnRequest(selectedReturnRequest.id)
          .then(() => {
            toast.success('Thay đổi trạng thái thành công!');
            onSuccess();
            setOpenChangeStatusDialog(false);
          })
          .catch((error) => {
            console.error('Error changing status:', error);
            toast.error(error?.message || 'Đã có lỗi xảy ra khi thay đổi trạng thái!');
          });
        break;
      case ReturnStatus.COMPLETED:
        returnRequestApi.completeReturnRequest(selectedReturnRequest.id)
          .then(() => {
            toast.success('Thay đổi trạng thái thành công!');
            onSuccess();
            setOpenChangeStatusDialog(false);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="return requests table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Mã đơn hàng</TableCell>
              <TableCell>Lý do đổi trả</TableCell>
              <TableCell>Loại đổi trả</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Ngày tạo</TableCell>
              <TableCell>Ghi chú</TableCell>
              <TableCell align="center">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {listReturnRequests.map((returnRequest) => (
              <TableRow key={returnRequest.id}>
                <TableCell>{returnRequest.id}</TableCell>
                <TableCell>{returnRequest.order_id}</TableCell>
                <TableCell>{returnRequest.return_reason}</TableCell>
                <TableCell>{getReturnTypeLabel(returnRequest.return_type)}</TableCell>
                <TableCell>
                  <Chip
                    label={getReturnStatusLabel(returnRequest.status)}
                    color="primary"
                    size="small"
                    sx={{
                      backgroundColor: getReturnStatusColor(returnRequest.status),
                      color: 'white'
                    }}
                  />
                </TableCell>
                <TableCell>{formatDate(returnRequest.created_at)}</TableCell>
                <TableCell>{returnRequest.admin_notes || '-'}</TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                    <Tooltip title="Xem chi tiết">
                      <IconButton
                        size="small"
                        onClick={() => handleViewDetails(returnRequest)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>

                    {canAdminApproveReject(returnRequest.status)  && (
                      <>
                        {isExchangeType(returnRequest.return_type) && (
                          <Tooltip title="Chọn sản phẩm đổi">
                            <IconButton
                              size="small"
                              color="success"
                              onClick={() => handleSelectExchange(returnRequest)}
                            >
                              <SwapHorizIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                        {isReturnType(returnRequest.return_type) && (
                          <>
                            <Tooltip title="Duyệt">
                              <IconButton
                                size="small"
                              color="success"
                                onClick={() => handleApprove(returnRequest)}
                              >
                                <CheckCircleIcon />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                        <Tooltip title="Từ chối">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleReject(returnRequest)}
                          >
                            <CancelIcon />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}

                    {canAdminProcess(returnRequest.status) && (
                      <Tooltip title="Bắt đầu xử lý">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleProcess(returnRequest.id)}
                        >
                          <PlayArrowIcon />
                        </IconButton>
                      </Tooltip>
                    )}

                    {canAdminComplete(returnRequest.status) && (
                      <Tooltip title="Hoàn thành">
                        <IconButton
                          size="small"
                          color="success"
                          onClick={() => handleComplete(returnRequest.id)}
                        >
                          <DoneIcon />
                        </IconButton>
                      </Tooltip>
                    )}

                    <Tooltip title="Xóa">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(returnRequest)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <DialogReturnRequestDetails
        open={openDetailsDialog}
        onClose={() => setOpenDetailsDialog(false)}
        returnRequest={selectedReturnRequest}
      />

      <Dialog open={openApproveDialog} onClose={() => setOpenApproveDialog(false)}>
        <DialogTitle>Duyệt yêu cầu đổi trả hàng</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Bạn có chắc chắn muốn duyệt yêu cầu đổi trả hàng này?
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Ghi chú (tùy chọn)"
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            placeholder="Nhập ghi chú nếu cần..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenApproveDialog(false)}>Hủy</Button>
          <Button 
            onClick={() => {
              if (selectedReturnRequest) {
                handleApproveReturnRequest(selectedReturnRequest.id, adminNotes);
              }
            }} 
            color="success" 
            variant="contained"
          >
            Duyệt
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openRejectDialog} onClose={() => setOpenRejectDialog(false)}>
        <DialogTitle>Từ chối yêu cầu đổi trả hàng</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Bạn có chắc chắn muốn từ chối yêu cầu đổi trả hàng này?
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Lý do từ chối (bắt buộc)"
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            placeholder="Nhập lý do từ chối..."
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRejectDialog(false)}>Hủy</Button>
          <Button 
            onClick={() => {
              if (selectedReturnRequest) {
                handleRejectReturnRequest(selectedReturnRequest.id, adminNotes);
              }
            }}
            color="error" 
            variant="contained"
            disabled={!adminNotes.trim()}
          >
            Từ chối
          </Button>
        </DialogActions>
      </Dialog>

      <DialogChangeStatus
        open={openChangeStatusDialog}
        onClose={() => setOpenChangeStatusDialog(false)}
        onConfirm={handleChangeStatusReturnRequest}
        currentStatus={selectedReturnRequest?.status}
        title="Thay đổi trạng thái yêu cầu đổi trả hàng"
      />

      <DialogDelete
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleDeleteReturnRequest}
        title="Xác nhận xóa yêu cầu đổi trả hàng"
        message="Bạn có chắc chắn muốn xóa yêu cầu đổi trả hàng này?"
      />

      <DialogSelectExchangeProduct
        open={openExchangeDialog}
        onClose={() => setOpenExchangeDialog(false)}
        onConfirm={handleApproveExchangeRequest}
        returnRequest={selectedReturnRequest}
      />
    </>
  );
};

export default TableListReturnRequest; 