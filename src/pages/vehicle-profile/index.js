import React, { useEffect } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'dva';
import { Row, Col, Avatar, Tabs, Descriptions } from 'antd';
import { CloseOutlined, CarOutlined } from '@ant-design/icons';
import styles from './index.less';
import Trail from './Trail';

const { TabPane } = Tabs;

export default function(props) {
  const dispatch = useDispatch();
  const { info } = useSelector(({ vehicleFile }) => vehicleFile, shallowEqual);
  const { query = {} } = props.location;
  useEffect(() => {
    if (query.licensePlate) {
      dispatch({
        type: 'vehicleFile/getHistoricalTrack',
        payload: {
          carPlate: query.licensePlate,
          timeMatch: -1,
        },
      });
    }
    return () => {
      dispatch({
        type: 'vehicleFile/clear',
      });
    };
  }, [dispatch, query]);

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
              icon={<CarOutlined />}
              src={info.personUrl}
            />
          </Col>
          <Col flex="10 0" style={{ flexShrink: 0 }}>
            <div style={{ width: '100%' }}>
              <Descriptions column={3}>
                <Descriptions.Item key="licensePlate">
                  <span
                    className="mr-8"
                    style={{ fontWeight: 'bold', fontSize: 16 }}
                  >
                    {query.licensePlate}
                  </span>
                  <span className="mr-8">{info.sex}</span>
                </Descriptions.Item>
                <Descriptions.Item key="name" label="车主">
                  {info.name}
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
              <Col flex="100px">车辆属性</Col>
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
        </Tabs>
      </div>
    </div>
  );
}
