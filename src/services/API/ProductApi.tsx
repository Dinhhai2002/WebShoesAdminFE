import { AxiosResponse } from "axios";
import BaseApiService from "./BaseApiService";
import handleResponseApi from "../handleResponseApi/handleResponseApi";

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
    brand_name: string;
    category_name: string;
}

interface ProductListResponse {
    limit: number;
    list: Product[];
    total_record: number;
}

interface ProductQueryParams {
    key_search?: string;
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

interface UpdateProductRequest extends Partial<CreateProductRequest> { }

class ProductApi extends BaseApiService {
    constructor(token?: string) {
        super(token);
    }

    // Fetch all products with search, status filter and pagination
    async findAll(params: ProductQueryParams = {}): Promise<ApiResponse<ProductListResponse>> {
        try {
            const response: AxiosResponse<ApiResponse<ProductListResponse>> = await this.api.get("/product", {
                params: {
                    key_search: params.key_search || "",
                    status: params.status,
                    page: params.page || 1,
                    limit: params.limit || 10
                }
            });
            handleResponseApi.handleResponse(response);
            return response.data;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    // Get a single product by ID
    async getById(id: number): Promise<ApiResponse<Product>> {
        try {
            const response: AxiosResponse<ApiResponse<Product>> = await this.api.get(`/product/${id}`);
            handleResponseApi.handleResponse(response);
            return response.data;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    // Change product status (active/inactive)
    async changeStatus(id: number, status: number): Promise<ApiResponse<Product>> {
        try {
            const response: AxiosResponse<ApiResponse<Product>> = await this.api.post(`/product/${id}/change-status`, { status });
            handleResponseApi.handleResponse(response);
            return response.data;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    // Create a new product
    async create(product: CreateProductRequest): Promise<ApiResponse<Product>> {
        try {
            const response: AxiosResponse<ApiResponse<Product>> = await this.api.post("/product/create", product);
            handleResponseApi.handleResponse(response);
            return response.data;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    // Update an existing product
    async update(id: number, product: UpdateProductRequest): Promise<ApiResponse<Product>> {
        try {
            const response: AxiosResponse<ApiResponse<Product>> = await this.api.post(`/product/${id}/update`, product);
            handleResponseApi.handleResponse(response);
            return response.data;
        } catch (error) {
            throw new Error(error.message);
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
            handleResponseApi.handleResponse(response);
            return response.data;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async uploadImages(id: number, files: File[]): Promise<ApiResponse<Product[]>> {
        try {
            const formData = new FormData();
            files.forEach((file) => {
                formData.append('files', file);
            });

            const response: AxiosResponse<ApiResponse<Product[]>> = await this.api.post(
                `/product/${id}/images`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            handleResponseApi.handleResponse(response);
            return response.data;
        } catch (error) {
            throw new Error(error.message);
        }
    }
    
}

const token = localStorage.getItem("token") || undefined;
const productApi = new ProductApi(token);
export default productApi; 