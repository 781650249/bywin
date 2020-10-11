import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'dva';
import { Drawer, DatePicker, Spin, Avatar } from 'antd';
import { LoadingOutlined, PictureOutlined, ClockCircleOutlined } from '@ant-design/icons';
import InfiniteScroll from 'react-infinite-scroller';
import Aliplayer from '@/components/Aliplayer';
// import moment from 'moment';
import styles from './index.less';

const { RangePicker } = DatePicker;

export default function({
  bobmBoxInfo = { visible: false, title: '关闭中...' },
  playCameraId = null,
  closeBobmBox = () => {},
}) {
  const dispatch = useDispatch();
  const { elevatorWarnList, elevatorWarnTotal, elevatorBasicInfo = {} } = useSelector(
    ({ elevator }) => elevator,
  );
  const drawerWidth = useRef(480);
  const scrollRef = useRef(null); // 用于控制滚动条位置
  const [time, setTime] = useState({ startTime: null, endTime: null });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const pageSize = 10;

  const getWarnList = useCallback(
    (params) => {
      setLoading(true);
      dispatch({
        type: 'elevator/getListWarnRecord',
        payload: {
          pageNum: 1,
          pageSize,
          startTime: time.startTime,
          endTime: time.endTime,
          ...params,
        },
        callback: () => {
          setLoading(false);
        },
      });
    },
    [dispatch, time],
  );

  useEffect(() => {
    if (bobmBoxInfo.title === '预警记录') {
      getWarnList();
    } else {
      setPage(1);
      if (scrollRef.current) {
        scrollRef.current.scrollTop = 0;
      }
    }
  }, [dispatch, bobmBoxInfo, getWarnList]);

  const handleInfiniteOnLoad = () => {
    getWarnList({ pageNum: page + 1 });
    setPage(page + 1);
  };

  return (
    <Drawer
      width={drawerWidth.current}
      forceRender
      title={bobmBoxInfo.title}
      headerStyle={{ borderBottom: 0 }}
      bodyStyle={{ overflow: 'hidden' }}
      onClose={closeBobmBox}
      visible={bobmBoxInfo.visible}
    >
      {bobmBoxInfo.title === '预警记录' && (
        <div className={styles.drawerBody}>
          <RangePicker
            style={{ marginBottom: 12, width: '100%' }}
            showTime
            format="YYYY-MM-DD HH:mm:ss"
            onChange={(_, dateString) => {
              setTime({ startTime: dateString[0] || null, endTime: dateString[1] || null });
              setPage(1);
              scrollRef.current.scrollTop = 0;
            }}
          />

          <Spin spinning={loading} indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}>
            <div className={styles.listContainer} ref={scrollRef}>
              <InfiniteScroll
                initialLoad={false}
                pageStart={0}
                loadMore={handleInfiniteOnLoad}
                hasMore={!loading && elevatorWarnTotal > page * pageSize}
                threshold={20}
                useWindow={false}
              >
                {elevatorWarnList.map((item, index) => (
                  <div key={index} className={styles.warnCard}>
                    <div>
                      <Avatar
                        src={item.imageUrl}
                        shape="square"
                        size={100}
                        className={styles.warnCardAvatar}
                        icon={<PictureOutlined />}
                      />
                    </div>
                    <div className={styles.warnCardInfo}>
                      <p>{item.name}</p>
                      <p>
                        <span>停靠:</span>
                        <span>{item.stopFloor}F</span>
                      </p>
                      <p>
                        <span>载重:</span>
                        <span>{item.currentLoad}KG</span>
                      </p>
                      <p>
                        <span>梯门:</span>
                        <span>{item.doorStatusCn}</span>
                      </p>
                      <p>
                        <ClockCircleOutlined />
                        <span>{item.createDateStr}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </InfiniteScroll>
            </div>
          </Spin>
        </div>
      )}
      {bobmBoxInfo.title === '设备信息' && (
        <div className={styles.basicInfo}>
          <p>
            <span>电梯名称:</span>
            <span>{elevatorBasicInfo.name}</span>
          </p>
          <p>
            <span>电梯地址:</span>
            <span>{elevatorBasicInfo.address}</span>
          </p>
          <p>
            <span>电梯型号:</span>
            <span>{elevatorBasicInfo.model}</span>
          </p>
          <p>
            <span>电梯类别:</span>
            <span>未知</span>
          </p>
          <p>
            <span>制造日期:</span>
            <span>{elevatorBasicInfo.manufDateStr}</span>
          </p>
          <p>
            <span>出厂编号:</span>
            <span>未知</span>
          </p>
          <p>
            <span>安装单位:</span>
            <span>{elevatorBasicInfo.installationUnit}</span>
          </p>
          <p>
            <span>维保单位:</span>
            <span>{elevatorBasicInfo.maintenanceUnit}</span>
          </p>
          <p>
            <span>维修人员:</span>
            <span>{elevatorBasicInfo.maintainer}</span>
          </p>
          <p>
            <span>最近维护:</span>
            <span>{elevatorBasicInfo.newestMaintainedDate}</span>
          </p>
        </div>
      )}
      {playCameraId && (
        <div
          className={styles.vedioBox}
          style={{ width: drawerWidth.current - 48, height: (drawerWidth.current - 48) * 0.5625 }}
        >
          <Aliplayer id={playCameraId} cameraId={playCameraId} selectTime={[]} />
        </div>
      )}
    </Drawer>
  );
}
