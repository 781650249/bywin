import React, { useState, useEffect, useCallback } from 'react';
import {
  Input,
  Button,
  Table,
  Radio,
  Drawer,
  Collapse,
  Checkbox,
  Modal,
  Avatar,
  message,
} from 'antd';
import { PlusOutlined, CaretRightOutlined, UserOutlined } from '@ant-design/icons';
import { uniqBy } from 'lodash';
import {
  getCtrlDetailById,
  getQYSBList,
  getPersonnelList,
  editPersonnelControl,
} from '@/services/surveillance';
import styles from './index.less';

const { Panel } = Collapse;

const deviceColumns = [
  {
    title: '设备名称',
    dataIndex: 'mc',
    key: 'mc',
  },
  {
    title: '位置',
    dataIndex: 'dz',
    key: 'dz',
  },
];

const namesColumns = [
  {
    title: '图片',
    dataIndex: 'url',
    key: 'url',
    render: (url) => (
      <Avatar
        style={{ margin: '-8px 0' }}
        shape="square"
        size={42}
        src={url}
        icon={<UserOutlined />}
      />
    ),
  },
  {
    title: '姓名',
    dataIndex: 'xm',
    key: 'xm',
  },
  {
    title: '岗位',
    dataIndex: 'gw',
    key: 'gw',
  },
  {
    title: '手机号',
    dataIndex: 'sjhm',
    key: 'sjhm',
  },
  {
    title: '归属企业',
    dataIndex: 'gsqy',
    key: 'gsqy',
  },
  {
    title: '操作',
    key: 'action',
    render: () => (
      <Button type="link" block>
        删除
      </Button>
    ),
  },
];

const popColumns = [
  {
    title: '序号',
    dataIndex: 'num',
    key: 'num',
  },
  {
    title: '图片',
    dataIndex: 'url',
    key: 'url',
    render: (url) => (
      <Avatar
        style={{ margin: '-8px 0' }}
        shape="square"
        size={42}
        src={url}
        icon={<UserOutlined />}
      />
    ),
  },
  {
    title: '姓名',
    dataIndex: 'xm',
    key: 'xm',
  },
  {
    title: '手机号',
    dataIndex: 'sjhm',
    key: 'sjhm',
  },
];

export default function({ siteId = null, handleClosePage = () => {}, getPopCtrlData = () => {} }) {
  const [deviceDrawer, setDeviceDrawer] = useState(false);
  const [allQysbList, setAllQysbList] = useState([]);
  const [areaName, setAreaName] = useState('');
  const [qysbList, setQysbList] = useState([]);
  const [ryxxList, setRyxxList] = useState([]);
  const [selectedQysb, setSelectedQysb] = useState([]); // 选中的区域设备
  const [whiteOrBlack, setWhiteOrBlack] = useState('0'); // 黑白名单
  const [isPopModal, setIsPopModal] = useState(false);
  const [allPopList, setAllPopList] = useState([]);
  const [selectedRowInfo, setSelectedRowInfo] = useState([]); // 表单人员选中

  const clearForm = () => {
    setAreaName('');
    setQysbList([]);
    setRyxxList([]);
    setSelectedQysb([]);
  };

  const getPersonnelData = useCallback(async (params) => {
    const res = await getPersonnelList({ ...params });
    if (res.rows) {
      setAllPopList(
        res.rows.map((item, index) => ({
          ...item,
          gsqy: item.qymc,
          url: item.xp,
          gw: item.positionName,
          qydz: item.dz,
          num: index + 1,
          key: index + 1,
        })),
      );
    }
  }, []);

  useEffect(() => {
    getQYSBList().then((res) => {
      if (res) {
        setAllQysbList(res);
      }
    });
    getPersonnelData();
  }, [getPersonnelData]);

  useEffect(() => {
    if (siteId) {
      getCtrlDetailById({ bkrwId: siteId }).then((res) => {
        if (res.id) {
          setWhiteOrBlack(res.bklx);
          setAreaName(res.qymc);
          setSelectedQysb(res.qysbList.map((item) => `${item.sxtid}&${item.dz}`));
          setRyxxList(res.ryxxList.map((item, index) => ({ ...item, key: index })));
        }
      });
    } else {
      clearForm();
    }
  }, [siteId]);

  useEffect(() => {
    setQysbList(
      selectedQysb.map((val, index) => ({
        key: index,
        mc: val.split('&')[1],
        dz: val.split('&')[1],
        sxtid: val.split('&')[0],
      })),
    );
  }, [selectedQysb]);

  const rowSelection = {
    selectedRowKeys: selectedRowInfo.map((item) => item.key),
    onChange: (_, rows) => {
      setSelectedRowInfo(rows);
    },
  };

  const handleSaveOk = () => {
    if (!areaName) {
      message.warning('请输入重点区域！');
      return null;
    }
    if (qysbList.length === 0) {
      message.warning('请选择区域设备！');
      return null;
    }
    if (ryxxList.length === 0) {
      message.warning('请选择人员');
      return null;
    }

    editPersonnelControl({ 
      id: siteId,
      bklx: whiteOrBlack,
      qymc: areaName,
      qysbList: qysbList.map((item) => item.sxtid),
      ryxxList: ryxxList.map((item) => ({
        bz: item.bz,
        gsqy: item.gsqy,
        gw: item.gw,
        id: item.id,
        qydz: item.qydz,
        sjhm: item.sjhm,
        tyshxydm: item.tyshxydm,
        url: item.url,
        xbdm: item.xbdm,
        xm: item.xm,
        ygxxbz: item.ygxxbz,
      }))
    }).then((res) => {
      if(res && siteId) {
        message.success('更新成功');
      }else if(res && !siteId) {
        message.success('添加成功');
        getPopCtrlData()
      }
    })
  };

  return (
    <div className={styles.container}>
      <div className={styles.areaSite}>
        <span>{`区域${siteId ? '更新' : '新增'}`}</span>
      </div>
      <div className={styles.areaInput}>
        <span>重点区域</span>
        <Input
          placeholder="请输入"
          value={areaName}
          style={{ width: 280 }}
          onChange={(e) => setAreaName(e.target.value)}
        />
      </div>
      <div className={styles.operateColumn}>
        <span>区域设备</span>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setDeviceDrawer(true)}>
          新增
        </Button>
      </div>
      <Table dataSource={qysbList} columns={deviceColumns} />
      <div className={styles.operateColumn}>
        <Radio.Group
          value={whiteOrBlack}
          buttonStyle="solid"
          onChange={(e) => setWhiteOrBlack(e.target.value)}
        >
          <Radio.Button value="0">白名单</Radio.Button>
          <Radio.Button value="1">黑名单</Radio.Button>
        </Radio.Group>
        <div>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsPopModal(true)}>
            导入
          </Button>
          {/* <Button type="primary" icon={<PlusOutlined />} style={{ marginLeft: 20 }}>
            新增
          </Button> */}
        </div>
      </div>
      <Table dataSource={ryxxList} columns={namesColumns} />
      <div className={styles.footer}>
        <Button type="primary" ghost style={{ marginRight: 20 }} onClick={handleClosePage}>
          取消
        </Button>
        <Button type="primary" onClick={handleSaveOk}>
          确定
        </Button>
      </div>
      <Drawer
        width={412}
        forceRender
        title="新增区域设备"
        headerStyle={{ borderBottom: 0 }}
        onClose={() => setDeviceDrawer(false)}
        visible={deviceDrawer}
      >
        {/* <Input.Search
          placeholder="请输入地址/设备名称"
          enterButton="查询"
          onSearch={(value) => console.log(value)}
        /> */}
        <Checkbox.Group
          style={{ width: '100%' }}
          onChange={(checkedValues) => setSelectedQysb(checkedValues)}
          value={selectedQysb}
        >
          {allQysbList.length !== 0 && (
            <Collapse
              bordered={false}
              defaultActiveKey={allQysbList.map((item) => item.id)}
              expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
              className={styles.collapseBox}
              ghost
            >
              {allQysbList.map((item) => (
                <Panel header={item.azdd} key={item.id}>
                  {item.monitoringInformationlist.map((i) => (
                    <div key={i.spbfbm}>
                      <Checkbox value={`${i.spbfbm}&${i.azdd}`}>{i.azdd}</Checkbox>
                    </div>
                  ))}
                </Panel>
              ))}
            </Collapse>
          )}
        </Checkbox.Group>
      </Drawer>
      <Modal
        visible={isPopModal}
        width={840}
        onCancel={() => setIsPopModal(false)}
        onOk={() => {
          setRyxxList([
            ...ryxxList.filter((i) => !i.ygxxbz),
            ...uniqBy([...ryxxList.filter((i) => i.ygxxbz), ...selectedRowInfo], 'ygxxbz'),
          ]);
          setIsPopModal(false);
        }}
        okButtonProps={{ disabled: selectedRowInfo.length === 0 }}
      >
        <p className={styles.addModalTitle}>导入人员</p>
        <Input.Search
          placeholder="请输入人员姓名/手机号码"
          enterButton="搜索"
          style={{ width: 280 }}
          onSearch={(value) => {
            setSelectedRowInfo([]);
            getPersonnelData({ key: value });
          }}
        />
        <div style={{ marginTop: 16 }}>
          <Table
            rowSelection={rowSelection}
            dataSource={allPopList}
            columns={popColumns}
            pagination={false}
            scroll={{ y: 428 }}
          />
        </div>
      </Modal>
    </div>
  );
}
