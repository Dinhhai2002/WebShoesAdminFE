import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
  IconButton,
  Tooltip,
  Box
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import TableCellComponent from 'src/components/TableCellComponent/TableCellComponent';
import Label from 'src/components/Label';
import { StatusEnum } from 'src/utils/enum/StatusEnum';
import { getStatusLabel } from 'src/utils/LabelTable';

interface TableListBrandProps {
  listBrand: any[];
  labelTable: any[];
  handleClickOpenEdit: (id: number) => void;
  handleClickOpenStatus: (id: number, status: number) => void;
  handleChangeStatus: (id: number) => void;
}

function TableListBrand({
  listBrand,
  labelTable,
  handleClickOpenEdit,
  handleClickOpenStatus,
  handleChangeStatus
}: TableListBrandProps) {
  const theme = useTheme();

  // const getStatusColor = (status: number) => {
  //   switch (status) {
  //     case StatusEnum.ACTIVE:
  //       return 'success';
  //     case StatusEnum.INACTIVE:
  //       return 'error';
  //     default:
  //       return 'info';
  //   }
  // };

  // const getStatusText = (status: number) => {
  //   switch (status) {
  //     case StatusEnum.ACTIVE:
  //       return 'Hoạt động';
  //     case StatusEnum.INACTIVE:
  //       return 'Không hoạt động';
  //     default:
  //       return 'Không xác định';
  //   }
  // };

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            {labelTable.map((item: any) => (
              <TableCell align="center" key={item.id}>
                {item.name}
              </TableCell>
            ))}
            {/* <TableCell align="center">Thao tác</TableCell> */}
          </TableRow>
        </TableHead>
        <TableBody>
          {listBrand &&
            listBrand.map((item: any) => {
              return (
                <TableRow hover key={item.id}>
                  <TableCellComponent position={'center'} value={item.id} />
                  <TableCellComponent position={'center'} value={item.name} />
                  <TableCell align="center">
                    <Box display="flex" justifyContent="center">
                      <img 
                        src={item.image_url} 
                        alt={item.name}
                        style={{
                          width: '50px',
                          height: '50px',
                          objectFit: 'contain'
                        }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                  {getStatusLabel(item.status, 'Hoạt động', 'Tạm khóa')}
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Chỉnh sửa">
                      <IconButton
                        onClick={() => handleClickOpenEdit(item.id)}
                        color="primary"
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={item.status === StatusEnum.ON ? "Vô hiệu hóa" : "Kích hoạt"}>
                      <IconButton
                        onClick={() => handleClickOpenStatus(item.id, item.status)}
                        color={item.status === StatusEnum.ON ? "error" : "success"}
                        size="small"
                      >
                        {item.status === StatusEnum.ON ? <ToggleOnIcon /> : <ToggleOffIcon />}
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default TableListBrand; 