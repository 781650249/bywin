import React, { useState } from 'react';
import { Button, Drawer, Form, Input, Select, Table } from 'antd';
// import { useDispatch } from 'dva';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { usePersonnelList } from '@/hooks';
import styles from './index.less';

export default function({ positionList = [], onOk = async () => false }) {
  // const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const { list, loading, setParams } = usePersonnelList({
    defaultParams: {
      page: 1,
      pageSize: 1000,
    },
  });
  const handleClose = () => {
    setVisible(false);
    setSelectedRowKeys([]);
  };

  const handleSave = async () => {
    const success = await onOk(selectedRowKeys)
    if (success) {
      handleClose();
    }
  };

  const showDrawer = () => {
    setVisible(true);
  };

  /**
   * 搜索
   * @param {Object} values
   */
  const handleSearch = (values) => {
    setParams({
      ...values,
    });
  };

  return (
    <>
      <span className={styles.action} onClick={showDrawer}>
        <PlusOutlined />
      </span>
      <Drawer
        title="新增人员"
        className={styles.drawer}
        width={720}
        onClose={handleClose}
        visible={visible}
        // getContainer={false}
        // bodyStyle={{ paddingBottom: 80 }}
        footer={
          <div
            style={{
              textAlign: 'right',
            }}
          >
            <Button onClick={handleClose} style={{ marginRight: 8 }}>
              取消
            </Button>
            <Button onClick={handleSave} type="primary">
              保存
            </Button>
          </div>
        }
      >
        <Form layout="inline" className={styles.form} onFinish={handleSearch}>
          <Form.Item name="position">
            <Select
              allowClear
              getPopupContainer={(triggerNode) => triggerNode.parentElement}
              style={{ width: 160 }}
              placeholder="选择角色"
            >
              {positionList.map((item) => (
                <Select.Option key={item.key}>{item.text}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="key">
            <Input style={{ width: 224 }} placeholder="请输入人员姓名/手机号码/地址" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
              查询
            </Button>
          </Form.Item>
        </Form>
        <Table
          rowKey="ygxxbz"
          loading={loading}
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
            columnWidth: 32,
          }}
          size="middle"
          columns={[
            {
              title: '序号',
              key: 'number',
              width: 48,
              align: 'center',
              render: (_, record, index) => index + 1,
            },
            {
              title: '姓名',
              dataIndex: 'xm',
              width: 64,
            },
            {
              title: '角色',
              dataIndex: 'positionName',
              width: 48,
            },
            {
              title: '性别',
              dataIndex: 'xbmc',
              width: 48,
            },
            {
              title: '手机号',
              dataIndex: 'sjhm',
            },
            {
              title: '归属',
              dataIndex: 'qymc',
            },
            {
              title: '地址',
              dataIndex: 'dz',
            },
          ]}
          dataSource={list}
          // pagination={{
          //   current: pagination.page,
          //   pageSize: pagination.pageSize,
          //   total: pagination.total,
          //   onChange: (page, pageSize) => setParams({ page, pageSize }),
          // }}
        />
      </Drawer>
    </>
  );
}
