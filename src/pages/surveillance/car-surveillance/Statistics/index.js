import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'umi';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import moment from 'moment';
import { getWeekWarn, getCarFlowStatistics } from '@/services/surveillance';
import { Trapezoid } from '../../components';
import { lineOption } from '../../echartConfig';
import styles from './index.less';

export default function({ isShowWarn }) {
  const firstLineChartRef = useRef();
  const firstLineChart = useRef();
  const secLineChartRef = useRef();
  const secLineChart = useRef();
  const [warnCount, setWarnCount] = useState(0);
  const [carTotal, setCarTotal] = useState({});

  useEffect(() => {
    if(isShowWarn) return;
    getWeekWarn().then((res) => {
      try {
        const { carNum = {} } = res;
        setCarTotal(carNum)
        setWarnCount(res.weekCount);
        const chartOption = {
          ...lineOption,
          xAxis: {
            ...lineOption.xAxis,
            data: [...res.weekSubData].reverse().map((item) => moment(item.time).format('MM/DD')),
          },
          series: [
            {
              ...lineOption.series[0],
              data: [...res.weekSubData].reverse().map((item) => item.count),
            },
          ],
        };
        firstLineChart.current = echarts.init(firstLineChartRef.current);
        firstLineChart.current.setOption(chartOption);
        window.addEventListener('resize', firstLineResize);
      } catch (error) {
        return error;
      }
      return () => {
        window.removeEventListener('resize', firstLineResize);
      };
    });
    getCarFlowStatistics().then((res) => {
      try {
        const chartOption = {
          ...lineOption,
          xAxis: {
            ...lineOption.xAxis,
            data: [...res.twoList].map((item) => moment(item.time).format('MM/DD')),
          },
          series: [
            {
              ...lineOption.series[0],
              data: res.twoList.map((item) => item.value),
            },
          ],
        };
        secLineChart.current = echarts.init(secLineChartRef.current);
        secLineChart.current.setOption(chartOption);
        window.addEventListener('resize', secLineResize);
      } catch (error) {
        return error;
      }
      return () => {
        window.removeEventListener('resize', secLineResize);
      };
    });
  }, [isShowWarn]);

  function firstLineResize() {
    if (firstLineChart.current) {
      firstLineChart.current.resize();
    }
  }

  function secLineResize() {
    if (secLineChart.current) {
      secLineChart.current.resize();
    }
  }

  return (
    <>
      <div className={styles.titleBox}>可疑车辆检测</div>
      <div className={styles.warnBar}>
        <Trapezoid style={{ flexShrink: 0 }} text="预警统计" />
        <div className={styles.warnBarContent}>
          <div className={styles.warnBarContentTop}>
            <span>{warnCount}</span>
            <div>
              <span>预警次数</span>
              <span>七日统计</span>
            </div>
          </div>
          <div className={styles.lineChart} ref={firstLineChartRef} />
        </div>
      </div>
      <div className={styles.dayBar}>
        <Trapezoid text="近七日车流辆统计" />
        <div className={styles.chartWrapper}>
          <div className={styles.lineChart} ref={secLineChartRef} />
        </div>
      </div>
      <div className={styles.bottomBar}>
        <div className={styles.bottomBarContent}>
          <div className={styles.bottomBarTitle}>
            <span>金牛山互联网基地</span>
            <div className={styles.bottomBarTitleBtn}>
              <Link to="/car-surveillance/site">设置</Link>
            </div>
          </div>
          <div className={styles.bottomBarInfo}>
            <div className={styles.bottomBarInfoCard}>
              <p>
                <span>{carTotal.totalCount}</span>
                <span>台</span>
              </p>
              <p>车辆总数</p>
            </div>
            <div className={styles.bottomBarInfoCard}>
              <p>
                <span>{carTotal.whiteCount}</span>
                <span>人</span>
              </p>
              <p>白名单</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
