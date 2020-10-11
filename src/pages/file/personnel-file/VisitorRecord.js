import React, { useState, useEffect } from 'react';
import { Form, Input, DatePicker, Button, Row, Col, Avatar, Pagination } from 'antd';
import { SearchOutlined, ClockCircleOutlined, MobileOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import { getVisitorRecord } from '@/services/file/personnel-file';
import Card from '../components/Card';
import styles from './index.less';

const { RangePicker } = DatePicker;

export default function({ ygxxbz }) {
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(1);
  const [searchParams, setSearchParams] = useState({});

  useEffect(() => {
    getVisitorRecord({ ...searchParams, ygxxbz, page: current, pageSize: 6 }).then((data) => {
      setList(data.rows);
      setTotal(data.total);
    });
  }, [ygxxbz, current, searchParams]);

  const handleSearch = (values) => {
    const { times, key } = values;
    const params = {};
    if (Array.isArray(times) && times.length === 2) {
      const [start, end] = times;
      params.beginTime = start.format('YYYY-MM-DD HH:mm');
      params.endTime = end.format('YYYY-MM-DD HH:mm');
    }
    if (key) {
      params.key = key;
    }
    setSearchParams({ ...params });
  };

  return (
    <Card id="visitor" title="访客记录" extra={`${list.length}条`}>
      <div className={styles.visitorWrapper}>
        <Form layout="inline" className="mb-16" onFinish={handleSearch}>
          <Form.Item name="times">
            <RangePicker
              showTime={{ format: 'HH:mm' }}
              format="YYYY-MM-DD HH:mm"
              style={{ width: 320 }}
            />
          </Form.Item>
          <Form.Item name="key">
            <Input placeholder="请输入搜索内容" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
              查询
            </Button>
          </Form.Item>
        </Form>
        <div className={classNames(styles.list, 'mt-16')}>
          {list.map((item, index) => (
            <div className={styles.listItem} key={index}>
              <Row gutter={16}>
                <Col flex="100px">
                  <Avatar shape="square" size={100} src={item.faceImageUrl} />
                </Col>
                <Col flex="auto">
                  <p>{item.visitorName}</p>
                  <p>
                    <MobileOutlined />
                    {item.visitorTelephone}
                  </p>
                  <p>
                    <ClockCircleOutlined />
                    {item.newestVisitDateFormat}
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
