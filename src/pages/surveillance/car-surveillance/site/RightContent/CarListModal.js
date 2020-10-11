import React, { useEffect, useState, useCallback } from 'react';
import { Modal, Input, Table, Avatar } from 'antd';
import { getAllCarList } from '@/services/surveillance';
import { PictureOutlined } from '@ant-design/icons';
import styles from './index.less';

const columns = [
  {
    title: '车牌号',
    dataIndex: 'carNumber',
    key: 'carNumber',
  },
  {
    title: '车辆照片',
    dataIndex: 'imageUrl',
    key: 'imageUrl',
    render: (imageUrl) => (
      <Avatar
        style={{ margin: '-8px 0' }}
        shape="square"
        size={42}
        src={imageUrl}
        icon={<PictureOutlined />}
      />
    ),
  },
  {
    title: '车主',
    dataIndex: 'carOwner',
    key: 'carOwner',
  },
  {
    title: '手机号码',
    dataIndex: 'phoneNumber',
    key: 'phoneNumber',
  },
];

export default function({
  carListVislible = false,
  handleCarCancel = () => {},
  handleCarOk = () => {},
}) {
  const [selectedRowInfo, setSelectedRowInfo] = useState([]);
  const [allCarList, setAllCarList] = useState({ rows: [], total: 0 });

  const getAllCarData = useCallback(async (params) => {
    const res = await getAllCarList({ ...params });
    if (res.rows) {
      setAllCarList({
        rows: res.rows.map((item) => ({ ...item, key: item.id })),
        total: res.total,
      });
    }
  }, []);

  useEffect(() => {
    getAllCarData();
  }, [getAllCarData]);

  useEffect(() => {
    if(!carListVislible) {
      setSelectedRowInfo([]);
    }
  }, [carListVislible])

  const rowSelection = {
    selectedRowKeys: selectedRowInfo.map((item) => item.key),
    onChange: (_, rows) => {
      setSelectedRowInfo(rows);
    },
  };

  return (
    <Modal
      visible={carListVislible}
      width={840}
      onCancel={handleCarCancel}
      onOk={() => handleCarOk(selectedRowInfo)}
      okButtonProps={{ disabled: selectedRowInfo.length === 0 }}
    >
      <p className={styles.addModalTitle}>导入车辆</p>
      <Input.Search
        placeholder="请输入车牌号码/车主"
        enterButton="搜索"
        style={{ width: 280 }}
        onSearch={(value) => {
          setSelectedRowInfo([]);
          getAllCarData({ keyWord: value });
        }}
      />
      <div style={{ marginTop: 16 }}>
        <Table
          rowSelection={rowSelection}
          dataSource={allCarList.rows}
          columns={columns}
          pagination={false}
          scroll={{ y: 428 }}
        />
      </div>
    </Modal>
  );
}
