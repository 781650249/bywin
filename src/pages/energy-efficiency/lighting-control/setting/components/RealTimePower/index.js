import React, { useState, useEffect } from 'react';
import styles from './index.less';

export default function({ value = 0, runTime = '' }) {
  const [angle, setAngle] = useState(-130);
  useEffect(() => {
    setAngle(0 - 130);
  }, [value]);

  return (
    <div className={styles.container}>
      <div className={styles.pointer} style={{ transform: `rotate(${angle}deg)` }} />
      <div className={styles.runTime}>{runTime}</div>
      <div className={styles.value}>
        {value}
        <span>kw</span>
      </div>
    </div>
  );
}
