import React, { useEffect, useRef } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Avatar } from 'antd';
import { PictureOutlined } from '@ant-design/icons';
import cx from 'classnames';
import styles from './index.less';

const sexCn = { 
  '1': '男',
  '2': '女'
}

function Carousel(props) {
  const { members } = props;
  const recRef = useRef(null);

  useEffect(() => {}, []);

  const onScoll = (type) => {
    const { current } = recRef;
    const { scrollWidth, scrollLeft, offsetWidth } = current;
    const maxScrollLeft = scrollWidth - offsetWidth;
    const range = offsetWidth - 281;
    let nextScrollLeft = scrollLeft;
    if (type === 'next') {
      if (scrollLeft + range >= maxScrollLeft - 1) {
        nextScrollLeft = maxScrollLeft;
      } else {
        nextScrollLeft = scrollLeft + range;
      }
    }

    if (type === 'pref') {
      if (nextScrollLeft <= 0) {
        nextScrollLeft = 0;
      } else {
        nextScrollLeft = scrollLeft - range;
      }
    }
    current.scrollLeft = nextScrollLeft;
  };

  return (
    <div className={styles.carousel}>
      <div className={cx('f-arrow-prev', styles.pref)} onClick={() => onScoll('pref')} />
      {/* <div className={styles.pref} >1</div> */}
      <div className={styles.imgContain} ref={recRef}>
        {members &&
          members.map((item, index) => (
            <div className={styles.itemCard} key={index} onClick={() => router.push(`/discover/${item.pid}`)}>
              <div className={styles.picture}>
                <Avatar
                  src={item.cjtobjectUrl || ''}
                  shape="square"
                  size={92}
                  icon={<PictureOutlined />}
                />
              </div>
              <div className={styles.text}>
                <p className={styles.firstRow}>
                  <span>{item.name || ''}</span>
                  <span>{sexCn[item.sex]}</span>
                  <span>{item.age || ''}</span>
                </p>
                <p style={{ color: '#373D41', marginBottom: 18 }}>{item.communityName || ''}</p>
                <div className={cx('f-tag', 'f-tag-primary')}>{item.peopleType || ''}</div>
              </div>
            </div>
          ))}
      </div>
      <div className={cx('f-arrow-next', styles.next)} onClick={() => onScoll('next')} />
    </div>
  );
}

export default connect()(Carousel);
