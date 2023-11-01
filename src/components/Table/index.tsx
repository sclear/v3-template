import {
  computed,
  defineComponent,
  reactive,
  ref,
  unref,
  provide,
  ComponentInternalInstance,
} from "vue";
import type { PropType, Ref } from "vue";
import "./index.less";
import { ElTable, ElPagination, ElTableColumn } from "element-plus";
import { omit } from "../../tools/util";
import { useServer, ApiType, UseServerConfig } from "../../hook/useServer";
import { setting } from "@/tools/setting/setting";
import { Components } from "./components";
import type { DialogOpenArgs } from "@/components/Dialog";

type UseServerProps = Pick<
  UseServerConfig<any, any, any>,
  | "beforeSetData"
  | "headers"
  | "autoRun"
  | "data"
  | "urlParams"
  | "default"
  | "beforeRequest"
>;
interface SlotsParams {
  row: any[];
  $index: any;
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
  prop?: string
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
export function CreateTable(option: CreateTable) {
  return {
    data: ref<any[]>([]),
    ...option,
    run() {
      console.warn("fast-warning: 请勿在Table初始化时调用Table run");
    },
    open(option: DialogOpenArgs, dialogIdx?: number) {
      console.warn("fast-warning: 请勿在Table初始化时调用Table open");
    },
  };
}

// 递归解析tableHeader
function deepResolver(
  jsxNodes: any[],
  formatRowText?: FormatRowText,
  pagination?: Pagination
) {
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

    const rstProp = Array.isArray(prop?.prop) ? prop.prop[0] : prop?.prop;

    // slots & format & !render & !type
    let slots;
    if (formatRowText && !item.render && !item.type) {
      slots = {
        default: (slots: SlotsParams) => {
          return formatRowText(slots?.row[rstProp] as any, rstProp);
        },
      };
    } else {
      slots = {
        default: (slots: SlotsParams) => {
          let value: string | string[] = "";
          if (Array.isArray(prop?.prop)) {
            value = prop.prop.map((key: any) => slots.row[key]);
          } else {
            value = slots.row[rstProp];
          }

          const index =
            slots.$index +
            (pagination?.pageSize || 0) * ((pagination?.currentPage || 0) - 1) +
            1;

          // render custom Components
          if (prop.type) {
            const component = Components[prop.type as keyof typeof Components];
            return (
              <component
                value={value}
                data={slots.row}
                index={slots.$index}
                action={prop.action}
                args={{
                  index,
                }}
              />
            );
          }

          // custom render
          return item.render
            ? item.render(value, slots.row, slots.$index, {
                index,
              })
            : slots?.row[rstProp];
        },
      };
    }

    const columnProps = {
      ...prop,
      prop: rstProp,
    };

    if (item.children) {
      return (
        <ElTableColumn {...columnProps}>
          {deepResolver(item.children, formatRowText, pagination)}
        </ElTableColumn>
      );
    } else
      return (
        <ElTableColumn v-slots={slots} {...columnProps}>
          {deepResolver(item.children, formatRowText, pagination)}
        </ElTableColumn>
      );
  });
}

type TableColumnProp = string | string[];

interface Column {
  prop?: TableColumnProp;
  label?: string;
  customProps?: Record<string, unknown>;
  width?: number;
  children?: Column[];
  vIf?: (() => boolean) | boolean | Ref<boolean>;
  type?: keyof typeof Components;
  action?: any[];
  render?: (
    text: any,
    row: any,
    $index: number,
    args: {
      index: number;
    }
  ) => JSX.Element | string | any;
}

export default defineComponent({
  props: {
    createOption: {
      type: Object as PropType<ReturnType<typeof CreateTable>>,
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

    const loading = ref(false);
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
        onSuccess(resp, res) {
          console.log(res);
          pagination.total = setting.table.total(res);
          props.createOption.data.value = unref(res.data);
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

    props.createOption.run = run;

    props.createOption.autoRun && run();

    // let dialogInstance = ref<any | null>(null);
    let dialogInstanceList = ref<any[]>([]);
    // provide
    provide("GetDialogInstance", {
      setDialogInstance(instance: ComponentInternalInstance | null) {
        // dialogInstance.value = instance;
        dialogInstanceList.value.push(instance);

        // console.log("instance");
        // console.log(instance);
      },
    });

    function open(option: DialogOpenArgs, dialogIdx: number = 0) {
      dialogInstanceList.value[dialogIdx].open(option);
    }

    props.createOption.open = open;

    // provide
    provide("formTable", {
      run: search,
      // trigger
      open,
    });

    expose({
      run: search,
      // open
      open,
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
            props.createOption.formatRowText,
            pagination
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
