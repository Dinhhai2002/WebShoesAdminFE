import { AxiosResponse } from 'axios';
import BaseApiService from './BaseApiService';
import handleResponseApi from '../handleResponseApi/handleResponseApi';

export interface Category {
  id: number;
  name: string;
  image_url: string;
  parent_id: number;
  status: number;
}

interface CategoryQueryParams {
  key_search?: string;
  status?: number;
  page?: number;
  limit?: number;
}

interface CategoryListResponse {
  limit: number;
  list: Category[];
  total_record: number;
}

interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

class CategoryApi extends BaseApiService {
  constructor(token?: string) {
    super(token);
  }

  // Fetch all categories with search, status filter and pagination
  async findAll(
    params: CategoryQueryParams
  ): Promise<ApiResponse<CategoryListResponse>> {
    try {
      const response: AxiosResponse<ApiResponse<CategoryListResponse>> =
        await this.api.get('/category', {
          params: {
            key_search: params.key_search,
            status: params.status,
            page: params.page,
            limit: params.limit
          }
        });
      handleResponseApi.handleResponse(response);
      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Get all categories for dropdowns
  async getAll(): Promise<ApiResponse<Category[]>> {
    try {
      const response: AxiosResponse<ApiResponse<Category[]>> =
        await this.api.get('/category/all');
      handleResponseApi.handleResponse(response);
      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Fetch a single category by ID
  async findOne(id: number): Promise<ApiResponse<Category>> {
    try {
      const response: AxiosResponse<ApiResponse<Category>> = await this.api.get(
        `/category/${id}`
      );
      handleResponseApi.handleResponse(response);
      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Change category status (active/inactive)
  async changeStatus(id: number): Promise<ApiResponse<Category>> {
    try {
      const response: AxiosResponse<ApiResponse<Category>> =
        await this.api.post(`/category/${id}/change-status`);
      handleResponseApi.handleResponse(response);
      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Create a new category
  async create(category: Omit<Category, 'id'>): Promise<ApiResponse<Category>> {
    try {
      const response: AxiosResponse<ApiResponse<Category>> =
        await this.api.post('/category/create', category);
      handleResponseApi.handleResponse(response);
      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Update an existing category
  async update(
    id: number,
    category: Partial<Category>
  ): Promise<ApiResponse<Category>> {
    try {
      const response: AxiosResponse<ApiResponse<Category>> =
        await this.api.post(`/category/${id}/update`, category);
      handleResponseApi.handleResponse(response);
      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Get categories by parent ID
  async getByParentId(parentId: number): Promise<ApiResponse<Category[]>> {
    try {
      const response: AxiosResponse<ApiResponse<Category[]>> =
        await this.api.get(`/category/parent/${parentId}`);
      handleResponseApi.handleResponse(response);
      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async uploadImage(id: number, file: File): Promise<ApiResponse<Category>> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response: AxiosResponse<ApiResponse<Category>> = await this.api.post(
        `/category/${id}/image`,
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

const token = localStorage.getItem('token') || undefined;
const categoryApi = new CategoryApi(token);
export default categoryApi;
