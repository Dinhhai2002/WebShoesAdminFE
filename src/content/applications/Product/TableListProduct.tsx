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
import DialogStatusProduct from './DialogStatusProduct';
import DialogEditProduct from './DialogEditProduct';
import { useState } from 'react';

interface TableListProductProps {
  listProduct: any[];
  labelTable: { id: number; label: string }[];
  handleClickOpenStatus: (id: number, status: number) => void;
  handleChangeStatus: (id: number) => void;
  onRefresh: () => void;
}

function TableListProduct({
  listProduct,
  labelTable,
  handleClickOpenStatus,
  handleChangeStatus,
  onRefresh
}: TableListProductProps) {
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
            {listProduct.map((product) => (
              <TableRow hover key={product.id}>
                <TableCell>{product.id}</TableCell>
                <TableCell sx={{ maxWidth: 200, whiteSpace: 'normal', wordWrap: 'break-word' }}>
                  {product.name}
                </TableCell>
                <TableCell sx={{ color: 'text.secondary' }}>
                  {product.brand_name || 'Không có thương hiệu'}
                </TableCell>
                <TableCell sx={{ color: 'text.secondary' }}>
                  {product.category_name || 'Không có danh mục'}
                </TableCell>
                <TableCell>{product.price.toLocaleString('vi-VN')}đ</TableCell>
                <TableCell>{product.average_rating.toFixed(1)}</TableCell>
                <TableCell>
                  <Chip
                    icon={product.status === 1 ? <CheckCircleIcon /> : <BlockIcon />}
                    label={product.status === 1 ? 'Hoạt động' : 'Tạm khóa'}
                    color={product.status === 1 ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Chỉnh sửa">
                    <IconButton
                      size="small"
                      onClick={() => handleClickOpenEditDialog(product.id)}
                      sx={{ color: 'primary.main' }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={product.status === 1 ? 'Tạm khóa' : 'Kích hoạt'}>
                    <IconButton
                      size="small"
                      onClick={() => handleClickOpenStatusDialog(product.id, product.status)}
                      sx={{ color: product.status === 1 ? 'error.main' : 'success.main' }}
                    >
                      {product.status === 1 ? <BlockIcon /> : <CheckCircleIcon />}
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <DialogStatusProduct
        open={openStatusDialog}
        onClose={handleCloseStatusDialog}
        id={selectedId}
        currentStatus={selectedStatus}
        handleChangeStatus={handleChangeStatus}
      />

      <DialogEditProduct
        open={openEditDialog}
        onClose={handleCloseEditDialog}
        id={selectedId}
        onSuccess={onRefresh}
      />
    </>
  );
}

export default TableListProduct; 