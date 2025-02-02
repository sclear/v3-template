type Pagination = {
  pageSize: number;
  currentPage: number;
  total: number;
};

export const setting = {
  request: {
    code: {
      success: [200],
      error: {
        0: "服未知错误",
        300: "未知错误",
        404: "未找到该资源",
        500: "服务器错误",
      },
    },
    status: {
      success: [200],
      error: {
        500: "服务器错误",
        404: "未找到改资源",
      },
    },
  },
  form: {
    eventTrigger: {
      Select: "change",
      Input: "blur",
      DatePicker: "change",
      Radio: "change",
      CheckBox: "change",
      Rate: "change",
      Switch: "change",
      Upload: "change",
      DateRangePicker: "change",

      default: "change",
    },
    labelMessage: {
      Select: "请选择",
      DatePicker: "请选择",
      Radio: "请选择",
      Input: "请输入",
      CheckBox: "请选择",
      Rate: "请选择",
      Switch: "请选择",
      Upload: "请选择",
      DateRangePicker: "请选择",

      default: "请选择",
    },
  },

  dialog: {
    cancelText: "关闭",
    confirmText: "确认",
  },

  table: {
    // pagination total
    total(res: any) {
      return res?.count || 0;
    },
    // pagination
    pagination(pagination: Pagination) {
      return {
        page: {
          pageSize: pagination.pageSize,
          pageNo: pagination.currentPage,
        },
      };
    },
  },
};
