import React, { useRef, useState, useEffect } from 'react';
import { useSelector } from 'dva';
import { Link } from 'umi';
import cx from 'classnames';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/pie';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import moment from 'moment';
import { getPopToDayCount, getPopWeekWarn, getAreaInfoList } from '@/services/surveillance';
import { Trapezoid } from '../../components';
import { pieOption, lineOption } from '../../echartConfig';
import styles from './index.less';

export default function({ isShowWarn = false }) {
  const { communityInfo } = useSelector((state) => state.global);
  const recRef = useRef();
  const lineChartRef = useRef();
  const lineChart = useRef();
  const pieChartRef = useRef();
  const pieChart = useRef();
  const [todayCount, setTodayCount] = useState(0);
  const [weekWarnTotal, setWeekWarnTotal] = useState(0);
  const [warnInfoList, setWarnInfoList] = useState([]);

  useEffect(() => {
    getAreaInfoList().then((res) => {
      if (res) {
        setWarnInfoList(res);
      }
    });
    if (isShowWarn) return;
    getPopToDayCount().then((res) => {
      try {
        if (!Array.isArray(res) && res.length === 0) return;
        let total = 0;
        res.forEach((item) => {
          total += Number(item.countNumber);
        });
        setTodayCount(total);
        const pieChartOption = {
          ...pieOption,
          series: [
            {
              ...pieOption.series[0],
              data: [...res].map((item) => ({ value: item.countNumber, name: item.area })),
            },
          ],
        };
        pieChart.current = echarts.init(pieChartRef.current);
        pieChart.current.setOption(pieChartOption);
        window.addEventListener('resize', pieChartResize);
      } catch (error) {
        return error;
      }
      return () => {
        window.removeEventListener('resize', pieChartResize);
      };
    });
    getPopWeekWarn().then((res) => {
      try {
        if (!Array.isArray(res) && res.length === 0) return;
        let total = 0;
        res.forEach((item) => {
          total += Number(item.value);
        });
        setWeekWarnTotal(total);
        const lineChartOption = {
          ...lineOption,
          xAxis: {
            ...lineOption.xAxis,
            data: [...res].map((item) => moment(item.time).format('MM/DD')),
          },
          series: [
            {
              ...lineOption.series[0],
              data: [...res].map((item) => item.value),
            },
          ],
        };
        lineChart.current = echarts.init(lineChartRef.current);
        lineChart.current.setOption(lineChartOption);
        window.addEventListener('resize', lineChartResize);
      } catch (error) {
        return error;
      }
      return () => {
        window.removeEventListener('resize', lineChartResize);
      };
    });
  }, [isShowWarn]);

  function lineChartResize() {
    if (lineChart.current) {
      lineChart.current.resize();
    }
  }

  function pieChartResize() {
    if (pieChart.current) {
      pieChart.current.resize();
    }
  }

  const onScoll = (type) => {
    const { current } = recRef;
    const { scrollWidth, scrollLeft, offsetWidth } = current;
    const maxScrollLeft = scrollWidth - offsetWidth;
    const range = offsetWidth - 281;
    let nextScrollLeft = scrollLeft;
    if (type === 'next') {
      if (scrollLeft + range >= maxScrollLeft - 1) {
        nextScrollLeft = maxScrollLeft;
      } else {
        nextScrollLeft = scrollLeft + range;
      }
    }

    if (type === 'pref') {
      if (nextScrollLeft <= 0) {
        nextScrollLeft = 0;
      } else {
        nextScrollLeft = scrollLeft - range;
      }
    }
    current.scrollLeft = nextScrollLeft;
  };

  return (
    <>
      <div className={styles.titleBox}>可疑人员检测</div>
      <div className={styles.siteBox}>
        <p>{communityInfo.address}</p>
        <p>{communityInfo.name}</p>
      </div>
      <div className={styles.todayBar}>
        <Trapezoid text="本日检测" />
        <div className={styles.pieChart}>
          <div style={{ flex: 'auto' }} ref={pieChartRef} />
          <div
            className={styles.pieChartCenter}
            style={{ display: pieChart.current ? null : 'none' }}
          >
            <div>
              <span className={styles.chartNum}>{todayCount}</span>
              <span>次</span>
            </div>
            <div>预警次数</div>
          </div>
        </div>
      </div>
      <div className={styles.warnBar}>
        <Trapezoid style={{ flexShrink: 0 }} text="预警统计" />
        <div className={styles.warnBarContent}>
          <div className={styles.warnBarContentTop}>
            <span>{weekWarnTotal}</span>
            <div>
              <span>预警次数</span>
              <span>七日统计</span>
            </div>
          </div>
          <div className={styles.lineChart} ref={lineChartRef} />
        </div>
      </div>
      <div className={styles.areaBar}>
        <Trapezoid
          className={styles.areaBarTitle}
          text="区域信息"
          extra={
            <div className={styles.areaBarBtn}>
              <Link to="/pop-surveillance/site">设置</Link>
            </div>
          }
        />
        <div className={styles.areaBarContent}>
          <div className={styles.list}>
            <div className={cx('f-arrow-prev', styles.listPref)} onClick={() => onScoll('pref')} />
            <div className={styles.listContent} ref={recRef}>
              {warnInfoList.map((item, index) => (
                <div key={index} className={styles.itemCard}>
                  <div className={styles.itemCardTitle}>{item.areaName}</div>
                  <div className={styles.itemCardInfo}>
                    <div className={styles.itemCardInfoLeft}>
                      <div>
                        <span>{item.facilityCount}</span>
                        <span>台</span>
                      </div>
                      <div>视频监控</div>
                    </div>
                    <div className={styles.divider} />
                    <div className={styles.itemCardInfoRight}>
                      <div>
                        <span>{item.personnelCount}</span>
                        <span>人</span>
                      </div>
                      <div>白名单</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className={cx('f-arrow-next', styles.listNext)} onClick={() => onScoll('next')} />
          </div>
        </div>
      </div>
    </>
  );
}
