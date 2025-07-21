import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  PlayArrow as PlayArrowIcon,
  Done as DoneIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  SwapHoriz as SwapHorizIcon
} from '@mui/icons-material';
import { useState } from 'react';
import {
  getReturnStatusLabel,
  getReturnStatusColor,
  ReturnStatus,
  canAdminApproveReject,
  canAdminProcess,
  canAdminComplete,
  isExchangeType
} from 'src/constants/ReturnRequestConstants';
import DialogReturnRequestDetails from './DialogReturnRequestDetails';
import DialogChangeStatus from './DialogChangeStatus';
import DialogDelete from './DialogDelete';
import DialogSelectExchangeProduct from './DialogSelectExchangeProduct';

interface TableListReturnRequestProps {
  listReturnRequests: any[];
  onApprove: (id: number, adminNotes?: string) => void;
  onReject: (id: number, adminNotes?: string) => void;
  onProcess: (id: number) => void;
  onComplete: (id: number) => void;
  onDelete?: (id: number) => void;
  onChangeStatus?: (id: number, status: string, notes?: string) => void;
  onApproveExchange?: (id: number, exchangeProducts: any[], adminNotes?: string, priceDifference?: number) => void;
}

const TableListReturnRequest = ({
  listReturnRequests,
  onApprove,
  onReject,
  onProcess,
  onComplete,
  onDelete,
  onChangeStatus,
  onApproveExchange
}: TableListReturnRequestProps) => {
  const [selectedReturnRequest, setSelectedReturnRequest] = useState<any>(null);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [openApproveDialog, setOpenApproveDialog] = useState(false);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [openChangeStatusDialog, setOpenChangeStatusDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openExchangeDialog, setOpenExchangeDialog] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');

  const handleViewDetails = (returnRequest: any) => {
    setSelectedReturnRequest(returnRequest);
    setOpenDetailsDialog(true);
  };

  const handleApprove = (returnRequest: any) => {
    setSelectedReturnRequest(returnRequest);
    setOpenApproveDialog(true);
  };

  const handleReject = (returnRequest: any) => {
    setSelectedReturnRequest(returnRequest);
    setOpenRejectDialog(true);
  };

  const handleChangeStatus = (returnRequest: any) => {
    setSelectedReturnRequest(returnRequest);
    setOpenChangeStatusDialog(true);
  };

  const handleDelete = (returnRequest: any) => {
    setSelectedReturnRequest(returnRequest);
    setOpenDeleteDialog(true);
  };

  const handleSelectExchange = (returnRequest: any) => {
    setSelectedReturnRequest(returnRequest);
    setOpenExchangeDialog(true);
  };

  const handleProcess = (id: number) => {
    onProcess(id);
  };

  const handleComplete = (id: number) => {
    onComplete(id);
  };

  const handleConfirmApprove = () => {
    if (selectedReturnRequest) {
      onApprove(selectedReturnRequest.id, adminNotes);
      setOpenApproveDialog(false);
      setAdminNotes('');
    }
  };

  const handleConfirmReject = () => {
    if (selectedReturnRequest) {
      onReject(selectedReturnRequest.id, adminNotes);
      setOpenRejectDialog(false);
      setAdminNotes('');
    }
  };

  const handleConfirmChangeStatus = (status: string, notes?: string) => {
    if (selectedReturnRequest && onChangeStatus) {
      onChangeStatus(selectedReturnRequest.id, status, notes);
    }
  };

  const handleConfirmDelete = () => {
    if (selectedReturnRequest && onDelete) {
      onDelete(selectedReturnRequest.id);
    }
  };

  const handleConfirmExchange = (exchangeProducts: any[], adminNotes?: string, priceDifference?: number) => {
    if (selectedReturnRequest && onApproveExchange) {
      onApproveExchange(selectedReturnRequest.id, exchangeProducts, adminNotes, priceDifference);
      setOpenExchangeDialog(false);
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
                <TableCell>{returnRequest.return_type}</TableCell>
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

                    {onChangeStatus && (
                      <Tooltip title="Thay đổi trạng thái">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleChangeStatus(returnRequest)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    )}

                    {canAdminApproveReject(returnRequest.status) && (
                      <>
                        {isExchangeType(returnRequest.return_type) && onApproveExchange ? (
                          <Tooltip title="Chọn sản phẩm đổi">
                            <IconButton
                              size="small"
                              color="success"
                              onClick={() => handleSelectExchange(returnRequest)}
                            >
                              <SwapHorizIcon />
                            </IconButton>
                          </Tooltip>
                        ) : (
                          <Tooltip title="Duyệt">
                            <IconButton
                              size="small"
                              color="success"
                              onClick={() => handleApprove(returnRequest)}
                            >
                              <CheckCircleIcon />
                            </IconButton>
                          </Tooltip>
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

                    {onDelete && (
                      <Tooltip title="Xóa">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(returnRequest)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog chi tiết */}
      <DialogReturnRequestDetails
        open={openDetailsDialog}
        onClose={() => setOpenDetailsDialog(false)}
        returnRequest={selectedReturnRequest}
      />

      {/* Dialog duyệt */}
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
          <Button onClick={handleConfirmApprove} color="success" variant="contained">
            Duyệt
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog từ chối */}
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
            onClick={handleConfirmReject} 
            color="error" 
            variant="contained"
            disabled={!adminNotes.trim()}
          >
            Từ chối
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog thay đổi trạng thái */}
      <DialogChangeStatus
        open={openChangeStatusDialog}
        onClose={() => setOpenChangeStatusDialog(false)}
        onConfirm={handleConfirmChangeStatus}
        currentStatus={selectedReturnRequest?.status}
        title="Thay đổi trạng thái yêu cầu đổi trả hàng"
      />

      {/* Dialog xóa */}
      <DialogDelete
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa yêu cầu đổi trả hàng"
        message="Bạn có chắc chắn muốn xóa yêu cầu đổi trả hàng này?"
      />

      {/* Dialog chọn sản phẩm đổi */}
      <DialogSelectExchangeProduct
        open={openExchangeDialog}
        onClose={() => setOpenExchangeDialog(false)}
        onConfirm={handleConfirmExchange}
        returnRequest={selectedReturnRequest}
      />
    </>
  );
};

export default TableListReturnRequest; 