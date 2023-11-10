<template>
  <div>
    <div class="grid grid-cols-4 gap-x-10">
      <div
        class="flex justify-between items-center bg-white rd-1 px-4 h-80px shadow-md hover:shadow-lg"
      >
        <div>
          <i class="c-primary iconfont text-40px icon-wiappfangwenliang"></i>
        </div>
        <div>
          <div class="c-primary mb-3">New Visits</div>
          <div>1000230</div>
        </div>
      </div>
      <div
        class="flex justify-between items-center bg-white rd-1 px-4 h-80px shadow-md hover:shadow-lg"
      >
        <div>
          <i class="c-danger iconfont text-40px icon-xiaoxi"></i>
        </div>
        <div>
          <div class="c-primary mb-3">Message</div>
          <div>10034500</div>
        </div>
      </div>
      <div
        class="flex justify-between items-center bg-white rd-1 px-4 h-80px shadow-md hover:shadow-lg"
      >
        <div>
          <i class="c-success iconfont text-40px icon-renwu"></i>
        </div>
        <div>
          <div class="c-primary mb-3">Purchases</div>
          <div>1045000</div>
        </div>
      </div>
      <div
        class="flex justify-between items-center bg-white rd-1 px-4 h-80px shadow-md hover:shadow-lg"
      >
        <div>
          <i class="c-warning iconfont text-40px icon-gouwugouwuchedinggou"></i>
        </div>
        <div>
          <div class="c-primary mb-3">Shoppings</div>
          <div>10003450</div>
        </div>
      </div>
    </div>
    <div
      :ref="line.element"
      class="h-400px w-full mt-4 bg-white shadow-md hover:shadow-lg"
    ></div>
    <div class="grid grid-cols-1 gap-y-4 mt-4">
      <div
        :ref="line2.element"
        class="h-400px bg-white shadow-md hover:shadow-lg"
      ></div>
      <div
        :ref="line3.element"
        class="h-400px bg-white shadow-md hover:shadow-lg"
      ></div>
      <div
        :ref="line4.element"
        class="h-400px bg-white shadow-md hover:shadow-lg"
      ></div>
    </div>
  </div>
</template>

<script lang="tsx" setup>
import { ref, computed, onMounted } from "vue";
import { ElButton, ElInput } from "element-plus";
import {
  Dialog,
  CreateTable,
  useServer,
  Form,
  CreateForm,
  Trigger,
} from "@/entry";
import * as echarts from "echarts";
import { useChart } from "@/hook";

const line = useChart({
  data: ref({
    backgroundColor: "#fff",
    title: {
      text: "渐变折线图",
      left: "12%",
      top: "13%",
      textStyle: {
        color: "#999",
        fontSize: 14,
      },
    },
    legend: {
      show: true,
      icon: "circle",
      top: "13%",
      itemWidth: 6,
      itemHeight: 6,
      itemGap: 25,
    },
    tooltip: {
      trigger: "axis",
    },
    xAxis: [
      {
        type: "category",
        data: ["A", "B", "C", "D", "E", "F", "G"],
        axisLine: {
          lineStyle: {
            color: "#ddd",
          },
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          interval: 0,
          textStyle: {
            color: "#c56790",
          },
          margin: 15,
        },
        boundaryGap: false,
      },
    ],
    yAxis: [
      {
        type: "value",
        axisTick: {
          show: false,
        },
        axisLine: {
          lineStyle: {
            color: "#ddd",
          },
        },
        axisLabel: {
          textStyle: {
            color: "#c56790",
          },
        },
        splitLine: {
          show: false,
        },
      },
    ],
    series: [
      {
        name: "S",
        type: "line",
        data: [13, 10, 3, 12, 15, 30, 7],
        symbolSize: 6,
        symbol: "circle",
        smooth: true,
        lineStyle: {
          color: "#fe9a8b",
        },
        itemStyle: {
          normal: {
            color: "#fe9a8b",
            borderColor: "#fe9a8b",
          },
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: "#fe9a8bb3",
            },
            {
              offset: 1,
              color: "#fe9a8b03",
            },
          ]),
        },
        emphasis: {
          itemStyle: {
            color: {
              type: "radial",
              x: 0.5,
              y: 0.5,
              r: 0.5,
              colorStops: [
                {
                  offset: 0,
                  color: "#fe9a8b",
                },
                {
                  offset: 0.4,
                  color: "#fe9a8b",
                },
                {
                  offset: 0.5,
                  color: "#fff",
                },
                {
                  offset: 0.7,
                  color: "#fff",
                },
                {
                  offset: 0.8,
                  color: "#fff",
                },
                {
                  offset: 1,
                  color: "#fff",
                },
              ],
            },
            borderColor: "#fe9a8b",
            borderWidth: 2,
          },
        },
      },
      {
        name: "M",
        type: "line",
        data: [5, 12, 11, 4, 25, 16, 1],
        symbolSize: 6,
        symbol: "circle",
        smooth: true,
        lineStyle: {
          color: "#9E87FF",
        },
        itemStyle: {
          normal: {
            color: "#9E87FF",
            borderColor: "#9E87FF",
          },
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: "#9E87FFb3",
            },
            {
              offset: 1,
              color: "#9E87FF03",
            },
          ]),
        },
        emphasis: {
          itemStyle: {
            color: {
              type: "radial",
              x: 0.5,
              y: 0.5,
              r: 0.5,
              colorStops: [
                {
                  offset: 0,
                  color: "#9E87FF",
                },
                {
                  offset: 0.4,
                  color: "#9E87FF",
                },
                {
                  offset: 0.5,
                  color: "#fff",
                },
                {
                  offset: 0.7,
                  color: "#fff",
                },
                {
                  offset: 0.8,
                  color: "#fff",
                },
                {
                  offset: 1,
                  color: "#fff",
                },
              ],
            },
            borderColor: "#9E87FF",
            borderWidth: 2,
          },
        },
      },
    ],
  }),
});

var colorList = ["#f36c6c", "#e6cf4e", "#20d180", "#0093ff"];
var datas = [
  {
    value: 36,
    name: "系列一",
  },
  {
    value: 54,
    name: "系列二",
  },
  {
    value: 29,
    name: "系列三",
  },
  {
    value: 25,
    name: "系列四",
  },
  {
    value: 55,
    name: "系列五",
  },
  {
    value: 69,
    name: "系列6",
  },
  {
    value: 75,
    name: "系列7",
  },
  {
    value: 85,
    name: "系列8",
  },
];
let maxArr = new Array(datas.length).fill(100);

const line2 = useChart({
  data: ref({
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    legend: {
      show: false,
    },
    grid: {
      left: 0,
      right: 50,
      containLabel: true,
    },
    xAxis: {
      show: false,
      type: "value",
    },
    yAxis: [
      {
        type: "category",
        inverse: true,
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisPointer: {
          label: {
            show: true,
            margin: 30,
          },
        },
        data: datas.map((item) => item.name),
        axisLabel: {
          margin: 100,
          fontSize: 14,
          align: "left",
          color: "#333",
          rich: {
            a1: {
              color: "#fff",
              backgroundColor: colorList[0],
              width: 30,
              height: 30,
              align: "center",
              borderRadius: 2,
            },
            a2: {
              color: "#fff",
              backgroundColor: colorList[1],
              width: 30,
              height: 30,
              align: "center",
              borderRadius: 2,
            },
            a3: {
              color: "#fff",
              backgroundColor: colorList[2],
              width: 30,
              height: 30,
              align: "center",
              borderRadius: 2,
            },
            b: {
              color: "#fff",
              backgroundColor: colorList[3],
              width: 30,
              height: 30,
              align: "center",
              borderRadius: 2,
            },
          },
          formatter: function (params) {
            var index = datas.map((item) => item.name).indexOf(params);
            index = index + 1;
            if (index - 1 < 3) {
              return ["{a" + index + "|" + index + "}" + "  " + params].join(
                "\n"
              );
            } else {
              return ["{b|" + index + "}" + "  " + params].join("\n");
            }
          },
        },
      },
      {
        type: "category",
        inverse: true,
        axisTick: "none",
        axisLine: "none",
        show: true,
        data: datas.map((item) => item.value),
        axisLabel: {
          show: true,
          fontSize: 14,
          color: "#333",
          formatter: "{value}%",
        },
      },
    ],
    series: [
      {
        z: 2,
        name: "value",
        type: "bar",
        barWidth: 20,
        zlevel: 1,
        data: [],
        label: {
          show: false,
          position: "right",
          color: "#333333",
          fontSize: 14,
          offset: [10, 0],
        },
      },
      {
        name: "背景",
        type: "bar",
        barWidth: 20,
        barGap: "-100%",
        itemStyle: {
          normal: {
            color: "rgba(118, 111, 111, 0.55)",
          },
        },
        data: maxArr,
      },
    ],
  }),
});
const line3 = useChart({
  data: ref({
    tooltip: {
      trigger: "item",
      axisPointer: {
        // 坐标轴指示器，坐标轴触发有效
        type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
      },
    },
    grid: {
      left: "2%",
      right: "4%",
      bottom: "14%",
      top: "16%",
      containLabel: true,
    },
    legend: {
      data: ["调解成功", "调解失败", "调解终止", "调解成功率"],
      left: "7%",
      top: "5%",
      textStyle: {
        color: "#666666",
      },
      itemWidth: 15,
      itemHeight: 10,
      itemGap: 25,
    },
    xAxis: {
      type: "category",
      data: ["2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019"],
      axisLine: {
        lineStyle: {
          color: "#cdd5e2",
        },
      },
      axisLabel: {
        textStyle: {
          color: "#666666",
        },
      },
    },

    yAxis: [
      {
        type: "value",
        axisLine: {
          show: false,
          lineStyle: {
            color: "#cdd5e2",
          },
        },
        splitLine: {
          show: false,
        },
        axisLabel: {
          textStyle: {
            color: "#666666",
          },
        },
      },
      {
        type: "value",
        name: "百分比",
        nameTextStyle: {
          color: "#666666",
        },
        position: "right",
        axisLine: {
          lineStyle: {
            color: "#cdd5e2",
          },
        },
        splitLine: {
          show: false,
        },
        axisLabel: {
          show: true,
          formatter: "{value} %", //右侧Y轴文字显示
          textStyle: {
            color: "#666666",
          },
        },
      },
    ],
    series: [
      {
        name: "调解成功",
        type: "bar",
        barWidth: "12px",
        itemStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: "#29acff",
              },
              {
                offset: 1,
                color: "#4bdfff",
              },
            ]),
            barBorderRadius: 6,
          },
        },
        data: [400, 400, 300, 300, 300, 400, 400, 400, 300],
      },
      {
        name: "调解失败",
        type: "bar",
        barWidth: "12px",
        itemStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: "#3d93f2",
              },
              {
                offset: 1,
                color: "#5dc1fd",
              },
            ]),
            barBorderRadius: 6,
          },
        },
        data: [400, 500, 500, 500, 500, 400, 400, 500, 500],
      },
      {
        name: "调解终止",
        type: "bar",
        barWidth: "12px",
        itemStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: "#01c871",
              },
              {
                offset: 1,
                color: "#55f49c",
              },
            ]),
            barBorderRadius: 6,
          },
        },
        data: [400, 600, 700, 700, 1000, 400, 400, 600, 700],
      },
      {
        name: "调解成功率",
        type: "line",
        yAxisIndex: 1, //使用的 y 轴的 index，在单个图表实例中存在多个 y轴的时候有用
        smooth: false, //平滑曲线显示

        symbol: "circle", //标记的图形为实心圆
        symbolSize: 8, //标记的大小
        itemStyle: {
          normal: {
            color: "#ffa43a",
            borderColor: "rgba(255, 234, 0, 0.5)", //圆点透明 边框
            borderWidth: 5,
          },
        },
        lineStyle: {
          color: "#ffa43a",
        },

        data: [4.2, 3.8, 4.8, 3.5, 2.9, 2.8, 3, 5],
      },
    ],
  }),
});

// 指定图表的配置项和数据
var data1 = [20, 30, 20, 30, 20, 30, 20, 30, 20, 30];
var data2 = [9, 30, 9, 60, 70, 20, 59, 20, 49, 20];
var data3 = [20, 30, 20, 30, 20, 30, 20, 30, 20, 30];
var data4 = [9, 30, 9, 60, 70, 20, 59, 20, 49, 20];
var datacity = [
  "济南市",
  "青岛市",
  "淄博市",
  "枣庄",
  "东营",
  "烟台市",
  "潍坊市",
  "济宁市",
  "威海市",
  "泰安市",
];

const line4 = useChart({
  data: ref({
    color: ["#388BFF", "#05C3FA", "#F6931C", "#FFD52E"],
    tooltip: {
      trigger: "axis",
    },
    legend: {
      top: "8%",
      data: ["存量", "新增", "拆除", "整改"],
    },
    grid: {
      //图表的位置
      top: "20%",
      left: "3%",
      right: "4%",
      bottom: "5%",
      containLabel: true,
    },
    yAxis: [
      {
        type: "value",
        axisLabel: {
          show: true,
          interval: "auto",
          formatter: "{value} ",
        },
        splitLine: {
          show: true,
          lineStyle: {
            type: "dashed",
          },
        },
        show: true,
      },
    ],
    xAxis: [
      {
        type: "category",
        axisLabel: {
          interval: 0,
          show: true,
          splitNumber: 15,
          textStyle: {
            fontSize: 10,
            color: "#000",
          },
        },
        data: datacity,
      },
    ],
    series: [
      {
        name: "存量",
        type: "bar",
        stack: "sum",
        barWidth: "20px",
        data: data1,
      },
      {
        name: "新增",
        type: "bar",
        barWidth: "20px",
        stack: "sum",
        data: data2,
      },
      {
        name: "拆除",
        type: "bar",
        color: "#F6931C",
        stack: "sum1",
        barWidth: "20px",
        data: data3,
      },
      {
        name: "整改",
        type: "bar",
        color: "#FFD52E",
        stack: "sum1",
        barWidth: "20px",
        data: data3,
      },
    ],
  }),
});
</script>
