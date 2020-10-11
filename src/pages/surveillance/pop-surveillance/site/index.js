import React, { useState, useEffect, useCallback } from 'react';
import { Input, Button, Popconfirm, message } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { getPopCtrlList, deletePopCtrlTask } from '@/services/surveillance';
import cx from 'classnames';
import RightContent from './RightContent';
import styles from './index.less';

export default function({ history }) {
  const [popCtrlList, setPopCtrlList] = useState([]);
  const [siteId, setSiteId] = useState(null);
  const [keyWord, setKeyWord] = useState('');

  const handleClosePage = () => {
    const { goBack } = history;
    if (goBack) goBack();
  };

  const getPopCtrlData = useCallback(async () => {
    const res = await getPopCtrlList();
    if (res) {
      setPopCtrlList(res);
    }
  }, [])

  useEffect(() => {
    getPopCtrlData()
  }, [getPopCtrlData]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.closeBtn} onClick={handleClosePage}>
        <CloseOutlined />
      </div>
      <div className={styles.leftList}>
        <Input.Search
          placeholder="输入搜索内容"
          enterButton="查询"
          onSearch={(value) => setKeyWord(value)}
        />
        <div className={styles.leftListContent}>
          {popCtrlList
            .filter((el) => el.carOwner.indexOf(keyWord) !== -1)
            .map((item, index) => (
              <div
                key={index}
                className={cx(styles.listItem, siteId === item.id ? styles.listItemActive : null)}
                onClick={() => setSiteId(item.id)}
              >
                <span>{item.carOwner}</span>
                <Popconfirm
                  title="确认移除当前布防任务?"
                  onConfirm={() => {
                    deletePopCtrlTask({ bkrwId: item.id }).then((res) => {
                      if(res) {
                        message.success('删除成功')
                        getPopCtrlData();
                        setSiteId(null);
                      }
                    })
                  }}
                  okText="是"
                  cancelText="否"
                >
                  <span>删除</span>
                </Popconfirm>
              </div>
            ))}
          <Button type="primary" block onClick={() => setSiteId(null)}>
            添加
          </Button>
        </div>
      </div>
      <RightContent siteId={siteId} getPopCtrlData={getPopCtrlData} handleClosePage={handleClosePage} />
    </div>
  );
}
