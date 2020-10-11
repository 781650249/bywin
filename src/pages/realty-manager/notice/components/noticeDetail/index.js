import React, { useState } from 'react';
import { useSelector, useDispatch } from 'dva';
import cx from 'classnames';
import { Avatar, Drawer, Row, Col } from 'antd';
import styles from './index.less';

export default function({ item }) {
  const [showDetailDrawer, setShowDetailDrawer] = useState(false);
  const dispatch = useDispatch();
  const { detailList } = useSelector(({ notice }) => notice);
  const handleDetail = ({ id }) => {
    dispatch({
      type: 'notice/getAnnouncementDetail',
      payload: {
        id,
      },
    });
    setShowDetailDrawer(true);
  };

  const subStrMethod = (val) => {
    if (val) return val.substring(0, 6);
    return val;
  };

  return (
    <div>
      <div
        style={{ display: 'flex', minWidth: '113px', color: '#66EAF8', cursor: 'pointer' }}
        onClick={() => handleDetail(item)}
      >
        详情
      </div>

      <Drawer
        closable
        className={styles.drawWrap}
        title="公告详情"
        bodyStyle={{ padding: 20 }}
        placement="right"
        onClose={() => setShowDetailDrawer(false)}
        visible={showDetailDrawer}
      >
        <div className={styles.wrap}>
          <div className={cx(styles.title)}>{subStrMethod(detailList.typeName)}</div>
          <div className={styles.timeArea}>
            <div>{subStrMethod(detailList.communityName)}</div>
            <div>{detailList.createDateFormat}</div>
          </div>

          <div
            className={styles.con}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: detailList.content,
            }}
          />
          <div className={styles.pic}>
            {detailList.imageUrlList &&
              detailList.imageUrlList.map((it, index) => (
                <Avatar
                  key={index}
                  style={{
                    width: '100%',
                    height: '264px',
                    marginTop: '20px',
                    marginBottom: '10px',
                  }}
                  shape="square"
                  src={it}
                />
              ))}
          </div>

          {/* <div className={styles.row}>
            <div className={styles.rowLabel}>公告对象:</div>
            <div className={styles.rowTitle}>11111</div>
          </div> */}

          <Row justify="start" style={{ marginTop: '20px' }}>
            {detailList.notifyRange !== 1 && 
              <>
                <Col span={24}>公告对象:</Col>
                {Array.isArray(detailList.targetNameList) &&
                  detailList.targetNameList.length > 0 &&
                  detailList.targetNameList.map((it) => (
                    <Col span={4}>
                      <div>{it}</div>
                    </Col>
                  ))}
              </>
            }
            {detailList.notifyRange === 1 && (
              <>
                <Col span={4}>公告对象:</Col>
                <Col span={4}> {detailList.notifyRangeCn}</Col>
              </>
            )}
          </Row>
        </div>
      </Drawer>
    </div>
  );
}
