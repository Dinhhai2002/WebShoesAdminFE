import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Radio,
  Divider,
  Paper
} from '@mui/material';
import { useEffect, useState } from 'react';
import voucherApi, { Voucher } from 'src/services/API/VoucherApi';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

interface VoucherDialogProps {
  open: boolean;
  onClose: () => void;
  onApply: (discountAmount: number, voucherId: number) => void;
  totalAmount: number;
}

function VoucherDialog({ open, onClose, onApply, totalAmount }: VoucherDialogProps) {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [selectedVoucherId, setSelectedVoucherId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [applyLoading, setApplyLoading] = useState(false);

  useEffect(() => {
    if (open) {
      fetchAvailableVouchers();
    } else {
      setSelectedVoucherId(null);
    }
  }, [open]);

  const fetchAvailableVouchers = async () => {
    setLoading(true);
    try {
      const response = await voucherApi.findAll({});
      // Lọc voucher còn hiệu lực
      const now = dayjs();
      const availableVouchers = response.data.list.filter(voucher => {
        const endDate = dayjs(voucher.end_date, 'DD/MM/YYYY HH:mm:ss');
        return endDate.isAfter(now) && voucher.status === 1 && voucher.usage_limit > voucher.used_count;
      });
      setVouchers(availableVouchers);
    } catch (error) {
      toast.error('Không thể tải danh sách voucher');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyVoucher = async () => {
    if (!selectedVoucherId) {
      toast.error('Vui lòng chọn voucher');
      return;
    }

    setApplyLoading(true);
    try {
      const response = await voucherApi.apply(selectedVoucherId, { total_amount: totalAmount });
      const discountAmount = response.data.amount_voucher;
      onApply(discountAmount, selectedVoucherId);
      toast.success('Áp dụng voucher thành công');
      onClose();
    } catch (error: any) {
      toast.error(error?.message || 'Không thể áp dụng voucher');
    } finally {
      setApplyLoading(false);
    }
  };

  const formatVoucherValue = (voucher: Voucher) => {
    if (voucher.discount_type === 1) { // Phần trăm
      return `${voucher.discount_value}% (Tối đa ${voucher.max_discount.toLocaleString('vi-VN')}₫)`;
    }
    return `${voucher.discount_value.toLocaleString('vi-VN')}₫`;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Chọn Voucher</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Tổng tiền đơn hàng: {totalAmount.toLocaleString('vi-VN')}₫
        </Typography>
        
        {loading ? (
          <Box display="flex" justifyContent="center" my={3}>
            <CircularProgress />
          </Box>
        ) : vouchers.length === 0 ? (
          <Paper sx={{ p: 2, mt: 2, textAlign: 'center' }}>
            <Typography color="text.secondary">
              Không có voucher khả dụng
            </Typography>
          </Paper>
        ) : (
          <List>
            {vouchers.map((voucher, index) => (
              <Box key={voucher.id}>
                <ListItem>
                  <Radio
                    checked={selectedVoucherId === voucher.id}
                    onChange={() => setSelectedVoucherId(voucher.id)}
                  />
                  <ListItemText
                    primary={voucher.code}
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Giảm: {formatVoucherValue(voucher)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Đơn tối thiểu: {voucher.min_order_value.toLocaleString('vi-VN')}₫
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Còn lại: {voucher.usage_limit - voucher.used_count} lượt
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                        Ngày áp dụng: {dayjs(voucher.start_date, 'DD/MM/YYYY HH:mm:ss').format('DD/MM/YYYY')}
                        <br />
                          Ngày kết thúc: {dayjs(voucher.end_date, 'DD/MM/YYYY HH:mm:ss').format('DD/MM/YYYY')}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
                {index < vouchers.length - 1 && <Divider />}
              </Box>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button 
          onClick={handleApplyVoucher} 
          variant="contained" 
          disabled={applyLoading || !selectedVoucherId}
        >
          {applyLoading ? <CircularProgress size={24} /> : 'Áp dụng'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default VoucherDialog;