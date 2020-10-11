import React, { useEffect } from 'react';
import { useSelector } from 'dva';
import { Card } from '@/components';
import styles from './index.less';

export default function ListSection() {
  const { passList } = useSelector(({ videoArchives }) => videoArchives);
  const { queryParams } = useSelector(({ videoArchives }) => videoArchives);
  const { popOrCar } = queryParams;
  useEffect(() => {}, []);
  return (
    <div className={styles.list}>
      {passList &&
        passList.map((item, index) => (
          <Card
            key={index}
            className="mr-16 mb-16"
            avatar={item.cjtobjectUrl || ''}
            link={popOrCar === 'pop' ? `/video-archives/${item.pid}` : `/video-archives/vehicle-file?licensePlate=${item.pid}`}
            title={item.name || ''}
            describe={item.wzbjsj}
            tags={[item.type === '1' ? `常住${popOrCar === 'pop' ? '人员' : '车辆'}` : `流动${popOrCar === 'pop' ? '人员' : '车辆'}`]}
          />
        ))}
      <div className={styles.hiddenCard} />
      <div className={styles.hiddenCard} />
      <div className={styles.hiddenCard} />
      <div className={styles.hiddenCard} />
      <div className={styles.hiddenCard} />
    </div>
  );
}
