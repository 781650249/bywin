import React, { useEffect } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'dva';
import { Row, Col, Avatar, Tabs, Descriptions } from 'antd';
import { CloseOutlined, UserOutlined } from '@ant-design/icons';
import styles from './index.less';
import Trail from './Trail';
import Relation from './Relation';
import Behavior from './Behavior';

const { TabPane } = Tabs;

const sexCn = {
  1: '男',
  2: '女'
}

export default function(props) {
  const dispatch = useDispatch();
  const { info } = useSelector(({ profile }) => profile, shallowEqual);
  const { params } = props.match;
  const { query = {} } = props.location;
  useEffect(() => {
    if (params && params.id) {
      dispatch({
        type: 'profile/getPersonInfo',
        payload: {
          pid: params.id,
          ...query,
        },
      });
      dispatch({
        type: 'profile/getHistoricalTrack',
        payload: {
          pids: [params.id],
          ...query,
        },
      });
      dispatch({
        type: 'profile/getRelationEntity',
        payload: {
          pid: params.id,
        },
      });
      dispatch({
        type: 'profile/getPidBehaviorTrace',
        payload: {
          pid: params.id,
        }
      });
    }
    return () => {
      dispatch({
        type: 'profile/setState',
        payload: {
          gxObject: {},
          peerRecordList: [],
          selectedPeer: {},
        },
      });
    };
  }, [dispatch, params, query]);

  const handleClose = () => {
    const { goBack } = props.history;
    if (goBack) goBack();
  };
  return (
    <div className={styles.wrapped}>
      <div className={styles.header}>
        <div className={styles.close} onClick={handleClose}>
          <CloseOutlined />
        </div>
        <Row gutter={16}>
          <Col flex="100px 0">
            <Avatar
              className={styles.avatar}
              shape="square"
              size={100}
              icon={<UserOutlined />}
              src={info.personUrl}
            />
          </Col>
          <Col flex="10 0" style={{ flexShrink: 0 }}>
            <div style={{ width: '100%' }}>
              <Descriptions column={3}>
                <Descriptions.Item key="1">
                  <span
                    className="mr-8"
                    style={{ fontWeight: 'bold', fontSize: 16 }}
                  >
                    {info.name}
                  </span>
                  <span className="mr-8">{sexCn[info.sex]}</span>
                  <span className="mr-8">{info.age}岁</span>
                </Descriptions.Item>
                <Descriptions.Item key="cardid" label="身份证">
                  {info.cardId}
                </Descriptions.Item>
                <Descriptions.Item key="phone" label="手机号">
                  {info.phone}
                </Descriptions.Item>
                <Descriptions.Item key="address" label="住址">
                  {info.address}
                </Descriptions.Item>
                <Descriptions.Item key="dateOfBirth" label="出生日期">
                  {info.dateBirth}
                </Descriptions.Item>
                <Descriptions.Item key="nativePlace" label="籍贯">
                  {info.nativePlace}
                </Descriptions.Item>
                <Descriptions.Item key="plateNumber" label="车辆信息">
                  {Array.isArray(info.vehicleId) ? info.vehicleId.join(', ') : ''}
                </Descriptions.Item>
              </Descriptions>
            </div>
          </Col>
          <Col flex="2 0" className="text-center">
            <div className={styles.divider} />
          </Col>
          <Col flex="7 0" style={{ flexShrink: 0 }}>
            <Row style={{ lineHeight: '32px' }}>
              <Col flex="100px">人口属性</Col>
              <Col flex="calc(100% - 100px)" style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>
                {(info.behaviorLabelList || []).map((item) => (
                  <div key={item.labelId} className="f-tag f-tag-primary mr-8">
                    {item.labelName}
                  </div>
                ))}
              </Col>
            </Row>
            <Row>
              <Col flex="100px">标签库</Col>
              <Col flex="calc(100% - 100px)">
                {(info.libraryLabelList || []).map((item) => (
                  <div key={item.labelId} className="f-tag f-tag-primary mr-8">
                    {item.labelName}
                  </div>
                ))}
              </Col>
            </Row>
            <Row>
              <Col flex="100px">自定义标签</Col>
              <Col flex="calc(100% - 100px)">
                {(info.customizeLabelList || []).map((text, i) => (
                  <div key={i} className="f-tag f-tag-primary mr-8">
                    {text}
                  </div>
                ))}
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
      <div className={styles.body}>
        <Tabs defaultActiveKey="1" tabPosition="left">
          <TabPane tab="历史轨迹" key="1">
            <Trail />
          </TabPane>
          <TabPane tab="关联实体" key="2">
            <Relation id={params.id} />
          </TabPane>
          <TabPane tab="行为分析" key="3">
            <Behavior />
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
}
