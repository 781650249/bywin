import React, { useEffect, useRef } from 'react';
import { Row, Col } from 'antd';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import styles from './index.less';

const getOption = (data, xAxisData) => ({
  tooltip: {
    trigger: 'axis',
    textStyle: {
      fontSize: 10,
    },
    axisPointer: {
      // lineStyle: {
      //   color: 'rgba(0, 0, 0, 0.1)',
      //   type: 'dashed',
      // },
    },
  },
  grid: {
    // show: false,
    top: 20,
    right: 0,
    bottom: 20,
    left: 30,
    containLabel: false,
  },
  xAxis: [
    {
      type: 'category',
      show: true,
      boundaryGap: false,
      data: xAxisData,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        show: true,
        textStyle: {
          color: '#fff',
        },
      },
      splitLine: {
        show: false,
      },
    },
  ],
  yAxis: [
    {
      type: 'value',
      show: true,
      axisLine: {
        show: false,
      },
      axisTick: { show: false },
      axisLabel: {
        show: true,
        textStyle: {
          color: '#fff',
        },
      },
      splitLine: {
        show: false,
      },
      minInterval: 1,
      splitNumber: 3,
    },
  ],
  series: [
    {
      data,
      name: '',
      type: 'line',
      itemStyle: {
        color: 'rgb(82, 196, 26)',
      },
      showSymbol: false,
      hoverAnimation: false,
      areaStyle: {
        normal: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(82, 196, 26, .4)',
            },
            {
              offset: 1,
              color: 'rgba(82, 196, 26, 0)',
            },
          ]),
        },
      },
    },
  ],
});

export default React.memo(function VehicleInfo({ statistics = [], chartData = [] }) {
  const chartRef = useRef();
  const chart = useRef();
  useEffect(() => {
    chart.current = echarts.init(chartRef.current);
    window.addEventListener('resize', chartResize);
    return () => {
      window.removeEventListener('resize', chartResize);
    };
  }, []);

  useEffect(() => {
    const chartOption = getOption(
      chartData.map((item) => item.value),
      chartData.map((item) => item.time.replace(/^\d{4}-/, '')),
    );
    chart.current.setOption(chartOption);
    chart.current.resize();
  }, [chartData]);

  function chartResize() {
    if (chart.current) {
      chart.current.resize();
    }
  }
  return (
    <div className={styles.container}>
      <div>
        <div className="title-1">车辆信息</div>
      </div>
      <Row>
        {statistics.map((item, i) => (
          <Col flex="1" key={i}>
            <div className={styles.statistic}>
              <div className={styles.statisticTitle}>{item.name}</div>
              <div className={styles.statisticContent}>
                <div className={styles.borderRightTop} />
                <div className={styles.borderleftBottom} />
                {item.count}
              </div>
            </div>
          </Col>
        ))}
      </Row>
      <div className={styles.chartWrapper}>
        <div className={styles.chart} ref={chartRef} />
        <div className={styles.re} />
      </div>
    </div>
  );
});
