import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { ProductDetail } from 'src/services/API/ProductDetailApi';
import productDetailApi from 'src/services/API/ProductDetailApi';
import { toast } from 'react-toastify';

interface DialogDetailProductDetailProps {
  open: boolean;
  onClose: () => void;
  id: number | null;
}

const DialogDetailProductDetail: React.FC<DialogDetailProductDetailProps> = ({ open, onClose, id }) => {
  const [detail, setDetail] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [barcodeImgUrl, setBarcodeImgUrl] = useState<string | null>(null);
  const [barcodeLoading, setBarcodeLoading] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false); // Trạng thái dialog xác nhận

  useEffect(() => {
    if (open && id) {
      setLoading(true);
      productDetailApi.findOne(id)
        .then((res) => setDetail(res.data))
        .catch((err) => toast.error(err?.message || 'Không lấy được thông tin sản phẩm!'))
        .finally(() => setLoading(false));
      setBarcodeImgUrl(null);
    }
  }, [open, id]);

  const handleShowBarcode = async () => {
    if (!detail?.barcode) return;
    setBarcodeLoading(true);
    try {
      const blob = await productDetailApi.getBarcodeImage(detail.barcode);
      const url = URL.createObjectURL(blob);
      setBarcodeImgUrl(url);
    } catch (error: any) {
      toast.error(error?.message || 'Không thể lấy hình ảnh barcode!');
    } finally {
      setBarcodeLoading(false);
    }
  };

  // Mở dialog xác nhận
  const handleOpenConfirmDialog = () => {
    setConfirmDialogOpen(true);
  };

  // Đóng dialog xác nhận
  const handleCloseConfirmDialog = () => {
    setConfirmDialogOpen(false);
  };
  
  // Xử lý xác nhận thay đổi màu sắc (để trống cho bạn triển khai)
  const handleConfirmChangeColor = () => {
    productDetailApi.updateImage(id)
      .then(() => {
        toast.success('áp dụng thay đổi hình ảnh thành công cho các sản phẩm chi tiết cùng màu sắc!');
        onClose();
      })
      .catch((err) => toast.error(err?.message || 'Không thay đổi được màu sắc!'));
    setConfirmDialogOpen(false);
  };
  
  return (
    <>
      {/* Dialog chi tiết sản phẩm */}
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Chi tiết sản phẩm</DialogTitle>
        <DialogContent>
          {loading ? (
            <Typography>Đang tải...</Typography>
          ) : detail ? (
            <Box>
              <Typography><b>ID:</b> {detail.id}</Typography>
              <Typography><b>Tên:</b> {detail.name}</Typography>
              <Typography><b>Mã sản phẩm:</b> {detail.product_id}</Typography>
              <Typography><b>Màu:</b> {detail.color}</Typography>
              <Typography><b>Size:</b> {detail.size}</Typography>
              <Typography><b>Chất liệu:</b> {detail.material}</Typography>
              <Typography><b>Thương hiệu:</b> {detail.brand}</Typography>
              <Typography><b>Danh mục:</b> {detail.category}</Typography>
              <Typography><b>Giá:</b> {detail.price.toLocaleString('vi-VN')} VND</Typography>
              <Typography><b>Tồn kho:</b> {detail.stock}</Typography>
              <Typography><b>Trạng thái:</b> {detail.status === 1 ? 'Hoạt động' : 'Tạm khóa'}</Typography>
              <Typography><b>Barcode:</b> {detail.barcode || 'Không có'}</Typography>
              {detail.barcode && (
                <Box mt={2}>
                  <Button variant="outlined" onClick={handleShowBarcode} disabled={barcodeLoading}>
                    {barcodeLoading ? 'Đang tải...' : 'Xem hình ảnh barcode'}
                  </Button>
                  {barcodeImgUrl && (
                    <Box mt={2}>
                      <img src={barcodeImgUrl} alt="barcode" style={{ maxWidth: '100%', border: '1px solid #ddd' }} />
                    </Box>
                  )}
                </Box>
              )}
              {/* Nút thay đổi màu sắc */}
              <Box mt={2}>
                <Button variant="contained" onClick={handleOpenConfirmDialog}>
                  Thay đổi màu sắc
                </Button>
              </Box>
            </Box>
          ) : (
            <Typography>Không có dữ liệu.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="contained" color="primary">Đóng</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog xác nhận */}
      <Dialog open={confirmDialogOpen} onClose={handleCloseConfirmDialog}>
        <DialogTitle>Xác nhận thay đổi màu sắc</DialogTitle>
        <DialogContent>
          <Typography>Bạn có chắc chắn muốn thay đổi màu sắc của sản phẩm này không?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog}>No</Button>
          <Button onClick={handleConfirmChangeColor} variant="contained" color="primary">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DialogDetailProductDetail;