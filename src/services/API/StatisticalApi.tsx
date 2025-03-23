import { AxiosResponse } from "axios";
import BaseApiService from "./BaseApiService";

export interface WebsiteStatisticalResponse {
  total_users: number;
  total_revenue: number;
  total_products: number;
  total_orders: number;
}

export interface AmountStatisticalResponse {
  date: string;
  totalAmount: number;
}

interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

class StatisticalApi extends BaseApiService {
  constructor(token?: string) {
    super(token);
  }

  async getOverview(): Promise<ApiResponse<WebsiteStatisticalResponse>> {
    try {
      const response: AxiosResponse<ApiResponse<WebsiteStatisticalResponse>> = await this.api.get("/admin/statistical-overview");
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getAmountStatistical(params: {
    number_week?: number;
    from_date?: string;
    to_date?: string;
    type?: number;
  }): Promise<ApiResponse<AmountStatisticalResponse[]>> {
    try {
      const response: AxiosResponse<ApiResponse<AmountStatisticalResponse[]>> = await this.api.get('/admin/amount', {
        params: {
          number_week: params.number_week ?? '',
          from_date: params.from_date ?? '-1',
          to_date: params.to_date ?? '-1',
          type: params.type ?? 1
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

const token = localStorage.getItem("token") || undefined;
const statisticalApi = new StatisticalApi(token);
export default statisticalApi;
