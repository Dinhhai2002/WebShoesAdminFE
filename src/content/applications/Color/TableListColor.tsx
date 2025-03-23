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
import DialogStatusColor from './DialogStatusColor';
import DialogEditColor from './DialogEditColor';
import { useState } from 'react';
import { Color } from 'src/services/API/ColorApi';

interface TableListColorProps {
  listColor: Color[];
  labelTable: { id: number; label: string }[];
  handleClickOpenStatus: (id: number, status: number) => void;
  handleChangeStatus: (id: number) => void;
  onRefresh: () => void;
}

function TableListColor({
  listColor,
  labelTable,
  handleClickOpenStatus,
  handleChangeStatus,
  onRefresh
}: TableListColorProps) {
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
            {listColor.map((color) => (
              <TableRow hover key={color.id}>
                <TableCell>{color.id}</TableCell>
                <TableCell>{color.name}</TableCell>
                <TableCell>
                  <Chip
                    icon={color.status === 1 ? <CheckCircleIcon /> : <BlockIcon />}
                    label={color.status === 1 ? 'Hoạt động' : 'Tạm khóa'}
                    color={color.status === 1 ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Chỉnh sửa">
                    <IconButton
                      size="small"
                      onClick={() => handleClickOpenEditDialog(color.id)}
                      sx={{ color: 'primary.main' }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={color.status === 1 ? 'Tạm khóa' : 'Kích hoạt'}>
                    <IconButton
                      size="small"
                      onClick={() => handleClickOpenStatusDialog(color.id, color.status)}
                      sx={{ color: color.status === 1 ? 'error.main' : 'success.main' }}
                    >
                      {color.status === 1 ? <BlockIcon /> : <CheckCircleIcon />}
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <DialogStatusColor
        open={openStatusDialog}
        onClose={handleCloseStatusDialog}
        id={selectedId}
        currentStatus={selectedStatus}
        handleChangeStatus={handleChangeStatus}
      />

      <DialogEditColor
        open={openEditDialog}
        onClose={handleCloseEditDialog}
        id={selectedId}
        onSuccess={onRefresh}
      />
    </>
  );
}

export default TableListColor;