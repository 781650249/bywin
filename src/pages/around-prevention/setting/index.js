import React, { useState, useEffect } from 'react';
import { Row, Col, Tree } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import { Link } from 'umi';
import {
  getDeviceTree,
  // getPrewarningEventConfig,
} from '@/services/around-prevention';
import CameraContent from './CameraContent';
import InfraredContent from './InfraredContent';
import styles from './index.less';

export default function() {
  const [treeData, setTreeData] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState('');
  const [selectedTitle, setSelectedTitle] = useState('');
  const [contentProps, setContentProps] = useState({ deviceId: '', deviceType: '' });

  useEffect(() => {
    const getTreeData = async () => {
      const data = await getDeviceTree();
      setTreeData(data);
    };
    getTreeData();
  }, []);

  const handleTreeSelect = async (keys, { selected, node }) => {
    if (selected) {
      setSelectedKeys(keys);
      setSelectedTitle(node.title);
      const [selectedKey] = keys;
      const [deviceType, deviceId] = selectedKey.split('&');
      setContentProps({ deviceId, deviceType });
    } else {
      setSelectedKeys([]);
      setSelectedTitle('');
    }
  };

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>预警设置</h2>
      <Link to="/around-prevention">
        <div className={styles.close}>
          <CloseOutlined />
        </div>
      </Link>
      <Row style={{ flex: 'auto', height: 'calc(100% - 48px)' }}>
        <Col flex="240px" className={classNames(styles.treeContainer, 'mr-16')}>
          {treeData.length > 0 && (
            <Tree
              treeData={treeData}
              defaultExpandedKeys={treeData.map((item) => item.key)}
              selectedKeys={selectedKeys}
              onSelect={handleTreeSelect}
            />
          )}
        </Col>
        <Col flex="auto" style={{ height: '100%' }}>
          <h3 className={styles.title}>{selectedTitle}</h3>
          <CameraContent {...contentProps} />
          <InfraredContent {...contentProps} />
        </Col>
      </Row>
    </div>
  );
}
