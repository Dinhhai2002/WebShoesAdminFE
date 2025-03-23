import { AxiosResponse } from "axios";
import BaseApiService from "./BaseApiService";
import handleResponseApi from "../handleResponseApi/handleResponseApi";

export interface AddressBook {
    id: number;
    user_id: number;
    full_name: string;
    phone: string;
    ward_id: number;
    ward_name: string;
    district_id: number;
    district_name: string;
    city_id: number;
    city_name: string;
    full_address: string;
    is_default: number;
    status: number;
    created_at: string;
}

export interface AddressBookRequest {
    full_name: string;
    phone: string;
    ward_id: number;
    ward_name: string;
    district_id: number;
    district_name: string;
    city_id: number;
    city_name: string;
    full_address: string;
    is_default?: number;
}

interface AddressBookQueryParams {
    userId?: number;
    keySearch: string;
    status: number;
    page: number;
    limit: number;
}

interface AddressBookListResponse {
    limit: number;
    list: AddressBook[];
    total_record: number;
}

interface ApiResponse<T> {
    status: number;
    message: string;
    data: T;
}

class AddressBookApi extends BaseApiService {
    constructor(token?: string) {
        super(token);
    }

    // Fetch all address books with search, status filter and pagination
    async findAll(params: AddressBookQueryParams): Promise<ApiResponse<AddressBookListResponse>> {
        try {
            const response: AxiosResponse<ApiResponse<AddressBookListResponse>> = await this.api.get("/address-book", {
                params: {
                    key_search: params.keySearch,
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

    async findAllAdmin(params: AddressBookQueryParams): Promise<ApiResponse<AddressBookListResponse>> {
        try {
            const response: AxiosResponse<ApiResponse<AddressBookListResponse>> = await this.api.get("/address-book/all", {
                params: {
                    user_id: params.userId,
                    key_search: params.keySearch,
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

    // Fetch a single address book by ID
    async findOne(id: number): Promise<ApiResponse<AddressBook>> {
        try {
            const response: AxiosResponse<ApiResponse<AddressBook>> = await this.api.get(`/address-book/${id}`);
            handleResponseApi.handleResponse(response);
            return response.data;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    // Create a new address book
    async create(addressBook: AddressBookRequest): Promise<ApiResponse<AddressBook>> {
        try {
            const response: AxiosResponse<ApiResponse<AddressBook>> = await this.api.post("/address-book/create", addressBook);
            handleResponseApi.handleResponse(response);
            return response.data;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    // Update an existing address book
    async update(id: number, addressBook: AddressBookRequest): Promise<ApiResponse<AddressBook>> {
        try {
            const response: AxiosResponse<ApiResponse<AddressBook>> = await this.api.post(`/address-book/${id}/update`, addressBook);
            handleResponseApi.handleResponse(response);
            return response.data;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    // Change address book status (active/inactive)
    async changeStatus(id: number): Promise<ApiResponse<AddressBook>> {
        try {
            const response: AxiosResponse<ApiResponse<AddressBook>> = await this.api.post(`/address-book/${id}/change-status`);
            handleResponseApi.handleResponse(response);
            return response.data;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    // Set address book as default
    async setDefault(id: number): Promise<ApiResponse<AddressBook>> {
        try {
            const response: AxiosResponse<ApiResponse<AddressBook>> = await this.api.post(`/address-book/${id}/set-default`);
            return response.data;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

const token = localStorage.getItem("token") || undefined;
const addressBookApi = new AddressBookApi(token);
export default addressBookApi; 