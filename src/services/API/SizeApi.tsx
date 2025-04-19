import { AxiosResponse } from "axios";
import BaseApiService from "./BaseApiService";
import handleResponseApi from "../handleResponseApi/handleResponseApi";

export interface Size {
    id: number;
    name: string;
    status: number;
}

interface SizeListResponse {
    limit: number;
    list: Size[];
    total_record: number;
}

interface ApiResponse<T> {
    status: number;
    message: string;
    data: T;
}

class SizeApi extends BaseApiService {
    constructor(token?: string) {
        super(token);
    }

    // Fetch all sizes with pagination
    async findAll(params: {
        key_search?: string;
        status?: number;
        page?: number;
        limit?: number;
    }): Promise<ApiResponse<SizeListResponse>> {
        try {
            const response: AxiosResponse<ApiResponse<SizeListResponse>> = await this.api.get("/size", {
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

    // Fetch a single size by ID
    async findOne(id: number): Promise<ApiResponse<Size>> {
        try {
            const response: AxiosResponse<ApiResponse<Size>> = await this.api.get(`/size/${id}`);
            handleResponseApi.handleResponse(response);
            return response.data;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    // Change size status (active/inactive)
    async changeStatus(id: number): Promise<ApiResponse<Size>> {
        try {
            const response: AxiosResponse<ApiResponse<Size>> = await this.api.post(`/size/${id}/change-status`);
            handleResponseApi.handleResponse(response);
            return response.data;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    // Create a new size
    async create(size: {
        name: string;
    }): Promise<ApiResponse<Size>> {
        try {
            const response: AxiosResponse<ApiResponse<Size>> = await this.api.post("/size/create", size);
            handleResponseApi.handleResponse(response);
            return response.data;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    // Update an existing size
    async update(id: number, size: {
        name: string;
    }): Promise<ApiResponse<Size>> {
        try {
            const response: AxiosResponse<ApiResponse<Size>> = await this.api.post(`/size/${id}/update`, size);
            handleResponseApi.handleResponse(response);
            return response.data;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

const token = localStorage.getItem("token") || undefined;
const sizeApi = new SizeApi(token);
export default sizeApi; 