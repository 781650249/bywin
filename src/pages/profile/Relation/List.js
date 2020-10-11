import React, { useState } from 'react';
import { Row, Col, Pagination, message } from 'antd';
import { useDispatch, useSelector, shallowEqual } from 'dva';
import { SwapOutlined } from '@ant-design/icons';
import { Viewer } from '@/components';
import cx from 'classnames';
import styles from './index.less';

export default function() {
  const dispatch = useDispatch();
  const { selectedPeer = {}, peerRecordList = [], current = 1, pageSize = 3 } = useSelector(
    ({ profile }) => profile,
    shallowEqual,
  );
  const { source = {}, target = {} } = selectedPeer;
  const [largeImg, setLargeImg] = useState('');
  const [imgId, setImgId] = useState(0);
  const [relativePosition, setRelativePosition] = useState([]);
  const onChange = (pageNum) => {
    dispatch({
      type: 'profile/setState',
      payload: {
        current: pageNum,
      },
    });
  };


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
    <>
      <div className={styles.recordTitle}>同行记录</div>
      <div
        className={styles.recordList}
        style={{ display: peerRecordList.length > 0 ? 'block' : 'none' }}
      >
        <Row className="mb-24" justify="center" align="middle">
          <Col span={9} className="text-center">
            <div className={cx(styles.imgWrapper, styles.circle)}>
              <img src={source.avatar} alt="" />
            </div>
          </Col>
          <Col span={6} className="text-center">
            <SwapOutlined />
          </Col>
          <Col span={9} className="text-center">
            <div className={cx(styles.imgWrapper, styles.circle)}>
              <img src={target.avatar} alt="" />
            </div>
          </Col>
        </Row>
        {peerRecordList.slice((current - 1) * pageSize, current * pageSize).map((item, i) => (
          <div className={styles.block} key={i}>
            <div className={styles.row}>
              <div className={styles.imgWrapper} onClick={() => viewLargeImg(item)}>
                <img src={item.cjtobjectUrl} alt="" />
              </div>
              <div className={styles.textWrapper}>
                <p className="ellipsis">{item.address || '未知'}</p>
                <p className="ellipsis">{item.wzbjSj || '时间未知'}</p>
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.imgWrapper} onClick={() => viewLargeImg(item)}>
                <img src={item.cjtobjectUrlTx} alt="" />
              </div>
              <div className={styles.textWrapper}>
                <p className="ellipsis">{item.address || '未知'}</p>
                <p className="ellipsis">{item.wzbjSj || '时间未知'}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div
        className={styles.recordPagination}
        style={{ display: peerRecordList.length > 0 ? 'block' : 'none' }}
      >
        <Pagination
          total={peerRecordList.length}
          current={current}
          pageSize={pageSize}
          onChange={onChange}
          showSizeChanger={false}
        />
      </div>
      <Viewer
        switching
        image={largeImg}
        onClose={closeLargeImg}
        onPrev={onPrev}
        onNext={onNext}
        relativePositions={relativePosition}
      />
    </>
  );
}
