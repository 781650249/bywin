import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'dva';
import { Spin } from 'antd';
import cx from 'classnames';
import HeaderBar from './HeaderBar';
import VideoModal from './VideoModal';
import PopCarList from './PopCarList';
import styles from './index.less';

function VideoArchives({ history, location }) {
  const dispatch = useDispatch();
  const { queryParams } = useSelector(({ videoArchives }) => videoArchives);
  const { popOrCar } = queryParams;
  const loading = useSelector(
    (state) =>
      state.loading.effects['videoArchives/getPersonPassedBy'] || state.loading.effects['videoArchives/getVehiclePassedBy'] || false,
  );

  const [collapse, setCollapse] = useState(false);

  const { listen } = history;
  useEffect(() => {
    const unlisten = listen(({ pathname }) => {
      if (!/^\/video-archives/.test(pathname)) {
        dispatch({ type: 'videoArchives/clear' });
        dispatch({ type: 'videoModal/clear' });
      }
    });
    return () => {
      unlisten();
    };
  }, [dispatch, listen]);
  return (
    <div className={styles.wrap}>
      <div
        className={cx(styles.info, {
          [styles.collapse]: collapse,
        })}
      >
        <HeaderBar history={history} location={location} />
        <VideoModal />
      </div>
      <div
        className={cx(styles.trigger, {
          'f-arrow-collapse': collapse,
          'f-arrow-primary': collapse,
          [styles.collapse]: collapse,
          'f-arrow-expand': !collapse,
        })}
        style={{ fontSize: 40 }}
        onClick={() => setCollapse(!collapse)}
      />
      <Spin spinning={loading && (popOrCar === 'pop' || popOrCar === 'car')}>
        <div className={cx(styles.container, {
          [styles.full]: collapse
        })}>
          <PopCarList />
        </div>
      </Spin>
    </div>
  );
}

export default VideoArchives;
