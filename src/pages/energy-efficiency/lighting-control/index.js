import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'dva';
import { Link } from 'umi';
import { Select, Row, Col, Progress } from 'antd';
import classNames from 'classnames';
import { SettingOutlined } from '@ant-design/icons';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import { getIndexData } from '@/services/lighting-control';
import styles from './index.less';

/**
 *
 * @param {Array} labels 日期
 * @param {Array} power 功率
 * @param {Array} data2 故障数
 */
const getOption = (labels = [], power = [], failureNumber = []) => ({
  tooltip: {
    trigger: 'axis',
  },
  grid: {
    // show: false,
    top: 40,
    right: 40,
    bottom: 40,
    left: 40,
    containLabel: false,
  },
  xAxis: [
    {
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
      axisLine: {
        lineStyle: { color: 'rgba(255, 255, 255, .45)' },
      },

      data: [...labels],
    },
  ],
  yAxis: [
    {
      type: 'value',
      scale: true,
      name: '功率(千瓦)',
      max: Math.max(...power),
      min: 0,
      axisLine: {
        show: false,
      },
      axisLabel: {
        show: true,
        textStyle: {
          color: '#fff',
        },
      },
      nameTextStyle: {
        color: '#fff',
      },
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: 'rgba(255, 255, 255, .45)',
        },
      },
      boundaryGap: [0.2, 0.2],
    },
    {
      type: 'value',
      scale: true,
      name: '故障数(次)',
      max: Math.max(...failureNumber),
      min: 0,
      axisLine: {
        show: false,
      },
      axisLabel: {
        show: true,
        textStyle: {
          color: '#fff',
        },
      },
      nameTextStyle: {
        color: '#fff',
      },
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: 'rgba(255, 255, 255, .45)',
        },
      },
      boundaryGap: [0.2, 0.2],
    },
  ],
  series: [
    {
      name: '功率(千瓦)',
      type: 'line',
      smooth: true,
      itemStyle: {
        color: '#66EAF8',
      },
      symbol: 'none',
      xAxisIndex: 0,
      yAxisIndex: 0,
      data: [...power],
    },
    {
      name: '故障数(次)',
      type: 'bar',
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#54a9f7' },
          { offset: 0.5, color: '#2a70ed' },
          { offset: 1, color: '#4751f1' },
        ]),
      },
      barWidth: 12,
      xAxisIndex: 0,
      yAxisIndex: 1,
      data: [...failureNumber],
    },
  ],
});

export default function() {
  const chartRef = useRef();
  const chart = useRef();
  const { communityList, communityInfo } = useSelector((state) => state.global);

  const [currentCommunityKey, setCurrentCommunityKey] = useState();

  const [chartData, setChartData] = useState({});
  const [baseInfo, setBaseInfo] = useState({});
  const [deviceStatus, setDeviceStatus] = useState({});
  const [openStatus, setOpenStatus] = useState({});

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
    getIndexData({ yqxxbz: currentCommunityKey || communityInfo.xqxxbz }).then((data) => {
      setChartData(data.chartData);
      setBaseInfo(data.baseInfo);
      setDeviceStatus(data.deviceStatus);
      setOpenStatus(data.openStatus);
    });
  }, [currentCommunityKey, communityInfo.xqxxbz]);

  useEffect(() => {
    chart.current.setOption(getOption(chartData.label, chartData.power, chartData.failureNumber));
  }, [chartData]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>
        <Select
          style={{ width: 176 }}
          defaultValue={communityInfo.xqxxbz || 1}
          onChange={setCurrentCommunityKey}
        >
          {communityList.map((item) => (
            <Select.Option key={item.xqxxbz} value={item.xqxxbz}>
              {item.communityName}
            </Select.Option>
          ))}
        </Select>
      </div>
      <div className={styles.main}>
        <div className={styles.kanban}>
          <Link to="/lighting-control/setting">
            <div className={styles.setting}>
              <SettingOutlined />
            </div>
          </Link>
          <div className={styles.total}>
            <div className={styles.totalIcon} />
            <div className={styles.totalContent}>
              <p style={{ fontSize: 12 }}>
                <span>{baseInfo.deviceTotal || 0}</span>台
              </p>
              <p>照明设备</p>
            </div>
          </div>
          <Row className="mb-24">
            <Col span={12}>
              <div className={styles.electricity}>
                <div className={styles.electricityIcon} />
                <div className={styles.electricityContent}>
                  <p style={{ fontSize: 12 }}>
                    <span>{baseInfo.sumTodayEle || 0}</span>kw
                  </p>
                  <p>本日用电</p>
                </div>
              </div>
            </Col>
            <Col span={12}>
              <div className={styles.electricity}>
                <div className={styles.electricityIcon} />
                <div className={styles.electricityContent}>
                  <p style={{ fontSize: 12 }}>
                    <span>{baseInfo.sumMonthEle || 0}</span>kw
                  </p>
                  <p>本月用电</p>
                </div>
              </div>
            </Col>
          </Row>
          <Row className="mt-8">
            <Col span={12} className="text-center">
              <Progress
                type="dashboard"
                percent={openStatus.openPercent}
                width={72}
                strokeWidth={16}
                gapDegree={0}
                strokeColor={{
                  '0%': '#4776F1',
                  '100%': '#4751F1',
                }}
                status="normal"
              />
              <div style={{ lineHeight: '32px' }}>亮灯率</div>
            </Col>
            <Col span={12}>
              <div className={styles.rateItem}>
                亮灯:<span>{openStatus.openNum || 0}</span>
              </div>
              <div className={styles.rateItem}>
                关灯:<span>{openStatus.closeNum || 0}</span>
              </div>
            </Col>
          </Row>
          <Row className="mt-8">
            <Col span={12} className="text-center">
              <Progress
                type="dashboard"
                percent={deviceStatus.normalPercent}
                width={72}
                strokeWidth={16}
                gapDegree={0}
                strokeColor={{
                  '0%': '#4776F1',
                  '100%': '#4751F1',
                }}
                status="normal"
              />
              <div style={{ lineHeight: '32px' }}>完好率</div>
            </Col>
            <Col span={12}>
              <div className={styles.rateItem}>
                正常:<span>{deviceStatus.normalNum || 0}</span>
              </div>
              <div className={styles.rateItem}>
                故障:<span>{deviceStatus.errorNum || 0}</span>
              </div>
            </Col>
          </Row>
          <div className={styles.chart}>
            <div className={classNames(styles.chartTitle, 'f-title')}>
              能耗及故障变化趋势
              <div className={styles.chartTitleExtra}>
                <span>功率</span>
                <span>故障数</span>
              </div>
            </div>
            <div className={styles.chartContent} ref={chartRef} />
          </div>
        </div>
        <div className={styles.content} />
      </div>
    </div>
  );
}
