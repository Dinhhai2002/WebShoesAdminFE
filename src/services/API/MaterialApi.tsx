import { AxiosResponse } from "axios";
import BaseApiService from "./BaseApiService";
import handleResponseApi from "../handleResponseApi/handleResponseApi";

export interface Material {
    id: number;
    name: string;
    status: number;
}

interface MaterialListResponse {
    limit: number;
    list: Material[];
    total_record: number;
}

interface ApiResponse<T> {
    status: number;
    message: string;
    data: T;
}

class MaterialApi extends BaseApiService {
    constructor(token?: string) {
        super(token);
    }

    // Fetch all materials with pagination
    async findAll(params: {
        key_search?: string;
        status?: number;
        page?: number;
        limit?: number;
    }): Promise<ApiResponse<MaterialListResponse>> {
        try {
            const response: AxiosResponse<ApiResponse<MaterialListResponse>> = await this.api.get("/materials", {
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

    // Fetch a single material by ID
    async findOne(id: number): Promise<ApiResponse<Material>> {
        try {
            const response: AxiosResponse<ApiResponse<Material>> = await this.api.get(`/materials/${id}`);
            handleResponseApi.handleResponse(response);
            return response.data;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    // Change material status (active/inactive)
    async changeStatus(id: number): Promise<ApiResponse<Material>> {
        try {
            const response: AxiosResponse<ApiResponse<Material>> = await this.api.post(`/materials/${id}/change-status`);
            handleResponseApi.handleResponse(response);
            return response.data;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    // Create a new material
    async create(material: {
        name: string;
    }): Promise<ApiResponse<Material>> {
        try {
            const response: AxiosResponse<ApiResponse<Material>> = await this.api.post("/materials/create", material);
            handleResponseApi.handleResponse(response);
            return response.data;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    // Update an existing material
    async update(id: number, material: {
        name: string;
    }): Promise<ApiResponse<Material>> {
        try {
            const response: AxiosResponse<ApiResponse<Material>> = await this.api.post(`/materials/${id}/update`, material);
            handleResponseApi.handleResponse(response);
            return response.data;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

const token = localStorage.getItem("token") || undefined;
const materialApi = new MaterialApi(token);
export default materialApi; 