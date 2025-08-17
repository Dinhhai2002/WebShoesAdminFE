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
  Grid,
  IconButton,
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
import customerApi, { Customer, CRUDCustomerRequest } from 'src/services/API/CustomerApi';
import { toast } from 'react-toastify';
import { LoadingButton } from '@mui/lab';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import dayjs from 'dayjs';

interface EditingCustomer extends CRUDCustomerRequest {
  id?: number;
}

function CustomerManagement() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<EditingCustomer | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [keySearch, setKeySearch] = useState('');
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [totalRecord, setTotalRecord] = useState(0);
  const [loading, setLoading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; id: number } | null>(null);
  const [formErrors, setFormErrors] = useState<{
    name?: string;
    phone?: string;
  }>({});

  const fetchCustomers = () => {
    customerApi
      .findAll({ page: page + 1, limit })
      .then((res) => {
        setCustomers(res.data.list);
        setTotalRecord(res.data.total_record);
      })
      .catch((error) => {
        toast.error(error?.message || 'Có lỗi xảy ra');
      });
  };

  useEffect(() => {
    fetchCustomers();
  }, [page, limit]);

  const validateForm = (data: Partial<CRUDCustomerRequest>): boolean => {
    const errors: { name?: string; phone?: string } = {};

    if (!data.name?.trim()) {
      errors.name = 'Tên khách hàng không được để trống';
    }

    if (!data.phone?.trim()) {
      errors.phone = 'Số điện thoại không được để trống';
    } else if (!/^(0|\+84)(\s|\.)?((3[2-9])|(5[689])|(7[06-9])|(8[1-689])|(9[0-46-9]))(\d)(\s|\.)?(\d{3})(\s|\.)?(\d{3})$/.test(data.phone)) {
      errors.phone = 'Số điện thoại không hợp lệ';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOpenCreate = () => {
    setSelectedCustomer({
      name: '',
      phone: ''
    });
    setFormErrors({});
    setOpenDialog(true);
  };

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer({
      id: customer.id,
      name: customer.name,
      phone: customer.phone
    });
    setFormErrors({});
    setOpenDialog(true);
  };

  const handleSave = async () => {
    if (!selectedCustomer) return;

    if (!validateForm(selectedCustomer)) {
      return;
    }

    setLoading(true);
    try {
      if (selectedCustomer.id) {
        await customerApi.update(selectedCustomer.id, {
          name: selectedCustomer.name,
          phone: selectedCustomer.phone
        });
        toast.success('Cập nhật thành công');
      } else {
        await customerApi.create({
          name: selectedCustomer.name,
          phone: selectedCustomer.phone
        });
        toast.success('Tạo mới thành công');
      }
      fetchCustomers();
      setOpenDialog(false);
    } catch (error) {
      toast.error(error?.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDialog) return;
    try {
      await customerApi.delete(confirmDialog.id);
      toast.success('Xóa khách hàng thành công');
      fetchCustomers();
    } catch (error) {
      toast.error(error?.message || 'Xóa khách hàng thất bại');
    } finally {
      setConfirmDialog(null);
    }
  };

  return (
    <Container maxWidth="xl">
      <Card>
        <CardHeader title="Quản lý Khách hàng" action={<Button variant='contained' onClick={handleOpenCreate}>Tạo mới</Button>} />
        <CardContent>
          <Stack direction="row" spacing={2} mb={2}>
            <TextField 
              label="Tìm kiếm" 
              value={keySearch} 
              onChange={(e) => setKeySearch(e.target.value)}
              placeholder="Tìm theo tên hoặc số điện thoại" 
            />
          </Stack>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Tên khách hàng</TableCell>
                  <TableCell>Số điện thoại</TableCell>
                  <TableCell>Ngày tạo</TableCell>
                  <TableCell>Ngày cập nhật</TableCell>
                  <TableCell align="center">Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer.id} hover>
                    <TableCell>{customer.id}</TableCell>
                    <TableCell>{customer.name}</TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell>{dayjs(customer.created_at).format('DD/MM/YYYY HH:mm')}</TableCell>
                    <TableCell>{dayjs(customer.updated_at).format('DD/MM/YYYY HH:mm')}</TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <IconButton onClick={() => handleEdit(customer)} color="primary">
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          onClick={() => setConfirmDialog({ open: true, id: customer.id })} 
                          color="error"
                        >
                          <DeleteIcon />
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
        <DialogTitle>{selectedCustomer?.id ? 'Chỉnh sửa' : 'Tạo mới'} khách hàng</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} mt={1}>
            <Grid item xs={12}>
              <TextField 
                label="Tên khách hàng" 
                fullWidth 
                value={selectedCustomer?.name} 
                onChange={(e) => setSelectedCustomer((prev) => ({ ...prev, name: e.target.value }))}
                error={!!formErrors.name}
                helperText={formErrors.name}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField 
                label="Số điện thoại" 
                fullWidth 
                value={selectedCustomer?.phone} 
                onChange={(e) => setSelectedCustomer((prev) => ({ ...prev, phone: e.target.value }))}
                error={!!formErrors.phone}
                helperText={formErrors.phone}
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
            disabled={!!formErrors.name || !!formErrors.phone}
          >
            Lưu
          </LoadingButton>
        </DialogActions>
      </Dialog>

      <Dialog open={!!confirmDialog} onClose={() => setConfirmDialog(null)}>
        <DialogTitle>Xác nhận xóa khách hàng</DialogTitle>
        <DialogContent>
          Bạn có chắc chắn muốn xóa khách hàng này không?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog(null)}>Hủy</Button>
          <Button variant="contained" color="error" onClick={handleDelete}>Xác nhận</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default CustomerManagement;