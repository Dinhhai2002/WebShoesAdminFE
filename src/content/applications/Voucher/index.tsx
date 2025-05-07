import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import voucherApi, { Voucher } from 'src/services/API/VoucherApi';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LoadingButton } from '@mui/lab';
import EditIcon from '@mui/icons-material/Edit';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';

// Extend dayjs to parse custom formats
dayjs.extend(customParseFormat);
const DiscountTypeEnum = {
  PERCENT: 1,
  CASH: 2
};

function VoucherManagement() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [selectedVoucher, setSelectedVoucher] = useState<Partial<Voucher> | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [keySearch, setKeySearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(-1);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [totalRecord, setTotalRecord] = useState(0);
  const [loading, setLoading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; id: number; currentStatus: number } | null>(null);

  const fetchVouchers = () => {
    voucherApi
      .findAll({ key_search: keySearch, status: statusFilter, page: page + 1, limit })
      .then((res) => {
        setVouchers(res.data.list);
        setTotalRecord(res.data.total_record);
      });
  };

  useEffect(() => {
    fetchVouchers();
  }, [keySearch, statusFilter, page, limit]);

  const handleOpenCreate = () => {
    setSelectedVoucher({
      code: '',
      discount_type: 1,
      discount_value: 0,
      min_order_value: 0,
      max_discount: 0,
      start_date: dayjs().format('DD/MM/YYYY HH:mm:ss'),
      end_date: dayjs().add(7, 'day').format('DD/MM/YYYY HH:mm:ss'),
      usage_limit: 10,
      used_count: 0,
      status: 1
    });
    setOpenDialog(true);
  };

  const handleEdit = (voucher: Voucher) => {
    setSelectedVoucher({
      ...voucher,
      start_date: voucher.start_date,
      end_date: voucher.end_date
    });
    setOpenDialog(true);
  };

  const handleSave = async () => {
    if (!selectedVoucher) return;

    // Validate start_date must be less than end_date
    if (dayjs(selectedVoucher.start_date, 'DD/MM/YYYY HH:mm:ss').isAfter(dayjs(selectedVoucher.end_date, 'DD/MM/YYYY HH:mm:ss'))) {
      toast.error('Ngày bắt đầu phải nhỏ hơn ngày kết thúc');
      return;
    }

    setLoading(true);
    try {
      if (selectedVoucher.id) {
        await voucherApi.update(selectedVoucher.id, selectedVoucher);
        toast.success('Cập nhật thành công');
      } else {
        await voucherApi.create(selectedVoucher as Omit<Voucher, 'id'>);
        toast.success('Tạo mới thành công');
      }
      fetchVouchers();
      setOpenDialog(false);
    } catch (error) {
      toast.error('Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const handleChangeStatus = async () => {
    if (!confirmDialog) return;
    try {
      await voucherApi.changeStatus(confirmDialog.id);
      toast.success('Cập nhật trạng thái thành công');
      fetchVouchers();
    } catch {
      toast.error('Thay đổi trạng thái thất bại');
    } finally {
      setConfirmDialog(null);
    }
  };

  return (
    <Container maxWidth="xl">
      <Card>
        <CardHeader title="Quản lý Voucher" action={<Button variant='contained' onClick={handleOpenCreate}>Tạo mới</Button>} />
        <CardContent>
          <Stack direction="row" spacing={2} mb={2}>
            <TextField label="Tìm kiếm" value={keySearch} onChange={(e) => setKeySearch(e.target.value)} />
            <FormControl>
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(Number(e.target.value))}
                label="Trạng thái"
                sx={{ minWidth: 150 }}
              >
                <MenuItem value={-1}>Tất cả</MenuItem>
                <MenuItem value={1}>Hoạt động</MenuItem>
                <MenuItem value={0}>Tạm khóa</MenuItem>
              </Select>
            </FormControl>
          </Stack>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Mã</TableCell>
                  <TableCell>Loại</TableCell>
                  <TableCell>Giá trị</TableCell>
                  <TableCell>Giảm tối đa</TableCell>
                  <TableCell>Đơn tối thiểu</TableCell>
                  <TableCell>Ngày bắt đầu</TableCell>
                  <TableCell>Ngày kết thúc</TableCell>
                  <TableCell>Giới hạn</TableCell>
                  <TableCell>Đã dùng</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell align="center">Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {vouchers.map((v) => (
                  <TableRow key={v.id} hover>
                    <TableCell>{v.code}</TableCell>
                    <TableCell>{v.discount_type === DiscountTypeEnum.PERCENT ? 'Phần trăm' : 'Tiền mặt'}</TableCell>
                    <TableCell>
                      {v.discount_type === DiscountTypeEnum.PERCENT
                        ? `${v.discount_value}%`
                        : `${v.discount_value.toLocaleString('vi-VN')}₫`}
                    </TableCell>
                    <TableCell>{v.max_discount.toLocaleString('vi-VN')}₫</TableCell>
                    <TableCell>{v.min_order_value.toLocaleString('vi-VN')}₫</TableCell>
                    <TableCell>{dayjs(v.start_date, 'DD/MM/YYYY HH:mm:ss').format('DD/MM/YYYY')}</TableCell>
                    <TableCell>{dayjs(v.end_date, 'DD/MM/YYYY HH:mm:ss').format('DD/MM/YYYY')}</TableCell>
                    <TableCell>{v.usage_limit}</TableCell>
                    <TableCell>{v.used_count}</TableCell>
                    <TableCell>
                      <Typography color={v.status === 1 ? 'success.main' : 'error.main'} fontWeight="bold">
                        {v.status === 1 ? 'Hoạt động' : 'Tạm khóa'}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <IconButton onClick={() => handleEdit(v)} color="primary">
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => setConfirmDialog({ open: true, id: v.id, currentStatus: v.status })} color="warning">
                          {v.status === 1 ? <LockIcon /> : <LockOpenIcon />}
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={totalRecord}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={limit}
            onRowsPerPageChange={(e) => setLimit(parseInt(e.target.value, 10))}
          />
        </CardContent>
      </Card>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedVoucher?.id ? 'Chỉnh sửa' : 'Tạo mới'} voucher</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} mt={1}>
            <Grid item xs={12}><TextField label="Mã" fullWidth value={selectedVoucher?.code} onChange={(e) => setSelectedVoucher((prev) => ({ ...prev, code: e.target.value }))} /></Grid>
            <Grid item xs={12}><FormControl fullWidth><InputLabel>Loại</InputLabel><Select value={selectedVoucher?.discount_type} label="Loại" onChange={(e) => setSelectedVoucher((prev) => ({ ...prev, discount_type: Number(e.target.value) }))}><MenuItem value={1}>Phần trăm</MenuItem><MenuItem value={2}>Tiền mặt</MenuItem></Select></FormControl></Grid>
            <Grid item xs={6}><TextField label="Giá trị" type="number" fullWidth value={selectedVoucher?.discount_value} onChange={(e) => setSelectedVoucher((prev) => ({ ...prev, discount_value: Number(e.target.value) }))} /></Grid>
            <Grid item xs={6}><TextField label="Giảm tối đa" type="number" fullWidth value={selectedVoucher?.max_discount} onChange={(e) => setSelectedVoucher((prev) => ({ ...prev, max_discount: Number(e.target.value) }))} /></Grid>
            <Grid item xs={6}><TextField label="Đơn tối thiểu" type="number" fullWidth value={selectedVoucher?.min_order_value} onChange={(e) => setSelectedVoucher((prev) => ({ ...prev, min_order_value: Number(e.target.value) }))} /></Grid>
            <Grid item xs={6}><TextField label="Giới hạn" type="number" fullWidth value={selectedVoucher?.usage_limit} onChange={(e) => setSelectedVoucher((prev) => ({ ...prev, usage_limit: Number(e.target.value) }))} /></Grid>
            <Grid item xs={6}><DesktopDatePicker label="Bắt đầu" value={dayjs(selectedVoucher?.start_date, 'DD/MM/YYYY HH:mm:ss')} onChange={(newDate) => setSelectedVoucher((prev) => ({ ...prev, start_date: newDate?.format('DD/MM/YYYY HH:mm:ss') || '' }))} slotProps={{ textField: { fullWidth: true } }} /></Grid>
            <Grid item xs={6}><DesktopDatePicker label="Kết thúc" value={dayjs(selectedVoucher?.end_date, 'DD/MM/YYYY HH:mm:ss')} onChange={(newDate) => setSelectedVoucher((prev) => ({ ...prev, end_date: newDate?.format('DD/MM/YYYY HH:mm:ss') || '' }))} slotProps={{ textField: { fullWidth: true } }} /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
          <LoadingButton onClick={handleSave} loading={loading} variant="contained">Lưu</LoadingButton>
        </DialogActions>
      </Dialog>

      <Dialog open={!!confirmDialog} onClose={() => setConfirmDialog(null)}>
        <DialogTitle>Xác nhận thay đổi trạng thái</DialogTitle>
        <DialogContent>
          Bạn có chắc chắn muốn {confirmDialog?.currentStatus === 1 ? 'khóa' : 'mở'} voucher này không?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog(null)}>Hủy</Button>
          <Button variant="contained" color="primary" onClick={handleChangeStatus}>Xác nhận</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default VoucherManagement;
