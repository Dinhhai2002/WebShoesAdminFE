class HandleResponseApi {
  public handleResponse(response: any): string {
    let messageError: string = '';

    if (response.data.status === 400) {
      messageError = response.data.message;
      throw new Error(response.data.message);
    } else if (response.data.status === 401) {
      messageError = 'Bạn không có quyền truy cập api này!';
      throw new Error(messageError);
    }

    return messageError;
  }
}

const handleResponseApi = new HandleResponseApi();
export default handleResponseApi;
