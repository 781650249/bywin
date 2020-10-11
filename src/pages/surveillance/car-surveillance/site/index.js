import React from 'react';
import { CloseOutlined } from '@ant-design/icons';
import RightContent from './RightContent';
import styles from './index.less';

export default function({ history }) {

  const handleClosePage = () => {
    const { goBack } = history;
    if (goBack) goBack();
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.closeBtn} onClick={handleClosePage}><CloseOutlined /></div>
      <RightContent />
    </div>
  );
}
