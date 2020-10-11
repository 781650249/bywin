import React, { useState, useEffect, useRef, useMemo } from 'react';
import { PageHeader, Anchor, Row, Col, Avatar, Descriptions } from 'antd';
import {
  ArrowLeftOutlined,
  SwapOutlined,
  // EditOutlined,
  UserOutlined,
  ShopOutlined,
} from '@ant-design/icons';
import { Icon } from '@/components';
import { getBaseInfo } from '@/services/file/personnel-file';
import { Link } from 'umi';
import Card from '../components/Card';
import TrackRecord from './TrackRecord';
import InOutRecord from './InOutRecord';
import VisitorRecord from './VisitorRecord';
import EventRecord from './EventRecord';

import styles from './index.less';

export default function({ match, history }) {
  const containerRef = useRef(window);
  const [info, setInfo] = useState({});
  const { id: ygxxbz } = match.params;
  useEffect(() => {
    getBaseInfo({ ygxxbz }).then((data) => {
      setInfo(data);
    });
  }, [ygxxbz]);

  const vehicleInfo = useMemo(() => {
    if (Array.isArray(info.mxclList) && info.mxclList.length > 0) {
      return (
        <span>
          {`${info.mxclList.length} 辆`}（
          {info.mxclList.map((el) => (
            <Link key={el} to={`/vehicle-file/${el}`} className="mr-4">
              {el}
            </Link>
          ))}
          ）
        </span>
      );
    }
    return '无';
  }, [info.mxclList]);

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
        subTitle="人员动态档案"
      />
      <div className={styles.body}>
        <div className={styles.sidebar}>
          <Anchor getContainer={() => containerRef.current}>
            <Anchor.Link
              href="#base"
              title={
                <>
                  <Icon type="base-info" /> 基本信息
                </>
              }
            />
            <Anchor.Link
              href="#company"
              title={
                <>
                  <Icon type="cityFilled" /> 任职企业
                </>
              }
            />
            <Anchor.Link
              href="#track"
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
              href="#visitor"
              title={
                <>
                  <Icon type="visitor" /> 访客记录
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
            title="基本信息"
            // extra={<EditOutlined style={{ fontSize: 16, cursor: 'pointer' }} />}
          >
            <Row gutter={20} style={{ flexWrap: 'nowrap' }}>
              <Col flex="160px">
                <Avatar shape="square" size={160} icon={<UserOutlined />} src={info.xp} />
              </Col>
              <Col flex="auto">
                <Descriptions
                  title={
                    <>
                      {info.xm}
                      <span style={{ marginLeft: 8, fontSize: 12, fontWeight: 'normal' }}>
                        {info.xb}
                      </span>
                    </>
                  }
                  size="small"
                >
                  <Descriptions.Item label="任职岗位">{info.gw}</Descriptions.Item>
                  <Descriptions.Item label="手机号码">{info.sjhm}</Descriptions.Item>
                  <Descriptions.Item label="名下车辆">{vehicleInfo}</Descriptions.Item>
                  <Descriptions.Item label="备注信息" span={3}>
                    {info.bz}
                  </Descriptions.Item>
                </Descriptions>
              </Col>
            </Row>
          </Card>
          <Card id="company" title="任职企业">
            <Row gutter={20}>
              <Col flex="160px">
                <Avatar shape="square" size={120} icon={<ShopOutlined />} src={info.qytb} />
              </Col>
              <Col flex="auto">
                <Descriptions title="半云科技有限公司" size="small">
                  <Descriptions.Item label="企业法人">{info.qyfr}</Descriptions.Item>
                  <Descriptions.Item label="租赁类型">{info.zllx}</Descriptions.Item>
                  <Descriptions.Item label="租赁面积">{info.zlmj}</Descriptions.Item>
                  <Descriptions.Item label="员工数量">{info.ygsl}</Descriptions.Item>
                  <Descriptions.Item label="公司类型">{info.gslx}</Descriptions.Item>
                  <Descriptions.Item label="注册资本">{info.zczb}</Descriptions.Item>
                  <Descriptions.Item label="营业额">{info.yye}</Descriptions.Item>
                  <Descriptions.Item label="地址" span={2}>
                    {info.dz}
                  </Descriptions.Item>
                </Descriptions>
              </Col>
            </Row>
          </Card>

          <TrackRecord ygxxbz={ygxxbz} />
          <InOutRecord ygxxbz={ygxxbz} />
          <VisitorRecord ygxxbz={ygxxbz} />
          <EventRecord ygxxbz={ygxxbz} />
        </div>
      </div>
    </div>
  );
}
