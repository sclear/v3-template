import { defineComponent, inject } from "vue";
import { ElTag, ElPopconfirm } from "element-plus";
import { propsType } from "../propsType";
import { useServer } from "@/entry";

export default defineComponent({
  props: propsType,
  emits: ["update:modelValue", "change"],
  setup(props) {
    const Trigger = inject<{
      run: any;
      open: any;
    }>("TableProvider", {
      run() {
        new Error();
      },
      open() {},
    });

    const handleGroup: any = {
      edit: (option: any) => {
        const args = {
          title: "编辑",
          label: "编辑",
          ...option,
        };
        return (
          <ElTag
            class="mx-2 cursor-pointer"
            onClick={() => {
              args.run && args.run();
              args.ran && args.ran();

              if (!args.run) {
                Trigger.open({
                  title: args.title,
                  data: { ...props.data },
                  api: args.api,
                });
              }
            }}
          >
            {args.label}
          </ElTag>
        );
      },
      view: (option: any) => {
        const args = {
          title: "查看",
          label: "查看",
          // run() {},
          // ran() {},
          ...option,
        };
        return (
          <ElTag
            class="mx-2 cursor-pointer"
            type="success"
            onClick={() => {
              args.run && args.run();
              args.ran && args.ran();
              if (!args.run) {
                Trigger.open({
                  title: args.title,
                  data: props.data,
                  disabled: true,
                });
              }
            }}
          >
            {args.label}
          </ElTag>
        );
      },
      remove: (option: any) => {
        const args = {
          title: "删除",
          label: "删除",
          // run() {},
          // ran() {},
          ...option,
        };

        return (
          <ElPopconfirm
            onConfirm={() => {
              args.run && args.run();
              args.ran && args.ran();
              if (!args.run) {
                useServer({
                  api: "user.del",
                  data: {
                    num: props.data.hero_type,
                  },
                  autoRun: true,
                  successMessage: "删除成功",
                  errorMessage: "删除失败",
                  onSuccess() {
                    Trigger.run();
                  },
                });
              }
            }}
            v-slots={{
              reference: () => (
                <ElTag type="danger" class="mx-2 cursor-pointer">
                  {args.label}
                </ElTag>
              ),
            }}
            title="Are you sure to delete this?"
          ></ElPopconfirm>
        );
      },
    };

    const handle: (keyof typeof handleGroup)[] = props.action as any;

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
