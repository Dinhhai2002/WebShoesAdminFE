import { AxiosResponse } from "axios";
import BaseApiService from "./BaseApiService";
import { StatusOrderEnum } from "../../utils/enum/StatusOrderEnum";
import { PaymentStatusEnum } from "../../utils/enum/PaymentStatusEnum";
import handleResponseApi from "../handleResponseApi/handleResponseApi";

interface ProductDetail {
    id: number;
    name: string;
    product_id: number;
    color_id: number;
    color: string;
    size_id: number;
    size: string;
    material_id: number;
    material: string;
    stock: number;
    price: number;
    image_url: string;
    status: number;
}

interface OrderDetail {
    id: number;
    order_id: number;
    product_detail_id: number;
    quantity: number;
    price: number;
    total_price: number;
    status: number;
    product_detail: ProductDetail;
}

export interface Order {
    id: number;
    user_id: number;
    voucher_id: number | null;
    price: number;
    discount_amount: number;
    total_price: number;
    payment_method: number;
    payment_status: PaymentStatusEnum;
    status: StatusOrderEnum;
    created_at: string;
    order_detail: OrderDetail[];
    address_id: number;
    shipping_name: string;
    shipping_phone: string;
    shipping_ward_id: number;
    shipping_ward_name: string;
    shipping_district_id: number;
    shipping_district_name: string;
    shipping_city_id: number;
    shipping_city_name: string;
    shipping_address: string;
    customer_phone: string;
}

interface OrderQueryParams {
    user_id?: number;
    key_search?: string;
    status?: number;
    page?: number;
    limit?: number;
}

interface OrderListResponse {
    limit: number;
    list: Order[];
    total_record: number;
}

interface CreateOrderRequest {
    price: number;
    discount_amount: number;
    total_price: number;
    payment_method: number;
    address_id: number;
}

interface ChangeStatusRequest {
    status: number;
}

interface ChangePaymentStatusRequest {
    payment_status: PaymentStatusEnum;
}

interface StaffOrderProductRequest {
    product_detail_id: number;
    quantity: number;
}

interface StaffOrderRequest {
    price: number;
    discount_amount: number;
    total_price: number;
    payment_method: number;
    address_id: number;
    products: StaffOrderProductRequest[];
    customer_phone: string;
}

interface ApiResponse<T> {
    status: number;
    message: string;
    data: T;
}

class OrderApi extends BaseApiService {
    constructor(token?: string) {
        super(token);
    }

    async findAll(params: OrderQueryParams): Promise<ApiResponse<OrderListResponse>> {
        const response: AxiosResponse<ApiResponse<OrderListResponse>> = await this.api.get("/order", {
            params: {
                user_id: params.user_id,
                key_search: params.key_search,
                status: params.status,
                page: params.page,
                limit: params.limit
            }
        });
        return response.data;
    }

    async findOne(id: number): Promise<ApiResponse<Order>> {
        const response: AxiosResponse<ApiResponse<Order>> = await this.api.get(`/order/${id}`);
        return response.data;
    }

    async changeStatus(id: number, status: number): Promise<ApiResponse<Order>> {
        try {
            const response: AxiosResponse<ApiResponse<Order>> = await this.api.post(`/order/${id}/change-status`, { status });
            handleResponseApi.handleResponse(response);
            return response.data;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async cancelOrder(id: number): Promise<ApiResponse<Order>> {
        const response: AxiosResponse<ApiResponse<Order>> = await this.api.post(`/order/${id}/cancel`);
        return response.data;
    }

    async create(order: CreateOrderRequest): Promise<ApiResponse<Order | string>> {
        const response: AxiosResponse<ApiResponse<Order | string>> = await this.api.post("/order/create", order);
        return response.data;
    }

    async update(id: number, order: Partial<CreateOrderRequest>): Promise<ApiResponse<Order>> {
        const response: AxiosResponse<ApiResponse<Order>> = await this.api.post(`/order/${id}/update`, order);
        return response.data;
    }

    async getPaymentUrl(id: number): Promise<ApiResponse<string>> {
        const response: AxiosResponse<ApiResponse<string>> = await this.api.post(`/order/payment-confirm/${id}`);
        return response.data;
    }

    async changePaymentStatus(id: number, paymentStatus: PaymentStatusEnum): Promise<ApiResponse<Order>> {
        const response: AxiosResponse<ApiResponse<Order>> = 
            await this.api.post(`/order/${id}/change-payment-status`, { payment_status: paymentStatus });
        return response.data;
    }

    async createByStaff(request: StaffOrderRequest): Promise<ApiResponse<Order>> {
        const response: AxiosResponse<ApiResponse<Order>> = 
            await this.api.post(`/order/create-by-staff`, request);
        return response.data;
    }
}

const token = localStorage.getItem("token") || undefined;
const orderApi = new OrderApi(token);
export default orderApi;
