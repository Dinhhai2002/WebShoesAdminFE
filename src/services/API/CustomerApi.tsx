import { AxiosResponse } from "axios";
import BaseApiService from "./BaseApiService";
import handleResponseApi from "../handleResponseApi/handleResponseApi";

// Types
export interface Customer {
  id: number;
  name: string;
  phone: string;
  created_at: string;
  updated_at: string;
}

export interface CRUDCustomerRequest {
  name: string;
  phone: string;
}

interface CustomerQueryParams {
  page?: number;
  limit?: number;
}

interface CustomerListResponse {
  limit: number;
  list: Customer[];
  total_record: number;
}

interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

class CustomerApi extends BaseApiService {
  constructor(token?: string) {
    super(token);
  }

  // Fetch all customers with pagination
  async findAll(params: CustomerQueryParams): Promise<ApiResponse<CustomerListResponse>> {
    try {
      const response: AxiosResponse<ApiResponse<CustomerListResponse>> = await this.api.get("/customer", {
        params: {
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

  // Get all customers without pagination
  async getAllCustomers(): Promise<ApiResponse<Customer[]>> {
    try {
      const response: AxiosResponse<ApiResponse<Customer[]>> = await this.api.get("/customer/all");
      handleResponseApi.handleResponse(response);
      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Find customer by ID
  async findById(id: number): Promise<ApiResponse<Customer>> {
    try {
      const response: AxiosResponse<ApiResponse<Customer>> = await this.api.get(`/customer/${id}`);
      handleResponseApi.handleResponse(response);
      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Find customer by phone number
  async findByPhone(phone: string): Promise<ApiResponse<Customer[]>> {
    try {
      const response: AxiosResponse<ApiResponse<Customer[]>> = await this.api.get(`/customer/phone/${phone}`);
      handleResponseApi.handleResponse(response);
      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Create a new customer
  async create(customer: CRUDCustomerRequest): Promise<ApiResponse<Customer>> {
    try {
      const response: AxiosResponse<ApiResponse<Customer>> = await this.api.post("/customer/create", customer);
      handleResponseApi.handleResponse(response);
      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Update an existing customer
  async update(id: number, customer: CRUDCustomerRequest): Promise<ApiResponse<Customer>> {
    try {
      const response: AxiosResponse<ApiResponse<Customer>> = await this.api.post(`/customer/${id}/update`, customer);
      handleResponseApi.handleResponse(response);
      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Delete a customer
  async delete(id: number): Promise<ApiResponse<string>> {
    try {
      const response: AxiosResponse<ApiResponse<string>> = await this.api.post(`/customer/${id}/delete`);
      handleResponseApi.handleResponse(response);
      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

const token = localStorage.getItem("token") || undefined;
const customerApi = new CustomerApi(token);
export default customerApi;