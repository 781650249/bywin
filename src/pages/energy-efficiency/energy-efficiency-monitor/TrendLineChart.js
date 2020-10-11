import React, { useRef, useEffect } from 'react';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';

const getChartOptions = () => ({
  grid: {
    top: 50,
    right: 40,
    bottom: 10,
    left: 10,
    containLabel: true,
  },
  xAxis: {
    name: '日期',
    type: 'category',
    boundaryGap: false,
    axisLine: {
      show: true,
      lineStyle: {
        color: 'rgba(255, 255, 255, .65)',
      },
    },
    axisTick: {
      show: false,
    },
    axisLabel: {
      show: true,
      textStyle: {
        color: 'rgba(255, 255, 255, .85)',
      },
    },
    data: [
      '10.01',
      '10.02',
      '10.03',
      '10.04',
      '10.05',
      '10.06',
      '10.07',
      '10.08',
      '10.09',
      '10.10',
      '10.11',
      '10.12',
      '10.13',
      '10.14',
    ],
  },
  yAxis: {
    name: '用电量\n(kw/h)',
    type: 'value',
    nameTextStyle: {
      color: 'rgba(255, 255, 255, .85)',
      // width: 40,
      align: 'right',
    },
    axisLine: {
      show: false,
    },
    axisLabel: {
      show: true,
      textStyle: {
        color: 'rgba(255, 255, 255, .85)',
      },
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(255, 255, 255, .35)',
        type: 'dotted',
      },
    },
  },
  series: [
    {
      data: [820, 932, 901, 934, 1290, 1330, 1320, 964, 1011, 460, 358],
      type: 'line',
      smooth: true,
      symbol: 'none',
      lineStyle: { color: 'rgba(102, 234, 248, 1)' },
      areaStyle: {
        normal: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(102, 234, 248, 0.45)',
            },
            {
              offset: 1,
              color: 'rgba(102, 234, 248, 0)',
            },
          ]),
        },
      },
    },
    {
      data: [620, 532, 801, 734, 990, 1030, 1120, 849],
      type: 'line',
      smooth: true,
      symbol: 'none',
      lineStyle: { color: 'rgba(49, 150, 250, 1)' },
      areaStyle: {
        normal: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(49, 150, 250, 0.45)',
            },
            {
              offset: 1,
              color: 'rgba(49, 150, 250, 0)',
            },
          ]),
        },
      },
    },
  ],
});

export default function() {
  const chartRef = useRef();
  const chart = useRef();

  const chartResize = () => {
    if (chart.current) {
      chart.current.resize();
    }
  };
  useEffect(() => {
    chart.current = echarts.init(chartRef.current);
    window.addEventListener('resize', chartResize);
    return () => {
      window.removeEventListener('resize', chartResize);
    };
  }, []);

  useEffect(() => {
    if (!chart.current) return;
    chart.current.setOption(getChartOptions());
    chart.current.resize();
  }, []);

  return <div ref={chartRef} style={{ height: '100%' }} />;
}
