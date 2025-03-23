import {
  Box,
  Card,
  CardHeader,
  Divider,
  useTheme,
  TablePagination
} from '@mui/material';
import { ChangeEvent, createContext, useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DropDownComponent from 'src/components/DropDownComponent/DropDownComponent';
import Empty from 'src/components/Empty/Empty';
import Search from 'src/components/Search/Search';
import brandApi from 'src/services/API/BrandApi';
import { PAGE_DEFAULT } from 'src/utils/Constant';
import { labelTableBrand, statusOptions } from 'src/utils/LabelTable';
import DialogEditBrand from './DialogEditBrand';
import DialogStatusBrand from './DialogStatusBrand';
import TableListBrand from './TableListBrand';
import RecentOrdersTable from '../User/RecentOrdersTable';

const BrandContext = createContext(null);

interface RecentBrandsTableProps {
  listBrand: any[];
  totalRecord: number;
  onClickPagination: (keySearch: string, page: number, limit: number, status: number) => void;
}

function RecentBrandsTable({
  listBrand,
  totalRecord,
  onClickPagination
}: RecentBrandsTableProps) {
  const [selectedId, setSelectedId] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [status, setStatus] = useState<number>(-1); // -1 represents "All"
  const [keySearch, setKeySearch] = useState<string>('');
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<number>(1);

  const theme = useTheme();

  const handleClickOpenEdit = (id: number) => {
    setSelectedId(id);
    setOpenEditDialog(true);
  };

  const handleClose = () => {
    setOpenEditDialog(false);
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

  const handleStatusChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setStatus(Number(e.target.value));
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

  const handleFilterStatus = (value: number) => {
    setStatus(value);
    setPage(0);
    onClickPagination(keySearch, 1, limit, value);
  };

  const handleChangeStatus = (id: number) => {
    brandApi
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

  const onChangeValue = () => {
    onClickPagination(keySearch, page + 1, limit, status);
  };

  return (
    <BrandContext.Provider value={{ onChangeValue }}>
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
                label="Tìm kiếm thương hiệu"
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
          title="Danh sách thương hiệu"
        />

        <Divider />

        <TableListBrand
          listBrand={listBrand}
          labelTable={labelTableBrand}
          handleClickOpenEdit={handleClickOpenEdit}
          handleClickOpenStatus={handleClickOpenStatus}
          handleChangeStatus={handleChangeStatus}
        />

        {listBrand.length > 0 ? (
          <TablePagination
            component="div"
            count={totalRecord}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={limit}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Số hàng mỗi trang:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} trên ${count}`}
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
        ) : (
          <Box p={2}>
            <Empty />
          </Box>
        )}

        <DialogEditBrand
          id={selectedId}
          openDialog={openEditDialog}
          handleClose={handleClose}
          onSuccess={onChangeValue}
        />

        <DialogStatusBrand
          id={selectedId}
          open={openStatusDialog}
          onClose={handleCloseStatus}
          handleChangeStatus={handleChangeStatus}
          currentStatus={selectedStatus}
        />
      </Card>
    </BrandContext.Provider>
  );
}

export default RecentBrandsTable;   