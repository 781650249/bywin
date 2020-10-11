import React, { useState, useEffect } from 'react';
import { Modal, Table, Avatar, Popconfirm } from 'antd';
import { PlusOutlined, UserOutlined, DeleteOutlined } from '@ant-design/icons';
import { uniq } from 'lodash';
import { usePersonnelList } from '@/hooks';
import styles from './index.less';

const PersonnelSelection = React.memo(({ value = [], onChange }) => {
  const [visible, setVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const { list } = usePersonnelList({
    defaultParams: {
      page: 1,
      pageSize: 1000,
      // position: '2',
    },
  });
  useEffect(() => {}, [value, list]);

  const handleDelete = (key) => {
    onChange(value.filter((el) => el !== key));
  };

  const handleTableChange = (keys) => {
    setSelectedRowKeys(keys);
  };

  const handleModalCancel = () => {
    setVisible(false);
    setSelectedRowKeys([]);
  };

  const handleModalOk = () => {
    const personnelKeys = list.map((item) => item.ygxxbz);
    onChange(uniq([...value.filter((el) => personnelKeys.includes(el)), ...selectedRowKeys]));
    handleModalCancel();
  };
  return (
    <div className={styles.wrapper}>
      <div className="text-right">
        <span className={styles.plus} onClick={() => setVisible(true)}>
          <PlusOutlined />
        </span>
      </div>
      <div className={styles.items}>
        {list
          .filter((item) => value.includes(item.ygxxbz))
          .map((item, i) => (
            <div className={styles.item} key={i}>
              <Avatar
                className={styles.itemAvatar}
                shape="square"
                size={64}
                icon={<UserOutlined />}
                src={item.xp}
              />
              <div className={styles.itemContent}>
                <div className={styles.itemName}>{item.xm}</div>
                <div className={styles.phoneNumber}>{item.sjhm}</div>
              </div>
              <Popconfirm
                title="确认移除当前人员?"
                onConfirm={() => handleDelete(item.ygxxbz)}
                okText="是"
                cancelText="否"
              >
                <div className={styles.itemDelete}>
                  <DeleteOutlined />
                </div>
              </Popconfirm>
            </div>
          ))}
      </div>
      <Modal
        title="人员列表"
        visible={visible}
        width={720}
        onCancel={handleModalCancel}
        onOk={handleModalOk}
      >
        <Table
          rowKey="ygxxbz"
          rowSelection={{
            selectedRowKeys,
            onChange: handleTableChange,
            getCheckboxProps: (record) => ({
              name: record.ygxxbz,
            }),
          }}
          columns={[
            {
              title: '姓名',
              dataIndex: 'xm',
              render: (text) => <a>{text}</a>,
            },
            {
              title: '手机号码',
              dataIndex: 'sjhm',
            },
            {
              title: '岗位',
              dataIndex: 'positionName',
            },
          ]}
          dataSource={list}
        />
      </Modal>
    </div>
  );
});

export default PersonnelSelection;
