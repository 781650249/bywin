import React, { useState, useEffect, useCallback } from 'react';
import {
  Input,
  Button,
  Col,
  Row,
  Avatar,
  Pagination,
  Space,
  Form,
  Modal,
  message,
  Tree,
  Spin,
} from 'antd';
import { useSelector, useDispatch } from 'dva';
import { router } from 'umi';
import {
  MobileOutlined,
  BankOutlined,
  EnvironmentOutlined,
  CloseOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import cx from 'classnames';
import { getTreeList } from '@/services/carManager';
import styles from './index.less';
import AddCar from './AddCar';
import { MyIcon } from '../icons/utils';

export default function PassingControl() {
  const {
    queryParams,
    whiteCarsList,
    carsTotal,
    listRecordParams,
    passRecordList,
    passRecordListTotal,
  } = useSelector(({ passingControl }) => passingControl);
  const loading = useSelector((state) => state.loading.effects['passingControl/getRecordList']);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [chooseIndex, setChooseIndex] = useState(null);
  const { confirm } = Modal;
  const [carType, setCarType] = useState('white');
  const [treeData, setTreeData] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const data = await getTreeList();
      setTreeData(data);
    };
    getData();
  }, [dispatch]);

  const changeType = useCallback(
    (params = {}, type = 'passingControl/getRecordList') => {
      dispatch({
        type,
        payload: {
          ...listRecordParams,
          barrierId: chooseIndex,
          carType: carType === 'recordVistor' ? 2 : 1,
          ...params,
        },
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, listRecordParams, chooseIndex],
  );

  const setQuery = useCallback(
    (params = {}, type = 'passingControl/getWhiteList') => {
      dispatch({
        type,
        payload: {
          ...queryParams,
          barrierId: params.barrierId,
          pageNum: queryParams.pageNum,
          ...params,
        },
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, queryParams.pageNum],
  );

  useEffect(
    () =>
      // changeType();
      () => {
        dispatch({
          type: 'passingControl/clear',
        });
      },
    [dispatch],
  );

  const handleCardDel = (e, { id }) => {
    e.stopPropagation();
    confirm({
      title: '提示',
      content: '是否确认删除该车辆',
      closable: true,
      centered: true,
      closeIcon: <CloseOutlined />,
      onOk() {
        dispatch({
          type: 'passingControl/deleteCarFromWhite',
          payload: {
            id,
          },
        }).then((code) => {
          if (code && code === 'SUCCESS') {
            message.success('删除成功');
            setQuery({ barrierId: chooseIndex });
          }
        });
      },
    });
  };

  const handleSelect = (_, item) => {
    const { id } = item.node;
    setChooseIndex(id);
    if (carType === 'white') {
      setQuery({ barrierId: id });
      dispatch({
        type: 'passingControl/getCarList',
      });
    } else if (carType === 'recordIn') {
      changeType({ barrierId: id, inOutType: 1 });
    } else if (carType === 'recordOut') {
      changeType({ barrierId: id, inOutType: 2 });
    } else {
      changeType({ barrierId: id, carType: 2 });
    }
  };

  const handleQueryCar = ({ carWord }) => {
    if (carType === 'white') {
      setQuery({ keyWord: carWord, barrierId: chooseIndex, pageNum: 1 });
      dispatch({
        type: 'passingControl/setState',
        payload: {
          ...queryParams,
          pageNum: 1,
        },
      });
    } else if (carType === 'recordIn') {
      changeType({ keyWord: carWord, inOutType: 1, pageNum: 1 });
      dispatch({
        type: 'passingControl/setState',
        payload: {
          ...listRecordParams,
          pageNum: 1,
        },
      });
    } else if (carType === 'recordOut') {
      changeType({ keyWord: carWord, inOutType: 2, pageNum: 1 });
      dispatch({
        type: 'passingControl/setState',
        payload: {
          ...listRecordParams,
          pageNum: 1,
        },
      });
    } else {
      changeType({ keyWord: carWord, carType: 2, pageNum: 1 });
      dispatch({
        type: 'passingControl/setState',
        payload: {
          ...listRecordParams,
          pageNum: 1,
        },
      });
    }
  };

  const renderList = () => {
    switch (carType) {
      case 'white':
        return (
          <div className={styles.list}>
            {Array.isArray(whiteCarsList) &&
              whiteCarsList.length > 0 &&
              whiteCarsList.map((item, i) => (
                <div key={i} className={styles.cardWrap}>
                  <div className={styles.left}>
                    <Avatar src={item.imageUrl} shape="square" size={92} />
                  </div>
                  <div className={styles.right}>
                    <div
                      className={styles.rightCarNum}
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/vehicle-file/${item.carNumber}`);
                      }}
                    >
                      {item.carNumber}
                    </div>
                    <div className={styles.rightItem}>
                      <div className={styles.rightItemIcon}>
                        <MyIcon type="icon-renyuan" />
                      </div>
                      <div className={styles.rightItemTxt}>{item.carOwner}</div>
                    </div>
                    <div className={styles.rightItem}>
                      <div className={styles.rightItemIcon}>
                        <MobileOutlined />
                      </div>
                      <div className={styles.rightItemTxt}>{item.phoneNumber}</div>
                    </div>
                    <div className={styles.rightItem}>
                      <div className={styles.rightItemIcon}>
                        <BankOutlined />
                      </div>
                      <div className={styles.rightItemTxt}>{item.companyName}</div>
                    </div>
                    <div className={styles.rightItem}>
                      <div className={styles.rightItemIcon}>
                        <EnvironmentOutlined />
                      </div>
                      <div className={styles.rightItemTxt}>{item.address}</div>
                    </div>
                  </div>
                  <div className={styles.del} onClick={(e) => handleCardDel(e, item)} />
                </div>
              ))}

            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className={cx(styles.cardWrap, styles.fill)} />
            ))}
          </div>
        );

      case 'recordIn':
      case 'recordOut':
      case 'recordVistor':
        return (
          <Spin spinning={loading} wrapperClassName={styles.spin}>
            <div className={styles.list}>
              {Array.isArray(passRecordList) &&
                passRecordList.length > 0 &&
                passRecordList.map((item, i) => (
                  <div key={i} className={styles.cardWrap}>
                    <div className={styles.left}>
                      <Avatar src={item.imageUrl} shape="square" size={92} />
                    </div>
                    <div className={styles.right}>
                      <div className={styles.rightCarNum}>{item.carNumber}</div>

                      <div className={styles.rightItem}>
                        <div className={styles.rightItemIcon}>
                          <MyIcon type="icon-renyuan" />
                        </div>
                        <div className={styles.rightItemTxt}>{item.carOwner}</div>
                      </div>
                      <div className={styles.rightItem}>
                        <div className={styles.rightItemIcon}>
                          <MobileOutlined />
                        </div>
                        <div className={styles.rightItemTxt}>{item.phoneNumber}</div>
                      </div>
                      <div className={styles.rightItem}>
                        <div className={styles.rightItemIcon}>
                          <BankOutlined />
                        </div>
                        <div className={styles.rightItemTxt}>{item.companyName}</div>
                      </div>
                      <div className={styles.rightItem}>
                        <div className={styles.rightItemIcon}>
                          <EnvironmentOutlined />
                        </div>
                        <div className={cx(styles.rightItemTxt, 'ellipsis')}>{item.address}</div>
                      </div>

                      <div className={styles.rightItem}>
                        <div className={styles.rightItemIcon}>
                          <ClockCircleOutlined />
                        </div>
                        <div className={styles.rightItemTxt}>{item.inOutDateStr}</div>
                      </div>
                    </div>
                  </div>
                ))}
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className={cx(styles.cardWrap, styles.fill)} />
              ))}
            </div>
          </Spin>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.menus}>
        <Tree treeData={treeData} onSelect={handleSelect} />
      </div>

      <div className={styles.content}>
        <div className={styles.top}>
          <Col span={24}>
            <Row>
              <div className={styles.items}>
                <div
                  className={cx(styles.itemsCon, {
                    [styles.isActive]: carType === 'white',
                  })}
                  onClick={() => {
                    form.resetFields();
                    setCarType('white');
                    setQuery({ barrierId: chooseIndex });
                  }}
                >
                  白名单
                </div>
                <div
                  className={cx(styles.itemsCon, {
                    [styles.isActive]: carType === 'recordIn',
                  })}
                  onClick={() => {
                    form.resetFields();
                    setCarType('recordIn');
                    changeType({ inOutType: 1 });
                  }}
                >
                  进入记录
                </div>
                <div
                  className={cx(styles.itemsCon, {
                    [styles.isActive]: carType === 'recordOut',
                  })}
                  onClick={() => {
                    form.resetFields();
                    setCarType('recordOut');
                    changeType({ inOutType: 2 });
                  }}
                >
                  出去记录
                </div>
                <div
                  className={cx(styles.itemsCon, {
                    [styles.isActive]: carType === 'recordVistor',
                  })}
                  onClick={() => {
                    form.resetFields();
                    setCarType('recordVistor');
                    changeType({ carType: 2 });
                  }}
                >
                  访客记录
                </div>
              </div>
            </Row>
            <Row>
              <Space>
                <Form form={form} layout="inline" onFinish={handleQueryCar}>
                  <Form.Item name="carWord">
                    <Input placeholder="请输入车牌号码/车主" />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      查询
                    </Button>
                  </Form.Item>
                </Form>
              </Space>
              {carType === 'white' && <AddCar chooseIndex={chooseIndex} />}
            </Row>
          </Col>
        </div>

        {renderList(carType)}

        <div className={styles.pagination}>
          <Pagination
            style={carType === 'white' ? { display: 'block' } : { display: 'none' }}
            current={queryParams.pageNum}
            total={carsTotal}
            onChange={(value) => {
              dispatch({
                type: 'passingControl/setState',
                payload: {
                  queryParams: {
                    ...queryParams,
                    pageNum: value,
                  },
                },
              });
              setQuery({ pageNum: value, barrierId: chooseIndex });
            }}
          />

          <Pagination
            style={carType === 'recordIn' ? { display: 'block' } : { display: 'none' }}
            current={listRecordParams.pageNum}
            total={passRecordListTotal}
            onChange={(value) => {
              dispatch({
                type: 'passingControl/setState',
                payload: {
                  listRecordParams: {
                    ...listRecordParams,
                    pageNum: value,
                  },
                },
              });
              changeType({ pageNum: value, inOutType: 1 });
            }}
          />

          <Pagination
            style={carType === 'recordOut' ? { display: 'block' } : { display: 'none' }}
            current={listRecordParams.pageNum}
            total={passRecordListTotal}
            onChange={(value) => {
              dispatch({
                type: 'passingControl/setState',
                payload: {
                  listRecordParams: {
                    ...listRecordParams,
                    pageNum: value,
                  },
                },
              });
              changeType({ pageNum: value, inOutType: 2 });
            }}
          />

          <Pagination
            style={carType === 'recordVistor' ? { display: 'block' } : { display: 'none' }}
            current={listRecordParams.pageNum}
            total={passRecordListTotal}
            onChange={(value) => {
              dispatch({
                type: 'passingControl/setState',
                payload: {
                  listRecordParams: {
                    ...listRecordParams,
                    pageNum: value,
                  },
                },
              });
              changeType({ pageNum: value, carType: 2 });
            }}
          />
        </div>
      </div>
    </div>
  );
}
