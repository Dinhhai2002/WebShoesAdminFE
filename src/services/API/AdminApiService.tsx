import handleResponseApi from "src/services/handleResponseApi/handleResponseApi";
import BaseApiService from "./BaseApiService";

class AdminApiService extends BaseApiService {
  constructor(token?: any) {
    super(token);
  }

  public async countStatistical(): Promise<any> {
    var messageError = '';
    try {
      const response = await this.api.get(`/admin/count-statistical`);

      messageError = handleResponseApi.handleResponse(response);
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw new Error(messageError);
    }
  }
}
const token = localStorage.getItem('token');

const adminApiService = new AdminApiService(token);
export default adminApiService;
