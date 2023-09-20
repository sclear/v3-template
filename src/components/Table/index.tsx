import { computed, defineComponent, reactive, ref, unref, provide } from "vue";
import type { PropType, Ref } from "vue";
import "./index.less";
import { ElTable, ElPagination, ElTableColumn } from "element-plus";
import { omit } from "../../tools/util";
import { useServer, ApiType, UseServerConfig } from "../../hook/useServer";
import { setting } from "@/tools/setting/setting";

type UseServerProps = Pick<
  UseServerConfig<any, any, any>,
  "beforeSetData" | "headers" | "autoRun" | "data" | "urlParams" | "default"
>;
interface SlotsParams {
  row: any[];
  $index: any[];
}

const defaultProps = {
  align: "center",
};

type Pagination = {
  pageSize: number;
  currentPage: number;
  total: number;
};

type FormatRowText = (
  content?: string | number | JSX.Element | undefined,
  prop?: string,
  option?: { isRender: boolean }
) => any;

interface CreateTable {
  api?: ApiType;
  column: Column[];
  customProps?: any;
  pagination?: boolean | ((pagination: Pagination) => any);
  total?: (res: any) => number;
  autoRun?: boolean;
  formatRowText?: FormatRowText;
  useServerProps?: UseServerProps;
  formatRequestData?: <T>(data: T, Pagination: Pagination) => any;
  data?: Ref<any[]>;
}

// 生成Table数据
export function CreateTableOption(option: CreateTable) {
  return {
    data: ref<any[]>([]),
    ...option,
    run() {
      console.warn("fast-warning: 请勿在Table初始化时调用Table run");
    },
  };
}

// 递归解析tableHeader
function deepResolver(jsxNodes: any[], formatRowText?: FormatRowText) {
  if (!jsxNodes || !jsxNodes.length) return;
  return jsxNodes.map((item) => {
    const prop = {
      ...omit(item, ["children", "render"]),
      ...defaultProps,
      ...(item.customProps || {}),
    };

    if (item.vIf || item.vIf === false) {
      const vIf =
        typeof item.vIf === "boolean" || typeof item.vIf === "object"
          ? unref(item.vIf)
          : item.vIf();
      if (!vIf) {
        return null;
      }
    }

    // slots & format
    let slots;
    if (formatRowText) {
      slots = {
        default: (slots: SlotsParams) => {
          return item.render
            ? formatRowText(
                item.render(slots?.row[prop?.prop], slots.row, slots.$index),
                prop?.prop,
                { isRender: true }
              )
            : formatRowText(slots?.row[prop?.prop] as any, prop.prop, {
                isRender: false,
              });
        },
      };
    } else {
      slots = {
        default: (slots: SlotsParams) => {
          return item.render
            ? item.render(slots?.row[prop?.prop], slots.row, slots.$index)
            : slots?.row[prop?.prop];
        },
      };
    }
    if (item.children) {
      return (
        <ElTableColumn {...prop}>{deepResolver(item.children)}</ElTableColumn>
      );
    } else
      return (
        <ElTableColumn v-slots={slots} {...prop}>
          {deepResolver(item.children, formatRowText)}
        </ElTableColumn>
      );
  });
}

interface Column {
  prop?: string;
  label?: string;
  customProps?: Record<string, unknown>;
  children?: Column[];
  vIf?: (() => boolean) | boolean | Ref<boolean>;
  render?: (
    text: string,
    row: any,
    $index: number
  ) => JSX.Element | string | any;
}

export default defineComponent({
  props: {
    createOption: {
      type: Object as PropType<ReturnType<typeof CreateTableOption>>,
      default: [],
    },
    beforeSetData: {
      type: Function,
    },
    searchParams: {
      type: Object as PropType<any>,
    },
  },
  setup(props, { expose, slots }) {
    const pagination = reactive({
      pageSize: 10,
      currentPage: 1,
      total: 0,
    });
    // ...(props.createOption.pagination ? pagination : {})
    const params = computed(() => {
      let pages = {};
      // 未传值
      if (props.createOption.pagination === undefined) {
        pages = setting.table.pagination(pagination);
      }
      // 去掉pagination
      if (props.createOption.pagination === false) {
      }
      // 方法
      if (typeof props.createOption.pagination === "function") {
        pages =
          props.createOption.pagination &&
          props.createOption.pagination(pagination);
      }
      return {
        ...pages,
        ...(unref(props.searchParams || {}) || {}),
      };
    });
    // const { loading, run, data } = useServer({
    //   api: props.createOption.api || ("" as any),
    //   data: params,
    //   autoRun: props.createOption.api
    //     ? typeof props.createOption.autoRun === "boolean"
    //       ? props.createOption.autoRun
    //       : true
    //     : false,
    //   beforeSetData:
    //     props.createOption.beforeSetData || setting.table.apiBeforeSetData,
    //   ...(props.createOption.useServerProps || {}),
    //   onSuccess(res) {
    //     props.createOption.data.value = unref(data);
    //     if (
    //       props.createOption.pagination ||
    //       props.createOption.pagination === undefined
    //     ) {
    //       pagination.total = props.createOption.total
    //         ? props.createOption.total(res)
    //         : setting.table.total(res);
    //     }
    //   },
    // });
    const loading = ref(false);
    const data = ref<any>([]);
    function run() {
      loading.value = true;
      useServer({
        api: props.createOption.api || ("" as any),
        data: props.createOption.formatRequestData
          ? props.createOption.formatRequestData(
              unref(props.searchParams),
              pagination
            )
          : params,
        ...(props.createOption.useServerProps || {}),
        onSuccess(resData) {
          pagination.total = setting.table.total(resData);
          props.createOption.data.value = unref(resData);
        },
        end() {
          loading.value = false;
        },
      }).run();
    }

    const search = (pager: boolean = false) => {
      if (pager) {
        pagination.currentPage = 1;
        pagination.pageSize = 10;
      }
      run();
    };

    props.createOption.autoRun && run();

    // provide
    provide("formTable", {
      run: search,
    });

    expose({
      run: search,
    });

    return () => (
      <div v-loading={loading.value}>
        <ElTable
          data={unref(props.createOption.data)}
          border
          {...(props.createOption.customProps || {})}
        >
          {deepResolver(
            props.createOption.column,
            props.createOption.formatRowText
          )}
        </ElTable>
        {typeof props.createOption.pagination === "boolean" ? (
          props.createOption.pagination
        ) : (
          <ElPagination
            class="pagination"
            v-model:page-size={pagination.pageSize}
            v-model:currentPage={pagination.currentPage}
            total={pagination.total}
            layout="prev, pager, next"
            onSize-change={() => {
              run();
            }}
            onCurrent-change={() => {
              run();
            }}
          />
        )}
        {(slots.default && slots.default()) || ""}
      </div>
    );
  },
});
