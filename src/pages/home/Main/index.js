import React from 'react';
import { useDispatch, useSelector } from 'dva';
import { Select } from 'antd';
import { router } from 'umi';
import cx from 'classnames';
import Header from './Header';
import styles from './index.less';

const { Option } = Select;

const menus = [
  {
    key: '/smart-search',
    text: '暂未开放', // 智能搜索
    icon: styles.smartSearch,
    disabled: true,
  },
  {
    key: '/relaTimeProtection',
    text: '综合安防',
    icon: styles.videoArchives,
  },
  {
    key: '/energy-efficiency-monitor',
    text: '能效管理',
    icon: styles.eventHubs,
  },
  {
    key: '/elevator',
    text: '智慧消防',
    icon: styles.searching,
  },
  {
    key: '/personnel/info',
    text: '人员管理',
    icon: styles.personManage,
  },
  {
    key: '/car-manager/info',
    text: '车辆管理',
    icon: styles.discover,
  },
  {
    key: '/community-manage',
    text: '社区画像',
    icon: styles.communityManage,
  },
];

export default React.memo(function Main({ headerItems = [] }) {
  const dispatch = useDispatch();
  const { communityInfo, communityList } = useSelector(({ global }) => global);

  function routerPush(path, bool) {
    if (bool === false) return;
    router.push(path);
  }

  function onSwitchCommunity(value) {
    dispatch({
      type: 'global/switchDataSource',
      payload: {
        id: value,
        isPush: 'true',
      },
      callback: () => {
        dispatch({ type: 'global/getCommunityInfo' });
      },
    });
  }

  return (
    <>
      <Header headerItems={headerItems} />
      <div className={styles.content}>
        <Select
          value={communityInfo.name || ''}
          style={{ width: 140 }}
          getPopupContainer={trigger => trigger.parentElement}
          onChange={(value) => onSwitchCommunity(value)}
        >
          {communityList.map((item) => (
            <Option value={item.communityId} key={item.communityId}>
              {item.communityName}
            </Option>
          ))}
        </Select>

        {menus.map((item, i) => (
          <div
            className={cx(styles.menu, item.icon, {
              [styles.usable]: !!item.key,
              [styles.disabled]: item.disabled,
            })}
            key={i}
          >
            <div className={styles.menuActive} />
            <div
              className={styles.menuTitle}
              onClick={() => routerPush(item.key, !!item.key && !item.disabled)}
            >
              {item.text}
            </div>
            <div className={styles.menuIcon} />
          </div>
        ))}
        <div className={cx(styles.menu, styles.equipmentCenter)}>
          <div className={styles.menuActive} />
          <div className={styles.menuTitle}>设备中心</div>
          <div className={styles.menuIcon} />
        </div>
        <div className={cx(styles.menu, styles.housingManage)}>
          <div className={styles.menuActive} />
          <div className={styles.menuTitle}>房屋管理</div>
          <div className={styles.menuIcon} />
        </div>
        <div className={cx(styles.menu, styles.vehicleManage)}>
          <div className={styles.menuActive} />
          <div className={styles.menuTitle}>车辆管理</div>
          <div className={styles.menuIcon} />
          <div className={cx(styles.carIcon, styles.carIconCenter)} />
          <div className={cx(styles.carIcon, styles.carIconLeft)} />
          <div className={cx(styles.carIcon, styles.carIconRight)} />
        </div>
        <div className={cx(styles.menu, styles.populationManage)}>
          <div className={styles.menuActive} />
          <div className={styles.menuTitle}>人口管理</div>
          <div className={styles.menuIcon} />
        </div>
        <div className={cx(styles.menu, styles.main)} />
        <div className={styles.car} />
        <div className={styles.person} style={{ top: '34%', left: '80%' }} />
        <div>
          <div className={cx(styles.person, styles.personLeft)} />
          <div className={cx(styles.person, styles.personLeft)} />
          <div className={cx(styles.person, styles.personLeft)} />
          <div className={cx(styles.person, styles.personLeft)} />
        </div>
        <div>
          <div className={cx(styles.person, styles.personRight)} />
          <div className={cx(styles.person, styles.personRight)} />
          <div className={cx(styles.person, styles.personRight)} />
        </div>
      </div>
    </>
  );
});
