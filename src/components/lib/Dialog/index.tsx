import {
  computed,
  defineComponent,
  onMounted,
  provide,
  inject,
  ref,
  ComponentInternalInstance,
  unref,
} from "vue";
import type { PropType } from "vue";
import { ElDialog, ElButton, ElIcon } from "element-plus";
import { Close } from "@element-plus/icons-vue";
import "./index.less";
import { setting } from "@/tools/setting/setting";
import { omit } from "@/tools/util";
import { ApiType } from "@/hook/useServer";

export type DialogOpenArgs = {
  disabled?: boolean;
  title?: string;
  data?: Object;
  api?: ApiType;
  action?: Action[];
};

type Action = {
  label?: string;
  function?: "confirm" | "cancel";
  type?: "default" | "danger" | "warning" | "info" | "primary" | "success";
  valid?: boolean;
  api?: ApiType;
  customData?: Object;
  render?: () => JSX.Element | JSX.Element[] | string;
};

export default defineComponent({
  props: {
    title: {
      type: String as PropType<string>,
    },
    confirm: {
      type: Function as PropType<(cb: (isClose?: boolean) => void) => void>,
    },
    cancel: {
      type: Function as PropType<() => void>,
    },
    width: {
      type: Number as PropType<number>,
    },
    elProps: {
      type: Object as PropType<Record<string, number | string | boolean>>,
    },
    disabled: {
      type: Boolean,
      default: () => false,
    },
    freeze: {
      type: Boolean,
      default: () => false,
    },
    confirmText: {
      type: String as PropType<string>,
    },
    cancelText: {
      type: String as PropType<string>,
    },
  },
  emits: {
    valid: () => void 0,
  },
  setup(props, ctx) {
    const { width, elProps, title, confirm, cancel, disabled } = props;

    const dialogTitle = ref("");

    const dialogDisabled = ref(false);

    const visible = ref(false);

    const buttonLoading = ref(false);

    const slot = ctx.slots;

    let formInstance = ref<ComponentInternalInstance | null>(null);

    const formDialog = computed(() => {
      return dialogDisabled.value || props.disabled;
    });

    // provide
    provide("DialogProvider", {
      setFormInstance(instance: any | null) {
        formInstance.value = instance;
      },
      disabled: formDialog,
    });

    // close callback
    function closeModel(api?: string, confirmOption?: object, valid?: boolean) {
      buttonLoading.value = true;
      // form联动
      if (formInstance.value && !props.freeze) {
        if (api) formInstance.value?.exposed?.setApi(api);
        if (confirmOption) formInstance.value?.exposed?.setData(confirmOption);
        formInstance.value?.exposed?.validate &&
          formInstance.value?.exposed?.validate(
            (isClose?: boolean) => {
              if (isClose || isClose === undefined) {
                buttonLoading.value = false;
                visible.value = false;
              } else {
                buttonLoading.value = false;
              }
            },
            valid === false ? false : true
          );
        return;
      }

      // has confirm callback
      if (props.confirm) {
        props.confirm((isClose?: boolean) => {
          if (isClose || isClose === undefined) {
            buttonLoading.value = false;
            visible.value = false;
          } else {
            buttonLoading.value = false;
          }
        });
        return;
      }
      buttonLoading.value = false;
      visible.value = false;
    }

    // cancel call form reset
    function cancelCallReset() {
      if (formInstance.value) {
        formInstance.value?.exposed?.validate &&
          formInstance.value?.exposed?.reset();
      }
    }

    // slots
    const slots = {
      header: () => (
        <div>
          <div class="dialog-header">
            <span>{dialogTitle.value || props.title || "标题"}</span>
            <div
              onClick={() => {
                visible.value = false;
                buttonLoading.value = false;
              }}
            >
              <ElIcon>
                <Close class="pointer" />
              </ElIcon>
            </div>
          </div>
        </div>
      ),
      footer: () => {
        if (dialogDisabled.value || props.disabled) {
          return "";
        }
        return (
          <>
            {action.value.map((vNode) => {
              return vNode();
            })}
          </>
        );
      },
    };

    const currentClickLabel = ref("");

    type ConfirmOption = {
      label?: string;
      api?: string;
      customData?: Object;
      valid?: boolean;
    };

    const handleList = {
      cancel: (handleProps: object, label?: string) => {
        return () => (
          <ElButton
            {...handleProps}
            disabled={unref(buttonLoading)}
            onClick={() => {
              props.cancel && props.cancel();
              cancelCallReset();
              visible.value = false;
              buttonLoading.value = false;
            }}
          >
            {label || props.cancelText || setting.dialog.cancelText || "取消"}
          </ElButton>
        );
      },
      confirm: (
        handleProps: object,
        confirmOption: ConfirmOption,
        valid: boolean = true
      ) => {
        return () => (
          <ElButton
            type="primary"
            {...handleProps}
            onClick={() => {
              closeModel(confirmOption.api, confirmOption.customData, valid);
              currentClickLabel.value = confirmOption.label || "确认";
            }}
            disabled={
              unref(buttonLoading) &&
              (confirmOption.label ||
                props.confirmText ||
                setting.dialog.confirmText ||
                "确认") !== currentClickLabel.value
            }
            loading={
              unref(buttonLoading) &&
              (confirmOption.label ||
                props.confirmText ||
                setting.dialog.confirmText ||
                "确认") === currentClickLabel.value
            }
          >
            {confirmOption.label ||
              props.confirmText ||
              setting.dialog.confirmText ||
              "确认"}
          </ElButton>
        );
      },
    };

    const action = ref<any[]>([]);

    const defaultAction: Action[] = [
      {
        label: "取消",
        function: "cancel",
        type: "default",
      },
      {
        label: "确定",
        function: "confirm",
        type: "primary",
      },
    ];

    function open(params: DialogOpenArgs = {}) {
      dialogTitle.value = params.title || "";
      dialogDisabled.value = params.disabled || false;
      visible.value = true;

      action.value = (params.action || defaultAction).map((item: Action) => {
        if (item.function === "cancel" && !item.render) {
          return handleList.cancel(
            omit(item, ["function", "label"]),
            item.label
          );
        }
        if (item.function === "confirm" && !item.render) {
          return handleList.confirm(
            omit(item, ["function", "label", "api", "customData"]),
            {
              label: item.label,
              api: item.api,
              customData: item.customData,
            },
            item.valid
          );
        }
        if (item.render) {
          return item.render;
        }
      });
      // 防止首次Form示例未生成
      setTimeout(() => {
        if (params.data && formInstance?.value?.exposed) {
          formInstance?.value?.exposed?.setData(params.data);
          if (params.api) {
            formInstance?.value?.exposed?.setApi(params.api);
          }
        }
      }, 50);
    }
    function close() {
      props.cancel && props.cancel();
      cancelCallReset();
      visible.value = false;
      buttonLoading.value = false;
    }

    // exports
    ctx.expose({
      open,
      close,
    });

    // 传递dialog instance 至 table
    const setTable = inject<{
      setDialogInstance?: (instance: any | null) => void;
    }>("GetDialogInstance", {
      // setDialogInstance()
    });

    onMounted(() => {
      setTable.setDialogInstance &&
        setTable.setDialogInstance({
          open,
          close,
        });
    });

    // destroy-on-close={true}
    return () => (
      <>
        <ElDialog
          {...elProps}
          v-model={visible.value}
          width={width}
          append-to-body={true}
          v-slots={slots}
          onClose={() => {
            cancelCallReset();
          }}
          show-close={false}
          close-on-click-modal={false}
          close-on-press-escape={false}
        >
          {(slot.default && slot.default()) || ""}
        </ElDialog>
      </>
    );
  },
});
