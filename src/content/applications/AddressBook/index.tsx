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
  MenuItem,
  Paper,
  Stack,
  Grid,
  Avatar,
  useTheme,
  alpha,
  InputAdornment
} from '@mui/material';
import { 
  CheckCircle, 
  Block, 
  Add,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
  LocationOn as LocationOnIcon,
  Phone as PhoneIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import addressBookApi from 'src/services/API/AddressBookApi';
import { PAGE_DEFAULT, LIMIT_DEFAULT } from 'src/utils/Constant';
import DialogViewAddressBook from './DialogViewAddressBook';

function AddressBookManagement() {
  const theme = useTheme();
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
      {/* Header Section */}
      <Box
        sx={{
          pb: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Typography variant="h3">
          Quản lý Sổ Địa Chỉ
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          disabled
          sx={{
            px: 2.5,
            py: 1
          }}
        >
          Thêm địa chỉ mới
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
              placeholder="Tìm kiếm theo tên hoặc SĐT"
              value={keySearch}
              onChange={(e) => setKeySearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
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
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleSearch}
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
                setStatus(-1);
                setPage(0);
                fetchAddressBooks(1, limit, '', -1);
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
        <CardHeader 
          title={
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="h5">Danh sách địa chỉ người dùng</Typography>
              {totalRecord > 0 && (
                <Chip 
                  label={`${totalRecord} địa chỉ`}
                  size="small"
                  sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main' }}
                />
              )}
            </Stack>
          }
        />
        <Divider />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: alpha(theme.palette.primary.main, 0.05)
                }}
              >
                <TableCell>ID</TableCell>
                <TableCell>Thông tin người dùng</TableCell>
                <TableCell>Địa chỉ</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell align="right">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {list.map((item: any) => (
                <TableRow key={item.id} hover>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar 
                        sx={{ 
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          color: 'primary.main'
                        }}
                      >
                        {item.full_name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body1">{item.full_name}</Typography>
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          <PhoneIcon fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary">
                            {item.phone}
                          </Typography>
                        </Stack>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Stack spacing={1}>
                      <Typography variant="body2" noWrap>{item.full_address}</Typography>
                      <Chip
                        size="small"
                        label={item.is_default ? 'Địa chỉ mặc định' : 'Địa chỉ phụ'}
                        color={item.is_default ? 'primary' : 'default'}
                        sx={{ width: 'fit-content' }}
                      />
                    </Stack>
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
                      <IconButton 
                        onClick={() => handleOpenView(item.id)}
                        sx={{
                          color: 'primary.main',
                          '&:hover': {
                            bgcolor: alpha(theme.palette.primary.main, 0.1)
                          }
                        }}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
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
          onPageChange={handleChangePage}
          rowsPerPage={limit}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelRowsPerPage="Số hàng mỗi trang"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} trên ${count}`}
        />
        </Box>
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
