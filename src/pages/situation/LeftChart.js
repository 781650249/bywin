import React, { useEffect, useRef } from 'react';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';

const option = {
  tooltip: {
    show: false,
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        // backgroundColor: '#0000ff',
      },
    },
  },
  grid: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    containLabel: true,
  },
  xAxis: [
    {
      type: 'category',
      show: false,
      boundaryGap: false,
      // data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { show: false },
    },
  ],
  yAxis: [
    {
      type: 'value',
      show: false,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { show: false },
    },
  ],
  series: [
    {
      type: 'line',

      symbol: 'none',
      label: {
        show: false,
      },
    },
  ],
};

export default function({ title = '', color = 'red' }) {
  const chartRef = useRef();
  const chart = useRef();
  useEffect(() => {
    const chartOption = {
      ...option,
      series: [
        {
          ...option.series[0],
          name: title,
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color,
                },
                {
                  offset: 1,
                  color: 'rgba(255, 255, 255, 0)',
                },
              ]),
            },
          },
          lineStyle: { color },
          data: [820, 932, 901, 934, 1290, 1330, 1320].reverse(),
        },
      ],
    };
    chart.current = echarts.init(chartRef.current);
    chart.current.setOption(chartOption);
    window.addEventListener('resize', chartResize)
    return () => {
      window.removeEventListener('resize', chartResize)
    }
  }, [title, color]);

  function chartResize() {
    if (chart.current) {
      chart.current.resize()
    }
  }


  return <div style={{ height: '100%', width: '100%' }} ref={chartRef} />;
}
