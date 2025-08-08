import {
  Box,
  Card,
  CardHeader,
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
import userApiService from 'src/services/API/UserApiService';
import { PAGE_DEFAULT } from 'src/utils/Constant';
import {
  getStatusLabel,
  labelTableUser,
  statusOptions,
  roleOptions
} from 'src/utils/LabelTable';
import { EditSuccess } from 'src/utils/MessageToast';
import TableListUser from './TableListUser';
import { RoleEnum } from 'src/utils/enum/RoleEnum';

const UserContext = createContext(null);

export const RecentOrdersTable = ({
  listUser,
  totalRecord,
  onClickPagination
}: any) => {
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [statusValue, setStatusValue] = useState<number>(-1);
  const [roleValue, setRoleValue] = useState<number>(-1);
  const [valueSearch, setValueSearch] = useState('');
  const [openDialogMapDelete, setOpenDialogMapDelete] = useState({});
  const [openDialogMapEdit, setOpenDialogMapEdit] = useState({});

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

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

  const handleChangeStatus = (event: ChangeEvent<HTMLInputElement>) => {
    const newStatusValue = Number(event.target.value);
    setStatusValue(newStatusValue);
    setPage(PAGE_DEFAULT);
    onClickPagination(valueSearch, PAGE_DEFAULT, limit, newStatusValue, roleValue);
  };

  const handleChangeRole = (event: ChangeEvent<HTMLInputElement>) => {
    const newRoleValue = Number(event.target.value);
    setRoleValue(newRoleValue);
    setPage(PAGE_DEFAULT);
    onClickPagination(valueSearch, PAGE_DEFAULT, limit, statusValue, newRoleValue);
  };

  const handleChangePagination = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    const newPage = Number(value);
    setPage(newPage);
    onClickPagination(valueSearch, newPage, limit, statusValue, roleValue);
  };

  const handleChangeLimit = (event: ChangeEvent<HTMLInputElement>) => {
    const newLimit = Number(event.target.value);
    setLimit(newLimit);
    setPage(PAGE_DEFAULT);
    onClickPagination(
      valueSearch,
      PAGE_DEFAULT,
      newLimit,
      statusValue,
      roleValue
    );
  };

  const handleSubmitSearch = () => {
    setPage(PAGE_DEFAULT);
    onClickPagination(valueSearch, PAGE_DEFAULT, limit, statusValue, roleValue);
  };

  const onChangeValue = () => {
    onClickPagination(valueSearch, page, limit, statusValue, roleValue);
  };

  const handleChangeStatusUser = (id: number) => {
    userApiService.changeStatus(id)
      .then((response) => {
        onClickPagination(valueSearch, page, limit, statusValue, roleValue);
        toast.success(EditSuccess);
      })
      .catch((error) => {
        toast.error(error?.message || 'Đã có lỗi xảy ra!');
      });

    handleCloseDelete(id);
  };

  return (
    <UserContext.Provider value={{ onChangeValue }}>
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
                label="Tìm kiếm người dùng"
              />
              <DropDownComponent
                arr={statusOptions}
                label="Trạng thái"
                value={statusValue}
                handleStatusChange={handleChangeStatus}
                type={0}
              />
              <DropDownComponent
                arr={roleOptions}
                label="Vai trò"
                value={roleValue}
                handleStatusChange={handleChangeRole}
                type={0}
              />
            </Box>
          }
          title="Danh sách người dùng"
        />

        <Divider />

        <TableListUser
          listUser={listUser}
          labelTable={labelTableUser}
          getStatusLabel={getStatusLabel}
          handleChangeStatusUser={handleChangeStatusUser}
          handleClickOpenDelete={handleClickOpenDelete}
          handleCloseDelete={handleCloseDelete}
          openDialogMapDelete={openDialogMapDelete}
          handleClickOpenEdit={handleClickOpenEdit}
          handleCloseEdit={handleCloseEdit}
          openDialogMapEdit={openDialogMapEdit}
        />

        {listUser.length > 0 ? (
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
    </UserContext.Provider>
  );
};

export default UserContext; 