import React, { useState, useEffect, useCallback } from 'react';
import router from 'umi/router';
import { useSelector } from 'dva';
import { Input, Pagination, Avatar } from 'antd';
import Icon, { UserOutlined } from '@ant-design/icons';
import { getCarWarnList } from '@/services/surveillance';
import { InWebSocket } from '@/components';
import { Card } from '../components';
import Statistics from './Statistics';
import styles from './index.less';

const warnSvg = () => (
  <svg width="1em" height="1em" viewBox="0 0 1024 1024" fill="currentColor">
    <path
      d="M175.726 934.787v-316.26c0-189.18 153.404-342.612 342.774-342.612s342.775 153.433 342.775 342.612v316.26h117.012c24.3 0 44 19.7 44 44s-19.7 44-44 44H44.747c-24.301 0-44-19.7-44-44s19.699-44 44-44h130.98z m367.588-520.804L374.237 692.332h135.221l-33.855 208.762L644.68 622.745H509.457l33.856-208.762h0.001z m259.29-305.76c15.875 9.237 21.299 29.622 12.156 45.488l-60.778 105.636-57.464-33.238 60.78-105.636c9.04-15.865 29.333-21.287 45.106-12.25h0.2zM518.4 30c19.892 0 35.966 14.962 35.966 33.539v119.693h-71.931V63.439C482.434 44.963 498.508 30 518.4 30h-0.001z m-284.003 78.223c15.773-9.138 36.065-3.716 45.208 12.05 0 0 0 0.1 0.1 0.1l60.78 105.636-57.465 33.237-60.78-105.636c-9.14-15.866-3.716-36.15 12.156-45.387h0.001zM26.44 316.985c9.041-15.867 29.334-21.39 45.208-12.252 0 0 0.1 0 0.1 0.101l105.283 61.052-33.152 57.638L38.595 362.37c-15.872-9.137-21.298-29.522-12.155-45.387z m984.12 0c9.143 15.864 3.717 36.249-12.155 45.486L893.12 423.423l-33.152-57.637 105.283-61.053c15.773-9.137 36.065-3.715 45.208 12.05 0 0.1 0.1 0.1 0.1 0.2v0.002z"
      p-id="6965"
      fill="#ffffff"
    />
  </svg>
);

export default function() {
  const { account } = useSelector((state) => state.auth);
  const [warnList, setWarnList] = useState({ data: [], total: 0 });
  const [newWarnData, setNewWarnData] = useState([]); // websocket推送过来的
  const [isShowWarn, setIsShowWarn] = useState(false);
  const [carNumber, setCarNumber] = useState('');
  const [page, setPage] = useState(1);

  const getCarWarnData = useCallback(async () => {
    const res = await getCarWarnList({ carNumber, page, size: 10 });
    if (res.rows) {
      setWarnList({ data: res.rows, total: res.total });
    }
  }, [page, carNumber]);

  useEffect(() => {
    getCarWarnData();
  }, [getCarWarnData]);

  const onNewData = (data) => {
    setIsShowWarn(true);
    setNewWarnData([...data]);
    setTimeout(() => {
      setIsShowWarn(false);
      getCarWarnData();
    }, 6000);
  };

  return (
    <div className={styles.wrapper}>
      <InWebSocket type={['car']} suffix={account} onNewData={onNewData} />
      <div className={styles.containner}>
        <div className={styles.leftList}>
          <div className={styles.leftListTitle}>预警事件</div>
          <div className={styles.leftListSearch}>
            {/* <Input placeholder="搜索内容" prefix={<SearchOutlined />} /> */}
            <Input.Search placeholder="搜索内容" onSearch={(value) => setCarNumber(value)} />
          </div>
          <div className={styles.leftListContent}>
            {warnList.data.map((item, index) => (
              <Card
                key={index}
                src={item.storageUrl1}
                className={styles.cardItem}
                onClick={() =>
                  router.push(
                    `/car-surveillance/warn-detail?dispositionId=${item.dispositionId}&motorVehicleId=${item.motorVehicleId}&resourceId=${item.resourceId}&plateNo=${item.plateNo}`,
                  )
                }
              >
                <div className={styles.cardItemFirstRow}>
                  <span>{item.plateNo}</span>
                  <div className={styles.messageBtn} style={{ display: item.sfyd ? 'none' : null }}>
                    NEW
                  </div>
                </div>
                <div className={styles.cardItemPlace}>时间：{item.triggerTime}</div>
                <div className={styles.cardItemPlace}>位置：{item.nameOfPassRoad}</div>
              </Card>
            ))}
          </div>
          <div className={styles.footerPaging}>
            <Pagination current={page} size="small" total={warnList.total} onChange={setPage} />
          </div>
        </div>
        <div className={styles.rightBar}>
          <div className={styles.rightBarContent}>
            <Statistics isShowWarn={isShowWarn} />
            <div className={styles.radarBox}>
              <div className={styles.radarBoxRadar} />
              <div className={styles.pointWraper}>
                {[...Array(5).keys()].map((i) => (
                  <div key={i} />
                ))}
                {isShowWarn &&
                  newWarnData.map((item, index) => (
                    <div key={index}>
                      <div>
                        <div className={styles.pushCardTitle}>
                          <Icon component={warnSvg} />
                          预警信息
                        </div>
                        <div className={styles.pushCardImg}>
                          <Avatar
                            style={{ background: 'transparent' }}
                            src={item.storageUrl1}
                            shape="square"
                            size={64}
                            icon={<UserOutlined />}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
