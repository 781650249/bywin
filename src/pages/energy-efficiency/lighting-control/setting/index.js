import React, { useState, useEffect, useCallback } from 'react';
import { Tree } from 'antd';
import cx from 'classnames';
import { CloseOutlined } from '@ant-design/icons';
import { getList, getTreeData } from '@/services/lighting-control';
import { Link } from 'umi';
import UnifiedControl from './UnifiedControl';
import IndependentControl from './IndependentControl';
import styles from './index.less';

export default function() {
  const [treeData, setTreeData] = useState([]);
  const [deviceList, setDeviceList] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [treeDataList, setTreeDataList] = useState([]);
  const [treeParams, setTreeParams] = useState({});
  // const [searchValue, setSearchValue] = useState('');
  const [titleText, setTitleText] = useState('');

  // 加载左侧treeData
  useEffect(() => {
    const getData = async () => {
      const data = await getTreeData();
      setTreeData(data);
    };
    getData();
  }, []);

  const getDeviceList = useCallback(async () => {
    const [selectedKey] = selectedKeys;
    if (selectedKey) {
      if (!String(selectedKey).includes('&')) {
        const data = await getList({ deviceId: selectedKey });
        setDeviceList(data);
      } else {
        const array = selectedKey.split('&');
        const [xqxxbz, ldxxbz, lch] = array;
        const params = { xqxxbz };
        if (ldxxbz) {
          params[lch === '' ? 'streetNo' : 'ldxxbz'] = ldxxbz;
        }
        if (lch) {
          params.lch = lch;
        }
        setTreeParams(params);
        const data = await getList(params);
        setDeviceList(data);
      }
    }
  }, [selectedKeys]);

  useEffect(() => {
    getDeviceList();
  }, [getDeviceList]);

  /**
   * 默认选中treeData的第一个节点
   */
  useEffect(() => {
    if (treeData.length > 0) {
      setSelectedKeys([treeData[0].key]);
    }
    const dataList = [];
    const generateList = (data, parentTitle = '') => {
      data.forEach((node) => {
        const { key, title, children } = node;
        const fullTitle = `${parentTitle}${title}`;
        dataList.push({ key, title, fullTitle });
        if (children) {
          generateList(children, fullTitle);
        }
      });
    };
    generateList(treeData);
    setTreeDataList(dataList);
  }, [treeData]);

  /**
   * 根据选中的节点显示标题
   */
  useEffect(() => {
    setTitleText();
    if (treeDataList.length === 0 || selectedKeys.length === 0) {
      setTitleText('');
      return;
    }
    const current = treeDataList.find((item) => item.key === selectedKeys[0]);
    if (current) {
      setTitleText(current.fullTitle);
    }
  }, [treeDataList, selectedKeys]);

  return (
    <div className={styles.wrapper}>
      <Link to="/lighting-control">
        <div className={styles.close}>
          <CloseOutlined />
        </div>
      </Link>
      <div className={styles.menus}>
        {/* <Input.Search enterButton style={{ marginBottom: 8 }} /> */}
        <div className={styles.tree}>
          <Tree selectedKeys={selectedKeys} onSelect={setSelectedKeys} treeData={treeData} />
        </div>
      </div>
      <div className={styles.content}>
        <h3>
          {titleText}
          统一控制
          {deviceList.length > 0 && (
            <span>
              （共<i className={styles.subtitleNumber}>{deviceList.length}</i>台空调）
            </span>
          )}
        </h3>
        <UnifiedControl deviceList={deviceList} setDeviceList={setDeviceList} params={treeParams} />
        <h3>{titleText || '独立控制'}</h3>
        <div className={cx(styles.independentControlWrapper)}>
          <IndependentControl deviceList={deviceList} setDeviceList={setDeviceList} />
          {[1, 2, 3, 4].map((el) => (
            <div className={styles.independentControl} style={{ height: 0 }} key={el} />
          ))}
        </div>
      </div>
    </div>
  );
}
