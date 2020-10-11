import React from 'react';
import styles from './index.less';

export default function() {
  return (
    <div className={styles.cornerMark}>
      <div className={styles.cornerMarkTop}>
        <div className={styles.circular} />
      </div>
      <div className={styles.cornerMarkBottom}>
        <div className={styles.circular} />
      </div>
      <div className={styles.cornerMarkLine1} />
      <div className={styles.cornerMarkLine2} />
    </div>
  );
}
