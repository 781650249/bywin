import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'dva';
import { Select, Input, Button, Form, Pagination } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, PauseCircleOutlined } from '@ant-design/icons';
import cx from 'classnames';
import monitorPng from './images/monitor-png.png';
import liftPng from './images/lift-png.png';
import helpPng from './images/help-png.png';
import liftWarn from './images/lift-warn.gif';
import liftUnwarn from './images/lift-unwarn.png';
import existPop from './images/exist-pop.png';
import unExistPop from './images/un-exist-pop.png';
import liftStop from './images/lift-stop.png';
import liftUp from './images/lift-up.png';
import liftDown from './images/lift-down.png';
import liftFault from './images/lift-fault.png';
import liftNormal from './images/lift-normal.png';
import styles from './index.less';

const { Option } = Select;
const moveStatusArrow = {
  1: <PauseCircleOutlined />,
  2: <ArrowUpOutlined />,
  3: <ArrowDownOutlined />,
};
const moveStatusIcon = {
  1: liftStop,
  2: liftUp,
  3: liftDown,
};

export default function({
  selectedKeys = null,
  bobmBoxInfo = {},
  setPlayCameraId = () => {},
  setBobmBoxInfo = () => {},
}) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { elevatorList, elevatorTotal } = useSelector(({ elevator }) => elevator);
  const [queryParams, setQueryParams] = useState({ operationStatus: '', name: '' });
  const [building, setBuilding] = useState({ ldxxbz: null, elevatorId: null });
  const [page, setPage] = useState(1);
  const [selectedCard, setSelectedCard] = useState(null);

  useEffect(() => {
    const [selectedKey] = selectedKeys;
    if (selectedKey) {
      const [, ldxxbz, elevatorId] = selectedKey.split('-');
      setBuilding({ ldxxbz, elevatorId });
    } else {
      setBuilding({ ldxxbz: null, elevatorId: null });
    }
    setQueryParams({
      operationStatus: null,
      name: null,
    });
    setPage(1);
    form.resetFields();
  }, [form, selectedKeys]);

  useEffect(() => {
    const { visible } = bobmBoxInfo;
    if (!visible) {
      setSelectedCard(null);
    }
  }, [dispatch, bobmBoxInfo]);

  const onFinish = (values) => {
    setQueryParams({ ...values });
    setPage(1);
    if (building.elevatorId || building.ldxxbz) {
      dispatch({
        type: 'elevator/getListOperationInfo',
        payload: {
          elevatorId: building.elevatorId,
          ldxxbz: building.ldxxbz,
          pageNum: 1,
          pageSize: 20,
          ...values,
        },
      });
    } else {
      dispatch({
        type: 'elevator/setState',
        payload: { elevatorList: [] },
      });
    }
  };

  const handlePageChange = (current) => {
    setPage(current);
    dispatch({
      type: 'elevator/getListOperationInfo',
      payload: {
        elevatorId: building.elevatorId,
        ldxxbz: building.ldxxbz,
        pageNum: current,
        pageSize: 20,
        ...queryParams,
      },
    });
  };

  const handlePlayVedio = (e, data) => {
    e.stopPropagation();
    setBobmBoxInfo({ visible: true, title: `${data.name}视频监控` });
    setPlayCameraId(data.cameraId)
  };

  return (
    <>
      <div className={styles.searchBar}>
        <Form form={form} layout="inline" onFinish={onFinish}>
          <Form.Item name="operationStatus">
            <Select placeholder="全部类型" style={{ width: 220 }}>
              <Option value="">全部类型</Option>
              <Option value="1">正常</Option>
              <Option value="2">异常</Option>
            </Select>
          </Form.Item>
          <Form.Item name="name">
            <Input placeholder="请输入电梯名称" autoComplete="off" style={{ width: 220 }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              查询
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className={styles.content}>
        {elevatorList.map((item, index) => (
          <div
            key={index}
            className={cx(
              styles.itemCard,
              'mr-16 mb-16',
              selectedCard === item.elevatorId ? styles.selectedCard : null,
            )}
            onClick={() => {
              setBobmBoxInfo({ visible: true, title: '设备信息' });
              setSelectedCard(item.elevatorId);
              dispatch({
                type: 'elevator/getElevatorInfo',
                payload: {
                  id: item.elevatorId,
                },
              });
            }}
          >
            <div className={styles.firstRow}>
              <img style={{ width: 14, height: 14 }} src={liftPng} alt="" />
              <span style={{ padding: '0 8px' }}>{item.name}</span>
              <img style={{ width: 12, height: 12, cursor: 'pointer' }} src={helpPng} alt="" />
              <div>
                <img
                  style={{ width: 16, height: 16, cursor: 'pointer' }}
                  src={monitorPng}
                  alt=""
                  onClick={(e) => handlePlayVedio(e, item)}
                />
              </div>
            </div>
            <div className={styles.floorRow}>
              {moveStatusArrow[item.moveStatus]} {item.stopFloor}F
            </div>
            <div className={styles.statusRow}>
              <div className={styles.doorBox}>
                <div
                  className={cx(
                    styles.doorBoxLeftClose,
                    item.doorStatus === 2 ? styles.doorBoxDoorOpen : null,
                  )}
                />
                <div
                  className={cx(
                    styles.doorBoxRightClose,
                    item.doorStatus === 2 ? styles.doorBoxDoorOpen : null,
                  )}
                />
              </div>
              <div className={styles.infoBox}>
                <div>
                  <img
                    style={{ width: 14, height: 14 }}
                    src={moveStatusIcon[item.moveStatus]}
                    alt=""
                  />
                  {item.stopFloor}F
                </div>
                <div>
                  <img
                    style={{ width: 14, height: 14 }}
                    src={item.emptyStatus === 1 ? existPop : unExistPop}
                    alt=""
                  />
                  {item.emptyStatus === 1 ? '有人' : '无人'}
                </div>
                <div>
                  <img
                    style={{ width: 14, height: 14 }}
                    src={item.operationStatus === 1 ? liftNormal : liftFault}
                    alt=""
                  />
                  {item.operationStatus === 1 ? '正常' : '故障'}
                </div>
                <div>
                  <img
                    style={{ width: 14, height: 14 }}
                    src={item.warnStatus === 1 ? liftUnwarn : liftWarn}
                    alt=""
                  />
                  {item.warnStatus === 1 ? '未预警' : '预警'}
                </div>
              </div>
            </div>
            {/* <div className={styles.secRow}>
              <div className={styles.secRowCard}>
                <div style={{ textAlign: 'left' }}>
                  <span>{item.stopFloor}</span>
                  <span>F</span>
                </div>
                <div style={{ textAlign: 'left' }}>停靠</div>
              </div>
              <div className={styles.secRowDivider} />
              <div className={styles.secRowCard}>
                <div style={{ textAlign: 'right' }}>
                  <span>{item.currentLoad}</span>
                  <span>KG</span>
                </div>
                <div style={{ textAlign: 'right' }}>载重</div>
              </div>
            </div> */}
            {/* <div className={styles.thirdRow}>
              <div>
                <img src={item.warnStatus === 1 ? liftUnwarn : liftWarn} alt="" />
                <div>{item.warnStatus === 1 ? '未预警' : '预警中'}</div>
              </div>
              <div>
                <img src={item.doorStatus === 1 ? openDoor : closeDoor} alt="" />
                <div>梯门</div>
              </div>
              <div>
                <img src={item.operationStatus === 1 ? liftNormal : liftFault} alt="" />
                <div>状态</div>
              </div>
            </div> */}
          </div>
        ))}
        {[...Array(5).keys()].map((_, index) => (
          <div key={index} className={cx(styles.hiddenCard, 'mr-16 mb-16')} />
        ))}
      </div>
      <div className={styles.pageBottom}>
        <Pagination
          current={page}
          pageSize={20}
          onChange={handlePageChange}
          total={elevatorTotal}
        />
      </div>
    </>
  );
}
