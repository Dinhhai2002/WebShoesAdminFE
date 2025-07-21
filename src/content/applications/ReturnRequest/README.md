# Hệ thống Quản lý Đổi Trả Hàng

## Tổng quan

Hệ thống quản lý đổi trả hàng cho phép admin xử lý các yêu cầu đổi trả hàng từ khách hàng, bao gồm:
- Quản lý yêu cầu đổi trả hàng (Return Requests)
- Quản lý yêu cầu đổi hàng (Exchange Requests)
- Chọn sản phẩm đổi tương ứng cho yêu cầu đổi hàng
- Tính toán chênh lệch giá tự động
- Sử dụng product_id để tìm sản phẩm con từ cùng sản phẩm cha

## Các Component Chính

### 1. RecentReturnRequests
Component chính để hiển thị danh sách yêu cầu đổi trả hàng.

### 2. RecentExchangeRequests
Component chính để hiển thị danh sách yêu cầu đổi hàng.

### 3. DialogSelectExchangeProduct
Dialog cho phép admin chọn sản phẩm đổi tương ứng khi duyệt yêu cầu đổi hàng.

## Tính năng chính

### Quản lý Yêu cầu Đổi Trả Hàng
- Xem danh sách yêu cầu đổi trả hàng
- Xem chi tiết yêu cầu
- Duyệt/từ chối yêu cầu
- Thay đổi trạng thái
- Xử lý và hoàn thành yêu cầu
- Xóa yêu cầu

### Quản lý Yêu cầu Đổi Hàng
- Xem danh sách yêu cầu đổi hàng
- Xem chi tiết sản phẩm đổi
- Duyệt/từ chối yêu cầu đổi hàng
- Tính toán chênh lệch giá tự động

### Chọn Sản phẩm Đổi
- Sử dụng `product_id` để tìm sản phẩm con từ cùng sản phẩm cha
- Hiển thị danh sách sản phẩm con tương ứng
- Cho phép chọn sản phẩm đổi tương ứng
- Tính toán chênh lệch giá real-time
- Hiển thị thông tin tồn kho

## Cách sử dụng

### 1. Duyệt yêu cầu đổi hàng
1. Vào danh sách yêu cầu đổi trả hàng
2. Tìm yêu cầu có loại "Đổi hàng"
3. Click nút "Chọn sản phẩm đổi" (icon SwapHoriz)
4. Hệ thống tự động tìm sản phẩm con từ cùng `product_id`
5. Chọn sản phẩm đổi tương ứng trong dialog
6. Xem chênh lệch giá được tính tự động
7. Nhập ghi chú nếu cần
8. Click "Xác nhận đổi hàng"

### 2. Quản lý trạng thái
- **Chờ duyệt**: Có thể duyệt hoặc từ chối
- **Đã duyệt**: Có thể bắt đầu xử lý
- **Đang xử lý**: Có thể hoàn thành
- **Hoàn thành**: Yêu cầu đã được xử lý xong

## API Endpoints

### Return Request API
- `GET /return-requests/admin` - Lấy danh sách yêu cầu đổi trả hàng
- `POST /return-requests/{id}/approve` - Duyệt yêu cầu
- `POST /return-requests/{id}/reject` - Từ chối yêu cầu
- `POST /return-requests/{id}/process` - Bắt đầu xử lý
- `POST /return-requests/{id}/complete` - Hoàn thành

### Exchange Request API
- `GET /exchange-requests/admin` - Lấy danh sách yêu cầu đổi hàng
- `POST /exchange-requests` - Tạo yêu cầu đổi hàng
- `POST /exchange-requests/{id}/approve` - Duyệt yêu cầu đổi hàng
- `POST /exchange-requests/{id}/reject` - Từ chối yêu cầu đổi hàng

## Cấu trúc dữ liệu

### Return Request
```typescript
interface ReturnRequestResponse {
  id: number;
  order_id: number;
  return_reason: string;
  return_type: string;
  status: string;
  admin_notes?: string;
  details: ReturnRequestDetailResponse[];
}

interface ReturnRequestDetailResponse {
  id: number;
  return_request_id: number;
  product_id: number; // Product ID của sản phẩm cha
  product_detail_id: number;
  quantity: number;
  return_reason: string;
  condition_description: string;
  images: string[];
  product_detail?: {
    id: number;
    name: string;
    image_url: string;
    color: string;
    size: string;
    material: string;
    price: number;
    product_id: number;
  };
}
```

### Exchange Request
```typescript
interface ExchangeRequestResponse {
  id: number;
  return_request_id: number;
  exchange_reason: string;
  status: string;
  admin_notes?: string;
  price_difference?: number;
  details: ExchangeRequestDetailResponse[];
}

interface ExchangeRequestDetailResponse {
  id: number;
  exchange_request_id: number;
  old_product_id: number; // Product ID của sản phẩm cha cũ
  old_product_detail_id: number;
  new_product_id: number; // Product ID của sản phẩm cha mới
  new_product_detail_id: number;
  quantity: number;
  exchange_reason: string;
  condition_description: string;
  images: string[];
  old_product_detail?: {
    id: number;
    name: string;
    image_url: string;
    color: string;
    size: string;
    material: string;
    price: number;
    product_id: number;
  };
  new_product_detail?: {
    id: number;
    name: string;
    image_url: string;
    color: string;
    size: string;
    material: string;
    price: number;
    product_id: number;
  };
}
```

## Constants

### Return Types
- `RETURN_FULL`: Hoàn trả 100% đơn hàng
- `RETURN_PARTIAL`: Hoàn trả một phần đơn hàng
- `EXCHANGE_FULL`: Đổi 100% đơn hàng
- `EXCHANGE_PARTIAL`: Đổi một phần đơn hàng

### Status
- `PENDING`: Chờ duyệt
- `APPROVED`: Đã duyệt
- `REJECTED`: Từ chối
- `PROCESSING`: Đang xử lý
- `COMPLETED`: Hoàn thành
- `CANCELLED`: Đã hủy

## Lưu ý

1. Khi duyệt yêu cầu đổi hàng, hệ thống sẽ tự động tạo một yêu cầu đổi hàng mới
2. Chênh lệch giá được tính tự động dựa trên giá sản phẩm cũ và mới
3. Sử dụng `product_id` để tìm sản phẩm con từ cùng sản phẩm cha, đảm bảo tính nhất quán
4. Tất cả các thao tác đều có loading state và toast notification
5. Hệ thống hỗ trợ đầy đủ `old_product_id`, `new_product_id` để theo dõi sản phẩm cha 