import React, { useState, useEffect, useRef, useMemo } from 'react';
import { PageHeader, Anchor, Row, Col, Avatar, Descriptions } from 'antd';
import {
  ArrowLeftOutlined,
  SwapOutlined,
  // EditOutlined,
  UserOutlined,
  CarOutlined,
} from '@ant-design/icons';
import { Icon } from '@/components';
import { getBaseInfo } from '@/services/file/vehicle-file';
import Card from '../components/Card';
import TrackRecord from './TrackRecord';
import InOutRecord from './InOutRecord';
import EventRecord from './EventRecord';
import styles from './index.less';

export default function({ match, history }) {
  const [info, setInfo] = useState({});
  const containerRef = useRef(window);
  const { id: carNumber } = match.params;

  useEffect(() => {
    getBaseInfo({ carNumber, xqxxbz: 1 }).then((data) => {
      setInfo(data);
    });
  }, [carNumber]);

  const vehicleInfo = useMemo(() => {
    if (Array.isArray(info.carList) && info.carList.length > 0) {
      return `${info.carList.length} 辆 ( ${info.carList.join(', ')} )`;
    }
    return '无';
  }, [info.carList]);

  return (
    <div className={styles.wrapper}>
      <PageHeader
        className={styles.pageHeader}
        backIcon={
          <>
            <ArrowLeftOutlined />
            <span style={{ marginLeft: 4, fontSize: 14 }}>返回</span>
          </>
        }
        onBack={() => {
          history.goBack();
        }}
        subTitle="车辆动态档案"
      />
      <div className={styles.body}>
        <div className={styles.sidebar}>
          <Anchor getContainer={() => containerRef.current}>
            <Anchor.Link
              href="#base"
              title={
                <>
                  <Icon type="car" /> 车辆信息
                </>
              }
            />
            <Anchor.Link
              href="#owner"
              title={
                <>
                  <Icon type="user" /> 车主信息
                </>
              }
            />
            <Anchor.Link
              href="#trail"
              title={
                <>
                  <Icon type="track" /> 轨迹记录
                </>
              }
            />
            <Anchor.Link
              href="#inAndOut"
              title={
                <>
                  <SwapOutlined /> 出入记录
                </>
              }
            />
            <Anchor.Link
              href="#event"
              title={
                <>
                  <Icon type="event" /> 事件记录
                </>
              }
            />
          </Anchor>
        </div>
        <div className={styles.main} ref={containerRef}>
          <Card
            id="base"
            title="车辆信息"
            // extra={<EditOutlined style={{ fontSize: 16, cursor: 'pointer' }} />}
          >
            <Row gutter={20} style={{ flexWrap: 'nowrap' }}>
              <Col flex="160px">
                <Avatar shape="square" size={160} icon={<CarOutlined />} src={info.carImageUrl} />
              </Col>
              <Col flex="auto">
                <Descriptions title={carNumber} size="small">
                  <Descriptions.Item label="备注信息" span={3}>
                    {info.carRemark}
                  </Descriptions.Item>
                </Descriptions>
              </Col>
            </Row>
          </Card>
          <Card id="owner" title="车主信息" extra="100条">
            <Row gutter={20} style={{ flexWrap: 'nowrap' }}>
              <Col flex="160px">
                <Avatar
                  shape="square"
                  size={160}
                  icon={<UserOutlined />}
                  src={info.ownerImageUrl}
                />
              </Col>
              <Col flex="auto">
                <Descriptions
                  title={
                    <>
                      {info.ownerName}
                      <span style={{ marginLeft: 8, fontSize: 12, fontWeight: 'normal' }}>
                        {info.ownerSex}
                      </span>
                    </>
                  }
                  size="small"
                >
                  <Descriptions.Item label="任职岗位">{info.ownerPosition}</Descriptions.Item>
                  <Descriptions.Item label="手机号码">{info.ownerPhone}</Descriptions.Item>
                  <Descriptions.Item label="名下车辆">{vehicleInfo}</Descriptions.Item>
                  <Descriptions.Item label="备注信息" span={3}>
                    {info.ownerRemark}
                  </Descriptions.Item>
                </Descriptions>
              </Col>
            </Row>
          </Card>
          <TrackRecord carNumber={carNumber} />
          <InOutRecord carNumber={carNumber} />
          <EventRecord carNumber={carNumber} />
        </div>
      </div>
    </div>
  );
}
