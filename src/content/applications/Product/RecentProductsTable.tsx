import {
  Box,
  CardHeader,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Tooltip,
  Chip
} from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import TableListProduct from './TableListProduct';
import { PAGE_DEFAULT } from 'src/utils/Constant';
import productApi from 'src/services/API/ProductApi';
import Search from 'src/components/Search/Search';
import DropDownComponent from 'src/components/DropDownComponent/DropDownComponent';
import { statusOptions } from 'src/utils/LabelTable';

interface RecentProductsTableProps {
  listProduct: any[];
  totalRecord: number;
  onClickPagination: (keySearch: string, page: number, limit: number, status: number) => void;
}



const labelTableProduct = [
  { id: 1, label: 'ID' },
  { id: 2, label: 'Tên sản phẩm' },
  { id: 3, label: 'Thương hiệu' },
  { id: 4, label: 'Danh mục' },
  { id: 5, label: 'Giá' },
  { id: 6, label: 'Đánh giá' },
  { id: 7, label: 'Trạng thái' }
];

function RecentProductsTable({
  listProduct,
  totalRecord,
  onClickPagination
}: RecentProductsTableProps) {
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [status, setStatus] = useState<number>(-1);
  const [keySearch, setKeySearch] = useState<string>('');
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [selectedId, setSelectedId] = useState<number>(0);
  const [selectedStatus, setSelectedStatus] = useState<number>(1);

  const handleStatusChange = (e: ChangeEvent<HTMLInputElement>): void => {
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
    productApi
      .changeStatus(id, selectedStatus === 1 ? 0 : 1)
      .then(() => {
        onClickPagination(keySearch, page + 1, limit, status);
        toast.success('Thay đổi trạng thái thành công!');
      })
      .catch((error) => {
        toast.error(error?.message || 'Đã có lỗi xảy ra!');
      });
    handleCloseStatus();
  };

  const handleRefresh = () => {
    onClickPagination(keySearch, page, limit, status);
  };

  return (
    <>
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
              label="Tìm kiếm sản phẩm"
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
        title="Danh sách sản phẩm"
      />

      <Divider />

      <TableListProduct
        listProduct={listProduct}
        labelTable={labelTableProduct}
        handleClickOpenStatus={handleClickOpenStatus}
        handleChangeStatus={handleChangeStatus}
        onRefresh={handleRefresh}
      />

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
    </>
  );
}

export default RecentProductsTable; 