import React, { useEffect } from 'react';
import { useSelector } from 'dva';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import { theme } from '@/config';

const chartTextColor = theme === 'light' ? 'rgba(0, 0, 0, .65)' : 'rgba(255, 255, 255, .65)';
const weekFlowOption = {
  tooltip: {
    trigger: 'axis',
    textStyle: {
      fontSize: 10,
    },
    axisPointer: {
      lineStyle: {
        color: theme === 'light' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)',
        type: 'dashed',
      },
    },
  },
  legend: {
    orient: 'vertical',
    data: ['常住', '访客'],
    bottom: 8,
    right: 0,
    itemHeight: 4,
    itemWidth: 10,
    textStyle: {
      color: chartTextColor,
    },
  },
  grid: {
    top: 20,
    right: 62,
    bottom: 20,
    borderColor: 'transparent',
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    axisLine: { show: true, lineStyle: { color: [chartTextColor] } },
    axisTick: { show: false },
    axisLabel: { show: true, color: chartTextColor },
    nameTextStyle: {
      color: chartTextColor,
    },
    data: [],
  },
  yAxis: [
    {
      type: 'value',
      name: '近七日趋势',
      axisLine: { show: true, lineStyle: { color: [chartTextColor] } },
      axisTick: { show: false },
      axisLabel: { show: true, color: chartTextColor },
      // splitLine: { show: false },
      nameGap: 6,
      nameTextStyle: {
        align: 'left',
        color: chartTextColor,
      },
      splitLine: {
        show: false,
      }
    },
  ],
  series: [
    {
      data: [0, 0, 0, 0, 0, 0, 0, 0],
      name: '常住',
      type: 'line',
      itemStyle: {
        color: '#4751F1',
      },
      showSymbol: false,
      hoverAnimation: false,
      areaStyle: {
        normal: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: '#4751F1',
            },
            {
              offset: 1,
              color: 'rgba(255, 255, 255, 0.4)',
            },
          ]),
        },
      },
    },
    {
      data: [0, 0, 0, 0, 0, 0, 0, 0],
      name: '访客',
      type: 'line',
      itemStyle: {
        color: '#E79A1B',
      },
      showSymbol: false,
      hoverAnimation: false,
      areaStyle: {
        normal: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: '#E79A1B',
            },
            {
              offset: 1,
              color: 'rgba(255, 255, 255, 0.4)',
            },
          ]),
        },
      },
    },
  ],
};

export default function() {
  const weekFlowList = useSelector(({ videoArchives }) => videoArchives.weekFlowList);

  useEffect(() => {
    const weekFlowOpt = echarts.init(document.getElementById('weekFlowOpt'));
    const { oneList, twoList } = weekFlowList;
    if (oneList && twoList) {
      weekFlowOption.xAxis.data = oneList.map((i) => i.time.slice(5, 10));
      weekFlowOption.series[0].data = oneList.map((i) => i.value);
      weekFlowOption.series[1].data = twoList.map((i) => i.value);
    }
    weekFlowOpt.clear();
    weekFlowOpt.setOption(weekFlowOption);
  }, [weekFlowList]);

  return <div id="weekFlowOpt" style={{ width: '100%', height: '100%' }} />;
}
