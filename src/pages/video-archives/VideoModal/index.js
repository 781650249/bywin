import React from 'react';
import { useDispatch, useSelector } from 'dva';
import { CloseOutlined } from '@ant-design/icons';
import { CSSTransition } from 'react-transition-group';
import { Modal } from '@/components';
import Videos from './Videos';
import Tabs from './Tabs';
import styles from './index.less';

export default function VideoModal() {
  const dispatch = useDispatch();
  const { visible } = useSelector(({ videoModal }) => videoModal);
  // useEffect(() => {
  //   dispatch({
  //     type: 'videoModal/getCameraList',
  //     payload: {
  //       startTime: ':00',
  //       stopTime: ':00',
  //     },
  //   });
  // }, [dispatch]);

  const handleClose = () => {
    dispatch({
      type: 'videoModal/setState',
      payload: {
        visible: false,
      },
    });
  };

  return (
    <Modal>
      <CSSTransition unmountOnExit in={visible} timeout={300} classNames="modal">
        <div className={styles.wrap}>
          <div className={styles.container}>
            <CloseOutlined className={styles.close} onClick={handleClose} />
            <Videos />
            <Tabs />
          </div>
        </div>
      </CSSTransition>
    </Modal>
  );
}
