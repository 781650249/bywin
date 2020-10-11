import React from 'react';
import Arrow from './Arrow';
import Items from './Items';
import CornerMark from './CornerMark';
import LightSpot from './LightSpot';
import styles from './index.less';

export default React.memo(function Header({ headerItems = [] }) {
  return (
    <div className={styles.header}>
      {headerItems.map((item, key) => (
        <div className={styles.headerItem} key={key}>
          <Arrow />
          <Items />
          <CornerMark />
          <LightSpot />
          <div className={styles.headerItemText}>{item.name}</div>
          <div className={styles.headerItemNumber}>{item.count}</div>
        </div>
      ))}
      <div className={styles.headerLeft} />
      <div className={styles.headerRight} />
    </div>
  );
});
