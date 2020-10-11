import React, { useState } from 'react';
import { Tag, Form, Radio, DatePicker, Select, Button, Row, Col } from 'antd';
import classNames from 'classnames';
import RankingBarChart from './RankingBarChart';
import ProportionPieChart from './ProportionPieChart';
import TrendLineChart from './TrendLineChart';
import StatisticLineChart from './StatisticLineChart';
import styles from './index.less';

const { RangePicker } = DatePicker;

export default function() {
  const [currentKey, setCurrentKey] = useState('electric');

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.sort}>
          <div
            className={classNames(styles.sortItem, {
              [styles.active]: currentKey === 'electric',
            })}
            onClick={() => setCurrentKey('electric')}
          >
            用电监控
          </div>
          <div
            className={classNames(styles.sortItem, { [styles.active]: currentKey === 'water' })}
            onClick={() => setCurrentKey('water')}
          >
            用水监控
          </div>
          <div
            className={classNames(styles.sortItem, { [styles.active]: currentKey === 'gas' })}
            onClick={() => setCurrentKey('gas')}
          >
            用气监控
          </div>
        </div>
      </div>
      <div className={classNames(styles.main, styles[currentKey])}>
        <div className={styles.left}>
          <h3 className="f-title mb-16">本月用电情况</h3>
          <div className={styles.amount}>
            <div className={classNames(styles.amountIcon)} />
            <div className={styles.amountContent}>
              <div className={styles.amountItem}>
                <strong className={styles.number1}>54321</strong>
                kw/h
                <div className={styles.tag}>
                  上月
                  <Tag color="success">5.5%</Tag>
                </div>
              </div>
              <div className={styles.amountItem}>
                本月用电量
                <div className={styles.tag}>
                  环比
                  <Tag color="error">11.11%</Tag>
                </div>
              </div>
            </div>
          </div>
          <h3 className="f-title mb-8">用电排行</h3>
          <div className={styles.ranking}>
            <RankingBarChart />
          </div>
          <h3 className="f-title mb-8">用电占比</h3>
          <div className={styles.proportion}>
            <ProportionPieChart />
          </div>
        </div>
        <div className={styles.center}>
          <h3 className="f-title mb-16">基本信息</h3>
          <div className={styles.baseInfo}>
            <div className={styles.baseInfoItem}>
              <div className={styles.baseInfoItemTitle}>监测楼栋</div>
              <strong className={styles.number2}>54321</strong>栋
            </div>
            <div className={styles.baseInfoItem}>
              <div className={styles.baseInfoItemTitle}>监测设备</div>
              <strong className={styles.number2}>54321</strong>台
            </div>
            <div className={styles.baseInfoItem}>
              <div className={styles.baseInfoItemTitle}>监测时间</div>
              <strong className={styles.number2}>54321</strong>天（1年8个月）
            </div>
          </div>
          <h3 className="f-title mb-8">用电趋势</h3>
          <div className={styles.trend}>
            <Form layout="inline">
              <Form.Item>
                <Radio.Group buttonStyle="solid">
                  <Radio.Button value="日">日</Radio.Button>
                  <Radio.Button value="月">月</Radio.Button>
                  <Radio.Button value="年">年</Radio.Button>
                </Radio.Group>
              </Form.Item>
              <Form.Item>
                <RangePicker style={{ width: 224 }} />
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
                    <strong className={classNames(styles.number2, 'mr-8')}>54321</strong>
                  </div>
                  <div>
                    <div className={classNames(styles.tag, 'mb-8')}>
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
                    <strong className={classNames(styles.number2, 'mr-8')}>54321</strong>
                  </div>
                  <div>
                    <div className={classNames(styles.tag, 'mb-8')}>
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
        </div>
        <div className={styles.right}>
          <h3 className="f-title mb-16">节能目标</h3>
          <Row className={styles.target}>
            <Col flex="108px">
              <div className={styles.targetIcon} />
            </Col>
            <Col flex="auto" style={{ paddingTop: 16 }}>
              <strong className={styles.number1}>2000</strong>
              <p>2000 kw/h</p>
              <p>年度节能目标</p>
            </Col>
          </Row>
          <h3 className="f-title mb-16">完成情况</h3>
          <div className={styles.completion}>
            <div className={styles.completionItem}>
              <div className={styles.completionIcon} />
              <div className={styles.completionContent}>
                <div>
                  <strong className={styles.number1}>2000</strong>kw
                </div>
                <p>节能</p>
              </div>
            </div>
            <div className={styles.completionItem}>
              <div className={styles.completionIcon} />
              <div className={styles.completionContent}>
                <div>
                  <strong className={styles.number1}>2000</strong>%
                </div>
                <p>节能达标</p>
              </div>
            </div>
          </div>
          <h3 className="f-title mb-16">节能统计</h3>
          <div className={styles.statistic}>
            <StatisticLineChart />
          </div>
        </div>
      </div>
    </div>
  );
}
