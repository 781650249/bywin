import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'dva';
import { Modal, Button, Form, Input, Table, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import styles from './index.less';

const columns = [
  {
    title: '序号',
    dataIndex: 'num',
    key: 'num',
  },
  {
    title: '员工照片',
    dataIndex: 'xp',
    key: 'xp',
    render: (xp) => (
      <Avatar
        style={{ margin: '-8px 0' }}
        shape="square"
        size={42}
        src={xp}
        icon={<UserOutlined />}
      />
    ),
  },
  {
    title: '员工姓名',
    dataIndex: 'xm',
    key: 'xm',
  },
  {
    title: '性别',
    dataIndex: 'sex',
    key: 'sex',
  },
  {
    title: '手机号码',
    dataIndex: 'sjhm',
    key: 'sjhm',
  },
];

export default function({
  staffModalVisible = false,
  patrolStaffs = [],
  handleStaffCancel = () => {},
  handleStaffOk = () => {},
}) {
  const [form] = Form.useForm();
  const [selectedRowInfo, setSelectedRowInfo] = useState([]);
  const dispatch = useDispatch();
  const { employeeList } = useSelector(({ editPatrol }) => editPatrol);

  useEffect(() => {
    dispatch({ type: 'editPatrol/getEmployeeList' });
  }, [dispatch]);

  useEffect(() => {
    if(!staffModalVisible) {
      setSelectedRowInfo([]);
    }else {
      setSelectedRowInfo(patrolStaffs);
    }
  }, [staffModalVisible, patrolStaffs]);

  const onFinish = (values) => {
    dispatch({ type: 'editPatrol/getEmployeeList', payload: { ...values } });
  };

  const rowSelection = {
    selectedRowKeys: selectedRowInfo.map((item) => item.key),
    onChange: (_, rows) => {
      setSelectedRowInfo(rows);
    },
  };

  return (
    <Modal
      visible={staffModalVisible}
      footer={null}
      width={720}
      className={styles.addModal}
      onCancel={handleStaffCancel}
    >
      <p className={styles.addModalTitle}>新增巡逻员</p>
      <Form form={form} layout="inline" onFinish={onFinish}>
        <Form.Item label="姓名" name="xm" style={{ flex: 'auto' }}>
          <Input autoComplete="off" />
        </Form.Item>
        <Form.Item label="手机号码" name="sjhm" style={{ flex: 'auto' }}>
          <Input autoComplete="off" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            搜索
          </Button>
        </Form.Item>
      </Form>
      <div className={styles.addModalEventList} style={{ marginTop: 16 }}>
        <Table
          rowSelection={rowSelection}
          dataSource={employeeList}
          columns={columns}
          pagination={false}
          scroll={{ y: 408 }}
        />
      </div>
      <div className={styles.addModalBottom}>
        <Button
          onClick={() => handleStaffOk(selectedRowInfo)}
          disabled={selectedRowInfo.length === 0}
          type="primary"
        >
          确定
        </Button>
        <Button style={{ marginLeft: 8 }} onClick={handleStaffCancel}>
          取消
        </Button>
      </div>
    </Modal>
  );
}
