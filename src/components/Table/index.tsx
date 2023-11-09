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
import { ElTable, ElPagination, ElTableColumn, ElTableV2 } from "element-plus";
import { omit } from "../../tools/util";
import { useServer, ApiType, UseServerConfig } from "../../hook/useServer";
import { setting } from "@/tools/setting/setting";
import { Components } from "./components";
import type { DialogOpenArgs } from "@/components/Dialog";
import { deepResolverVirtual, deepResolver } from "./renderTableColumn";
import { useElementSize } from "@vueuse/core";

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
  virtual?: boolean;
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

type TableColumnProp = string | string[];

export interface Column {
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

    let dialogInstanceList = ref<any[]>([]);
    // provide
    provide("GetDialogInstance", {
      setDialogInstance(instance: ComponentInternalInstance | null) {
        dialogInstanceList.value.push(instance);
      },
    });

    function open(option: DialogOpenArgs, dialogIdx: number = 0) {
      dialogInstanceList.value[dialogIdx].open(option);
    }

    props.createOption.open = open;

    // provide
    provide("TableProvider", {
      run: search,
      open,
    });

    expose({
      run: search,
      open,
    });

    const el = ref(null);
    const { width, height } = useElementSize(el);

    return () => (
      <div ref={el} v-loading={loading.value}>
        {props.createOption.virtual ? (
          <ElTableV2
            columns={
              deepResolverVirtual(props.createOption.column, width) || []
            }
            data={unref(props.createOption.data)}
            width={width.value}
            height={height.value}
            fixed
          />
        ) : (
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
        )}
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
