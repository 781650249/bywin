import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'dva';
import RightContent from './RightContent';
import styles from './index.less';

export default function({ history, location }) {
  const dispatch = useDispatch();
  const [tabs, setTabs] = useState([
    // { name: '来登去销' },
    // { name: '布控人员' },
    { name: '人员聚集' },
    { name: '未带口罩' },
    { name: '高空抛物' },
    { name: '人员摔倒' },
    // { name: '打架斗殴' },
  ]);
  const eventValue = useSelector(({ eventList }) => eventList.eventValue);
  const statisticalList = useSelector(({ eventCount }) => eventCount.statisticalList);

  useEffect(() => {
    const { unDisposeList = {} } = statisticalList;
    setTabs([
      // { name: '来登去销', value: unDisposeList.ldqx },
      // { name: '布控人员', value: unDisposeList.keyPerson },
      { name: '人员聚集', value: unDisposeList.personGather },
      { name: '未带口罩', value: unDisposeList.noMask },
      { name: '高空抛物', value: unDisposeList.highTossAct },
      { name: '人员摔倒', value: unDisposeList.liedown },
      // { name: '打架斗殴', value: unDisposeList.brawl },
    ]);
  }, [statisticalList]);

  return (
    <div className={styles.tabs}>
      <div className={styles.tabsBar}>
        {tabs.map((item, index) => (
          <div
            key={index}
            onClick={() => {
              dispatch({
                type: 'eventList/setState',
                payload: { eventValue: item.name },
              });
            }}
          >
            <span className={eventValue === item.name ? styles.checkedStatus : null}>
              {item.name}
            </span>
            {eventValue !== item.name && (
              <span className={styles.notificationCount}>{item.value || 0}</span>
            )}
          </div>
        ))}
      </div>

      <div className={styles.content}>
        <RightContent history={history} location={location} />
      </div>
    </div>
  );
}
