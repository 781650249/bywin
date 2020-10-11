import React, { useState, useEffect } from 'react';
import { Radio, Row, Col, Avatar, Pagination } from 'antd';
import { ClockCircleOutlined, EnvironmentOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import { getEventRecord } from '@/services/file/vehicle-file';
import Card from '../components/Card';
import styles from './index.less';

export default function({ carNumber }) {
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(1);
  const [carEventType, setCarEventType] = useState('1');

  useEffect(() => {
    getEventRecord({ carNumber, carEventType, page: current, pageSize: 6 }).then((data) => {
      setList(data.list);
      setTotal(data.total);
    });
  }, [carNumber, carEventType, current]);

  return (
    <Card id="event" title="事件记录" extra={`${list.length}条`}>
      <div>
        <Radio.Group
          value={carEventType}
          buttonStyle="solid"
          onChange={(e) => setCarEventType(e.target.value)}
        >
          <Radio.Button value="1">车辆布防</Radio.Button>
          <Radio.Button value="2">违停告警</Radio.Button>
        </Radio.Group>
        <div className={classNames(styles.list, 'mt-16')}>
          {list.map((item, index) => (
            <div className={styles.listItem} key={index}>
              <Row gutter={16}>
                <Col flex="100px">
                  <Avatar shape="square" size={100} src={item.storageUrl1} />
                </Col>
                <Col flex="auto">
                  <p>{item.plateNo}</p>
                  <p>
                    <ClockCircleOutlined />
                    {item.triggerTime}
                  </p>
                  <p>
                    <EnvironmentOutlined />
                    {item.nameOfPassRoad}
                  </p>
                </Col>
              </Row>
            </div>
          ))}
          {Array.from({ length: 6 - list.length }).map((_, i) => (
            <div key={i} className={classNames(styles.listItem, styles.fill)} style={{}}>
              <div style={{ height: 100 }} />
            </div>
          ))}
        </div>
        <div className="text-right mt-16">
          {list.length !== 0 && (
            <Pagination
              current={current}
              pageSize={6}
              total={total}
              showSizeChanger={false}
              onChange={setCurrent}
            />
          )}
        </div>
      </div>
    </Card>
  );
}
