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
  Edit as EditIcon
} from '@mui/icons-material';
import { useState } from 'react';
import {
  getExchangeStatusLabel,
  getExchangeStatusColor,
  ExchangeStatus,
  canAdminApproveReject,
  canAdminProcess,
  canAdminComplete
} from 'src/constants/ReturnRequestConstants';
import DialogExchangeRequestDetails from './DialogExchangeRequestDetails';
import DialogChangeStatus from './DialogChangeStatus';
import DialogDelete from './DialogDelete';

interface TableListExchangeRequestProps {
  listExchangeRequests: any[];
  onApprove: (id: number, adminNotes?: string, priceDifference?: number) => void;
  onReject: (id: number, adminNotes?: string) => void;
  onProcess: (id: number) => void;
  onComplete: (id: number) => void;
  onDelete?: (id: number) => void;
  onChangeStatus?: (id: number, status: string, notes?: string, priceDifference?: number) => void;
}

const TableListExchangeRequest = ({
  listExchangeRequests,
  onApprove,
  onReject,
  onProcess,
  onComplete,
  onDelete,
  onChangeStatus
}: TableListExchangeRequestProps) => {
  const [selectedExchangeRequest, setSelectedExchangeRequest] = useState<any>(null);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [openApproveDialog, setOpenApproveDialog] = useState(false);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [openChangeStatusDialog, setOpenChangeStatusDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');

  const handleViewDetails = (exchangeRequest: any) => {
    setSelectedExchangeRequest(exchangeRequest);
    setOpenDetailsDialog(true);
  };

  const handleApprove = (exchangeRequest: any) => {
    setSelectedExchangeRequest(exchangeRequest);
    setOpenApproveDialog(true);
  };

  const handleReject = (exchangeRequest: any) => {
    setSelectedExchangeRequest(exchangeRequest);
    setOpenRejectDialog(true);
  };

  const handleChangeStatus = (exchangeRequest: any) => {
    setSelectedExchangeRequest(exchangeRequest);
    setOpenChangeStatusDialog(true);
  };

  const handleDelete = (exchangeRequest: any) => {
    setSelectedExchangeRequest(exchangeRequest);
    setOpenDeleteDialog(true);
  };

  const handleProcess = (id: number) => {
    onProcess(id);
  };

  const handleComplete = (id: number) => {
    onComplete(id);
  };

  const handleConfirmApprove = () => {
    if (selectedExchangeRequest) {
      onApprove(selectedExchangeRequest.id, adminNotes);
      setOpenApproveDialog(false);
      setAdminNotes('');
    }
  };

  const handleConfirmReject = () => {
    if (selectedExchangeRequest) {
      onReject(selectedExchangeRequest.id, adminNotes);
      setOpenRejectDialog(false);
      setAdminNotes('');
    }
  };

  const handleConfirmChangeStatus = (status: string, notes?: string, priceDifference?: number) => {
    if (selectedExchangeRequest && onChangeStatus) {
      onChangeStatus(selectedExchangeRequest.id, status, notes, priceDifference);
    }
  };  

  const handleConfirmDelete = () => {
    if (selectedExchangeRequest && onDelete) {
      onDelete(selectedExchangeRequest.id);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="exchange requests table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Mã yêu cầu đổi trả</TableCell>
              <TableCell>Lý do đổi hàng</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Chênh lệch giá</TableCell>
              <TableCell>Ngày tạo</TableCell>
              <TableCell>Ghi chú</TableCell>
              <TableCell align="center">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {listExchangeRequests.map((exchangeRequest) => (
              <TableRow key={exchangeRequest.id}>
                <TableCell>{exchangeRequest.id}</TableCell>
                <TableCell>#{exchangeRequest.return_request_id}</TableCell>
                <TableCell>{exchangeRequest.exchange_reason}</TableCell>
                <TableCell>
                  <Chip
                    label={getExchangeStatusLabel(exchangeRequest.status)}
                    color="primary"
                    size="small"
                    sx={{
                      backgroundColor: getExchangeStatusColor(exchangeRequest.status),
                      color: 'white'
                    }}
                  />
                </TableCell>
                <TableCell>
                  {exchangeRequest.price_difference ? (
                    <Chip
                      label={`${exchangeRequest.price_difference > 0 ? '+' : ''}${exchangeRequest.price_difference.toLocaleString('vi-VN')} VND`}
                      color={exchangeRequest.price_difference > 0 ? 'error' : 'success'}
                      size="small"
                    />
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell>{formatDate(exchangeRequest.created_at)}</TableCell>
                <TableCell>{exchangeRequest.admin_notes || '-'}</TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                    <Tooltip title="Xem chi tiết">
                      <IconButton
                        size="small"
                        onClick={() => handleViewDetails(exchangeRequest)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>

                    {onChangeStatus && (
                      <Tooltip title="Thay đổi trạng thái">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleChangeStatus(exchangeRequest)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    )}

                    {canAdminApproveReject(exchangeRequest.status) && (
                      <>
                        <Tooltip title="Duyệt">
                          <IconButton
                            size="small"
                            color="success"
                            onClick={() => handleApprove(exchangeRequest)}
                          >
                            <CheckCircleIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Từ chối">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleReject(exchangeRequest)}
                          >
                            <CancelIcon />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}

                    {canAdminProcess(exchangeRequest.status) && (
                      <Tooltip title="Bắt đầu xử lý">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleProcess(exchangeRequest.id)}
                        >
                          <PlayArrowIcon />
                        </IconButton>
                      </Tooltip>
                    )}

                    {canAdminComplete(exchangeRequest.status) && (
                      <Tooltip title="Hoàn thành">
                        <IconButton
                          size="small"
                          color="success"
                          onClick={() => handleComplete(exchangeRequest.id)}
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
                          onClick={() => handleDelete(exchangeRequest)}
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
      <DialogExchangeRequestDetails
        open={openDetailsDialog}
        onClose={() => setOpenDetailsDialog(false)}
        exchangeRequest={selectedExchangeRequest}
      />

      {/* Dialog duyệt */}
      <Dialog open={openApproveDialog} onClose={() => setOpenApproveDialog(false)}>
        <DialogTitle>Duyệt yêu cầu đổi hàng</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Bạn có chắc chắn muốn duyệt yêu cầu đổi hàng này?
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
        <DialogTitle>Từ chối yêu cầu đổi hàng</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Bạn có chắc chắn muốn từ chối yêu cầu đổi hàng này?
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
        currentStatus={selectedExchangeRequest?.status}
        title="Thay đổi trạng thái yêu cầu đổi hàng"
      />

      {/* Dialog xóa */}
      <DialogDelete
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa yêu cầu đổi hàng"
        message="Bạn có chắc chắn muốn xóa yêu cầu đổi hàng này?"
      />
    </>
  );
};

export default TableListExchangeRequest; 