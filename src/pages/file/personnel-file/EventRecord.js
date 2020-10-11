import React, { useState, useEffect } from 'react';
import { Radio, Row, Col, Avatar, Pagination } from 'antd';
import { ClockCircleOutlined, EnvironmentOutlined, AimOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import { getEventRecord } from '@/services/file/personnel-file';
import Card from '../components/Card';
import styles from './index.less';

export default function({ ygxxbz }) {
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(1);
  const [type, setType] = useState('1');

  useEffect(() => {
    getEventRecord({
      ygxxbz,
      page: current,
      pageSize: 6,
      type,
    }).then((data) => {
      setList(data.rows);
      setTotal(data.total);
    });
  }, [ygxxbz, current, type]);

  return (
    <Card id="event" title="事件记录" extra={`${list.length}条`}>
      <div>
        <Radio.Group value={type} buttonStyle="solid" onChange={setType}>
          <Radio.Button value="1">人员布防</Radio.Button>
        </Radio.Group>
        <div className={classNames(styles.list, 'mt-16')}>
          {list.map((item, index) => (
            <div className={styles.listItem} key={index}>
              <Row gutter={16}>
                <Col flex="100px">
                  <Avatar shape="square" size={100} src={item.cjtUrl} />
                </Col>
                <Col flex="auto">
                  <p>{item.name}</p>
                  <p>
                    <ClockCircleOutlined />
                    {item.times}
                  </p>
                  <p>
                    <EnvironmentOutlined />
                    {item.address}
                  </p>
                  <p>
                    <AimOutlined />
                    {item.area}
                  </p>
                </Col>
              </Row>
            </div>
          ))}
          {Array.from({ length: 6 - list.length }).map((_, i) => (
            <div key={i} className={classNames(styles.listItem, styles.fill)} style={{  }}>
              <div style={{ height: 100 }} />
            </div>
          ))}
        </div>
        <div className="text-right mt-16">
          <Pagination
            current={current}
            pageSize={6}
            total={total}
            showSizeChanger={false}
            onChange={setCurrent}
          />
        </div>
      </div>
    </Card>
  );
}
