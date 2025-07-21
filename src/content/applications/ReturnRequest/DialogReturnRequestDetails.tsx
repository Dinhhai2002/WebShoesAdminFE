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
  getReturnStatusLabel,
  getReturnStatusColor,
  getReturnTypeLabel,
  isExchangeType
} from 'src/constants/ReturnRequestConstants';
import { formatCurrency } from 'src/utils/formatCurrency';

interface DialogReturnRequestDetailsProps {
  open: boolean;
  onClose: () => void;
  returnRequest: any;
}

const DialogReturnRequestDetails = ({
  open,
  onClose,
  returnRequest
}: DialogReturnRequestDetailsProps) => {
  if (!returnRequest) return null;

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
    if (!returnRequest.details) return 0;
    return returnRequest.details.reduce((total: number, detail: any) => {
      return total + (detail?.price || 0) * detail.quantity;
    }, 0);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        Chi tiết yêu cầu đổi trả hàng #{returnRequest.id}
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
                    ID yêu cầu:
                  </Typography>
                  <Typography variant="body1">
                    #{returnRequest.id}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Mã đơn hàng:
                  </Typography>
                  <Typography variant="body1">
                    #{returnRequest.order_id}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Loại đổi trả:
                  </Typography>
                  <Typography variant="body1">
                    {getReturnTypeLabel(returnRequest.return_type)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Trạng thái:
                  </Typography>
                  <Chip
                    label={getReturnStatusLabel(returnRequest.status)}
                    size="small"
                    sx={{
                      backgroundColor: getReturnStatusColor(returnRequest.status),
                      color: 'white'
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Ngày tạo:
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(returnRequest.created_at)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Ngày cập nhật:
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(returnRequest.updated_at)}
                  </Typography>
                </Grid>
                {isExchangeType(returnRequest.return_type) && returnRequest.price_difference !== undefined && (
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Chênh lệch giá:
                    </Typography>
                    <Chip
                      label={formatCurrency(returnRequest.price_difference)}
                      color={returnRequest.price_difference > 0 ? 'error' : returnRequest.price_difference < 0 ? 'success' : 'default'}
                      size="small"
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                      {returnRequest.price_difference > 0 ? '(Khách hàng cần thanh toán thêm)' : 
                       returnRequest.price_difference < 0 ? '(Cần hoàn tiền cho khách hàng)' : 
                       '(Không có chênh lệch giá)'}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Box>
          </Grid>

          {/* Lý do đổi trả */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Lý do đổi trả
            </Typography>
            <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
              <Typography variant="body1">
                {returnRequest.return_reason}
              </Typography>
            </Box>
          </Grid>

          {/* Ghi chú admin */}
          {returnRequest.admin_notes && (
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Ghi chú của admin
              </Typography>
              <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                <Typography variant="body1">
                  {returnRequest.admin_notes}
                </Typography>
              </Box>
            </Grid>
          )}

          {/* Chi tiết sản phẩm */}
          {returnRequest.details && returnRequest.details.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Chi tiết sản phẩm đổi trả
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Sản phẩm</TableCell>
                      <TableCell>Số lượng</TableCell>
                      <TableCell>Giá đơn vị</TableCell>
                      <TableCell>Thành tiền</TableCell>
                      <TableCell>Lý do</TableCell>
                      <TableCell>Tình trạng</TableCell>
                      <TableCell>Hình ảnh</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {returnRequest.details.map((detail: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <img
                              src={detail.product_detail?.image_url}
                              alt={detail.product_detail?.name}
                              style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }}
                            />
                            <Box>
                              <Typography variant="body2" fontWeight="bold">
                                {detail.product_detail?.name || `Sản phẩm #${detail.product_detail_id}`}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {detail.product_detail?.color} - {detail.product_detail?.size}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" display="block">
                                Product ID: {detail.product_id}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>{detail.quantity}</TableCell>
                        <TableCell>{formatCurrency(detail?.price || 0)}</TableCell>
                        <TableCell>{formatCurrency((detail?.price || 0) * detail.quantity)}</TableCell>
                        <TableCell>{detail.return_reason}</TableCell>
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
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              {/* Tổng tiền */}
              <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="h6" align="right">
                  Tổng tiền: {formatCurrency(calculateTotalAmount())}
                </Typography>
              </Box>
            </Grid>
          )}

          {/* Thông tin đổi hàng nếu có */}
          {isExchangeType(returnRequest.return_type) && returnRequest.exchange_request && (
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Thông tin đổi hàng
              </Typography>
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  Yêu cầu đổi hàng đã được tạo với ID: #{returnRequest.exchange_request.id}
                </Typography>
              </Alert>
              <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Trạng thái đổi hàng:
                    </Typography>
                    <Chip
                      label={getReturnStatusLabel(returnRequest.exchange_request.status)}
                      size="small"
                      sx={{
                        backgroundColor: getReturnStatusColor(returnRequest.exchange_request.status),
                        color: 'white'
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Lý do đổi hàng:
                    </Typography>
                    <Typography variant="body1">
                      {returnRequest.exchange_request.exchange_reason}
                    </Typography>
                  </Grid>
                  {returnRequest.exchange_request.admin_notes && (
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">
                        Ghi chú admin (đổi hàng):
                      </Typography>
                      <Typography variant="body1">
                        {returnRequest.exchange_request.admin_notes}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
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

export default DialogReturnRequestDetails; 