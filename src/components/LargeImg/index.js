import React from 'react';
import { Modal } from 'antd';
import {
  LeftOutlined,
  RightOutlined
} from '@ant-design/icons';
import styles from './index.less'


export default function(props) {
  const { visible = false, checkImg = '', closeLargeImg = () => {}, zbObject = {}, onLinePrev, onLineNext } = props

  /**
   * 关闭model
   */
  const onCancel = () => {
    closeLargeImg();
  };

  /**
   * 向左切换
   */
  const linePrev = () => {
    onLinePrev()
  }

  /**
   * 向右切换
   */
  const lineNext = () => {
    onLineNext()
  }

  const { yxjxzb = 0, zsjxzb = 0, yxjyzb = 0, zsjyzb = 0 } = zbObject;
  const Multiple = 2;
  const width = parseInt((yxjxzb - zsjxzb) / Multiple, 10);
  const height = parseInt((yxjyzb - zsjyzb) / Multiple, 10);
  const left = parseInt(zsjxzb / Multiple, 10);
  const top = parseInt(zsjyzb / Multiple, 10);
  return (
    <>
      <Modal
          visible={visible}
          footer={false}
          onCancel={onCancel}
          title="图片查看"
          bodyStyle={{ textAlign: 'center' }}
          width={1008}
        >
          <div style={{ position: 'relative', width: '100%', height: 580 }}>
            <img src={checkImg} alt="" style={{ width: '100%' }} />
            {yxjyzb ? (
              <div
                style={{ width, height, left, top, border: '2px solid red', position: 'absolute' }}
              />
            ) : null}
          </div>
          <div className={styles.prev} style={{ display: onLinePrev ? 'block' : 'none' }} onClick={linePrev}>
          <LeftOutlined />
        </div>
        <div className={styles.next} style={{ display: onLineNext ? 'block' : 'none' }} onClick={lineNext}>
          <RightOutlined />
        </div>
        </Modal>
    </>
  );
}
