import React from 'react';
import styles from './index.less';

export default function({ title = '', extra = null, children, ...props }) {
  return (
    <div className={styles.card} {...props}>
      <div className={styles.head}>
        {title}
        <div className={styles.extra}>{extra}</div>
      </div>
      <div className={styles.body}>{children}</div>
    </div>
  );
}
