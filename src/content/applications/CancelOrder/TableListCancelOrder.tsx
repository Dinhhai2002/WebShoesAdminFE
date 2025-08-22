import {
  Box,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Skeleton,
  Card,
  CardHeader,
  Divider,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  IconButton,
  OutlinedInput
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  FilterList as FilterListIcon
} from '@mui/icons-material';
import { useState } from 'react';
import DialogCancelOrderDetails from './DialogCancelOrderDetails';
import DialogDelete from './DialogDelete';
import CancelOrderCard from './components/CancelOrderCard';

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
  const theme = useTheme();
  const [selectedCancelOrder, setSelectedCancelOrder] = useState<any>(null);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [openApproveDialog, setOpenApproveDialog] = useState(false);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

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

  const filteredOrders = listCancelOrders.filter(order => {
    const matchesSearch = searchTerm === '' || 
      order.order_id.toString().includes(searchTerm) ||
      order.cancel_reason.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <Card sx={{ mb: 3 }}>
        <CardHeader title="Bộ lọc tìm kiếm" />
        <Divider />
        <Box p={2}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Tìm kiếm</InputLabel>
                <OutlinedInput
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm theo mã đơn hoặc lý do..."
                  startAdornment={
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  }
                  endAdornment={
                    searchTerm && (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => setSearchTerm('')}
                        >
                          <ClearIcon />
                        </IconButton>
                      </InputAdornment>
                    )
                  }
                  label="Tìm kiếm"
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth>
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="Trạng thái"
                >
                  <MenuItem value="all">Tất cả</MenuItem>
                  <MenuItem value="PENDING">Chờ duyệt</MenuItem>
                  <MenuItem value="APPROVED">Đã duyệt</MenuItem>
                  <MenuItem value="REJECTED">Từ chối</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      </Card>

      <Grid container spacing={3}>
        {filteredOrders.length > 0 ? (
          filteredOrders.map((cancelOrder) => (
            <Grid item xs={12} sm={6} md={4} key={cancelOrder.id}>
              <CancelOrderCard
                cancelOrder={cancelOrder}
                onViewDetails={() => handleViewDetails(cancelOrder)}
                onApprove={() => handleApprove(cancelOrder)}
                onReject={() => handleReject(cancelOrder)}
              />
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Card sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                Không tìm thấy yêu cầu hủy đơn hàng nào
              </Typography>
            </Card>
          </Grid>
        )}
      </Grid>

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