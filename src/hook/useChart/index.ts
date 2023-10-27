import { useDebounceFn, useResizeObserver } from "@vueuse/core";
import * as echarts from "echarts";
import { onMounted, ref, watch, Ref } from "vue";

export type UseChartOption = {
  data?: Ref<any>;
  click?: (opt: any) => any;
};

export function useChart(option: UseChartOption) {
  const element = ref();
  let instance: echarts.ECharts;

  function init() {
    if (!element.value) return;
    instance = echarts.init(element.value);

    if (option?.click) {
      instance.on("click", (params) => option?.click && option?.click(params));
    }

    const domResizeRender = useDebounceFn(() => {
      instance.resize();
      render();
    }, 600);

    useResizeObserver(element, () => {
      domResizeRender();
    });
  }

  function render() {
    instance?.clear();
    instance.setOption(option.data?.value || {});
  }

  onMounted(() => {
    init();
  });

  watch(
    () => option?.data,
    () => {
      render();
    }
  );

  return {
    element,
    render,
  };
}
