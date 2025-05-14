import { AxiosResponse } from "axios";
import BaseApiService from "./BaseApiService";
import handleResponseApi from "../handleResponseApi/handleResponseApi";

export interface ProductDetail {
    id: number;
    name: string;
    product_id: number;
    color_id: number;
    color: string;
    size_id: number;
    size: string;
    material_id: number;
    material: string;
    brand_id: number;
    brand: string;
    category_id: number;
    category: string;
    stock: number;
    price: number;
    image_url: string | null;
    status: number;
    sku?: string; // Bổ sung sku
    barcode?: string; // Bổ sung barcode
}

export interface ProductDetailQueryParams {
    product_id?: number;
    color_id?: number;
    size_id?: number;
    material_id?: number;
    brand_id?: number;
    category_id?: number;
    key_search?: string;
    status?: number;
    page?: number;
    limit?: number;
}

interface ProductDetailListResponse {
    limit: number;
    list: ProductDetail[];
    total_record: number;
}

interface ApiResponse<T> {
    status: number;
    message: string;
    data: T;
}

export interface CRUDProductDetailRequest {
    name: string;
    product_id: number;
    color_id: number;
    size_id: number;
    material_id: number;
    brand_id: number;
    category_id: number;
    price: number;
    stock: number;
    image_url?: string;
}

interface UpdateProductDetailRequest extends Partial<CRUDProductDetailRequest> {}

class ProductDetailApi extends BaseApiService {
    constructor(token?: string) {
        super(token);
    }

    // Fetch all product details with filters and pagination
    async findAll(params: ProductDetailQueryParams = {}): Promise<ApiResponse<ProductDetailListResponse>> {
        try {
            const response: AxiosResponse<ApiResponse<ProductDetailListResponse>> = await this.api.get("/product-detail", {
                params: {
                    product_id: params.product_id || -1,
                    color_id: params.color_id || -1,
                    size_id: params.size_id || -1,
                    material_id: params.material_id || -1,
                    brand_id: params.brand_id || -1,
                    category_id: params.category_id || -1,
                    key_search: params.key_search || "",
                    status: params.status,
                    page: params.page || 1,
                    limit: params.limit || 10
                }
            });
            handleResponseApi.handleResponse(response);
            return response.data;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    // Fetch a single product detail by ID
    async findOne(id: number): Promise<ApiResponse<ProductDetail>> {
        try {
            const response: AxiosResponse<ApiResponse<ProductDetail>> = await this.api.get(`/product-detail/${id}`);
            handleResponseApi.handleResponse(response);
            return response.data;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    // Change product detail status (active/inactive)
    async changeStatus(id: number): Promise<ApiResponse<ProductDetail>> {
        try {
            const response: AxiosResponse<ApiResponse<ProductDetail>> = await this.api.post(`/product-detail/${id}/change-status`);
            handleResponseApi.handleResponse(response);
            return response.data;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    // Create a new product detail
    async create(productDetail: CRUDProductDetailRequest): Promise<ApiResponse<ProductDetail>> {
        try {
            const response: AxiosResponse<ApiResponse<ProductDetail>> = await this.api.post("/product-detail/create", productDetail);
            handleResponseApi.handleResponse(response);
            return response.data;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    async createMany(productDetails: CRUDProductDetailRequest[]): Promise<ApiResponse<ProductDetail>> {
        try {
            const response: AxiosResponse<ApiResponse<ProductDetail>> = await this.api.post("/product-detail/create-multiple", productDetails);
            handleResponseApi.handleResponse(response);
            return response.data;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    // Update an existing product detail
    async update(id: number, productDetail: UpdateProductDetailRequest): Promise<ApiResponse<ProductDetail>> {
        try {
            const response: AxiosResponse<ApiResponse<ProductDetail>> = await this.api.post(`/product-detail/${id}/update`, productDetail);
            handleResponseApi.handleResponse(response);
            return response.data;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    async updateImage(id: number): Promise<ApiResponse<ProductDetail>> {
        try {
            const response: AxiosResponse<ApiResponse<ProductDetail>> = await this.api.post(`/product-detail/${id}/update-image`);
            handleResponseApi.handleResponse(response);
            return response.data;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    async uploadImage(id: number, file: File): Promise<ApiResponse<ProductDetail>> {
        try {
            const formData = new FormData();
            formData.append('file', file);
            
            const response: AxiosResponse<ApiResponse<ProductDetail>> = await this.api.post(
                `/product-detail/${id}/image`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            handleResponseApi.handleResponse(response);
            return response.data;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    // Lấy chi tiết sản phẩm theo barcode
    async getByBarcode(barcode: string): Promise<ApiResponse<ProductDetail>> {
        try {
            const response: AxiosResponse<ApiResponse<ProductDetail>> = await this.api.get(`/product-detail/barcode/${barcode}`);
            handleResponseApi.handleResponse(response);
            return response.data;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    // Lấy hình ảnh barcode (trả về blob)
    async getBarcodeImage(barcode: string): Promise<Blob> {
        try {
            const response = await this.api.get(`/product-detail/barcode-image/${barcode}`, {
                responseType: 'blob'
            });
            handleResponseApi.handleResponse(response);
            return response.data;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}

const token = localStorage.getItem("token") || undefined;
const productDetailApi = new ProductDetailApi(token);
export default productDetailApi; 