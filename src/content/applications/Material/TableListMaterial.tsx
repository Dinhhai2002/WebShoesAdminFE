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
import DialogStatusMaterial from './DialogStatusMaterial';
import DialogEditMaterial from './DialogEditMaterial';
import { useState } from 'react';
import { Material } from 'src/services/API/MaterialApi';

interface TableListMaterialProps {
  listMaterial: Material[];
  labelTable: { id: number; label: string }[];
  handleClickOpenStatus: (id: number, status: number) => void;
  handleChangeStatus: (id: number) => void;
  onRefresh: () => void;
}

function TableListMaterial({
  listMaterial,
  labelTable,
  handleClickOpenStatus,
  handleChangeStatus,
  onRefresh
}: TableListMaterialProps) {
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
            {listMaterial.map((material) => (
              <TableRow hover key={material.id}>
                <TableCell>{material.id}</TableCell>
                <TableCell>{material.name}</TableCell>
                <TableCell>
                  <Chip
                    icon={material.status === 1 ? <CheckCircleIcon /> : <BlockIcon />}
                    label={material.status === 1 ? 'Hoạt động' : 'Tạm khóa'}
                    color={material.status === 1 ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Chỉnh sửa">
                    <IconButton
                      size="small"
                      onClick={() => handleClickOpenEditDialog(material.id)}
                      sx={{ color: 'primary.main' }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={material.status === 1 ? 'Tạm khóa' : 'Kích hoạt'}>
                    <IconButton
                      size="small"
                      onClick={() => handleClickOpenStatusDialog(material.id, material.status)}
                      sx={{ color: material.status === 1 ? 'error.main' : 'success.main' }}
                    >
                      {material.status === 1 ? <BlockIcon /> : <CheckCircleIcon />}
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <DialogStatusMaterial
        open={openStatusDialog}
        onClose={handleCloseStatusDialog}
        id={selectedId}
        currentStatus={selectedStatus}
        handleChangeStatus={handleChangeStatus}
      />

      <DialogEditMaterial
        open={openEditDialog}
        onClose={handleCloseEditDialog}
        id={selectedId}
        onSuccess={onRefresh}
      />
    </>
  );
}

export default TableListMaterial;