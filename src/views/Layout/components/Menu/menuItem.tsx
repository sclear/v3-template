import { defineComponent, PropType } from "vue";
import { ElMenuItem, ElSubMenu, ElIcon } from "element-plus";
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
  Grid,
} from "@element-plus/icons-vue";

interface MenuItem {
  path: string;
  icon: string;
  title: string;
  children?: MenuItem[];
}

function renderMenuItems(menus?: MenuItem[]): Array<JSX.Element> | undefined {
  if (menus && menus.length) {
    return menus.map((item) => {
      if (item.children && item.children.length)
        return (
          <>
            <ElSubMenu
              v-slots={{
                title() {
                  return (
                    <>
                      <ElIcon>
                        <Grid />
                      </ElIcon>{" "}
                      <span>{item.title}</span>
                    </>
                  );
                },
              }}
              index={item.path}
            >
              {renderMenuItems(item.children)}
            </ElSubMenu>
          </>
        );
      return (
        <>
          <ElMenuItem index={item.path}>
            {" "}
            <ElIcon>
              <Document />
            </ElIcon>{" "}
            <span>{item.title}</span>{" "}
          </ElMenuItem>
        </>
      );
    });
  }
}

export default defineComponent({
  props: {
    menus: {
      type: Array as PropType<MenuItem[]>,
      default: [],
    },
  },
  setup(props) {
    return () => <>{renderMenuItems(props.menus)}</>;
  },
});
