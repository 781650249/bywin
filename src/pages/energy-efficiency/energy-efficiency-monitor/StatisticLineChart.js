import React, { useRef, useEffect } from 'react';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';

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
    boundaryGap: true,
    axisLabel: {
      show: true,
      rotate: -30,
      interval: () => true,
      margin: 16,
      color: '#fff',
      fontSize: 10,
      align: 'center',
    },
    axisTick: {
      show: false,
    },
    axisLine: {
      show: true,
      lineStyle: {
        color: 'rgba(255, 255, 255, .65)',
      },
    },
    data: ['10.01', '10.02', '10.03', '10.04', '10.05', '10.06', '10.07'],
  },
  yAxis: {
    name: '功率(千瓦)',
    type: 'value',
    nameTextStyle: {
      color: 'rgba(255, 255, 255, .85)',
      // width: 40,
      align: 'center',
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
      data: [120, 130, 130, 64, 101, 46, 58],
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
      data: [20, 32, 80, 74, 90, 120, 49],
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
