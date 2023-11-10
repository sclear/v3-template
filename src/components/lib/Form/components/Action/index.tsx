import { defineComponent, unref, PropType, watch, inject } from "vue";
import { ElSelect, ElOption, ElCol, ElFormItem, ElButton } from "element-plus";
import { propsType } from "../propsType";
import { useServer } from "@/entry";

export default defineComponent({
  props: propsType,
  emits: ["update:modelValue", "change"],
  setup(props, { emit }) {
    const { placeholder, label, model } = props;
    const prop = props.customProps || {};

    const Trigger = inject<{
      reset: any;
      validate: any;
      searchTableList: any;
      create: any;
    }>("TriggerFormProvider", {
      reset() {
        new Error();
      },
      validate() {},
      searchTableList() {},
      create() {},
    });

    const handleGroup: any = {
      create: (option: any) => {
        const args = {
          title: "新增",
          label: "新增",
          // run() {},
          // ran() {},
          ...option,
        };
        return (
          <ElButton
            type="primary"
            onClick={() => {
              args.run && args.run();
              args.ran && args.ran();

              if (!args.run) {
                Trigger.create({
                  title: args.title,
                  api: args.api || null,
                });
              }
            }}
          >
            {args.label}
          </ElButton>
        );
      },
      search: (option: any) => {
        const args = {
          label: "查询",
          // run() {},
          // ran() {},
          ...option,
        };
        return (
          <ElButton
            type="success"
            onClick={() => {
              args.run && args.run();
              args.ran && args.ran();

              if (!args.run) {
                Trigger.searchTableList();
              }
            }}
          >
            {args.label}
          </ElButton>
        );
      },
      reset: (option: any) => {
        const args = {
          label: "重置",
          // run() {},
          // ran() {},
          ...option,
        };
        return (
          <ElButton
            type="info"
            onClick={() => {
              args.run && args.run();
              args.ran && args.ran();

              if (!args.run) {
                Trigger.reset();
              }
            }}
          >
            {args.label}
          </ElButton>
        );
      },
    };

    const handle: (keyof typeof handleGroup)[] = props.dataSource as any;

    const handleList = handle.map((item: any) => {
      if (typeof item === "string") {
        return {
          vNode: handleGroup[item],
        };
      } else if (typeof item === "object" && !item?.render) {
        return {
          vNode: handleGroup[item.type],
          ...item,
        };
      } else if (item?.render && typeof item?.render === "function") {
        return {
          vNode: item.render,
        };
      }
    });

    return () => (
      <>
        {handleList.map((item) => {
          return item.vNode(item);
        })}
      </>
    );
  },
});
