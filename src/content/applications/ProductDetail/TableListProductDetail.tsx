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
import VisibilityIcon from '@mui/icons-material/Visibility';
import DialogStatusProductDetail from './DialogStatusProductDetail';
import DialogEditProductDetail from './DialogEditProductDetail';
import DialogDetailProductDetail from './DialogDetailProductDetail';
import { useState } from 'react';
import { ProductDetail } from 'src/services/API/ProductDetailApi';
import productDetailApi from 'src/services/API/ProductDetailApi';
import { toast } from 'react-toastify';

interface TableListProductDetailProps {
  listProductDetail: ProductDetail[];
  labelTable: { id: number; label: string }[];
  handleClickOpenStatus: (id: number, status: number) => void;
  handleChangeStatus: (id: number) => void;
  onRefresh: () => void;
}

function TableListProductDetail({
  listProductDetail,
  labelTable,
  handleClickOpenStatus,
  handleChangeStatus,
  onRefresh
}: TableListProductDetailProps) {
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [selectedId, setSelectedId] = useState<number>(0);
  const [selectedStatus, setSelectedStatus] = useState<number>(1);
  const [selectedDetailId, setSelectedDetailId] = useState<number | null>(null);

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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
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
              {/* <TableCell align="right">Barcode</TableCell> */}
              <TableCell align="right">Chi tiết</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {listProductDetail.map((product) => (
              <TableRow hover key={product.id}>
                <TableCell>{product.id}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.product_id}</TableCell>
                <TableCell>{product.color}</TableCell>
                <TableCell>{product.size}</TableCell>
                <TableCell>{product.material}</TableCell>
                {/* <TableCell>{product.brand}</TableCell> */}
                {/* <TableCell>{product.category}</TableCell> */}
                <TableCell>{formatPrice(product.price)}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>
                  <Chip
                    icon={
                      product.stock === 0
                        ? <BlockIcon />
                        : product.status === 1
                          ? <CheckCircleIcon />
                          : <BlockIcon />
                    }
                    label={
                      product.stock === 0
                        ? 'Hết hàng'
                        : product.status === 1
                          ? 'Hoạt động'
                          : 'Tạm khóa'
                    }
                    color={
                      product.stock === 0
                        ? 'warning'
                        : product.status === 1
                          ? 'success'
                          : 'error'
                    }
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
                {/* <TableCell>
                  {product.barcode && (
                    <Tooltip title="Xem barcode">
                      <IconButton
                        size="small"
                        onClick={async () => {
                          try {
                            const blob = await productDetailApi.getBarcodeImage(product.barcode);
                            const url = URL.createObjectURL(blob);
                            window.open(url, '_blank');
                          } catch (error: any) {
                            toast.error(error?.message || 'Không thể lấy hình ảnh barcode!');
                          }
                        }}
                        sx={{ color: 'secondary.main' }}
                      >
                        <img src="https://img.icons8.com/ios-filled/24/000000/barcode.png" alt="barcode icon" style={{ width: 20, height: 20 }} />
                      </IconButton>
                    </Tooltip>
                  )}
                </TableCell> */}
                <TableCell align="right">
                  <Tooltip title="Xem chi tiết">
                    <IconButton
                      size="small"
                      onClick={() => {
                        setSelectedDetailId(product.id);
                        setOpenDetailDialog(true);
                      }}
                      sx={{ color: 'info.main' }}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <DialogStatusProductDetail
        open={openStatusDialog}
        onClose={handleCloseStatusDialog}
        id={selectedId}
        currentStatus={selectedStatus}
        handleChangeStatus={handleChangeStatus}
      />

      <DialogEditProductDetail
        open={openEditDialog}
        onClose={handleCloseEditDialog}
        id={selectedId}
        onSuccess={onRefresh}
      />

      <DialogDetailProductDetail
        open={openDetailDialog}
        onClose={() => setOpenDetailDialog(false)}
        id={selectedDetailId}
      />
    </>
  );
}

export default TableListProductDetail;