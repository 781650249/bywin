import React, { useRef, useEffect, useState } from 'react';
import { useSelector } from 'dva';
import { Avatar } from 'antd';
import router from 'umi/router';
import cx from 'classnames';
import { UserOutlined } from '@ant-design/icons';
import comExample from '@/assets/com-example.png'
import styles from './index.less';

export default function() {
  const listRef = useRef(null);
  const { communityList } = useSelector(({ communityManage }) => communityManage);
  const [timer, setTimer] = useState(false);

  /**
   * 上一页
   */
  const handlePrevClick = () => {
    if (timer) return;
    setTimer(true);
    const { current } = listRef;
    const { scrollLeft } = current;
    const range = 512 + 32;
    let nextScrollLeft = scrollLeft;

    if (nextScrollLeft <= 0) {
      nextScrollLeft = 0;
    } else {
      nextScrollLeft = scrollLeft - range;
    }
    current.scrollLeft = nextScrollLeft;
    setTimeout(() => {
      setTimer(false);
    }, 450);
  };

  /**
   * 下一页
   */
  const handleNextClick = () => {
    if (timer) return;
    setTimer(true);
    const { current } = listRef;
    const { scrollWidth, scrollLeft, offsetWidth } = current;
    const maxScrollLeft = scrollWidth - offsetWidth;
    const range = 512 + 32;
    let nextScrollLeft = scrollLeft;
    if (scrollLeft + range >= maxScrollLeft - 1) {
      nextScrollLeft = maxScrollLeft;
    } else {
      nextScrollLeft = scrollLeft + range;
    }
    current.scrollLeft = nextScrollLeft;
    setTimeout(() => {
      setTimer(false);
    }, 450);
  };

  useEffect(() => {}, []);

  return (
    <div className={styles.slick}>
      <div className={cx('f-arrow-prev', styles.slickPrev)} onClick={handlePrevClick} />
      <div className={cx('f-arrow-next', styles.slickNext)} onClick={handleNextClick} />
      <div className={styles.slickList} ref={listRef}>
        <div className={styles.slickTrack}>
          {Array.isArray(communityList) &&
            communityList.map((item, index) => (
              <div className={styles.slickSlide} key={index}>
                <Avatar
                  className={styles.avatar}
                  src={comExample} 
                  shape="square"
                  size={104}
                  icon={<UserOutlined />}
                  onClick={() => router.push(`/community-manage/${item.communityId}`)}
                />
                <div className={styles.content}>
                  <p className="ellipsis">{item.communityAddress}</p>
                  {/* <p className="ellipsis">总人数：228</p> */}
                  <p className="ellipsis">所 属：{item.communityName}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
