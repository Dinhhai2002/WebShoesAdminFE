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
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useState } from 'react';
import DialogCancelOrderDetails from './DialogCancelOrderDetails';
import DialogDelete from './DialogDelete';

interface TableListCancelOrderProps {
  listCancelOrders: any[];
  onApprove: (id: number, adminNotes?: string) => void;
  onReject: (id: number, adminNotes?: string) => void;
  onDelete?: (id: number) => void;
}

const TableListCancelOrder = ({
  listCancelOrders,
  onApprove,
  onReject,
  onDelete
}: TableListCancelOrderProps) => {
  const [selectedCancelOrder, setSelectedCancelOrder] = useState<any>(null);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [openApproveDialog, setOpenApproveDialog] = useState(false);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');

  const handleViewDetails = (cancelOrder: any) => {
    setSelectedCancelOrder(cancelOrder);
    setOpenDetailsDialog(true);
  };

  const handleApprove = (cancelOrder: any) => {
    setSelectedCancelOrder(cancelOrder);
    setOpenApproveDialog(true);
  };

  const handleReject = (cancelOrder: any) => {
    setSelectedCancelOrder(cancelOrder);
    setOpenRejectDialog(true);
  };

  const handleDelete = (cancelOrder: any) => {
    setSelectedCancelOrder(cancelOrder);
    setOpenDeleteDialog(true);
  };

  const handleConfirmApprove = () => {
    if (selectedCancelOrder) {
      onApprove(selectedCancelOrder.id, adminNotes);
      setOpenApproveDialog(false);
      setAdminNotes('');
    }
  };

  const handleConfirmReject = () => {
    if (selectedCancelOrder) {
      onReject(selectedCancelOrder.id, adminNotes);
      setOpenRejectDialog(false);
      setAdminNotes('');
    }
  };

  const handleConfirmDelete = () => {
    if (selectedCancelOrder && onDelete) {
      onDelete(selectedCancelOrder.id);
      setOpenDeleteDialog(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Chờ duyệt';
      case 'APPROVED':
        return 'Đã duyệt';
      case 'REJECTED':
        return 'Từ chối';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return '#FFA500'; // Orange
      case 'APPROVED':
        return '#4CAF50'; // Green
      case 'REJECTED':
        return '#F44336'; // Red
      default:
        return '#000000';
    }
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="cancel orders table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Mã đơn hàng</TableCell>
              <TableCell>Lý do hủy</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Ngày tạo</TableCell>
              <TableCell>Ghi chú</TableCell>
              <TableCell align="center">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {listCancelOrders.map((cancelOrder) => (
              <TableRow key={cancelOrder.id}>
                <TableCell>{cancelOrder.id}</TableCell>
                <TableCell>#{cancelOrder.order_id}</TableCell>
                <TableCell>{cancelOrder.cancel_reason}</TableCell>
                <TableCell>
                  <Chip
                    label={getStatusLabel(cancelOrder.status)}
                    color="primary"
                    size="small"
                    sx={{
                      backgroundColor: getStatusColor(cancelOrder.status),
                      color: 'white'
                    }}
                  />
                </TableCell>
                <TableCell>{formatDate(cancelOrder.created_at)}</TableCell>
                <TableCell>{cancelOrder.admin_notes || '-'}</TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                    <Tooltip title="Xem chi tiết">
                      <IconButton
                        size="small"
                        onClick={() => handleViewDetails(cancelOrder)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>

                    {cancelOrder.status === 'PENDING' && (
                      <>
                        <Tooltip title="Duyệt">
                          <IconButton
                            size="small"
                            color="success"
                            onClick={() => handleApprove(cancelOrder)}
                          >
                            <CheckCircleIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Từ chối">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleReject(cancelOrder)}
                          >
                            <CancelIcon />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}

                    {/* {onDelete && (
                      <Tooltip title="Xóa">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(cancelOrder)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    )} */}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog chi tiết */}
      <DialogCancelOrderDetails
        open={openDetailsDialog}
        onClose={() => setOpenDetailsDialog(false)}
        cancelOrder={selectedCancelOrder}
      />

      {/* Dialog duyệt */}
      <Dialog open={openApproveDialog} onClose={() => setOpenApproveDialog(false)}>
        <DialogTitle>Duyệt yêu cầu hủy đơn hàng</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Bạn có chắc chắn muốn duyệt yêu cầu hủy đơn hàng này?
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
        <DialogTitle>Từ chối yêu cầu hủy đơn hàng</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Bạn có chắc chắn muốn từ chối yêu cầu hủy đơn hàng này?
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

      {/* Dialog xóa */}
      <DialogDelete
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa yêu cầu hủy đơn hàng"
        message="Bạn có chắc chắn muốn xóa yêu cầu hủy đơn hàng này?"
      />
    </>
  );
};

export default TableListCancelOrder; 