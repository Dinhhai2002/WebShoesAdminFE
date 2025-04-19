import { AxiosResponse } from "axios";
import BaseApiService from "./BaseApiService";
import handleResponseApi from "../handleResponseApi/handleResponseApi";

export interface Brand {
    id: number;
    name: string;
    image_url: string;
    status: number;
    created_at: string;
    updated_at: string;
}

interface BrandListResponse {
    limit: number;
    list: Brand[];
    total_record: number;
}

interface BrandQueryParams {
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

interface CRUDBrandRequest {
    name: string;
    image_url: string;
}

class BrandApi extends BaseApiService {
    constructor(token?: string) {
        super(token);
    }

    // Fetch all brands with search, status filter and pagination
    async findAll(params: BrandQueryParams = {}): Promise<ApiResponse<BrandListResponse>> {
        try {
            const response: AxiosResponse<ApiResponse<BrandListResponse>> = await this.api.get("/brand", {
                params: {
                    key_search: params.key_search || "",
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

    // Get all brands for dropdowns
    async getAll(): Promise<ApiResponse<Brand[]>> {
        try {
            const response: AxiosResponse<ApiResponse<Brand[]>> = await this.api.get("/brand/all");
            handleResponseApi.handleResponse(response);
            return response.data;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    // Fetch a single brand by ID
    async findOne(id: number): Promise<ApiResponse<Brand>> {
        try {
            const response: AxiosResponse<ApiResponse<Brand>> = await this.api.get(`/brand/${id}`);
            handleResponseApi.handleResponse(response);
            return response.data;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    // Change brand status (active/inactive)
    async changeStatus(id: number): Promise<ApiResponse<Brand>> {
        try {
            const response: AxiosResponse<ApiResponse<Brand>> = await this.api.post(`/brand/${id}/change-status`);
            handleResponseApi.handleResponse(response);
            return response.data;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    // Create a new brand
    async create(brand: CRUDBrandRequest): Promise<ApiResponse<Brand>> {
        try {
            const response: AxiosResponse<ApiResponse<Brand>> = await this.api.post("/brand/create", brand);
            handleResponseApi.handleResponse(response);
            return response.data;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    // Update an existing brand
    async update(id: number, brand: CRUDBrandRequest): Promise<ApiResponse<Brand>> {
        try {
            const response: AxiosResponse<ApiResponse<Brand>> = await this.api.post(`/brand/${id}/update`, brand);
            handleResponseApi.handleResponse(response);
            return response.data;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    // Upload brand image
    async uploadImage(id: number, file: File): Promise<ApiResponse<Brand>> {
        try {
            const formData = new FormData();
            formData.append('file', file);
            
            const response: AxiosResponse<ApiResponse<Brand>> = await this.api.post(
                `/brand/${id}/image`,
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
const brandApi = new BrandApi(token);
export default brandApi; 