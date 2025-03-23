import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  CardHeader,
  Divider,
  TablePagination,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import TableListSize from './TableListSize';
import sizeApi from 'src/services/API/SizeApi';
import { Size } from 'src/services/API/SizeApi';
import Search from 'src/components/Search/Search';
import DropDownComponent from 'src/components/DropDownComponent/DropDownComponent';
import { statusOptions } from 'src/utils/LabelTable';
import { PAGE_DEFAULT } from 'src/utils/Constant';

interface RecentSizesTableProps {
  listSize: Size[];
  totalRecord: number;
  onClickPagination: (keySearch: string, page: number, limit: number, status: number) => void;
}

const labelTable = [
  { id: 1, label: 'ID' },
  { id: 2, label: 'Tên size' },
  { id: 3, label: 'Trạng thái' }
];

function RecentSizesTable({
  listSize,
  totalRecord,
  onClickPagination
}: RecentSizesTableProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [status, setStatus] = useState<number>(-1);
  const [keySearch, setKeySearch] = useState<string>('');
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [selectedId, setSelectedId] = useState<number>(0);
  const [selectedStatus, setSelectedStatus] = useState<number>(1);

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newStatus = Number(e.target.value);
    setStatus(newStatus);
    setPage(0);
    onClickPagination(keySearch, 1, limit, newStatus);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newLimit = parseInt(event.target.value, 10);
    setLimit(newLimit);
    setPage(0);
  };

  useEffect(() => {
    onClickPagination(keySearch, page + 1, limit, status);
  }, [page]);

  useEffect(() => {
    onClickPagination(keySearch, PAGE_DEFAULT, limit, status);
  }, [limit, status]);

  const handleChangeSearch = (value: string) => {
    setKeySearch(value);
    setPage(0);
    onClickPagination(value, 1, limit, status);
  };

  const handleClickOpenStatus = (id: number, status: number) => {
    setSelectedId(id);
    setSelectedStatus(status);
    setOpenStatusDialog(true);
  };

  const handleCloseStatus = () => {
    setOpenStatusDialog(false);
    setSelectedId(0);
  };

  const handleChangeStatus = (id: number) => {
    sizeApi
      .changeStatus(id)
      .then(() => {
        onClickPagination(keySearch, page + 1, limit, status);
        toast.success('Thay đổi trạng thái thành công!');
      })
      .catch((error) => {
        toast.error(error.response?.data?.message);
      });
    handleCloseStatus();
  };

  const handleRefresh = () => {
    onClickPagination(keySearch, page + 1, limit, status);
  };

  return (
    <Card>
      <ToastContainer />
      <CardHeader
        action={
          <Box
            width={600}
            sx={{ display: 'flex', justifyContent: 'space-between' }}
          >
            <Search
              valueSearch={keySearch}
              setValueSearch={setKeySearch}
              handleSubmitSearch={() => onClickPagination(keySearch, 1, limit, status)}
              label="Tìm kiếm size"
            />
            <DropDownComponent
              arr={statusOptions}
              label="Trạng thái"
              value={status}
              handleStatusChange={handleStatusChange}
              type={0}
            />
          </Box>
        }
        title="Danh sách size"
      />

      <Divider />

      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TableListSize
                listSize={listSize}
                labelTable={labelTable}
                handleClickOpenStatus={handleClickOpenStatus}
                handleChangeStatus={handleChangeStatus}
                onRefresh={handleRefresh}
              />
            </Box>
          </Grid>
        </Grid>
      </CardContent>

      <TablePagination
        component="div"
        count={totalRecord}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={limit}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50]}
        labelRowsPerPage="Số hàng mỗi trang:"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} trên ${count}`
        }
      />
    </Card>
  );
}

export default RecentSizesTable; 