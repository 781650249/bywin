import React, { useState, useEffect } from 'react';
import { Tree } from 'antd';
import { useDispatch, useSelector } from 'dva';
import cx from 'classnames';
import UnifiedControl from './UnifiedControl';
import IndependentControl from './IndependentControl';
import styles from './index.less';

export default function() {
  const dispatch = useDispatch();
  const { treeData, deviceList } = useSelector((state) => state.airConditioningControl);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [treeDataList, setTreeDataList] = useState([]);
  // const [searchValue, setSearchValue] = useState('');
  const [titleText, setTitleText] = useState('');

  useEffect(() => {
    dispatch({ type: 'airConditioningControl/getTreeData' });
    return () => {
      dispatch({ type: 'airConditioningControl/clear' });
    };
  }, [dispatch]);

  useEffect(() => {
    const [selectedKey] = selectedKeys;
    if (selectedKey) {
      const [xqxxbz, ldxxbz, lch, fwbh] = selectedKey.split('&');
      const params = { xqxxbz, ldxxbz, lch, fwbh };
      dispatch({
        type: 'airConditioningControl/getList',
        payload: {
          ...params,
        },
      });
    } else {
      dispatch({
        type: 'airConditioningControl/setState',
        payload: {
          currentArea: {},
          deviceList: [],
        },
      });
    }
  }, [dispatch, selectedKeys]);

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
        <UnifiedControl />
        <h3>{titleText || '独立控制'}</h3>
        <div className={cx(styles.independentControlWrapper)}>
          {deviceList.map((item, i) => (
            <IndependentControl key={i} title="空调" data={item} />
          ))}
          {[1, 2, 3, 4].map((el) => (
            <div className={styles.independentControl} style={{ height: 0 }} key={el} />
          ))}
        </div>
      </div>
    </div>
  );
}
