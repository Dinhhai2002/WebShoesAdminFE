import { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardHeader,
  Divider,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Chip,
  Typography,
  Container,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { CheckCircle, Block, Add } from '@mui/icons-material';
import { toast } from 'react-toastify';
import addressBookApi from 'src/services/API/AddressBookApi';
import { PAGE_DEFAULT, LIMIT_DEFAULT } from 'src/utils/Constant';
import DialogViewAddressBook from './DialogViewAddressBook';

function AddressBookManagement() {
  const [list, setList] = useState([]);
  const [totalRecord, setTotalRecord] = useState(0);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [keySearch, setKeySearch] = useState('');
  const [status, setStatus] = useState(-1);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);

  const fetchAddressBooks = async (pageParam = 1, limitParam = 10, searchKey = '', statusFilter = -1) => {
    try {
      const res = await addressBookApi.findAllAdmin({
        userId: undefined,
        keySearch: searchKey,
        status: statusFilter,
        page: pageParam,
        limit: limitParam
      });
      setList(res.data.list);
      setTotalRecord(res.data.total_record);
    } catch (error) {
      toast.error('Không thể tải dữ liệu sổ địa chỉ');
    }
  };

  useEffect(() => {
    fetchAddressBooks(page + 1, limit, keySearch, status);
  }, [page, limit, status]);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLimit(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = () => {
    setPage(0);
    fetchAddressBooks(1, limit, keySearch, status);
  };

  const handleOpenView = (id: number) => {
    setSelectedId(id);
    setOpenViewDialog(true);
  };

  const handleCloseView = () => {
    setSelectedId(null);
    setOpenViewDialog(false);
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">Quản lý Sổ Địa Chỉ</Typography>
        <Button variant="contained" startIcon={<Add />} disabled>
          Thêm địa chỉ mới
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        <TextField
          label="Tìm kiếm theo tên hoặc SĐT"
          variant="outlined"
          size="small"
          value={keySearch}
          onChange={(e) => setKeySearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Trạng thái</InputLabel>
          <Select
            value={status}
            onChange={(e) => {
              setStatus(Number(e.target.value));
              setPage(0);
            }}
            label="Trạng thái"
          >
            <MenuItem value={-1}>Tất cả</MenuItem>
            <MenuItem value={1}>Hoạt động</MenuItem>
            <MenuItem value={0}>Tạm khóa</MenuItem>
          </Select>
        </FormControl>
        <Button variant="outlined" onClick={handleSearch}>Tìm kiếm</Button>
      </Box>

      <Card>
        <CardHeader title="Danh sách địa chỉ người dùng" />
        <Divider />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Họ tên</TableCell>
                <TableCell>SĐT</TableCell>
                <TableCell>Địa chỉ đầy đủ</TableCell>
                <TableCell>Mặc định</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell align="right">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {list.map((item: any) => (
                <TableRow key={item.id} hover>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.full_name}</TableCell>
                  <TableCell>{item.phone}</TableCell>
                  <TableCell>{item.full_address}</TableCell>
                  <TableCell>
                    <Chip
                      label={item.is_default ? 'Mặc định' : 'Không'}
                      color={item.is_default ? 'primary' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={item.status === 1 ? <CheckCircle /> : <Block />}
                      label={item.status === 1 ? 'Hoạt động' : 'Tạm khóa'}
                      color={item.status === 1 ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Xem chi tiết">
                      <IconButton onClick={() => handleOpenView(item.id)}>
                        👁️
                      </IconButton>
                    </Tooltip>
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
          onPageChange={handleChangePage}
          rowsPerPage={limit}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelRowsPerPage="Số hàng mỗi trang"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} trên ${count}`}
        />
      </Card>

      {selectedId && (
        <DialogViewAddressBook
          open={openViewDialog}
          onClose={handleCloseView}
          id={selectedId}
        />
      )}
    </Container>
  );
}

export default AddressBookManagement;
