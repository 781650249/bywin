import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'dva';
import { Avatar, Progress, Select, message } from 'antd';
import { UserOutlined, CheckCircleFilled } from '@ant-design/icons';
import { sortBy } from 'lodash';
import pending from '@/assets/eventIcon/pending.png';
import processed from '@/assets/eventIcon/processed.png';
// import ignored from '@/assets/eventIcon/ignored.png';
// import hisEvent from '@/assets/eventIcon/his-event.png';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import styles from './index.less';

const option = {
  tooltip: {
    trigger: 'item',
    formatter: '{b}<br />{d}%',
    position: 'left',
  },
  color: ['#347DFF', '#FFA234', '#38AB50', '#EF6262', '#FFCC00', '#ADFF2F'],
  series: [
    {
      type: 'pie',
      radius: ['61%', '76%'],
      hoverAnimation: false,
      startAngle: 180,
      // label: {
      //   normal: {
      //     show: false,
      //     position: 'center',
      //   },
      // },
      // labelLine: {
      //   normal: {
      //     show: false,
      //   },
      // },
      label: {
        show: true,
        formatter: '{d}%',
      },
      labelLine: {
        show: true,
        length: 4,
        length2: 6,
      },
      data: [],
    },
  ],
};

export default function({ history, location }) {
  const dispatch = useDispatch();
  const statisticalList = useSelector(({ eventCount }) => eventCount.statisticalList);
  const { communityInfo, communityList } = useSelector(({ global }) => global);
  const { username } = useSelector((state) => state.auth);
  const { unDisposeCount = 0, disposeCount = 0 } = statisticalList;
  
  useEffect(() => {
    dispatch({ type: 'eventCount/disposeEventCount' });
  }, [dispatch])

  useEffect(() => {
    const { source } = location.query;
    if (source) {
      dispatch({ type: 'eventCount/disposeEventCount' });
    }
  }, [dispatch, location.query]);

  useEffect(() => {
    const { typeCount = {} } = statisticalList;
    const pieOpt = echarts.init(document.getElementById('pieOpt'));
    pieOpt.clear();
    pieOpt.setOption(option);
    pieOpt.setOption({
      series: [
        {
          data: sortBy(
            [
              // { name: '来登去销', value: typeCount.ldqx },
              // { name: '布控人员', value: typeCount.keyPerson },
              { name: '人员聚集', value: typeCount.personGather },
              { name: '未带口罩', value: typeCount.noMask },
              { name: '高空抛物', value: typeCount.highTossAct },
              { name: '人员摔倒', value: typeCount.liedown },
            ],
            (o) => -o.value,
          ),
        },
      ],
    });
  }, [statisticalList]);

  /**
   * 小区切换
   * @params {Event} e
   */
  const onSwitchCommunity = (value) => {
    dispatch({
      type: 'global/switchDataSource',
      payload: {
        id: value,
      },
      callback: (code) => {
        history.push(`${location.pathname}?source=${value}`);
        dispatch({ type: 'global/getCommunityInfo' });
        if (code !== 'SUCCESS') {
          message.error('小区切换失败');
        }
      },
    });
  };

  return (
    <>
      <div className={styles.hLeft}>
        <div className={styles.addrAvatar}>
          <Avatar src="" shape="square" size={92} icon={<UserOutlined />} />
        </div>
        <div className={styles.introduction}>
          <p className={styles.nameRow}>
            <span>{username}</span>
            {/* <span>警官</span> */}
          </p>
          <div style={{ height: 32 }}>
            <Select
              value={communityInfo.id || ''}
              style={{ width: 140 }}
              bordered={false}
              onChange={(value) => onSwitchCommunity(value)}
            >
              {communityList.map((item) => (
                <Select.Option value={item.communityId} key={item.communityId}>
                  {item.communityName}
                </Select.Option >
              ))}
            </Select>
          </div>
          <div className={styles.statusClass}>
            <CheckCircleFilled />
            <span style={{ marginLeft: 10 }}>在线</span>
          </div>
        </div>
      </div>
      <div className={styles.hCenter}>
        <div className={styles.eventItem}>
          <div>
            <img src={pending} alt="" />
            <span>{unDisposeCount}</span>
          </div>
          <p>待处理</p>
        </div>
        <div className={styles.eventItem}>
          <div>
            <img src={processed} alt="" />
            <span>{disposeCount}</span>
          </div>
          <p>已处理</p>
        </div>
        {/* <div className={styles.eventItem}>
          <div>
            <img style={{ width: '100%', height: '100%' }} src={ignored} alt="" />
            <span style={{ color: '#010C26' }}>0</span>
          </div>
          <p>已忽略</p>
        </div>
        <div className={styles.eventItem}>
          <div>
            <img style={{ width: '100%', height: '100%' }} src={hisEvent} alt="" />
            <span style={{ color: '#121BAD' }}>0</span>
          </div>
          <p>历史事件</p>
        </div> */}
      </div>
      <div className={styles.hRight}>
        <div>
          <Progress
            type="circle"
            percent={Math.round((disposeCount * 100) / (disposeCount + unDisposeCount))}
            width={64}
            strokeWidth={10}
            strokeColor="#38AB50"
          />
          <p>完成率</p>
        </div>
        <div style={{ marginTop: '-10px' }}>
          <div id="pieOpt" style={{ width: 168, height: 82 }} />
          <p style={{ marginTop: 4 }}>类型占比</p>
        </div>
      </div>
    </>
  );
}
