import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'dva';
import { Avatar, Select, message } from 'antd';
import { PictureOutlined } from '@ant-design/icons';
import WeekChart from './WeekChart';
import styles from './index.less';

const { Option } = Select;

export default function({ history, location }) {
  const dispatch = useDispatch();
  const { queryParams, popCarCount, selectedCommunity } = useSelector(
    ({ videoArchives }) => videoArchives,
  );
  const { cameraList } = useSelector(({ videoModal }) => videoModal);
  const { communityInfo, communityList } = useSelector(({ global }) => global);
  const { popOrCar } = queryParams;
  const [countType, setCountType] = useState(['今日人流量', '常住人员', '流动人员', '重点人员']);

  useEffect(() => {
    if (communityInfo.id) {
      dispatch({
        type: 'videoArchives/setState',
        payload: {
          selectedCommunity: communityInfo.id,
        },
      });
      dispatch({
        type: 'videoModal/getCameraList',
        payload: {
          startTime: ':00',
          stopTime: ':00',
        },
      });
    }
  }, [dispatch, communityInfo]);

  useEffect(() => {
    if (!selectedCommunity) return;

    if (popOrCar === 'pop') {
      dispatch({ type: 'videoArchives/getPersonCount' });
      dispatch({ type: 'videoArchives/getPeopleWeek' });
      setCountType(['今日人流量', '常住人员', '流动人员', '重点人员']);
    } else if (popOrCar === 'car') {
      dispatch({ type: 'videoArchives/getCarCount' });
      dispatch({ type: 'videoArchives/getCarWeek' });
      setCountType(['今日车流量', '常住车辆', '流动车辆', '重点车辆']);
    }
  }, [dispatch, popOrCar, selectedCommunity]);

  useEffect(() => {
    const { source } = location.query;
    if (source) {
      dispatch({
        type: 'videoArchives/setState',
        payload: {
          selectedCommunity: source,
        },
      });
    }
  }, [dispatch, location.query]);

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
          <Avatar
            src={communityInfo.image || ''}
            shape="square"
            size={92}
            icon={<PictureOutlined />}
          />
        </div>
        <div className={styles.introduction}>
          <div>
            <Select
              value={selectedCommunity}
              style={{ width: 140 }}
              bordered={false}
              onChange={(value) => onSwitchCommunity(value)}
            >
              {communityList.map((item) => (
                <Option value={item.communityId} key={item.communityId}>
                  {item.communityName}
                </Option>
              ))}
            </Select>
          </div>
          <p>{`${cameraList && cameraList.length} 个`}</p>
          <p>摄像头点位</p>
          <p
            onClick={() =>
              dispatch({
                type: 'videoModal/setState',
                payload: {
                  visible: true,
                },
              })
            }
            className={styles.viewBox}
          >
            查看
          </p>
        </div>
      </div>
      <div className={styles.statistics}>
        <div className={styles.sides}>
          <p>{countType[0]}</p>
          <span>{popCarCount.todayFlowrate || 0}</span>
          {/* <div className={styles.accout}>
            <div
              style={{
                width: popCarCount.todayVisitor
                  ? `${Math.floor((100 * popCarCount.todayVisitor) / popCarCount.todayFlowrate)}%`
                  : 0,
                background: '#38AB50',
              }}
              className={styles.possess}
            />
          </div> */}
        </div>
        {/* <div className={styles.mid}> */}
          <div className={styles.sides}>
            <p>{countType[1]}</p>
            <span>{popCarCount.todayPermanent || 0}</span>
          </div>
          <div className={styles.sides}>
            <p>{countType[2]}</p>
            <span>{popCarCount.todayVisitor || 0}</span>
          </div>
          {/* <div className={styles.accout}>
            <div
              style={{
                width: popCarCount.todayPermanent
                  ? `${Math.floor((100 * popCarCount.todayPermanent) / (popCarCount.todayFlowrate + popCarCount.todayPermanent))}%`
                  : 0,
                background: '#4751f1',
              }}
              className={styles.possess}
            />
          </div> */}
        {/* </div> */}
        <div className={styles.sides}>
          <p>{countType[3]}</p>
          <span>{popCarCount.todayKey || 0}</span>
          {/* <div className={styles.accout}>
            <div
              style={{
                width: popCarCount.todayKey
                  ? `${Math.floor((100 * popCarCount.todayKey) / popCarCount.historyKey)}%`
                  : 0,
                background: '#C31737',
              }}
              className={styles.possess}
            />
          </div> */}
        </div>
      </div>
      <div className={styles.hRight}>
        <WeekChart />
      </div>
    </>
  );
}
