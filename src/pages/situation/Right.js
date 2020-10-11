import React from 'react';
import { useSelector } from 'dva';
import { CaretRightOutlined } from '@ant-design/icons';
import router from 'umi/router';
import styles from './index.less';

export default function() {
  const { community, careTarget, behavior, organization } = useSelector(
    ({ situation }) => situation,
  );
  return (
    <div className={styles.rightWrapper}>
      <div className={styles.card}>
        <div className={styles.title}>小区统计</div>
        <div className={styles.content}>
          {community.map((item, i) => (
            <div className={styles.box} key={i}>
              <div className={styles.boxIcon}>
                <img src={item.labelImage} alt="" />
              </div>
              <div className={styles.boxInfo}>
                <div>{item.count}</div>
                <div>{item.name}</div>
              </div>
            </div>
          ))}
          <div className={styles.boxFill} />
          <div className={styles.boxFill} />
          <div className={styles.boxFill} />
        </div>
        <div className={styles.action}>
          详情
          <CaretRightOutlined />
        </div>
      </div>
      <div className={styles.card}>
        <div className={styles.title}>动向管控</div>
        <div className={styles.content}>
          {careTarget.map((item, i) => (
            <div className={styles.box} key={i}>
              <div className={styles.boxIcon}>
                <img src={item.labelImage} alt="" />
              </div>
              <div className={styles.boxInfo}>
                <div>{item.count}</div>
                <div>{item.name}</div>
              </div>
            </div>
          ))}
          <div className={styles.boxFill} />
          <div className={styles.boxFill} />
          <div className={styles.boxFill} />
        </div>
        <div
          className={styles.action}
          onClick={() => router.push('/person-manage?current=careTarget')}
        >
          详情
          <CaretRightOutlined />
        </div>
      </div>
      <div className={styles.card}>
        <div className={styles.title}>行为预警</div>
        <div className={styles.content}>
          {behavior.map((item, i) => (
            <div className={styles.box} key={i}>
              <div className={styles.boxIcon}>
                <img src={item.labelImage} alt="" />
              </div>
              <div className={styles.boxInfo}>
                <div>{item.count}</div>
                <div>{item.name}</div>
              </div>
            </div>
          ))}
          <div className={styles.boxFill} />
          <div className={styles.boxFill} />
          <div className={styles.boxFill} />
        </div>
        <div className={styles.action} onClick={() => router.push('/event-hubs')}>
          详情
          <CaretRightOutlined />
        </div>
      </div>
      <div className={styles.card}>
        <div className={styles.title}>关系发现</div>
        <div className={styles.content}>
          {organization.map((item, i) => (
            <div className={styles.box} key={i}>
              <div className={styles.boxIcon}>
                <img src={item.labelImage} alt="" />
              </div>
              <div className={styles.boxInfo}>
                <div>{item.count}</div>
                <div>{item.name}</div>
              </div>
            </div>
          ))}
          <div className={styles.boxFill} />
          <div className={styles.boxFill} />
          <div className={styles.boxFill} />
        </div>
        <div className={styles.action} onClick={() => router.push('/discover')}>
          详情
          <CaretRightOutlined />
        </div>
      </div>
    </div>
  );
}
