import React from 'react';
import { Input, Select, Tabs, Button, Row, Col, Form, Tag, Radio, DatePicker } from 'antd';
import { HomeFilled } from '@ant-design/icons';
import classNames from 'classnames';
import moment from 'moment';
import { Icon } from '@/components';
import TrendLineChart from './TrendLineChart';
import styles from './index.less';

const { RangePicker } = DatePicker;

const { TabPane } = Tabs;

export default function() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.sidebar}>
        <div className={styles.screen}>
          <Input.Group style={{ marginBottom: 16 }}>
            <div className={styles.label}>
              <Icon type="park" />
              园区
            </div>
            <Select style={{ width: 'calc(100% - 88px)' }} size="large">
              <Select.Option value="1">1</Select.Option>
            </Select>
          </Input.Group>
          <Input.Group style={{ marginBottom: 16 }}>
            <div className={styles.label}>
              <Icon type="city" />
              楼栋
            </div>
            <Select style={{ width: 'calc(100% - 88px)' }} size="large">
              <Select.Option value="1">1</Select.Option>
            </Select>
          </Input.Group>
        </div>
        <div className={styles.tabs}>
          <Tabs>
            {Array.from({ length: 7 }).map((_, key) => (
              <TabPane tab={`${key + 1} 单元`} key={key}>
                <div className={classNames(styles.all)}>
                  <Button type="primary" block>
                    所有楼层
                  </Button>
                </div>
                {Array.from({ length: 10 }).map((item, i) => (
                  <div className={styles.floor} key={i}>
                    <div className={styles.floorNumber}>
                      {i + 1}F <HomeFilled className="ml-4" />
                    </div>
                    <div className={styles.room}>
                      <div className={styles.roomNumber}>{i + 1}01</div>
                      <div className={styles.roomNumber}>{i + 1}02</div>
                      <div className={styles.roomNumber}>{i + 1}03</div>
                      <div className={styles.roomNumber}>{i + 1}04</div>
                      <div className={styles.roomNumber}>{i + 1}05</div>
                      <div className={styles.roomNumber}>{i + 1}06</div>
                    </div>
                  </div>
                ))}
              </TabPane>
            ))}
          </Tabs>
        </div>
      </div>
      <main className={styles.main}>
        <h3 className="f-title mb-16">基本信息</h3>
        <Row className="mb-24">
          <Col flex="240px">
            <div className={styles.amount}>
              <div className={classNames(styles.amountIcon, styles.electric)} />
              <div className={styles.amountContent}>
                <div className={styles.amountItem}>
                  <strong className={styles.number1}>54321</strong>
                  kw/h
                </div>
                <div className={styles.amountItem}>本月用电量</div>
              </div>
            </div>
            <div className={styles.tags}>
              <div className={classNames(styles.tag, 'mr-8')}>
                上月
                <Tag color="success">5.5%</Tag>
              </div>
              <div className={styles.tag}>
                环比
                <Tag color="error">11.11%</Tag>
              </div>
            </div>
          </Col>
          <Col flex="240px">
            <div className={styles.amount}>
              <div className={classNames(styles.amountIcon, styles.water)} />
              <div className={styles.amountContent}>
                <div className={styles.amountItem}>
                  <strong className={styles.number1}>54321</strong>
                  kw/h
                </div>
                <div className={styles.amountItem}>本月用电量</div>
              </div>
            </div>
            <div className={styles.tags}>
              <div className={classNames(styles.tag, 'mr-8')}>
                上月
                <Tag color="success">5.5%</Tag>
              </div>
              <div className={styles.tag}>
                环比
                <Tag color="error">11.11%</Tag>
              </div>
            </div>
          </Col>
          <Col flex="240px">
            <div className={styles.amount}>
              <div className={classNames(styles.amountIcon, styles.gas)} />
              <div className={styles.amountContent}>
                <div className={styles.amountItem}>
                  <strong className={styles.number1}>54321</strong>
                  kw/h
                </div>
                <div className={styles.amountItem}>本月用电量</div>
              </div>
            </div>
            <div className={styles.tags}>
              <div className={classNames(styles.tag, 'mr-8')}>
                上月
                <Tag color="success">5.5%</Tag>
              </div>
              <div className={styles.tag}>
                环比
                <Tag color="error">11.11%</Tag>
              </div>
            </div>
          </Col>
        </Row>
        <h3 className="f-title mb-8">用电趋势</h3>
        <div className={styles.trend}>
          <Form layout="inline">
            <Form.Item>
              <Radio.Group buttonStyle="solid" defaultValue="month">
                <Radio.Button value="date">日</Radio.Button>
                <Radio.Button value="month">月</Radio.Button>
                <Radio.Button value="year">年</Radio.Button>
              </Radio.Group>
            </Form.Item>
            <Form.Item>
              <RangePicker
                picker="month"
                disabledDate={(current) => current && current >= moment().endOf('day')}
                style={{ width: 224 }}
              />
            </Form.Item>
            <Form.Item>
              <Select allowClear placeholder="选择楼栋" style={{ width: 136 }}>
                <Select.Option value="1">1</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Select allowClear placeholder="选择设备" style={{ width: 136 }}>
                <Select.Option value="1">1</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                确定
              </Button>
            </Form.Item>
          </Form>
          <div className={styles.trendChart}>
            <TrendLineChart />
          </div>
          <div className={styles.trendStatistic}>
            <div className={styles.trendStatisticItem}>
              <div className={styles.trendStatisticTitle}>平均用电量（kwh/天）</div>
              <div className={styles.trendStatisticContent}>
                <div>
                  <strong className={styles.number2}>54321</strong>
                </div>
                <div className={styles.tags}>
                  <div className={styles.tag}>
                    昨日
                    <Tag color="success">5.5%</Tag>
                  </div>
                  <div className={styles.tag}>
                    环比
                    <Tag color="error">11.11%</Tag>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.trendStatisticItem}>
              <div className={styles.trendStatisticTitle}>总用电量（kwh）</div>
              <div className={styles.trendStatisticContent}>
                <div>
                  <strong className={styles.number2}>54321</strong>
                </div>
                <div className={styles.tags}>
                  <div className={styles.tag}>
                    昨日
                    <Tag color="success">5.5%</Tag>
                  </div>
                  <div className={styles.tag}>
                    环比
                    <Tag color="error">11.11%</Tag>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
