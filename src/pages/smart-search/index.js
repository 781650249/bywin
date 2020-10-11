import React, { useEffect } from 'react';
import { Input, Radio, Divider } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useDispatch } from 'dva';
import styles from './index.less';

export default function() {
  const dispatch = useDispatch();
  useEffect(() => {}, [dispatch]);
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div>
          <div className={styles.types}>
            <Radio.Group defaultValue="a" size="large">
              <Radio.Button value="a">全部</Radio.Button>
              <Radio.Button value="b">人员</Radio.Button>
              <Radio.Button value="c">车辆</Radio.Button>
              <Radio.Button value="d">小区</Radio.Button>
              <Radio.Button value="e">设备</Radio.Button>
            </Radio.Group>
          </div>
          <Input.Search
            enterButton={
              <div>
                <SearchOutlined /> 搜索
              </div>
            }
            size="large"
            style={{ width: 600 }}
          />
          <div className={styles.history}>历史查看：</div>
        </div>
      </div>
      <Divider />
      <div className={styles.content}>123456</div>
    </div>
  );
}
