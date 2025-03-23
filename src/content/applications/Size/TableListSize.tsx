import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Chip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DialogStatusSize from './DialogStatusSize';
import DialogEditSize from './DialogEditSize';
import { useState } from 'react';
import { Size } from 'src/services/API/SizeApi';

interface TableListSizeProps {
  listSize: Size[];
  labelTable: { id: number; label: string }[];
  handleClickOpenStatus: (id: number, status: number) => void;
  handleChangeStatus: (id: number) => void;
  onRefresh: () => void;
}

function TableListSize({
  listSize,
  labelTable,
  handleClickOpenStatus,
  handleChangeStatus,
  onRefresh
}: TableListSizeProps) {
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedId, setSelectedId] = useState<number>(0);
  const [selectedStatus, setSelectedStatus] = useState<number>(1);

  const handleClickOpenStatusDialog = (id: number, status: number) => {
    setSelectedId(id);
    setSelectedStatus(status);
    setOpenStatusDialog(true);
  };

  const handleCloseStatusDialog = () => {
    setOpenStatusDialog(false);
    setSelectedId(0);
  };

  const handleClickOpenEditDialog = (id: number) => {
    setSelectedId(id);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedId(0);
  };

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {labelTable.map((label) => (
                <TableCell key={label.id}>{label.label}</TableCell>
              ))}
              <TableCell align="right">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {listSize.map((size) => (
              <TableRow hover key={size.id}>
                <TableCell>{size.id}</TableCell>
                <TableCell>{size.name}</TableCell>
                <TableCell>
                  <Chip
                    icon={size.status === 1 ? <CheckCircleIcon /> : <BlockIcon />}
                    label={size.status === 1 ? 'Hoạt động' : 'Tạm khóa'}
                    color={size.status === 1 ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Chỉnh sửa">
                    <IconButton
                      size="small"
                      onClick={() => handleClickOpenEditDialog(size.id)}
                      sx={{ color: 'primary.main' }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={size.status === 1 ? 'Tạm khóa' : 'Kích hoạt'}>
                    <IconButton
                      size="small"
                      onClick={() => handleClickOpenStatusDialog(size.id, size.status)}
                      sx={{ color: size.status === 1 ? 'error.main' : 'success.main' }}
                    >
                      {size.status === 1 ? <BlockIcon /> : <CheckCircleIcon />}
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <DialogStatusSize
        open={openStatusDialog}
        onClose={handleCloseStatusDialog}
        id={selectedId}
        currentStatus={selectedStatus}
        handleChangeStatus={handleChangeStatus}
      />

      <DialogEditSize
        open={openEditDialog}
        onClose={handleCloseEditDialog}
        id={selectedId}
        onSuccess={onRefresh}
      />
    </>
  );
}

export default TableListSize; 