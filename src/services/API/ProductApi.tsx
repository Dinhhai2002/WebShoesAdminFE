import { AxiosResponse } from "axios";
import BaseApiService from "./BaseApiService";

export interface Product {
    id: number;
    name: string;
    brand_id: number;
    category_id: number;
    description: string;
    price: number;
    image_url: string;
    status: number;
    average_rating: number;
    created_at: string;
    updated_at: string;
    brand?: {
        id: number;
        name: string;
    };
    category?: {
        id: number;
        name: string;
    };
}

interface ProductListResponse {
    limit: number;
    list: Product[];
    total_record: number;
}

interface ProductQueryParams {
    keySearch?: string;
    status?: number;
    page?: number;
    limit?: number;
}

interface ApiResponse<T> {
    status: number;
    message: string;
    data: T;
}

interface CreateProductRequest {
    name: string;
    brand_id: number;
    category_id: number;
    description: string;
    price: number;
    image_url: string;
    status: number;
    average_rating: number;
}

interface UpdateProductRequest extends Partial<CreateProductRequest> {}

class ProductApi extends BaseApiService {
    constructor(token?: string) {
        super(token);
    }

    // Fetch all products with search, status filter and pagination
    async findAll(params: ProductQueryParams = {}): Promise<ApiResponse<ProductListResponse>> {
        try {
            const response: AxiosResponse<ApiResponse<ProductListResponse>> = await this.api.get("/product", {
                params: {
                    key_search: params.keySearch || "",
                    status: params.status,
                    page: params.page || 1,
                    limit: params.limit || 10
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Get a single product by ID
    async getById(id: number): Promise<ApiResponse<Product>> {
        try {
            const response: AxiosResponse<ApiResponse<Product>> = await this.api.get(`/product/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Change product status (active/inactive)
    async changeStatus(id: number, status: number): Promise<ApiResponse<Product>> {
        try {
            const response: AxiosResponse<ApiResponse<Product>> = await this.api.post(`/product/${id}/change-status`, { status });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Create a new product
    async create(product: CreateProductRequest): Promise<ApiResponse<Product>> {
        try {
            const response: AxiosResponse<ApiResponse<Product>> = await this.api.post("/product/create", product);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Update an existing product
    async update(id: number, product: UpdateProductRequest): Promise<ApiResponse<Product>> {
        try {
            const response: AxiosResponse<ApiResponse<Product>> = await this.api.post(`/product/${id}/update`, product);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Upload product image
    async uploadImage(id: number, file: File): Promise<ApiResponse<Product>> {
        try {
            const formData = new FormData();
            formData.append('file', file);
            
            const response: AxiosResponse<ApiResponse<Product>> = await this.api.post(
                `/product/${id}/image`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}

const token = localStorage.getItem("token") || undefined;
const productApi = new ProductApi(token);
export default productApi; 