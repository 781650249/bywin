import React from 'react';
import { Avatar } from 'antd';
import { PictureOutlined } from '@ant-design/icons';
import cx from 'classnames';
import styles from './index.less';

export default function({ className = null, src = '', children = null, onClick = () => {}}) {
  return (
    <div className={cx(styles.card, className)} onClick={onClick}>
      <Avatar
        src={src}
        shape="square"
        size={72}
        className={styles.cardAvatar}
        icon={<PictureOutlined />}
      />
      <div className={styles.cardInfo}>
        {children}
      </div>
    </div>
  );
}
