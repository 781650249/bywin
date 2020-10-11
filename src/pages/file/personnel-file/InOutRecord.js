import React, { useState, useEffect } from 'react';
import { Form, Select, DatePicker, Button, Row, Col, Avatar, Pagination } from 'antd';
import { ClockCircleOutlined, LoginOutlined, LogoutOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import { useSelector } from 'dva';
import { getInOutRecord } from '@/services/file/personnel-file';
import Card from '../components/Card';
import styles from './index.less';

const { RangePicker } = DatePicker;

export default function({ ygxxbz }) {
  const [list, setList] = useState([]);
  const [searchParams, setSearchParams] = useState({});
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(1);

  const { communityList } = useSelector((state) => state.global);

  useEffect(() => {
    getInOutRecord({
      ...searchParams,
      ygxxbz,
      page: current,
      pageSize: 6,
    }).then((data) => {
      setList(data.rows);
      setTotal(data.total);
    });
  }, [ygxxbz, current, searchParams]);

  const handleSearch = (values) => {
    const { inOutTimes, inOutType } = values;
    const params = {};
    if (Array.isArray(inOutTimes) && inOutTimes.length === 2) {
      const [start, end] = inOutTimes;
      params.beginTime = start.format('YYYY-MM-DD HH:mm');
      params.endTime = end.format('YYYY-MM-DD HH:mm');
    }
    if (inOutType) {
      params.inOutType = inOutType;
    }
    setSearchParams({ ...params });
  };

  return (
    <Card id="inAndOut" title="出入记录" extra={`${list.length}条`}>
      <div className={styles.inAndOutWrapper}>
        <Form layout="inline" className="mb-16" onFinish={handleSearch}>
          <Form.Item name="yqxxbz">
            <Select
              getPopupContainer={(triggerNode) => triggerNode.parentElement}
              placeholder="请选择园区"
              style={{ width: 174 }}
            >
              {communityList.map((item, i) => (
                <Select.Option key={i} value={item.xqxxbz}>
                  {item.communityName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="inOutType">
            <Select
              allowClear
              getPopupContainer={(triggerNode) => triggerNode.parentElement}
              placeholder="请出入类型"
              style={{ width: 174 }}
            >
              <Select.Option value="1">进入</Select.Option>
              <Select.Option value="2">离开</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="inOutTimes">
            <RangePicker
              showTime={{ format: 'HH:mm' }}
              format="YYYY-MM-DD HH:mm"
              style={{ width: 320 }}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
          </Form.Item>
        </Form>
        <div className={classNames(styles.list, 'mt-16')}>
          {list.map((item, index) => (
            <div className={styles.listItem} key={index}>
              <Row gutter={16}>
                <Col flex="100px">
                  <Avatar shape="square" size={100} src={item.faceUrl} />
                </Col>
                <Col flex="auto">
                  <h3 className="ellipsis" title={item.barrierName}>
                    {item.barrierName}
                  </h3>
                  <p>
                    {item.inOutType === '进入' ? (
                      <LoginOutlined />
                    ) : (
                      <LogoutOutlined style={{ transform: 'rotate(180deg)' }} />
                    )}
                    {item.inOutType}
                  </p>
                  <p>
                    <ClockCircleOutlined />
                    {item.inOutDate}
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
