import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Avatar, Empty, Spin, message } from 'antd';
import { SwapOutlined, ThunderboltFilled } from '@ant-design/icons';
import { Viewer } from '@/components';
import styles from './index.less';

function PeerRecord(props) {
  const { peerRecordList, peerRecordLoading, selectedPeerList } = props;

  const [largeImg, setLargeImg] = useState('');
  const [imgId, setImgId] = useState(0);
  const [relativePosition, setRelativePosition] = useState([]);

  useEffect(() => {}, []);

  const viewLargeImg = (record) => {
    setImgId(record.id);
    setLargeImg(record.ytobjectUrl);
    setRelativePosition([{
      startX: record.zsjXzb,
      startY: record.zsjYzb,
      endX: record.yxjXzb,
      endY: record.yxjYzb,
    }, {
      startX: record.zsjXzbTX,
      startY: record.zsjYzbTX,
      endX: record.yxjXzbTX,
      endY: record.yxjYzbTX,
    }]);
  };

  const closeLargeImg = () => {
    setLargeImg('');
    setRelativePosition([]);
  };

  /**
   * 上一张图
   */
  const onPrev = () => {
    let num = 0;
    peerRecordList.forEach((item, index) => {
      if (item.id === imgId) {
        num = index;
      }
    });
    if (peerRecordList[num - 1]) {
      viewLargeImg(peerRecordList[num - 1]);
    } else {
      message.warn('没有图片啦!');
    }
  };

  /**
   * 下一张图
   */
  const onNext = () => {
    let num = 0;
    peerRecordList.forEach((item, index) => {
      if (item.id === imgId) {
        num = index;
      }
    });
    if (peerRecordList[num + 1]) {
      viewLargeImg(peerRecordList[num + 1]);
    } else {
      message.warn('没有图片啦!');
    }
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.title}>
        <h4>同行记录</h4>
        {Object.keys(selectedPeerList).length !== 0 ? (
          <div className={styles.headContent}>
            <div>
              <div><Avatar src={selectedPeerList.target.avatar || ''} size={48}  /></div>
              <SwapOutlined />
              <div><Avatar src={selectedPeerList.source.avatar || ''} size={48} /></div>
            </div>
            <span className={styles.qmdBox}>
              <ThunderboltFilled />
              {selectedPeerList.relation}
            </span>
          </div>
        ) : null}
      </div>
      <Spin spinning={peerRecordLoading !== undefined && peerRecordLoading}>
        <div className={styles.content}>
          {peerRecordList && peerRecordList.length === 0 ? (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          ) : null}
          {peerRecordList.map((item, index) => (
            <div className={styles.contentItem} key={index}>
              <div className={styles.itemPop}>
                <div
                  style={{ width: 80, height: 80 }}
                  onClick={() => {
                    viewLargeImg(item);
                  }}
                >
                  <Avatar src={item.cjtobjectUrl || ''} shape="square" size={80} />
                </div>
                <div className={styles.text}>
                  <p>摄像头ID: {item.sxtId}</p>
                  <p>时间: {item.wzbjSj}</p>
                </div>
              </div>
              <div className={styles.itemPop}>
                <div
                  style={{ width: 80, height: 80 }}
                  onClick={() => {
                    viewLargeImg(item);
                  }}
                >
                  <Avatar src={item.cjtobjectUrlTx || ''} shape="square" size={80} />
                </div>
                <div className={styles.text}>
                  <p>摄像头ID: {item.sxtId}</p>
                  <p>时间: {item.wzbjSj}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Spin>
      <Viewer
        switching
        image={largeImg}
        onClose={closeLargeImg}
        onPrev={onPrev}
        onNext={onNext}
        relativePositions={relativePosition}
      />
    </div>
  );
}

export default connect(({ discover, loading }) => {
  const { peerRecordList, selectedPeerList } = discover;
  return {
    peerRecordList,
    selectedPeerList,
    peerRecordLoading: loading.effects['discover/getTrajectoryByPidtx'],
  };
})(PeerRecord);
