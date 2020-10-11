import React from 'react';
import { Row, Col } from 'antd';
import styles from './index.less';

export default React.memo(function HouseInfo({ houseInfo = [] }) {
  return (
    <div className={styles.container}>
      <div>
        <div className="title-1">房屋信息</div>
      </div>
      <Row gutter={[8, 8]} className={styles.items}>
        {houseInfo.slice(0, 6).map((item, i) => (
          <Col span={8} key={i}>
            <div className={styles.card}>
              <div className={styles.cardText}>{item.name}</div>
              <div className={styles.cardNumber}>{item.count}</div>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
});
