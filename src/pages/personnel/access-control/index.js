import React, { useState, useEffect } from 'react';
import { Tree } from 'antd';
import { getTreeData } from '@/services/personnel/access-control';
import Main from './Main';
import styles from './index.less';

export default function() {
  const [treeData, setTreeData] = useState([]);

  const [selectedKey, setSelectedKey] = useState('');

  /**
   * 获取treeData
   */
  useEffect(() => {
    const getData = async () => {
      const data = await getTreeData();
      setTreeData(data);
    };
    getData();
  }, []);

  /**
   * tree选择节点事件
   * @param {String} key
   */
  const handleSelect = ([key = '']) => {
    setSelectedKey(key);
  };

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>通行控制</h1>
      <div className={styles.container}>
        <div className={styles.menu}>
          <Tree treeData={treeData} onSelect={handleSelect} />
        </div>
        <div className={styles.main}>
          <Main id={selectedKey} />
        </div>
      </div>
    </div>
  );
}
