const { differenceInDays } = require('date-fns');

class Utils {
  public getCurrentUser() {
    let isCurrentUser = false;
    let user: any = localStorage.getItem('user');
    let currentUser = JSON.parse(user);

    if (currentUser) {
      isCurrentUser = true;
    }

    return { currentUser, isCurrentUser };
  }

  public getTotalPage(totalRecord: number, limit: number) {
    if (totalRecord % limit != 0) {
      return Math.floor(totalRecord / limit) + 1;
    } else {
      return Math.floor(totalRecord / limit);
    }
  }

  public formatMoney(amount: number) {
    return amount.toLocaleString('vi-VN');
  }

  public getRole(id: number) {
    switch (id) {
      case 0:
        return 'Người dùng';
      case 1:
        return 'Học sinh';
      case 2:
        return 'Giáo viên';
      case 3:
        return 'Admin';
      default:
        return 'Người dùng';
    }
  }
}
const utils = new Utils();
export default utils;
