import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'dva';
import { Drawer, Col, Row, Input, Button, Table, Space, message, Form } from 'antd';
import styles from './index.less';

export default function AddCar({ chooseIndex }) {
  const { notWhiteCarsList, xqbzId, whiteCarsList } = useSelector(
    ({ passingControl }) => passingControl,
  );
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [addVisible, setAddVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [noWhiteListDefault, setNoWhiteListDefault] = useState([]);
  useEffect(() => {
    setNoWhiteListDefault(notWhiteCarsList);
  }, [notWhiteCarsList]);

  const handleDrawerClose = () => {
    setAddVisible(false);
  };

  const handleCarOk = () => {
    dispatch({
      type: 'passingControl/getCarToWhite',
      payload: {
        barrierId: chooseIndex,
        carIds: selectedRowKeys.join(','),
        xqxxbz: xqbzId,
      },
    }).then(({ code, msg = message }) => {
      if (code === 'SUCCESS') {
        message.success('添加成功');
        setSelectedRowKeys([]);
        setAddVisible(false);
        // dispatch({
        //     type: 'passingControl/getCarList'
        // })
        dispatch({
          type: 'passingControl/getWhiteList',
          payload: {
            barrierId: chooseIndex,
          },
        });
      } else {
        message.warn(`${msg}`);
      }
    });
  };

  useEffect(() => {
    setSelectedRowKeys(whiteCarsList.map((item) => item.carId));
    return () => {
      setSelectedRowKeys([]);
    };
  }, [whiteCarsList]);

  const handleAddCar = () => {
    setAddVisible(true);
    setNoWhiteListDefault(notWhiteCarsList);
    form.resetFields();
  };

  const columns = [
    {
      title: '序号',
      key: 'number',
      render: (_, record, index) => index + 1,
    },
    {
      title: '车牌',
      dataIndex: 'carNumber',
      key: 'carNumber',
    },
    {
      title: '车主',
      dataIndex: 'carOwner',
      key: 'carOwner',
    },
    {
      title: '手机号',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: '归属企业',
      dataIndex: 'companyName',
      key: 'companyName',
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
    },
  ];

  return (
    <div>
      <div onClick={handleAddCar} className={styles.add} />
      <Drawer
        className={styles.addCarWrap}
        closable
        title="新增白名单车辆"
        bodyStyle={{ overflowY: 'hidden' }}
        placement="right"
        onClose={handleDrawerClose}
        visible={addVisible}
      >
        <Col>
          <Row>
            <Space>
              <div className={styles.inp}>
                {' '}
                <Form form={form}>
                  <Form.Item name="value">
                    <Input.Search
                      allowClear
                      enterButton
                      //   ref={inpRef}
                      onSearch={(value) => {
                        const filterList = notWhiteCarsList.filter(
                          (item) => item.carNumber.includes(value) || item.carOwner.includes(value),
                        );
                        setNoWhiteListDefault(filterList);
                      }}
                      placeholder="请输入车牌号码/车主"
                    />
                  </Form.Item>
                </Form>
              </div>
            </Space>
          </Row>

          <Row>
            <div className={styles.addModalEventList} style={{ marginTop: 16 }}>
              <Table
                dataSource={noWhiteListDefault}
                columns={columns}
                pagination={false}
                size="middle"
                scroll={{ y: 508 }}
                rowSelection={{
                  selectedRowKeys,
                  onChange: (selectedRowKey) => {
                    setSelectedRowKeys(selectedRowKey);
                  },
                }}
              />
            </div>
          </Row>
          <Row justify="end">
            <div className={styles.addModalBottom}>
              <Button onClick={handleCarOk} type="primary">
                确定
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={handleDrawerClose}>
                取消
              </Button>
            </div>
          </Row>
        </Col>
      </Drawer>
    </div>
  );
}
