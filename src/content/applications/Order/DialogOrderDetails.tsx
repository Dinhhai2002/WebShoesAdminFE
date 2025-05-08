import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
  Zoom,
  Chip,
  SvgIcon
} from '@mui/material';
import { Save } from '@mui/icons-material';
import {
  useEffect,
  useState,
  useRef
} from 'react';
import { Order } from 'src/services/API/OrderApi';
import orderApi from 'src/services/API/OrderApi';
import Label from 'src/components/Label';
import { StatusOrderEnum } from 'src/utils/enum/StatusOrderEnum';
import { PaymentStatusEnum } from 'src/utils/enum/PaymentStatusEnum';
import { formatCurrency } from 'src/utils/formatCurrency';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { saveAs } from 'file-saver';
import { PaymentMethodEnum } from 'src/utils/enum/PaymentMethodEnum';
import { createVietnamesePDF, registerVietnameseFont, normalizeVietnameseText } from 'src/utils/pdfFontHelper';
import html2canvas from 'html2canvas';

interface DialogOrderDetailsProps {
  open: boolean;
  onClose: () => void;
  orderId: number;
}

function DialogOrderDetails({ open, onClose, orderId }: DialogOrderDetailsProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const pdfRef = useRef<HTMLDivElement>(null);

  const fetchOrderDetail = async () => {
    if (open && orderId) {
      setLoading(true);
      try {
        const response = await orderApi.findOne(orderId);
        setOrder(response.data);
      } catch (error) {
        console.error('Error fetching order details:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchOrderDetail();
  }, [open, orderId]);

  const getStatusLabel = (status: number, paymentMethod: number) => {
    const statusMap = {
      [StatusOrderEnum.PENDING]: { text: 'Chờ xác nhận', color: 'warning' },
      [StatusOrderEnum.CONFIRMED]: { text: 'Đã xác nhận', color: 'success' },
      [StatusOrderEnum.PROCESSING]: { text: 'Đang chuẩn bị hàng', color: 'info' },
      [StatusOrderEnum.SHIPPED]: { text: 'Đã gửi hàng', color: 'primary' },
      [StatusOrderEnum.DELIVERED]: { text: paymentMethod === 3 ? 'Thành công' : 'Đã giao hàng', color: 'success' },
      [StatusOrderEnum.CANCELLED]: { text: 'Đã hủy', color: 'error' },
    };

    const statusInfo = statusMap[status] || { text: 'Không xác định', color: 'default' };
    return <Label color={statusInfo.color}>{statusInfo.text}</Label>;
  };

  const getPaymentStatusLabel = (status: PaymentStatusEnum) => {
    const statusMap = {
      [PaymentStatusEnum.PENDING]: { text: 'Chờ thanh toán', color: 'warning' },
      [PaymentStatusEnum.PROCESSING]: { text: 'Đang xử lý', color: 'info' },
      [PaymentStatusEnum.PAID]: { text: 'Đã thanh toán', color: 'success' },
      [PaymentStatusEnum.FAILED]: { text: 'Thất bại', color: 'error' },
    };

    const statusInfo = statusMap[status] || { text: 'Không xác định', color: 'default' };
    return <Label color={statusInfo.color}>{statusInfo.text}</Label>;
  };

  const getPaymentMethodLabel = (method: number) => {
    const methodMap = {
      1: 'Thanh toán khi nhận hàng',
      2: 'Thanh toán online',
      3: 'Thanh toán tại quầy',
    };

    return methodMap[method] || 'Không xác định';
  };

  const handleExportExcel = async () => {
    const data = order?.order_detail.map((item) => ({
      'Product ID': item.product_detail.product_id,
      'Product Name': item.product_detail.name,
      'Color': item.product_detail.color,
      'Size': item.product_detail.size,
      'Quantity': item.quantity,
      'Unit Price': formatCurrency(item.price),
      'Total Price': formatCurrency(item.total_price)
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'OrderDetails');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, `Order_${order?.id}.xlsx`);
  };

  /**
   * Đảm bảo dữ liệu hiển thị chính xác trong PDF, ngay cả khi font gặp vấn đề
   */
  const ensureVietnameseDisplay = (text: string): string => {
    // Trong trường hợp của html2canvas, không cần phải normalize vì 
    // kết quả sẽ được chụp trực tiếp từ HTML đã render
    // Giữ nguyên text với đầy đủ dấu tiếng Việt
    return text;
  };

  const handleExportPDF = async () => {
    try {
      setPdfLoading(true);
      setIsPrinting(true); // Bật trạng thái in để ẩn các nút không cần thiết
      console.log('Starting PDF export using HTML2Canvas...');
      
      // Đợi một chút để React cập nhật lại UI với trạng thái mới
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Lấy tham chiếu đến nội dung cần xuất PDF
      const content = contentRef.current;
      if (!content) {
        throw new Error('Could not find content element');
      }
      
      // Chuyển đổi HTML sang canvas
      console.log('Converting HTML to canvas...');
      const canvas = await html2canvas(content, {
        scale: 1.5, // Tăng scale để cải thiện chất lượng
        useCORS: true, // Cho phép tải hình ảnh từ các domain khác
        logging: false,
        allowTaint: true, // Cho phép chụp nội dung từ các domain khác
        backgroundColor: '#ffffff', // Đặt nền trắng
        windowWidth: document.documentElement.offsetWidth,
        windowHeight: document.documentElement.offsetHeight
      });
      
      console.log('Canvas created, generating PDF...');
      
      // Tạo PDF từ canvas
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210; // A4 size in mm
      const pageHeight = 297; // A4 size in mm
      const imgHeight = canvas.height * imgWidth / canvas.width;
      
      // Tạo PDF và thêm hình ảnh
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Xử lý nhiều trang nếu nội dung quá dài
      let position = 0;
      let heightLeft = imgHeight;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      // Thêm các trang tiếp theo nếu nội dung không vừa một trang
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      console.log('Saving PDF...');
      pdf.save(`DonHang_${order?.id}.pdf`);
      console.log('PDF export completed successfully');
      
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setPdfLoading(false);
      setIsPrinting(false); // Trả về trạng thái bình thường
    }
  };

  // Hàm hủy quá trình xuất PDF
  const cancelPdfExport = () => {
    setPdfLoading(false);
    setIsPrinting(false);
  };

  if (loading) {
    return (
      <Dialog open={open} onClose={onClose} fullScreen={fullScreen}>
        <DialogTitle>Đang tải...</DialogTitle>
        <DialogContent>
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  if (!order) {
    return null;
  }

  // Component chỉ hiển thị khi chuẩn bị in, được tối ưu cho việc xuất PDF
  const PrintableContent = () => (
    <Box
      sx={{
        width: '100%',
        bgcolor: 'background.paper',
        padding: 2,
        paddingBottom: 4,
        fontFamily: 'Arial, Helvetica, sans-serif' // Font hỗ trợ Unicode tốt
      }}
    >
      <Typography 
        variant="h5" 
        align="center" 
        gutterBottom 
        sx={{ 
          fontWeight: 'bold', 
          mb: 3, 
          fontFamily: 'Arial, Helvetica, sans-serif' // Đảm bảo font nhất quán
        }}
      >
        Chi tiết đơn hàng #{order.id}
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', borderBottom: '1px solid #ccc', pb: 1 }}>
          Thông tin đơn hàng
        </Typography>
        <Typography variant="body1" gutterBottom>Mã đơn hàng: #{order.id}</Typography>
        <Typography variant="body1" gutterBottom>Ngày đặt: {order.created_at}</Typography>
        <Typography variant="body1" gutterBottom>Phương thức thanh toán: {getPaymentMethodLabel(order.payment_method)}</Typography>
        <Typography variant="body1" gutterBottom>Trạng thái thanh toán: {order.payment_status === PaymentStatusEnum.PAID ? 'Đã thanh toán' : 'Chưa thanh toán'}</Typography>
        <Typography variant="body1" gutterBottom>Trạng thái đơn hàng: {order.status === StatusOrderEnum.DELIVERED ? 'Đã giao hàng' : 'Đang xử lý'}</Typography>
      </Box>

      {order.voucher && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', borderBottom: '1px solid #ccc', pb: 1 }}>
            Thông tin voucher
          </Typography>
          <Typography variant="body1" gutterBottom>Mã voucher: {order.voucher.code}</Typography>
          <Typography variant="body1" gutterBottom>
            Loại giảm giá: {order.voucher.discount_type === 1 ? 'Phần trăm' : 'Giảm trực tiếp'}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Giá trị giảm: {order.voucher.discount_type === 1 ? 
              `${order.voucher.discount_value}%` : 
              formatCurrency(order.voucher.discount_value)}
          </Typography>
        </Box>
      )}

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', borderBottom: '1px solid #ccc', pb: 1 }}>
          {order.payment_method === 3 ? "Địa chỉ cửa hàng" : "Địa chỉ giao hàng"}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {order.payment_method === 3 ? "Nhân viên" : "Người nhận"}: {order.shipping_name}
        </Typography>
        <Typography variant="body1" gutterBottom>
          Địa chỉ: {order.shipping_address}, {order.shipping_ward_name}, {order.shipping_district_name}, {order.shipping_city_name}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {order.payment_method === PaymentMethodEnum.STORE ? "Số điện thoại khách hàng" : "Số điện thoại người nhận"}: 
          {order.payment_method === PaymentMethodEnum.STORE ? order.customer_phone : order.shipping_phone}
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', borderBottom: '1px solid #ccc', pb: 1 }}>
          Sản phẩm
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Sản phẩm</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Thông tin</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Đơn giá</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Số lượng</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Thành tiền</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {order.order_detail.map((detail) => (
                <TableRow key={detail.id}>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <img
                        src={detail.product_detail.image_url}
                        alt={detail.product_detail.name}
                        style={{ width: 50, height: 50, objectFit: 'cover', marginRight: 10 }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{detail.product_detail.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {detail.product_detail.color} - {detail.product_detail.size}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">{formatCurrency(detail.price)}</TableCell>
                  <TableCell align="right">{detail.quantity}</TableCell>
                  <TableCell align="right">{formatCurrency(detail.total_price)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <Typography variant="body1" sx={{ mb: 1 }}>
            Tổng tiền hàng: {formatCurrency(order.price)}
          </Typography>
          
          {order.discount_amount > 0 && (
            <Typography variant="body1" sx={{ mb: 1, color: 'error.main' }}>
              Giảm giá: -{formatCurrency(order.discount_amount)}
            </Typography>
          )}
          
          {order.amount_shipping > 0 && (
            <Typography variant="body1" sx={{ mb: 1, color: 'primary.main' }}>
              Phí vận chuyển: +{formatCurrency(order.amount_shipping)}
            </Typography>
          )}
          
          <Typography variant="h6" sx={{ mt: 1, fontWeight: 'bold', borderTop: '1px solid #ccc', pt: 1, width: '200px', textAlign: 'right' }}>
            Tổng cộng: {formatCurrency(order.total_price)}
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      TransitionComponent={Zoom}
      maxWidth="md"
      sx={{
        '& .MuiDialog-paper': {
          width: '90%',
          maxWidth: '1200px',
          margin: '20px auto'
        }
      }}
    >
      <DialogTitle>
        Chi tiết đơn hàng #{order.id}
        {pdfLoading && (
          <Typography variant="caption" color="primary" sx={{ ml: 2 }}>
            Đang tạo PDF...
          </Typography>
        )}
      </DialogTitle>
      
      {/* Nội dung sẽ được xuất ra PDF */}
      <Box 
        ref={contentRef} 
        sx={{
          display: isPrinting ? 'block' : 'none', 
          position: isPrinting ? 'absolute' : 'relative',
          top: '-9999px',
          left: '-9999px',
          width: '210mm',  // Chiều rộng A4
          minHeight: '297mm', // Chiều cao A4 (tối thiểu)
          padding: '10mm',
          backgroundColor: '#fff',
          boxSizing: 'border-box'
        }}
      >
        <PrintableContent />
      </Box>
      
      {/* Nội dung hiển thị trong dialog */}
      <DialogContent ref={pdfRef}>
        <Grid container spacing={3}>
          {/* Order Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Thông tin đơn hàng
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
              <Typography variant="body1" gutterBottom>
                Mã đơn hàng: #{order.id}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Ngày đặt: {order.created_at}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Phương thức thanh toán: {getPaymentMethodLabel(order.payment_method)}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Trạng thái thanh toán: {getPaymentStatusLabel(order.payment_status)}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Trạng thái đơn hàng: {getStatusLabel(order.status, order.payment_method)}
              </Typography>
            </Box>
          </Grid>
          {/* Rest of the existing dialog content... */}
          {order.voucher && (
            <Grid item xs={12}>
              <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, mt: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Thông tin voucher
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Mã voucher: {order.voucher.code}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Loại giảm giá: {order.voucher.discount_type === 1 ? 'Phần trăm' : 'Giảm trực tiếp'}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Giá trị giảm: {order.voucher.discount_type === 1 ?
                    `${order.voucher.discount_value}%` :
                    formatCurrency(order.voucher.discount_value)}
                </Typography>
              </Box>
            </Grid>
          )}
          {/* Shipping Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              {order.payment_method === 3 ? "Địa chỉ cửa hàng" : "Địa chỉ giao hàng"}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                  {order.payment_method === 3 ? "Nhân viên" : "Người nhận"}
                  </Typography>
                  <Typography>{order.shipping_name}</Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Địa chỉ
                  </Typography>
                  <Typography>
                    {order.shipping_address}, {order.shipping_ward_name}, {order.shipping_district_name}, {order.shipping_city_name}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                   {order.payment_method === PaymentMethodEnum.STORE ? "Số điện thoại khách hàng" : "Số điện thoại người nhận"}
                  </Typography>
                  <Typography>{order.payment_method === PaymentMethodEnum.STORE ? order.customer_phone : order.shipping_phone}</Typography>
                </Box>
              </Grid>
            </Grid>
          </Grid>

          {/* Order Items */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Sản phẩm
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Sản phẩm</TableCell>
                    <TableCell>Thông tin</TableCell>
                    <TableCell align="right">Đơn giá</TableCell>
                    <TableCell align="right">Số lượng</TableCell>
                    <TableCell align="right">Thành tiền</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.order_detail.map((detail) => (
                    <TableRow key={detail.id}>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <img
                            src={detail.product_detail.image_url}
                            alt={detail.product_detail.name}
                            style={{ width: 50, height: 50, objectFit: 'cover', marginRight: 10 }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" flexDirection="column" gap={1}>
                          <Typography variant="body2">{detail.product_detail.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {detail.product_detail.color} - {detail.product_detail.size}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right">{formatCurrency(detail.price)}</TableCell>
                      <TableCell align="right">{detail.quantity}</TableCell>
                      <TableCell align="right">{formatCurrency(detail.total_price)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ mt: 2 }}>
              <Grid container justifyContent="flex-end" spacing={1}>
                <Grid item xs={6}>
                  <Typography variant="body1" align="right">
                    Tổng tiền hàng:
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1" align="right">
                    {formatCurrency(order.price)}
                  </Typography>
                </Grid>
                {order.discount_amount > 0 && (
                  <>
                    <Grid item xs={6}>
                      <Typography variant="body1" align="right">
                        Giảm giá:
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body1" align="right" color="error">
                        -{formatCurrency(order.discount_amount)}
                      </Typography>
                    </Grid>
                  </>
                )}
                {order.amount_shipping > 0 && (
                  <>
                    <Grid item xs={6}>
                      <Typography variant="body1" align="right">
                        Phí vận chuyển:
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body1" align="right" color="primary">
                        +{formatCurrency(order.amount_shipping)}
                      </Typography>
                    </Grid>
                  </>
                )}
                <Divider sx={{ my: 1, width: '100%' }} />
                <Grid item xs={6}>
                  <Typography variant="h6" align="right">
                    Tổng cộng:
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h6" align="right">
                    {formatCurrency(order.total_price)}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        {pdfLoading ? (
          <>
            <Button onClick={cancelPdfExport} color="error">
              Hủy
            </Button>
            <Box sx={{ position: 'relative', ml: 1 }}>
              <Button
                variant="contained"
                color="primary"
                disabled
                startIcon={<CircularProgress size={20} color="inherit" />}
              >
                Đang xuất PDF...
              </Button>
            </Box>
          </>
        ) : (
          <>
            <Button 
              onClick={handleExportPDF} 
              variant="outlined" 
              startIcon={<Save />}
              disabled={pdfLoading}
            >
              Export PDF
            </Button>
            <Button onClick={onClose}>Đóng</Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default DialogOrderDetails;
