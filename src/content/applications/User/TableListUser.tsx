import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme
} from '@mui/material';
import TableCellComponent from 'src/components/TableCellComponent/TableCellComponent';
import IconActions from 'src/components/IconActions/IconActions';
import { StatusEnum } from 'src/utils/enum/StatusEnum';
import DialogDelete from './DialogDelete';

function TableListUser({
  listUser,
  labelTable,
  getStatusLabel,
  handleChangeStatusUser,
  handleClickOpenDelete,
  handleCloseDelete,
  openDialogMapDelete
}: any) {
  const theme = useTheme();

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {labelTable.map((item: any) => (
                <TableCell align="center" key={item.id}>
                  {item.name}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {listUser &&
              listUser.map((item: any) => {
                return (
                  <TableRow hover key={item.id}>
                    <TableCellComponent position={'center'} value={item.id} />
                    <TableCellComponent position={'center'} value={item.user_name} />
                    <TableCellComponent position={'center'} value={item.full_name} />
                    <TableCellComponent position={'center'} value={item.email} />
                    <TableCellComponent position={'center'} value={item.phone} />

                    <TableCell align="center">
                      {getStatusLabel(item.is_active, 'Active', 'Inactive')}
                    </TableCell>
                    <TableCell align="center">
                      {item.is_active === StatusEnum.ON ? (
                        <IconActions
                          title="Khóa tài khoản"
                          handleClickOpen={handleClickOpenDelete}
                          id={item.id}
                          type={0}
                        />
                      ) : (
                        <IconActions
                          title="Mở tài khoản"
                          handleClickOpen={handleClickOpenDelete}
                          id={item.id}
                          type={1}
                        />
                      )}
                    </TableCell>

                    <DialogDelete
                      openDialogMapDelete={openDialogMapDelete}
                      id={item.id}
                      handleCloseDelete={handleCloseDelete}
                      handleChangeStatusUser={handleChangeStatusUser}
                    />
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default TableListUser; 