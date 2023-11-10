import { unref } from "vue";
import type { Ref } from "vue";
import "./index.less";
import { ElTableColumn } from "element-plus";
import { omit } from "@/tools/util";
import { Components } from "@/components/lib/Table/components";

type CellRenderProps<T> = {
  cellData: T;
  column: any;
  columns: any;
  columnIndex: number;
  rowData: any;
  rowIndex: number;
};

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

interface SlotsParams {
  row: any[];
  $index: any;
}

// 解析虚拟table Column
export function deepResolverVirtual(
  jsxNodes: any[],
  width: Ref<number>
  // formatRowText?: FormatRowText,
  // pagination?: Pagination
) {
  if (!jsxNodes || !jsxNodes.length) return;

  const result = jsxNodes
    .map((item) => {
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
      let render = null;
      if (item.type) {
        render = (cell: CellRenderProps<any>) => {
          const component = Components[prop.type as keyof typeof Components];
          return (
            <component
              value={cell.cellData}
              data={cell.rowData}
              index={cell.rowIndex + 1}
              action={prop.action}
              args={{
                index: cell.rowIndex + 1,
              }}
            />
          );
        };
      } else if (item.render) {
        render = (cell: CellRenderProps<any>) => {
          return item.render(cell.cellData, cell.rowData, cell.rowIndex, {
            index: cell.rowIndex,
          });
        };
      }

      const column = {
        key: prop?.prop || item?.type,
        dataKey: prop?.prop || item?.type,
        width: prop?.width,
        title: prop?.label,
        cellRenderer: render,
        ...defaultProps,
        ...{ ...(prop?.customProps || {}) },
      };
      for (var key in column) {
        !column[key] && delete column[key];
      }
      return column;
    })
    .filter((item) => item);

  const columnWidthList = result
    .map((item) => item.width)
    .filter((item) => item);

  const sum = columnWidthList.reduce((pre, next) => {
    return pre + next;
  }, 0);

  if (width.value - sum > (result.length - columnWidthList.length) * 100) {
    const w =
      (width.value - sum - 7) / (result.length - columnWidthList.length);
    result.forEach((item) => {
      if (!item.width) {
        item.width = w;
      }
    });
  }

  return result;
}

// 解析普通table Column
export function deepResolver(
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
