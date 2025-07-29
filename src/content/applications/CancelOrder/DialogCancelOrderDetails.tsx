import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Chip,
  Divider
} from '@mui/material';

interface DialogCancelOrderDetailsProps {
  open: boolean;
  onClose: () => void;
  cancelOrder: any;
}

const DialogCancelOrderDetails = ({
  open,
  onClose,
  cancelOrder
}: DialogCancelOrderDetailsProps) => {
  if (!cancelOrder) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
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
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Chi tiết yêu cầu hủy đơn hàng #{cancelOrder.id}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          {/* Thông tin cơ bản */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Thông tin cơ bản
            </Typography>
            <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    ID yêu cầu:
                  </Typography>
                  <Typography variant="body1">
                    #{cancelOrder.id}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Mã đơn hàng:
                  </Typography>
                  <Typography variant="body1">
                    #{cancelOrder.order_id}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Trạng thái:
                  </Typography>
                  <Chip
                    label={getStatusLabel(cancelOrder.status)}
                    size="small"
                    sx={{
                      backgroundColor: getStatusColor(cancelOrder.status),
                      color: 'white'
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Ngày tạo:
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(cancelOrder.created_at)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Ngày cập nhật:
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(cancelOrder.updated_at)}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Grid>

          {/* Lý do hủy */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Lý do hủy đơn
            </Typography>
            <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
              <Typography variant="body1">
                {cancelOrder.cancel_reason}
              </Typography>
            </Box>
          </Grid>

          {/* Ghi chú admin */}
          {cancelOrder.admin_notes && (
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Ghi chú của admin
              </Typography>
              <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                <Typography variant="body1">
                  {cancelOrder.admin_notes}
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogCancelOrderDetails; 