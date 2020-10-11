import React, { useEffect, useRef } from 'react';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import { useSelector } from 'dva';
import styles from './index.less';

const option = {
  tooltip: {
    trigger: 'axis',
    textStyle: {
      fontSize: 10,
    },
    axisPointer: {
      lineStyle: {
         color: 'rgba(0, 0, 0, 0.1)',
         type: 'dashed',
      }
    }
  }, 
  grid: {
    top: 10,
    right: 20,
    bottom: 0,
    left: 0,
    containLabel: true,
  },
  xAxis: [
    {
      type: 'category',
      show: true,
      boundaryGap: false,
      // data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      axisLine: { show: true },
      axisTick: { show: true },
      axisLabel: { show: true },
    },
  ],
  yAxis: [
    {
      type: 'value',
      show: true,
      axisLine: { show: true },
      axisTick: { show: true },
      axisLabel: { show: true },
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
  const chart1Ref = useRef();
  const chart2Ref = useRef();
  const chart1 = useRef();
  const chart2 = useRef();
  const { peopleFlowTrend, trafficFlowTrend } = useSelector(({ situation }) => situation);
  useEffect(() => {
    chart1.current = echarts.init(chart1Ref.current);
    chart2.current = echarts.init(chart2Ref.current);
    window.addEventListener('resize', chartResize);
    return () => {
      window.removeEventListener('resize', chartResize);
    };
  }, []);
  /**
   * 人流趋势图标渲染
   */
  useEffect(() => {
    const { oneList = [], twoList = [] } = peopleFlowTrend;
    const chartOption = {
      ...option,
      xAxis: [
        {
          ...option.xAxis[0],
          data: oneList.map((item) => item.time.replace(/^\d{4}-/, '')),
        },
      ],
      series: [
        {
          ...option.series[0],
          data: oneList.map((item) => item.value),
        },
        {
          ...option.series[1],
          data: twoList.map((item) => item.value),
        },
      ],
    };
    chart1.current.setOption(chartOption);
  }, [peopleFlowTrend]);

  /**
   * 车流趋势图标渲染
   */
  useEffect(() => {
    const { oneList = [], twoList = [] } = trafficFlowTrend;
    const chartOption = {
      ...option,
      xAxis: [
        {
          ...option.xAxis[0],
          data: oneList.map((item) => item.time.replace(/^\d{4}-/, '')),
        },
      ],
      series: [
        {
          ...option.series[0],
          data: oneList.map((item) => item.value),
        },
        {
          ...option.series[1],
          data: twoList.map((item) => item.value),
        },
      ],
    };
    chart2.current.setOption(chartOption);
  }, [trafficFlowTrend]);

  function chartResize() {
    if (chart1.current) {
      chart1.current.resize();
    }
    if (chart2.current) {
      chart2.current.resize();
    }
  }

  return (
    <div className={styles.bottomWrapper}>
      <div className={styles.card}>
        <div className={styles.title}>人流趋势</div>
        <div className={styles.subtitle}>近七日趋势</div>
        <div className={styles.content} ref={chart1Ref} />
      </div>
      <div className={styles.card}>
        <div className={styles.title}>车流趋势</div>
        <div className={styles.subtitle}>近七日趋势</div>
        <div className={styles.content} ref={chart2Ref} />
      </div>
    </div>
  );
}
