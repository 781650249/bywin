import React from 'react';
import cx from 'classnames';
import boxBg from '@/assets/home/intelligent-warning-box-bg.png';
import styles from './index.less';

export default React.memo(function IntelligentWarning({ eventList = [], targetList = [] }) {
  return (
    <div className={styles.container}>
      <div className="title-1">
        <span>智能预警</span>
      </div>
      <div className={styles.count}>
        <div className={styles.countItems}>
          {eventList.slice(0, 4).map((item, i) => (
            <div className={styles.countItem} key={i}>
              <div className={cx(styles.countBox, styles[`countBox${i + 1}`])}>
                <div className={styles.countBoxLine}>
                  <div className={styles.countBoxLine1} />
                  <div className={styles.countBoxLine2} />
                </div>
                <img src={boxBg} alt="" className={styles.countBoxBg} />
                <div className={styles.countNumber}>{item.count}</div>
              </div>
              <div className={styles.countText}>{item.name}</div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.items}>
        {targetList.slice(0, 4).map((item, i) => (
          <div className={styles.item} key={i}>
            <div className={styles.card}>
              <div className={styles.cardAvatar}>
                <img src={item.tpurl} alt="" />
              </div>
              <div className={styles.cardContent}>
                <div className={cx(styles.cardText, 'ellipsis')}>{item.address}</div>
                <div>
                  <div className={styles.cardTag}>{item.yjlx}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});
