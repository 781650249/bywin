import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'dva';
import { Button, Table, Radio, Select, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { getCarCtrlList, batchAddCarCtrl } from '@/services/surveillance';
import CarListModal from './CarListModal';
import styles from './index.less';

const namesColumns = [
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
  // {
  //   title: '操作',
  //   key: 'action',
  //   render: () => <div>1</div>,
  // },
];
export default function() {
  const { communityList } = useSelector(({ global }) => global);
  const [selectedXq, setSelectedXq] = useState(null);
  const [carCtrlList, setCarCtrlList] = useState({ rows: [], total: 0 });
  const [listType, setListType] = useState(0); // 布控类型 (0: 白名单 1:黑名单)
  const [carListVislible, setCarListVislible] = useState(false);

  const getCarCtrlData = useCallback(async () => {
    if (selectedXq) {
      const res = await getCarCtrlList({ controlType: listType, yqxxbz: selectedXq });
      if (res.rows) {
        setCarCtrlList({
          rows: res.rows.map((item) => ({ ...item, key: item.id })),
          total: res.total,
        });
      }
    }
  }, [selectedXq, listType]);

  useEffect(() => {
    if (Array.isArray(communityList) && communityList.length !== 0) {
      setSelectedXq(communityList[0].xqxxbz);
    }
  }, [communityList]);

  useEffect(() => {
    getCarCtrlData();
  }, [getCarCtrlData]);

  const handleCarOk = (keys) => {
    batchAddCarCtrl({
      yqxxbz: selectedXq,
      controlType: listType,
      carIds: keys.map((item) => item.id),
    }).then((res) => {
      if(res) {
        message.success('导入成功');
        setCarListVislible(false);
        getCarCtrlData();
      }
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.areaSite}>
        <span>车辆设置</span>
      </div>
      <Select
        value={selectedXq}
        style={{ width: 148, marginTop: 16 }}
        onChange={(value) => setSelectedXq(value)}
      >
        {communityList.map((item) => (
          <Select.Option key={item.xqxxbz} value={item.xqxxbz}>
            {item.communityName}
          </Select.Option>
        ))}
      </Select>
      <div className={styles.operateColumn}>
        <Radio.Group
          value={listType}
          buttonStyle="solid"
          onChange={(e) => setListType(e.target.value)}
        >
          <Radio.Button value={0}>白名单</Radio.Button>
          <Radio.Button value={1}>黑名单</Radio.Button>
        </Radio.Group>
        <div>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setCarListVislible(true)}>
            导入
          </Button>
          {/* <Button type="primary" icon={<PlusOutlined />} style={{ marginLeft: 20 }}>
            新增
          </Button> */}
        </div>
      </div>
      <Table
        dataSource={carCtrlList.rows}
        columns={namesColumns}
        pagination={{ total: carCtrlList.total }}
      />
      <CarListModal
        carListVislible={carListVislible}
        handleCarCancel={() => setCarListVislible(false)}
        handleCarOk={handleCarOk}
      />
    </div>
  );
}
