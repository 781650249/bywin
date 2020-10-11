import React, { useRef, useEffect } from 'react';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/tooltip';

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
    const chartOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      grid: {
        top: 20,
        right: 60,
        bottom: 0,
        left: 0,
        containLabel: true,
      },
      xAxis: {
        type: 'value',
        name: '用电量\n(kw/h)',
        nameGap: 60,
        nameTextStyle: {
          color: 'rgba(255, 255, 255, .85)',
          // width: 40,
          align: 'right',
          verticalAlign: 'bottom',
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: 'rgba(255, 255, 255, .35)',
            type: 'dashed',
          },
        },
        axisTick: {
          show: false,
        },
        position: 'top',
        axisLabel: {
          show: true,
          textStyle: {
            color: 'rgba(255, 255, 255, .85)',
          },
        },
        splitLine: {
          show: false,
        },
      },
      yAxis: {
        type: 'category',
        data: ['1号楼', '2号楼', '3号楼', '4号楼', '5号楼', '6号楼'],
        axisLine: {
          show: false,
        },
        axisLabel: {
          show: true,
          textStyle: {
            color: 'rgba(255, 255, 255, .85)',
          },
        },
        nameTextStyle: {
          color: 'rgba(255, 255, 255, .85)',
        },
        splitLine: {
          show: false,
        },
      },
      series: [
        {
          type: 'bar',
          smooth: true,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: '#4751F1' },
              { offset: 1, color: '#7D89F9' },
            ]),
          },
          label: {
            show: true,
            color: '#66eaf8',
            position: 'right',
            fontSize: 16,
            fontWeight: 'bold'
          },
          barWidth: 16,
          data: [182, 234, 290, 1049, 1317, 630],
        },
      ],
    };
    chart.current.setOption(chartOption);
    chart.current.resize();
  }, []);

  return <div ref={chartRef} style={{ height: '100%' }} />;
}
