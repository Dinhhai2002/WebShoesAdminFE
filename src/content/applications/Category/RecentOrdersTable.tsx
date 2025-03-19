import {
  Box,
  Button,
  Card,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { ChangeEvent, createContext, useEffect, useState } from 'react';

import Empty from 'src/components/Empty/Empty';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DropDownComponent from 'src/components/DropDownComponent/DropDownComponent';
import PaginationComponent from 'src/components/Pagination/PaginationComponent';
import Search from 'src/components/Search/Search';
import categoryApi from 'src/services/API/CategoryApi';
import { PAGE_DEFAULT } from 'src/utils/Constant';
import {
  getStatusLabel,
  labelTableDanhMuc,
  statusOptions
} from 'src/utils/LabelTable';
import { EditSuccess } from 'src/utils/MessageToast';
import TableListCategoryExam from './TableListCategory';
import TableListDanhMuc from './TableListCategory';
import TableListCategory from './TableListCategory';

const CategoryContext = createContext(null);

export const RecentOrdersTable = ({
  listCategory,
  totalRecord,
  onClickPagination
}: any) => {
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [statusValue, setStatusValue] = useState<number>(-1);
  const [valueSearch, setValueSearch] = useState('');
  const [openDialogMapDelete, setOpenDialogMapDelete] = useState({});
  const [openDialogMapEdit, setOpenDialogMapEdit] = useState({});

  const [open, setOpen] = useState(false);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  // xử lí đóng mở model delete và edit theo id
  const handleClickOpenDelete = (id) => {
    setOpenDialogMapDelete((prevState) => ({
      ...prevState,
      [id]: true
    }));
  };

  const handleClickOpenEdit = (id) => {
    setOpenDialogMapEdit((prevState) => ({
      ...prevState,
      [id]: true
    }));
  };

  const handleCloseDelete = (id) => {
    setOpenDialogMapDelete((prevState) => ({
      ...prevState,
      [id]: false
    }));
  };

  const handleCloseEdit = (id) => {
    setOpenDialogMapEdit((prevState) => ({
      ...prevState,
      [id]: false
    }));
  };

  // xử lí show list exam đang hoạt động thuộc danh mục đề thi
  const handleOpenShowList = () => {
    setOpen(true);
  };
  const handleCloseShowList = () => {
    setOpen(false);
  };

  const handleStatusChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setStatusValue(Number(e.target.value));
  };

  const handleChangePagination = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(Number(value));
  };

  const handleChangeLimit = (event: ChangeEvent<HTMLInputElement>) => {
    setLimit(Number(event.target.value));
  };

  /**
   * khi có sự kiện thay đổi thì truyền sự kiện
   * lên component cha để gọi lấy list danh sách
   */
  useEffect(() => {
    onClickPagination(valueSearch, page, limit, statusValue);
  }, [page]);

  useEffect(() => {
    onClickPagination(valueSearch, PAGE_DEFAULT, limit, statusValue);
  }, [limit, statusValue]);

  const handleChangeStatusCategory = (id: number) => {
    categoryApi.changeStatus(id)
      .then((response) => {
        onClickPagination(valueSearch, page, limit, statusValue);
        toast.success(EditSuccess);
      })
      .catch((error) => {
        toast.error(`${error.response?.data?.message}`);
      });

    handleCloseDelete(id);
  };

  const handleSubmitSearch = () => {
    onClickPagination(valueSearch, PAGE_DEFAULT, limit, statusValue);
  };

  /**
   * hàm này để lắng nge sự kiện sau khi edit xong
   * thì gọi lại để lấy dữ liệu mới sau khi edit
   */
  const onChangeValue = () => {
    onClickPagination(valueSearch, page, limit, statusValue);
  };

  return (
    <CategoryContext.Provider value={{ onChangeValue }}>
      <Card>
        <ToastContainer />
        <CardHeader
          action={
            <Box
              width={600}
              sx={{ display: 'flex', justifyContent: 'space-between' }}
            >
              <Search
                valueSearch={valueSearch}
                setValueSearch={setValueSearch}
                handleSubmitSearch={handleSubmitSearch}
                label="Search category"
              />
              <DropDownComponent
                arr={statusOptions}
                label="Status"
                value={statusValue}
                handleStatusChange={handleStatusChange}
                type={0}
              />
            </Box>
          }
          title="Quản lý danh mục"
        />

        <Divider />

        <TableListCategory
          listCategory={listCategory}
          labelTable={labelTableDanhMuc}
          getStatusLabel={getStatusLabel}
          handleChangeStatusCategory={handleChangeStatusCategory}
          handleClickOpenDelete={handleClickOpenDelete}
          handleCloseDelete={handleCloseDelete}
          openDialogMapDelete={openDialogMapDelete}
          handleClickOpenEdit={handleClickOpenEdit}
          handleCloseEdit={handleCloseEdit}
          openDialogMapEdit={openDialogMapEdit}
        />

        {listCategory.length > 0 ? (
          <PaginationComponent
            handleChangePagination={handleChangePagination}
            handleChangeLimit={handleChangeLimit}
            totalRecord={totalRecord}
            limit={limit}
          />
        ) : (
          <Box p={2} sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Empty />
          </Box>
        )}
      </Card>
    </CategoryContext.Provider>
  );
};

export default CategoryContext;
