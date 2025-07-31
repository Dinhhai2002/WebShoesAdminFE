import { AxiosResponse } from "axios";
import BaseApiService from "./BaseApiService";
import { toast } from "react-toastify";

// Interfaces
export interface ReturnRequestRequest {
  order_id: number;
  user_id: number;
  return_reason: string;
  return_type: string;
  details: ReturnRequestDetailRequest[];
}

export interface ReturnRequestDetailRequest {
  product_id: number;
  product_detail_id: number;
  quantity: number;
  return_reason: string;
  condition_description: string;
  images: string[];
}

export interface ReturnRequestResponse {
  id: number;
  order_id: number;
  user_id: number;
  return_reason: string;
  return_type: string;
  status: string;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
  details: ReturnRequestDetailResponse[];
}

export interface ReturnRequestDetailResponse {
  id: number;
  return_request_id: number;
  product_id: number;
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

export interface ApproveReturnRequestRequest {
  admin_notes?: string;
}

export interface RejectReturnRequestRequest {
  admin_notes?: string;
}

interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

interface BaseListDataResponse<T> {
  list: T[];
  total_record: number;
}

// API Service Class
class ReturnRequestApi extends BaseApiService {
  constructor(token?: string) {
    super(token);
  }

  async getAll(params: {
    user_id?: number;
    key_search?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<BaseListDataResponse<ReturnRequestResponse>>> {
    try {
      const response: AxiosResponse<ApiResponse<BaseListDataResponse<ReturnRequestResponse>>> = await this.api.get("/return-requests", { params });
      
      if (response.data.status === 400) {
        toast.error(response.data.message || "Không thể lấy danh sách yêu cầu trả hàng");
        throw new Error(response.data.message);
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Create return request
  async createReturnRequest(request: ReturnRequestRequest): Promise<ApiResponse<ReturnRequestResponse>> {
    try {
      const response: AxiosResponse<ApiResponse<ReturnRequestResponse>> = await this.api.post("/return-requests", request);
      
      if (response.data.status === 400) {
        throw new Error(response.data.message);
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Get return request by ID
  async getReturnRequestById(id: number): Promise<ApiResponse<ReturnRequestResponse>> {
    try {
      const response: AxiosResponse<ApiResponse<ReturnRequestResponse>> = await this.api.get(`/return-requests/${id}`);
      
      if (response.data.status === 400) {
        throw new Error(response.data.message);
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Get return requests by user ID
  async getReturnRequestsByUserId(userId: number): Promise<ApiResponse<ReturnRequestResponse[]>> {
    try {
      const response: AxiosResponse<ApiResponse<ReturnRequestResponse[]>> = await this.api.get(`/return-requests/user/${userId}`);
      
      if (response.data.status === 400) {
        throw new Error(response.data.message);
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Get return requests by order ID
  async getReturnRequestsByOrderId(orderId: number): Promise<ApiResponse<ReturnRequestResponse[]>> {
    try {
      const response: AxiosResponse<ApiResponse<ReturnRequestResponse[]>> = await this.api.get(`/return-requests/order/${orderId}`);
      
      if (response.data.status === 400) {
        throw new Error(response.data.message);
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Admin: Get all return requests
  async getAllReturnRequests(status?: string): Promise<ApiResponse<ReturnRequestResponse[]>> {
    try {
      const params = status ? { status } : {};
      const response: AxiosResponse<ApiResponse<ReturnRequestResponse[]>> = await this.api.get("/return-requests/admin", { params });
      
      if (response.data.status === 400) {
        throw new Error(response.data.message);
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Admin: Approve return request
  async approveReturnRequest(id: number, request: ApproveReturnRequestRequest): Promise<ApiResponse<ReturnRequestResponse>> {
    try {
      const response: AxiosResponse<ApiResponse<ReturnRequestResponse>> = await this.api.post(`/return-requests/${id}/approve`, request);
      
      if (response.data.status === 400) {
        throw new Error(response.data.message);
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Admin: Reject return request
  async rejectReturnRequest(id: number, request: RejectReturnRequestRequest): Promise<ApiResponse<ReturnRequestResponse>> {
    try {
      const response: AxiosResponse<ApiResponse<ReturnRequestResponse>> = await this.api.post(`/return-requests/${id}/reject`, request);
      
      if (response.data.status === 400) {
        throw new Error(response.data.message);
      }
      
        return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Admin: Process return request
  async processReturnRequest(id: number): Promise<ApiResponse<ReturnRequestResponse>> {
    try {
      const response: AxiosResponse<ApiResponse<ReturnRequestResponse>> = await this.api.post(`/return-requests/${id}/process`);
      
      if (response.data.status === 400) {
        throw new Error(response.data.message);
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Admin: Complete return request
  async completeReturnRequest(id: number): Promise<ApiResponse<ReturnRequestResponse>> {
    try {
      const response: AxiosResponse<ApiResponse<ReturnRequestResponse>> = await this.api.post(`/return-requests/${id}/complete`);
      
      if (response.data.status === 400) {
        throw new Error(response.data.message);
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Cancel return request
  async cancelReturnRequest(id: number): Promise<ApiResponse<void>> {
    try {
      const response: AxiosResponse<ApiResponse<void>> = await this.api.post(`/return-requests/${id}/cancel`);
      
      if (response.data.status === 400) {
        throw new Error(response.data.message);
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Delete return request
  async deleteReturnRequest(id: number): Promise<ApiResponse<void>> {
    try {
      const response: AxiosResponse<ApiResponse<void>> = await this.api.post(`/return-requests/${id}/deleted`);
      
      if (response.data.status === 400) {
        throw new Error(response.data.message);
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

// Export singleton instance
const token = localStorage.getItem("token") || undefined;
const returnRequestApi = new ReturnRequestApi(token);
export default returnRequestApi; 