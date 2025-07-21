import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert
} from '@mui/material';
import {
  getExchangeStatusLabel,
  getExchangeStatusColor
} from 'src/constants/ReturnRequestConstants';
import { formatCurrency } from 'src/utils/formatCurrency';

interface DialogExchangeRequestDetailsProps {
  open: boolean;
  onClose: () => void;
  exchangeRequest: any;
}

const DialogExchangeRequestDetails = ({
  open,
  onClose,
  exchangeRequest
}: DialogExchangeRequestDetailsProps) => {
  if (!exchangeRequest) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateTotalAmount = () => {
    if (!exchangeRequest.details) return 0;
    return exchangeRequest.details.reduce((total: number, detail: any) => {
      const oldPrice = detail.old_product_detail?.price || 0;
      const newPrice = detail.new_product_detail?.price || 0;
      return total + (newPrice - oldPrice) * detail.quantity;
    }, 0);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        Chi tiết yêu cầu đổi hàng #{exchangeRequest.id}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          {/* Thông tin cơ bản */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Thông tin cơ bản
            </Typography>
            <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    ID yêu cầu đổi hàng:
                  </Typography>
                  <Typography variant="body1">
                    #{exchangeRequest.id}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Mã yêu cầu đổi trả:
                  </Typography>
                  <Typography variant="body1">
                    #{exchangeRequest.return_request_id}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Trạng thái:
                  </Typography>
                  <Chip
                    label={getExchangeStatusLabel(exchangeRequest.status)}
                    size="small"
                    sx={{
                      backgroundColor: getExchangeStatusColor(exchangeRequest.status),
                      color: 'white'
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Chênh lệch giá:
                  </Typography>
                  {exchangeRequest.price_difference ? (
                    <Chip
                      label={formatCurrency(exchangeRequest.price_difference)}
                      color={exchangeRequest.price_difference > 0 ? 'error' : 'success'}
                      size="small"
                    />
                  ) : (
                    <Typography variant="body1">-</Typography>
                  )}
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Ngày tạo:
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(exchangeRequest.created_at)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Ngày cập nhật:
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(exchangeRequest.updated_at)}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Grid>

          {/* Lý do đổi hàng */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Lý do đổi hàng
            </Typography>
            <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
              <Typography variant="body1">
                {exchangeRequest.exchange_reason}
              </Typography>
            </Box>
          </Grid>

          {/* Ghi chú admin */}
          {exchangeRequest.admin_notes && (
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Ghi chú của admin
              </Typography>
              <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                <Typography variant="body1">
                  {exchangeRequest.admin_notes}
                </Typography>
              </Box>
            </Grid>
          )}

          {/* Chi tiết sản phẩm đổi */}
          {exchangeRequest.details && exchangeRequest.details.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Chi tiết sản phẩm đổi
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Sản phẩm cũ</TableCell>
                      <TableCell>Sản phẩm mới</TableCell>
                      <TableCell>Số lượng</TableCell>
                      <TableCell>Giá cũ</TableCell>
                      <TableCell>Giá mới</TableCell>
                      <TableCell>Chênh lệch</TableCell>
                      <TableCell>Lý do</TableCell>
                      <TableCell>Tình trạng</TableCell>
                      <TableCell>Hình ảnh</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {exchangeRequest.details.map((detail: any, index: number) => {
                      const oldPrice = detail.old_product_detail?.price || 0;
                      const newPrice = detail.new_product_detail?.price || 0;
                      const difference = (newPrice - oldPrice) * detail.quantity;
                      
                      return (
                        <TableRow key={index}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <img
                                src={detail.old_product_detail?.image_url}
                                alt={detail.old_product_detail?.name}
                                style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }}
                              />
                              <Box>
                                <Typography variant="body2" fontWeight="bold">
                                  {detail.old_product_detail?.name || `Sản phẩm #${detail.old_product_detail_id}`}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {detail.old_product_detail?.color} - {detail.old_product_detail?.size}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" display="block">
                                  Product ID: {detail.old_product_id}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <img
                                src={detail.new_product_detail?.image_url}
                                alt={detail.new_product_detail?.name}
                                style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }}
                              />
                              <Box>
                                <Typography variant="body2" fontWeight="bold">
                                  {detail.new_product_detail?.name || `Sản phẩm #${detail.new_product_detail_id}`}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {detail.new_product_detail?.color} - {detail.new_product_detail?.size}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" display="block">
                                  Product ID: {detail.new_product_id}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>{detail.quantity}</TableCell>
                          <TableCell>{formatCurrency(oldPrice)}</TableCell>
                          <TableCell>{formatCurrency(newPrice)}</TableCell>
                          <TableCell>
                            <Chip
                              label={formatCurrency(difference)}
                              color={difference > 0 ? 'error' : difference < 0 ? 'success' : 'default'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>{detail.exchange_reason}</TableCell>
                          <TableCell>{detail.condition_description}</TableCell>
                          <TableCell>
                            {detail.images && detail.images.length > 0 ? (
                              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                {detail.images.map((image: string, imgIndex: number) => (
                                  <img
                                    key={imgIndex}
                                    src={image}
                                    alt={`Hình ảnh ${imgIndex + 1}`}
                                    style={{ 
                                      width: 50, 
                                      height: 50, 
                                      objectFit: 'cover',
                                      borderRadius: 4,
                                      cursor: 'pointer'
                                    }}
                                    onClick={() => window.open(image, '_blank')}
                                  />
                                ))}
                              </Box>
                            ) : (
                              <Typography variant="body2" color="text.secondary">
                                Không có hình ảnh
                              </Typography>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              
              {/* Tổng chênh lệch giá */}
              <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="h6" align="right">
                  Tổng chênh lệch giá: {formatCurrency(calculateTotalAmount())}
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogExchangeRequestDetails; 