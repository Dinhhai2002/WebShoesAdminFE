import { AxiosResponse } from "axios";
import BaseApiService from "./BaseApiService";
import handleResponseApi from "../handleResponseApi/handleResponseApi";

export interface Banner {
    id: number;
    url: string;
    status: number;
    is_deleted: number;
}

interface BannerQueryParams {
    key_search?: string;
    status?: number;
    page?: number;
    limit?: number;
}

interface BannerListResponse {
    limit: number;
    list: Banner[];
    total_record: number;
}

interface ApiResponse<T> {
    status: number;
    message: string;
    data: T;
}

class BannerApi extends BaseApiService {
    constructor(token?: string) {
        super(token);
    }

    // Fetch all banners with search, status filter and pagination
    async findAll(params: BannerQueryParams = {}): Promise<ApiResponse<BannerListResponse>> {
        try {
            const response: AxiosResponse<ApiResponse<BannerListResponse>> = await this.api.get("/banner", {
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

    // Fetch a single banner by ID
    async findOne(id: number): Promise<ApiResponse<Banner>> {
        try {
            const response: AxiosResponse<ApiResponse<Banner>> = await this.api.get(`/banner/${id}`);
            handleResponseApi.handleResponse(response);
            return response.data;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    // Change banner status (active/inactive)
    async changeStatus(id: number): Promise<ApiResponse<Banner>> {
        try {
            const response: AxiosResponse<ApiResponse<Banner>> = await this.api.post(`/banner/${id}/change-status`);
            handleResponseApi.handleResponse(response);
            return response.data;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    // Create a new banner
    async create(file: File): Promise<ApiResponse<Banner>> {
        try {
            const formData = new FormData();
            formData.append('file', file);
            const response: AxiosResponse<ApiResponse<Banner>> = await this.api.post("/banner/create", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            handleResponseApi.handleResponse(response);
            return response.data;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    // Update an existing banner
    async update(id: number, url: string): Promise<ApiResponse<Banner>> {
        try {
            const response: AxiosResponse<ApiResponse<Banner>> = await this.api.post(`/banner/${id}/update`, { url });
            handleResponseApi.handleResponse(response);
            return response.data;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

const token = localStorage.getItem("token") || undefined;
const bannerApi = new BannerApi(token);
export default bannerApi; 