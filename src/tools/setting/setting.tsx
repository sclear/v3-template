type Pagination = {
  pageSize: number;
  currentPage: number;
  total: number;
};

export const setting = {
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

      default: "请选择",
    },
  },

  dialog: {
    cancelText: "关闭",
    confirmText: "确认",
  },

  table: {
    // table - useServer api
    apiBeforeSetData(res: any) {
      return res || [];
    },
    // pagination total
    total(res: any) {
      return res?.page?.count || 0;
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
