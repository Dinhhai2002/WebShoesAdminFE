import Label from 'src/components/Label';
import { UserStatus } from 'src/models/crypto_order';
import { StatusOrderEnum } from './enum/StatusOrderEnum';
import { PaymentStatusEnum } from './enum/PaymentStatusEnum';

export const labelTableClass = [
  {
    id: 1,
    name: 'Mã lớp học'
  },
  {
    id: 2,
    name: 'Tên lớp học'
  },
  {
    id: 3,
    name: 'Ngày bắt đầu'
  },
  {
    id: 4,
    name: 'Ngày kết thúc'
  },
  {
    id: 5,
    name: 'Tên giáo viên'
  },
  {
    id: 6,
    name: 'Tên khóa học'
  },
  {
    id: 7,
    name: 'Số lượng học sinh'
  },
  {
    id: 8,
    name: 'Trạng thái lớp học'
  },
  {
    id: 9,
    name: 'Actions'
  }
];

export const labelTableClassInCourse = [
  {
    id: 1,
    name: 'Mã lớp học'
  },
  {
    id: 2,
    name: 'Tên lớp học'
  },
  {
    id: 3,
    name: 'Trạng thái lớp học'
  }
];

export const getStatusLabel = (
  userStatus: UserStatus,
  labelSuccess,
  labelError
): JSX.Element => {
  const map = {
    0: {
      text: labelError,
      color: 'error'
    },
    1: {
      text: labelSuccess,
      color: 'success'
    }
  };

  const { text, color }: any = map[userStatus];

  return <Label color={color}>{text}</Label>;
};

export const getStatusLabelBlog = (
  userStatus: UserStatus,
  labelSuccess,
  labelError,
  labelPending
): JSX.Element => {
  const map = {
    1: {
      text: labelPending,
      color: 'info'
    },
    2: {
      text: labelSuccess,
      color: 'success'
    },
    3: {
      text: labelError,
      color: 'error'
    }
  };

  const { text, color }: any = map[userStatus];

  return <Label color={color}>{text}</Label>;
};

export const getStatusMoneyCourse = (userStatus: UserStatus): JSX.Element => {
  const map = {
    0: {
      text: 'Có phí',
      color: 'error'
    },
    1: {
      text: 'Miễn phí',
      color: 'success'
    }
  };

  const { text, color }: any = map[userStatus];

  return <Label color={color}>{text}</Label>;
};

export const statusOptions = [
  {
    id: -1,
    name: 'Tất cả'
  },
  {
    id: 1,
    name: 'Hoạt động'
  },
  {
    id: 0,
    name: 'Tạm khóa'
  }
];

export const statusOptionsBlog = [
  {
    id: -1,
    name: 'Tất cả'
  },
  {
    id: 1,
    name: 'Chờ duyệt'
  },
  {
    id: 2,
    name: 'Đã duyệt'
  },
  {
    id: 2,
    name: 'Tạm khóa'
  }
];

export const LessonsOptions = [
  {
    id: 1,
    name: 'Miễn phí'
  },
  {
    id: 0,
    name: 'khóa'
  }
];

export const labelTableDanhMuc= [
  {
    id: 1,
    name: 'Mã Danh mục'
  },
  {
    id: 2,
    name: 'Tên danh mục '
  },
  {
    id: 3,
    name: 'Trạng thái'
  },
  {
    id: 4,
    name: 'Actions'
  }
];

export const labelTableExamInCategoryExam = [
  {
    id: 1,
    name: 'Mã đề thi'
  },
  {
    id: 2,
    name: 'Tên đề thi'
  },
  {
    id: 3,
    name: 'Trạng thái đề thi'
  }
];

export const labelTableCourseInCategoryCourse = [
  {
    id: 1,
    name: 'Mã khóa học'
  },
  {
    id: 2,
    name: 'Tên khóa học'
  },
  {
    id: 3,
    name: 'Trạng thái khóa học'
  }
];

export const labelTableCourse = [
  {
    id: 1,
    name: 'Mã Khóa học'
  },
  {
    id: 2,
    name: 'Tên Khóa học'
  },
  {
    id: 3,
    name: 'Giá'
  },
  {
    id: 4,
    name: 'Số bài học'
  },
  {
    id: 5,
    name: 'Hình thức khóa học'
  },
  {
    id: 6,
    name: 'Trạng thái khóa học'
  },
  {
    id: 7,
    name: 'Actions'
  }
];

export const labelTableExam = [
  {
    id: 1,
    name: 'Tên đề thi'
  },
  {
    id: 2,
    name: 'Bộ đề thi'
  },
  {
    id: 3,
    name: 'Thời gian làm bài'
  },
  {
    id: 4,
    name: 'Số câu hỏi'
  },
  {
    id: 5,
    name: 'Số người đã làm bài'
  },
  {
    id: 6,
    name: 'Audio'
  },
  // {
  //   id: 7,
  //   name: 'File câu hỏi'
  // },
  {
    id: 7,
    name: 'Trạng thái đề thi'
  },
  {
    id: 8,
    name: 'Actions'
  }
];

export const labelTableUser = [
  {
    id: 1,
    name: 'Mã người dùng'
  },
  {
    id: 2,
    name: 'Tên người dùng'
  },
  {
    id: 3,
    name: 'Ngày sinh'
  },
  {
    id: 4,
    name: 'Email'
  },
  {
    id: 5,
    name: 'Số điện thoại'
  },
  {
    id: 6,
    name: 'Trạng thái người dùng'
  },
  {
    id: 7,
    name: 'Actions'
  }
];

export const labelTableChapter = [
  {
    id: 1,
    name: 'Mã chương học'
  },
  {
    id: 2,
    name: 'Tên chương học'
  },
  {
    id: 3,
    name: 'Tên khóa học'
  },
  {
    id: 4,
    name: 'Trạng thái khóa học'
  },
  {
    id: 5,
    name: 'Actions'
  }
];

export const labelTableLessons = [
  {
    id: 1,
    name: 'Mã bài học'
  },
  {
    id: 2,
    name: 'Tên bài học'
  },
  {
    id: 3,
    name: 'Tên khóa học'
  },
  {
    id: 4,
    name: 'Tên chương học'
  },
  {
    id: 5,
    name: 'Upload Video'
  },

  {
    id: 6,
    name: 'Trạng thái bài học'
  },
  {
    id: 7,
    name: 'Actions'
  },
  {
    id: 8,
    name: 'Xem video'
  }
];

export const labelTableLessonsInChapter = [
  {
    id: 1,
    name: 'Mã bài học'
  },
  {
    id: 2,
    name: 'Tên bài học'
  },
  {
    id: 3,
    name: 'Trạng thái bài học'
  }
];

export const labelTableExamOverview = [
  {
    id: 1,
    name: 'Tên đề thi'
  },
  {
    id: 2,
    name: 'Bộ đề thi'
  },
  {
    id: 3,
    name: 'Thời gian làm bài'
  },
  {
    id: 4,
    name: 'Số câu hỏi'
  },
  {
    id: 5,
    name: 'Số người đã làm bài'
  },
  {
    id: 6,
    name: 'Trạng thái đề thi'
  }
];

export const labelTablePaymentHistory = [
  {
    id: 1,
    name: 'Mã thanh toán'
  },
  {
    id: 2,
    name: 'Tên khóa học'
  },
  {
    id: 3,
    name: 'Tên người dùng'
  },
  {
    id: 4,
    name: 'Số tiền'
  },
  {
    id: 5,
    name: 'Ngày thanh toán'
  }
];

export const labelTableBlog = [
  {
    id: 1,
    name: 'Mã Blog'
  },
  {
    id: 2,
    name: 'Tên Blog'
  },
  {
    id: 3,
    name: 'Tên tác giả'
  },
  {
    id: 4,
    name: 'Điểm bài viết'
  },
  {
    id: 5,
    name: 'Trạng thái blog'
  },
  {
    id: 6,
    name: 'Actions'
  }
];

export const labelTableBanner = [
  {
    id: 1,
    name: 'Mã banner'
  },
  {
    id: 2,
    name: 'Hình ảnh'
  },
  {
    id: 3,
    name: 'Trạng thái'
  },
  {
    id: 4,
    name: 'Actions'
  }
];

export const labelTablePromotion = [
  {
    id: 1,
    name: 'Mã khuyến mãi'
  },
  {
    id: 2,
    name: 'Kiểu khuyến mãi'
  },
  {
    id: 3,
    name: 'Điểm quy đổi'
  },
  {
    id: 4,
    name: 'Giá trị khuyến mãi'
  },
  {
    id: 5,
    name: 'Trạng thái'
  },
  {
    id: 6,
    name: 'Actions'
  }
];

export const labelTableOrder = [
  {
    id: 1,
    name: 'Mã đơn hàng'
  },
  {
    id: 2,
    name: 'Mã người dùng'
  },
  {
    id: 3,
    name: 'Tổng tiền'
  },
  {
    id: 4,
    name: 'Phương thức thanh toán'
  },
  {
    id: 5,
    name: 'Ngày tạo'
  },
  {
    id: 6,
    name: 'Trạng thái đơn hàng'
  },
  {
    id: 7,
    name: 'Trạng thái thanh toán'
  },
  {
    id: 8,
    name: 'Actions'
  }
];

export const statusOptionsOrder = [
  { id: -1, name: 'Tất cả' },
  { id: StatusOrderEnum.PENDING, name: 'Chờ xác nhận' },
  { id: StatusOrderEnum.CONFIRMED, name: 'Đã xác nhận' },
  { id: StatusOrderEnum.PROCESSING, name: 'Đang xử lý' },
  { id: StatusOrderEnum.SHIPPED, name: 'Đã gửi hàng' },
  { id: StatusOrderEnum.DELIVERED, name: 'Đã giao hàng' },
  { id: StatusOrderEnum.CANCELLED, name: 'Đã hủy' }
];

export const paymentStatusOptions = [
  { id: -1, name: 'Tất cả' },
  { id: PaymentStatusEnum.PENDING, name: 'Chưa thanh toán' },
  { id: PaymentStatusEnum.PROCESSING, name: 'Đang chờ thanh toán' },
  { id: PaymentStatusEnum.PAID, name: 'Đã thanh toán' },
  { id: PaymentStatusEnum.FAILED, name: 'Thanh toán thất bại' }
];
