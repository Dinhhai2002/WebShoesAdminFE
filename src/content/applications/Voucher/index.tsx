import {
  Box,
  Button,
  Card,
  CardContent,
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
  Typography,
  Paper,
  Chip,
  Avatar,
  useTheme,
  alpha,
  InputAdornment,
  Tooltip,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Refresh as RefreshIcon,
  LocalOffer as LocalOfferIcon,
  AccessTime as AccessTimeIcon,
  CalendarToday as CalendarTodayIcon,
  MonetizationOn as MonetizationOnIcon
} from '@mui/icons-material';
import { useEffect, useState } from 'react';
import voucherApi, { Voucher } from 'src/services/API/VoucherApi';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LoadingButton } from '@mui/lab';

// Extend dayjs to parse custom formats
dayjs.extend(customParseFormat);
const DiscountTypeEnum = {
  PERCENT: 1,
  CASH: 2
};

const VoucherStatusEnum = {
  PENDING: 'Chưa diễn ra',
  ONGOING: 'Đang diễn ra',
  ENDED: 'Kết thúc',
  OUT_OF_STOCK: 'Hết lượt',
  LOCKED: 'Khóa'
};

const getVoucherStatus = (voucher: Voucher) => {
  const now = dayjs();
  const startDate = dayjs(voucher.start_date, 'DD/MM/YYYY HH:mm:ss');
  const endDate = dayjs(voucher.end_date, 'DD/MM/YYYY HH:mm:ss');
  if(voucher.status === 0) {
    return VoucherStatusEnum.LOCKED;
  }
  if (voucher.usage_limit <= voucher.used_count) {
    return VoucherStatusEnum.OUT_OF_STOCK;
  }
  
  if (now.isBefore(startDate)) {
    return VoucherStatusEnum.PENDING;
  }
  
  if (now.isAfter(endDate)) {
    return VoucherStatusEnum.ENDED;
  }
  
  return VoucherStatusEnum.ONGOING;
};

function VoucherManagement() {
  const theme = useTheme();
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
  const [dateErrors, setDateErrors] = useState<{
    startDate: string;
    endDate: string;
  }>({ startDate: '', endDate: '' });

  const fetchVouchers = () => {
    voucherApi
      .findAll({ key_search: keySearch, status: statusFilter, page: page + 1, limit })
      .then((res) => {
        setVouchers(res.data.list);
        setTotalRecord(res.data.total_record);
      })
      .catch((error) => {
        toast.error(error?.message || 'Có lỗi xảy ra');
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
    setDateErrors({ startDate: '', endDate: '' });
    setOpenDialog(true);
  };

  const handleEdit = (voucher: Voucher) => {
    const status = getVoucherStatus(voucher);
    if (status === VoucherStatusEnum.ENDED) {
      toast.error('Không thể chỉnh sửa voucher đã kết thúc');
      return;
    }
    setSelectedVoucher({
      ...voucher,
      start_date: voucher.start_date,
      end_date: voucher.end_date
    });
    setDateErrors({ startDate: '', endDate: '' });
    setOpenDialog(true);
  };

  const validateDates = (start: string, end: string) => {
    const startDate = dayjs(start, 'DD/MM/YYYY HH:mm:ss');
    const endDate = dayjs(end, 'DD/MM/YYYY HH:mm:ss');
    
    if (!startDate.isValid() || !endDate.isValid()) {
      return {
        startDate: '',
        endDate: ''
      };
    }

    if (startDate.isAfter(endDate)) {
      return {
        startDate: 'Ngày bắt đầu không được lớn hơn ngày kết thúc',
        endDate: ''
      };
    }
    
    return {
      startDate: '',
      endDate: ''
    };
  };

  const handleSave = async () => {
    if (!selectedVoucher) return;

    const errors = validateDates(selectedVoucher.start_date, selectedVoucher.end_date);
    if (errors.startDate || errors.endDate) {
      setDateErrors(errors);
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
      toast.error(error?.message || 'Có lỗi xảy ra');
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
    } catch (error) {
      toast.error(error?.message || 'Thay đổi trạng thái thất bại');
    } finally {
      setConfirmDialog(null);
    }
  };

  return (
    <Container maxWidth="xl">
      {/* Header Section */}
      <Box
        sx={{
          pb: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: 'primary.main'
            }}
          >
            <LocalOfferIcon />
          </Avatar>
          <Typography variant="h3">
            Quản lý Voucher
          </Typography>
        </Stack>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenCreate}
          sx={{
            px: 2.5,
            py: 1
          }}
        >
          Tạo voucher mới
        </Button>
      </Box>

      {/* Filter Section */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1} mb={3}>
          <FilterListIcon />
          <Typography variant="h5">Bộ lọc tìm kiếm</Typography>
        </Stack>

        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              placeholder="Tìm kiếm theo mã voucher"
              value={keySearch}
              onChange={(e) => setKeySearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(Number(e.target.value))}
                label="Trạng thái"
              >
                <MenuItem value={-1}>Tất cả</MenuItem>
                <MenuItem value={1}>Hoạt động</MenuItem>
                <MenuItem value={0}>Tạm khóa</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Button
              fullWidth
              variant="contained"
              onClick={() => {
                setPage(0);
                fetchVouchers();
              }}
              startIcon={<SearchIcon />}
            >
              Tìm kiếm
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => {
                setKeySearch('');
                setStatusFilter(-1);
                setPage(0);
                fetchVouchers();
              }}
              startIcon={<RefreshIcon />}
            >
              Làm mới
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Table Section */}
      <Card
        sx={{
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: 'none'
        }}
      >
        <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="h5">Danh sách Voucher</Typography>
            {totalRecord > 0 && (
              <Chip 
                label={`${totalRecord} voucher`}
                size="small"
                sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main' }}
              />
            )}
          </Stack>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                <TableCell>Thông tin Voucher</TableCell>
                <TableCell>Giá trị giảm</TableCell>
                <TableCell>Điều kiện</TableCell>
                <TableCell>Thời gian</TableCell>
                <TableCell>Sử dụng</TableCell>
                <TableCell align="right">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {vouchers.map((v) => (
                <TableRow key={v.id} hover>
                  <TableCell>
                    <Stack spacing={1}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            color: 'primary.main'
                          }}
                        >
                          <LocalOfferIcon fontSize="small" />
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2">{v.code}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {v.discount_type === DiscountTypeEnum.PERCENT ? 'Giảm theo phần trăm' : 'Giảm theo số tiền'}
                          </Typography>
                        </Box>
                      </Stack>
                      <Chip
                        size="small"
                        label={getVoucherStatus(v)}
                        color={
                          getVoucherStatus(v) === VoucherStatusEnum.ONGOING
                            ? 'success'
                            : getVoucherStatus(v) === VoucherStatusEnum.PENDING
                            ? 'info'
                            : 'error'
                        }
                        sx={{ width: 'fit-content' }}
                      />
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Stack spacing={1}>
                      <Box>
                        <Typography variant="subtitle2" color="primary.main">
                          {v.discount_type === DiscountTypeEnum.PERCENT
                            ? `Giảm ${v.discount_value}%`
                            : `Giảm ${v.discount_value.toLocaleString('vi-VN')}₫`}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Tối đa: {v.max_discount.toLocaleString('vi-VN')}₫
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <MonetizationOnIcon fontSize="small" color="action" />
                      <Typography variant="body2">
                        Đơn tối thiểu: {v.min_order_value.toLocaleString('vi-VN')}₫
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Stack spacing={1}>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <CalendarTodayIcon fontSize="small" color="action" />
                        <Typography variant="body2">
                          {dayjs(v.start_date, 'DD/MM/YYYY HH:mm:ss').format('DD/MM/YYYY')}
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <AccessTimeIcon fontSize="small" color="action" />
                        <Typography variant="body2">
                          {dayjs(v.end_date, 'DD/MM/YYYY HH:mm:ss').format('DD/MM/YYYY')}
                        </Typography>
                      </Stack>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle2">
                        {v.used_count}/{v.usage_limit}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Còn lại: {v.usage_limit - v.used_count} lượt
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      {getVoucherStatus(v) !== VoucherStatusEnum.ENDED && (
                        <Tooltip title="Chỉnh sửa">
                          <IconButton 
                            onClick={() => handleEdit(v)}
                            sx={{
                              color: 'primary.main',
                              '&:hover': {
                                bgcolor: alpha(theme.palette.primary.main, 0.1)
                              }
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title={v.status === 1 ? 'Khóa voucher' : 'Mở khóa'}>
                        <IconButton 
                          onClick={() => setConfirmDialog({ open: true, id: v.id, currentStatus: v.status })} 
                          disabled={getVoucherStatus(v) === VoucherStatusEnum.ENDED}
                          sx={{
                            color: v.status === 1 ? 'error.main' : 'success.main',
                            '&:hover': {
                              bgcolor: alpha(
                                v.status === 1 ? theme.palette.error.main : theme.palette.success.main,
                                0.1
                              )
                            }
                          }}
                        >
                          {v.status === 1 ? <LockIcon fontSize="small" /> : <LockOpenIcon fontSize="small" />}
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
          <TablePagination
            component="div"
            count={totalRecord}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={limit}
            onRowsPerPageChange={(e) => setLimit(parseInt(e.target.value, 10))}
            rowsPerPageOptions={[5, 10, 25, 50]}
            labelRowsPerPage="Số hàng mỗi trang"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} trên ${count}`}
          />
        </Box>
      </Card>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedVoucher?.id ? 'Chỉnh sửa' : 'Tạo mới'} voucher</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} mt={1}>
            <Grid item xs={12}><TextField label="Tên Voucher" fullWidth value={selectedVoucher?.code} onChange={(e) => setSelectedVoucher((prev) => ({ ...prev, code: e.target.value }))} /></Grid>
            <Grid item xs={12}><FormControl fullWidth><InputLabel>Loại</InputLabel><Select value={selectedVoucher?.discount_type} label="Loại" onChange={(e) => setSelectedVoucher((prev) => ({ ...prev, discount_type: Number(e.target.value) }))}><MenuItem value={1}>Phần trăm</MenuItem><MenuItem value={2}>Tiền mặt</MenuItem></Select></FormControl></Grid>
            <Grid item xs={6}><TextField label="Giá trị" type="number" fullWidth value={selectedVoucher?.discount_value} onChange={(e) => setSelectedVoucher((prev) => ({ ...prev, discount_value: Number(e.target.value) }))} /></Grid>
            <Grid item xs={6}><TextField label="Giảm tối đa" type="number" fullWidth value={selectedVoucher?.max_discount} onChange={(e) => setSelectedVoucher((prev) => ({ ...prev, max_discount: Number(e.target.value) }))} /></Grid>
            <Grid item xs={6}><TextField label="Đơn tối thiểu" type="number" fullWidth value={selectedVoucher?.min_order_value} onChange={(e) => setSelectedVoucher((prev) => ({ ...prev, min_order_value: Number(e.target.value) }))} /></Grid>
            <Grid item xs={6}><TextField label="Giới hạn" type="number" fullWidth value={selectedVoucher?.usage_limit} onChange={(e) => setSelectedVoucher((prev) => ({ ...prev, usage_limit: Number(e.target.value) }))} /></Grid>
            <Grid item xs={6}>
              <DesktopDatePicker 
                label="Bắt đầu" 
                value={dayjs(selectedVoucher?.start_date, 'DD/MM/YYYY HH:mm:ss')} 
                onChange={(newDate) => {
                  const newStartDate = newDate?.format('DD/MM/YYYY HH:mm:ss') || '';
                  setSelectedVoucher((prev) => ({ 
                    ...prev, 
                    start_date: newStartDate
                  }));
                  if (selectedVoucher?.end_date) {
                    setDateErrors(validateDates(newStartDate, selectedVoucher.end_date));
                  }
                }} 
                slotProps={{ 
                  textField: { 
                    fullWidth: true,
                    error: !!dateErrors.startDate,
                    helperText: dateErrors.startDate
                  } 
                }} 
              />
            </Grid>
            <Grid item xs={6}>
              <DesktopDatePicker 
                label="Kết thúc" 
                value={dayjs(selectedVoucher?.end_date, 'DD/MM/YYYY HH:mm:ss')} 
                onChange={(newDate) => {
                  const newEndDate = newDate?.format('DD/MM/YYYY HH:mm:ss') || '';
                  setSelectedVoucher((prev) => ({ 
                    ...prev, 
                    end_date: newEndDate
                  }));
                  if (selectedVoucher?.start_date) {
                    setDateErrors(validateDates(selectedVoucher.start_date, newEndDate));
                  }
                }} 
                slotProps={{ 
                  textField: { 
                    fullWidth: true,
                    error: !!dateErrors.endDate,
                    helperText: dateErrors.endDate
                  } 
                }} 
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
          <LoadingButton 
            onClick={handleSave} 
            loading={loading} 
            variant="contained"
            disabled={!!dateErrors.startDate || !!dateErrors.endDate}
          >
            Lưu
          </LoadingButton>
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
