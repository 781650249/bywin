import React, { useState, useEffect } from 'react';
import { Drawer, Col, Row, Input, Button, Table, Form, Select } from 'antd';
import { useSelector, useDispatch } from 'dva';
import styles from './index.less';

export default function AddPerson() {
  const [addVisible, setAddVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [personRows, setPersonRows] = useState([]);
  const { perSonList, savePeople, personParams } = useSelector(
    ({ parkWarn }) => parkWarn,
  );
  const dispatch = useDispatch();
  useEffect(() => {
    setSelectedRowKeys(savePeople.map((item) => item.ygxxbz));
  }, [savePeople]);

  const handleDrawerClose = () => {
    setAddVisible(false);
  };

  const handleCarOk = () => {
    dispatch({
      type: 'parkWarn/setState',
      payload: {
        savePeople: personRows,
      },
    });
    setAddVisible(false);
  };

  const handleAddCar = () => {
    setSelectedRowKeys(savePeople.map((item) => item.ygxxbz));
    setAddVisible(true);
  };

  const handleSearch = (value) => {
    dispatch({
      type: 'parkWarn/getPersonnelList',
      payload: {
        ...personParams,
        ...value,
      },
    });
  };

  const columns = [
    {
      title: '序号',
      key: 'number',
      render: (_, record, index) => index + 1,
    },
    {
      title: '姓名',
      dataIndex: 'xm',
      key: 'xm',
    },
    {
      title: '岗位',
      dataIndex: 'positionName',
      key: 'positionName',
    },
    {
      title: '性别',
      dataIndex: 'xbmc',
      key: 'xbmc',
    },

    {
      title: '手机号码',
      dataIndex: 'sjhm',
      key: 'sjhm',
    },
    {
      title: '归属企业',
      dataIndex: 'qymc',
      key: 'qymc',
    },
    {
      title: '地址',
      dataIndex: 'dz',
      key: 'dz',
    },
  ];

  return (
    <div>
      <div onClick={() => handleAddCar()} className={styles.add} />
      <Drawer
        z-index={1000}
        mask
        className={styles.addCarWrap}
        closable
        title="新增人员"
        zIndex={1000}
        bodyStyle={{ padding: 20 }}
        placement="right"
        onClose={handleDrawerClose}
        visible={addVisible}
        footer={
          <div
            style={{
              textAlign: 'right',
            }}
          >
            <Button onClick={() => setAddVisible(false)} style={{ marginRight: 8 }}>
              取消
            </Button>
            <Button onClick={() => handleCarOk()} type="primary">
              保存
            </Button>
          </div>
        }
      >
        <Col>
          <Form layout="inline" className={styles.form} onFinish={handleSearch}>
            <Form.Item name="position">
              <Select
                getPopupContainer={(triggerNode) => triggerNode.parentElement}
                style={{ width: 160 }}
                placeholder="选择岗位"
                allowClear
              >
                <Select.Option value="2">保安</Select.Option>
                <Select.Option value="1">巡查员</Select.Option>
                <Select.Option value="3">企业员工</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="key">
              <Input style={{ width: 224 }} placeholder="请输入人员姓名/手机号码/地址" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
            </Form.Item>
          </Form>

          <Row>
            <div className={styles.addModalEventList} style={{ marginTop: 16 }}>
              <Table
                dataSource={perSonList}
                columns={columns}
                pagination={false}
                size="middle"
                scroll={{ y: 533 }}
                rowSelection={{
                  selectedRowKeys,
                  onChange: (selectedRowKey, item) => {
                    setPersonRows(item);
                    setSelectedRowKeys(selectedRowKey);
                  },
                }}
              />
            </div>
          </Row>
        </Col>
      </Drawer>
    </div>
  );
}
