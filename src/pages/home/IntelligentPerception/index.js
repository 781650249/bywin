import React, { useState } from 'react';
import { Row, Col } from 'antd';
import { useSelector } from 'dva';
import cx from 'classnames';
import Aliplayer from '@/components/Aliplayer';
import styles from './index.less';

export default React.memo(function IntelligentPerception({
  cameraList = Array.from({ length: 3 }),
  person = [],
  vehicle = [],
}) {
  const communityInfo = useSelector(({ global }) => global.communityInfo);
  const [videoKey, setVideoKey] = useState(1);
  return (
    <div className={styles.container}>
      <div>
        <div className="title-1">智能感知</div>
      </div>
      <div className={styles.map}>
        <div className={styles.address}>
          <div className="ellipsis">{communityInfo.address}</div>
          <div className="ellipsis">{communityInfo.name}</div>
        </div>
      </div>
      <div className={styles.videoWrap}>
        {cameraList.map((el, i) =>(
              <div
                className={cx(styles.video, styles[videoKey === i + 1 ? 'leftVideo' : 'rightVideo'])}
                onClick={() => setVideoKey(i + 1)}
                key={i + 1}
              >
                <Aliplayer id={el} cameraId={el} selectTime={[]}/>
              </div>
            ))}
      </div>

      <Row className={styles.record}>
        <Col flex="15%">
          <div className={styles.recordHeader}>
            <div className={styles.recordHalf}>
              <div className={styles.recordCirBorder}> 
                <div className={styles.recordCircular}>
                  <div className={styles.recordPerson} />
                </div>
              </div>
              <div className={styles.recordFont}>人</div>
            </div>
            <div className={styles.recordHalf}>
            <div className={styles.recordCirBorder}> 
              <div className={styles.recordCircular}>
                <div className={styles.recordCar} />
              </div>
            </div>
            <div className={styles.recordFont}>车</div>
          </div>
          </div>
        </Col>
        <Col flex="auto">
          <div className={styles.recordContent}>
            <div className={styles.recordItems}>
              {person.slice(0, 5).map((item, i) => (
                <div className={styles.recordItem} key={i}>
                  <img src={item.cjtobjectUrl} alt={i} />
                </div>
              ))}
              {/* {Array.from({ length: 5 }).map((_, i) => (
                <div className={styles.recordItem} key={i}>
                  <img
                    src="https://pic4.zhimg.com/e1e290d7c265a84881ca46f55e87d21c_xl.jpg"
                    alt={i}
                  />
                </div>
              ))} */}
            </div>
            <div className={styles.recordItems}>
              {vehicle.slice(0, 5).map((item, i) => (
                <div className={styles.recordItem} key={i}>
                  <img src={item.cjtobjectUrl} alt={i} />
                </div>
              ))}
              {/* {Array.from({ length: 5 }).map((_, i) => (
                <div className={styles.recordItem} key={i}>
                  <img
                    src="https://pic4.zhimg.com/e1e290d7c265a84881ca46f55e87d21c_xl.jpg"
                    alt={i}
                  />
                </div>
              ))} */}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
});
