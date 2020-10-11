import React, { useState, useEffect, useCallback, useRef } from 'react';
import cx from 'classnames';
import { useSelector, useDispatch } from 'dva';
import { DatePicker, Form, Button, Select, Spin } from 'antd';
import echarts from 'echarts/lib/echarts';
import moment from 'moment';
import styles from './index.less';
import Main from './Main';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/radar';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';

const getPeopleRangeOption = (indicator = [], inPeople = [], outPeople = [], totalCount = []) => ({
  tooltip: {},
  legend: {
    orient: 'vertical',
    right: '0px',
    icon: 'circle',
    tooltip: {
      show: true,
    },
    textStyle: {
      color: 'rgba(255, 255, 255, .65)',
    },
    marginBottom: 29,
    marginTop: 10,
    data: ['人员总数', '园区人员', '外来人员'],
  },
  grid: {
    top: '30%',
    right: '2%',
    bottom: '10%',
  },
  radar: {
    name: {
      textStyle: {
        color: '#fff',
        fontSize: 8,
        padding: [-8, 5],
      },
    },
    splitArea: {
      areaStyle: {
        color: ['rgba(0,0,0,0.3)'],
        shadowColor: 'rgba(0, 0, 0, 0.3)',
        shadowBlur: 10,
        opacity: 0.5,
      },
    },
    indicator,
  },
  series: [
    {
      type: 'radar',
      splitArea: {
        areaStyle: {
          backgroundColor: [
            'rgba(114, 172, 209, 0.2)',
            'rgba(114, 172, 209, 0.4)',
            'rgba(114, 172, 209, 0.6)',
          ],
          shadowColor: 'rgba(0, 0, 0, 0.3)',
          shadowBlur: 10,
        },
      },
      data: [
        {
          value: totalCount || 0,
          name: '人员总数',
          itemStyle: {
            color: '#66EAF8',
          },
        },
        {
          value: inPeople || 0,
          name: '园区人员',
          itemStyle: {
            color: '#F29645',
          },
        },
        {
          value: outPeople || 0,
          name: '外来人员',
          itemStyle: {
            color: '#32BF50',
          },
        },
      ],
    },
  ],
});

const getpeopleAssignOption = (
  timeFormat = [],
  AssignData0 = [],
  AssignData1 = [],
  AssignData2 = [],
) => ({
  tooltip: {
    trigger: 'axis',
    textStyle: {
      fontSize: 10,
    },
    axisPointer: {
      lineStyle: {
        color: 'rgba(255, 255, 255, 1)',
        type: 'dashed',
      },
    },
  },
  legend: {
    itemWidth: 10,
    textStyle: {
      color: 'rgba(255, 255, 255, .65)',
    },
    backgroundColor: 'transparent',
    icon: 'circle',
  },
  grid: {
    top: '10%',
    right: '2%',
    bottom: '10%',
    borderColor: 'transparent',
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    axisLine: { show: true, lineStyle: { color: ['rgba(255, 255, 255, 1)'] } },
    axisTick: {
      show: true,
    },
    axisPointer: { type: 'none' },
    axisLabel: {
      show: false,
      color: 'rgba(255, 255, 255, 1)',
    },
    nameTextStyle: {
      color: 'rgba(255, 255, 255, 1)',
    },
    data: timeFormat,
  },
  yAxis: [
    {
      type: 'value',
      // name: '数量(个)',
      axisLine: { show: true, lineStyle: { color: ['rgba(255, 255, 255, 1)'] } },
      axisTick: { show: false },
      axisLabel: { show: true, color: 'rgba(255, 255, 255, 1)' },
      nameTextStyle: {
        align: 'left',
        color: 'rgba(255, 255, 255, 1)',
      },
      splitLine: {
        show: false,
      },
    },
  ],
  series: [
    {
      data: AssignData0,
      name: '人员总数',
      type: 'line',
      itemStyle: {
        color: '#66EAF8',
      },
    },
    {
      data: AssignData1,
      name: '园区人员',
      type: 'line',
      itemStyle: {
        color: '#F29645',
      },
    },
    {
      data: AssignData2,
      name: '外来人员',
      type: 'line',
      itemStyle: {
        color: '#32BF50',
      },
    },
  ],
});

export default function() {
  const [form] = Form.useForm();
  const [typeTime, setTypeTime] = useState(1);
  const dispatch = useDispatch();
  const { communityList } = useSelector(({ global }) => global);
  const {
    queryParams,
    peopleAssignCount,
    doorList,
    totalCountList,
    outsiderCountList,
    insiderCountList,
    AssignData0,
    AssignData1,
    AssignData2,
    timeFormat,
    inSideTotal,
    peopleTotal,
    outSideTotal,
  } = useSelector(({ heatMap }) => heatMap);

  const loading = useSelector((state) => state.loading.effects['heatMap/getStatistics']);
  const NumLoading = useSelector((state) => state.loading.effects['heatMap/getPeopleCount']);
  const rangeLoading = useSelector((state) => state.loading.effects['heatMap/getStatisticsRange']);
  const outLoading = useSelector((state) => state.loading.effects['heatMap/getStaticsPercent']);

  const { RangePicker } = DatePicker;
  const { Option } = Select;

  const range = (start, end) => {
    const result = [];
    for (let i = start; i < end; i += 1) {
      result.push(i);
    }
    return result;
  };

  const queryStatistics = useCallback(
    (params = {}, type = 'heatMap/getStatistics') => {
      dispatch({
        type,
        payload: {
          ...queryParams,
          ...params,
        },
      });
    },
    [dispatch, queryParams],
  );

  const queryPeopleCount = useCallback(
    (params = {}, type = 'heatMap/getPeopleCount') => {
      dispatch({
        type,
        payload: {
          ...queryParams,
          ...params,
        },
      });
    },
    [dispatch, queryParams],
  );

  const queryPeopleAssign = useCallback(
    (params = {}, type = 'heatMap/getStatisticsRange') => {
      dispatch({
        type,
        payload: {
          ...queryParams,
          ...params,
        },
      });
    },
    [dispatch, queryParams],
  );

  const getStaticsPercent = useCallback(
    (params = {}, type = 'heatMap/getStaticsPercent') => {
      dispatch({
        type,
        payload: {
          ...queryParams,
          ...params,
        },
      });
    },
    [dispatch, queryParams],
  );

  const handleSearch = (params) => {
    if (params.time) {
      const beginTime = moment(params.time[1]).format('YYYY-MM-DD HH:mm:ss');
      const endTime = moment(params.time[0]).format('YYYY-MM-DD HH:mm:ss');
      queryStatistics({
        yqbh: params.xqxxbz || 'cs1',
        beginTime,
        endTime,
      });
      queryPeopleCount({
        yqbh: params.xqxxbz || 'cs1',
        beginTime,
        endTime,
      });
      queryPeopleAssign({
        yqbh: params.xqxxbz || 'cs1',
        beginTime,
        endTime,
      });
      getStaticsPercent({
        yqbh: params.xqxxbz || 'cs1',
        beginTime,
        endTime,
      });
    } else {
      queryStatistics({
        yqbh: params.xqxxbz || 'cs1',
      });
      queryPeopleCount({
        yqbh: params.xqxxbz || 'cs1',
      });
      queryPeopleAssign({
        yqbh: params.xqxxbz || 'cs1',
      });
      getStaticsPercent({
        yqbh: params.xqxxbz || 'cs1',
      });
    }
  };

  // 设置时间的选择范围
  const setTime = (timeValue) => {
    const date1 = moment(moment(), 'YYYY-MM-DD HH:mm:ss');
    const date2 = moment(
      moment(new Date())
        .subtract(timeValue, 'hours')
        .format('YYYY-MM-DD HH:mm:ss'),
      'YYYY-MM-DD HH:mm:ss',
    );
    form.setFieldsValue({
      time: [date1, date2],
    });
  };

  // 统一根据选择时间来搜索
  const handleAjaxUnit = (value) => {
    const areaId = form.getFieldValue('xqxxbz');
    setTypeTime(value);
    setTime(value);
    const timeSet = form.getFieldValue('time');
    const beginTime = timeSet[1].format('YYYY-MM-DD HH:mm:ss');
    const endTime = timeSet[0].format('YYYY-MM-DD HH:mm:ss');
    queryPeopleCount({
      beginTime,
      endTime,
      yqbh: areaId || 'cs1',
    });
    queryStatistics({
      beginTime,
      endTime,
      yqbh: areaId || 'cs1',
    });
    queryPeopleAssign({
      beginTime,
      endTime,
      yqbh: areaId || 'cs1',
    });
    getStaticsPercent({
      beginTime,
      endTime,
      yqbh: areaId || 'cs1',
    });
  };

  // 初始化默认前一小时
  useEffect(() => {
    handleAjaxUnit(1);
    // return () => {
    //   dispatch({
    //     type: 'heatMap/clearState',
    //   });
    // };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const chart1Ref = useRef();
  const chart2Ref = useRef();
  const peopleAssign = useRef();
  const peopleRange = useRef();

  // 初次渲染chart1
  useEffect(() => {
    peopleAssign.current = echarts.init(chart1Ref.current);
    peopleRange.current = echarts.init(chart2Ref.current);
    if (Array.isArray(doorList) && doorList.length > 0) {
      peopleRange.current.setOption(
        getPeopleRangeOption(doorList, insiderCountList, outsiderCountList, totalCountList),
      );
    }
  }, [doorList, totalCountList, outsiderCountList, insiderCountList]);

  // 初次渲染chart2
  useEffect(() => {
    if (Array.isArray(AssignData0) && AssignData0.length > 0) {
      peopleAssign.current.setOption(
        getpeopleAssignOption(timeFormat, AssignData0, AssignData1, AssignData2),
      );
    }
  }, [timeFormat, AssignData0, AssignData1, AssignData2]);

  // 数据改变重新渲染
  useEffect(() => {
    if (!peopleAssign.current || peopleRange.current) return;
    peopleRange.current.setOption(
      getPeopleRangeOption(doorList, insiderCountList, outsiderCountList, totalCountList),
    );

    peopleAssign.current.setOption(
      getpeopleAssignOption(timeFormat, AssignData0, AssignData1, AssignData2),
    );
    window.addEventListener('resize', chartResize);
    return () => {
      window.removeEventListener('resize', chartResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function chartResize() {
    if (peopleAssign.current) {
      peopleAssign.current.resize();
    }
    if (peopleRange.current) {
      peopleRange.current.resize();
    }
  }

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>人员热力</h3>

      <div className={styles.container}>
        <div className={styles.top}>
          <div
            className={cx(styles.topTag, { [styles.active]: typeTime === 1 })}
            onClick={() => handleAjaxUnit(1)}
          >
            1小时
          </div>
          <div
            className={cx(styles.topTag, { [styles.active]: typeTime === 3 })}
            onClick={() => handleAjaxUnit(3)}
          >
            3小时
          </div>
          <div
            className={cx(styles.topTag, { [styles.active]: typeTime === 6 })}
            onClick={() => handleAjaxUnit(6)}
          >
            6小时
          </div>
          <div
            className={cx(styles.topTag, { [styles.active]: typeTime === 24 })}
            onClick={() => handleAjaxUnit(24)}
          >
            24小时
          </div>
          <div
            className={cx(styles.topTag, { [styles.active]: typeTime === 48 })}
            onClick={() => handleAjaxUnit(48)}
          >
            48小时
          </div>
          <div
            className={cx(styles.topTag, { [styles.active]: typeTime === 72 })}
            onClick={() => handleAjaxUnit(72)}
          >
            72小时
          </div>
          <Form layout="inline" onFinish={handleSearch} form={form}>
            <Form.Item name="xqxxbz">
              <Select defaultValue="cs1">
                {communityList.length > 0 &&
                  communityList.map((item, i) => (
                    <Option key={i} value={item.communityId}>
                      {item.communityName}
                    </Option>
                  ))}
              </Select>
            </Form.Item>

            <Form.Item name="time">
              <RangePicker
                allowClear
                showTime={{ format: 'HH:mm:ss' }}
                value={moment()}
                placeholder={['开始时间', '结束时间']}
                disabledDate={(current) => current && current >= moment().endOf('day')}
                disabledTime={(date) => {
                  const currentDate = new Date();
                  const h = currentDate.getHours();
                  const m = currentDate.getMinutes();
                  let disabledHours = [];
                  let disabledMinutes = [];
                  if (moment.isMoment(date) && date.isSame(moment(), 'day')) {
                    disabledHours = range(0, h);
                    disabledMinutes = range(0, m);
                  }
                  return {
                    disabledHours: () => disabledHours,
                    disabledMinutes: (selectedHour) => (selectedHour > h ? [] : disabledMinutes),
                  };
                }}
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
            </Form.Item>
          </Form>
        </div>

        <div className={styles.content}>
          <div className={styles.left}>
            <Main loading={loading} />
          </div>
          <div className={styles.right}>
            <div className={styles.rightNum}>
              <div className={styles.peopleTitle}>人员数量</div>
              <Spin spinning={NumLoading} wrapperClassName={styles.spin}>
                <div className={styles.subTitle}>
                  <div className={styles.peopleNum}>
                    <div className={styles.pic1} />
                    <div>人员总数</div>
                    <div>
                      <span style={{ color: '#66EAF8', fontSize: '24px' }}>{peopleTotal}</span>人
                    </div>
                  </div>
                  <div className={styles.areaNum}>
                    <div className={styles.pic2} />
                    <div>园区人员</div>
                    <div>
                      <span style={{ color: '#66EAF8', fontSize: '24px' }}>{inSideTotal}</span>人
                    </div>
                  </div>
                  <div className={styles.outNum}>
                    <div className={styles.pic3} />
                    <div>外来人员</div>
                    <div>
                      <span style={{ color: '#66EAF8', fontSize: '24px' }}>{outSideTotal}</span>人
                    </div>
                  </div>
                </div>
              </Spin>
            </div>

            <div className={styles.rightRange}>
              <div className={styles.peopleTitle}>人员分布</div>
              <div className={styles.peopleAssign}>
                <Spin wrapperClassName={styles.spin} spinning={rangeLoading}>
                  {' '}
                  <div
                    ref={chart1Ref}
                    id="peopleAssign"
                    style={{ width: '100%', height: '100%' }}
                  />
                </Spin>
                <div className={styles.timeLabel}>{`${peopleAssignCount.fromTime ||
                  ''} ~ ${peopleAssignCount.toTime || ''}`}</div>
              </div>
            </div>

            <div className={styles.rightPercent}>
              <div className={styles.peopleTitle}>进出占比</div>
              <div className={styles.peopleRange}>
                <Spin wrapperClassName={styles.spin} spinning={outLoading}>
                  {' '}
                  <div id="peopleRange" ref={chart2Ref} style={{ width: '100%', height: '100%' }} />
                </Spin>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
