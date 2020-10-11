import React from 'react';
import { useSelector } from 'dva';
import styles from './index.less';
import LeftChart from './LeftChart';

const cardList = [
  {
    title: '今日人流量',
    color: '#4751f1',
  },
  {
    title: '常住人口',
    color: '#347dff',
  },
  {
    title: '流动人口',
    color: '#38ab50',
  },
  {
    title: '重点人员',
    color: '#c31737',
  },
  {
    title: '今日车流量',
    color: '#e79a1b',
  },
];

export default function() {
  const { quantity } = useSelector(({ situation }) => situation);
  return (
    <div className={styles.leftWrapper}>
      {cardList.map((item, i) => (
        <div key={item.title} className={styles.card}>
          <div className={styles.title}>{item.title}</div>
          <div className={styles.content}>
            <LeftChart title={item.title} color={item.color} />
            <div className={styles.number}>{quantity[i] || 0}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
