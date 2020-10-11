import React, { useState, useRef } from 'react';
import { useSelector } from 'dva';
import { Avatar, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Viewer } from '@/components';
import cx from 'classnames';
import styles from './index.less';

export default function() {
  const [timer, setTimer] = useState(false);
  const [fullImage, setFullImage] = useState('');
  const [relativePosition, setRelativePosition] = useState({});
  const [imgId, setImgId] = useState(0);
  const listRef = useRef(null);

  const { track } = useSelector(({ vehicleFile }) => vehicleFile);

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

  /**
   * 查看大图
   * @param {Object} item
   */
  const viewFullImage = (item) => {
    setImgId(item.id);
    setFullImage(item.fullUrl);
    setRelativePosition({
      startX: item.leftTop.x,
      startY: item.leftTop.y,
      endX: item.rightBottom.x,
      endY: item.rightBottom.y,
    });
  };

  /**
   * 关闭大图窗口
   */
  const onClose = () => {
    setFullImage('');
    setRelativePosition({});
  };

  /**
   * 上一张图
   */
  const onPrev = () => {
    let num = 0;
    track.forEach((item, index) => {
      if (item.id === imgId) {
        num = index;
      }
    });
    if (track[num - 1]) {
      viewFullImage(track[num - 1]);
    } else {
      message.warn('没有图片啦!');
    }
  };

  /**
   * 下一张图
   */
  const onNext = () => {
    let num = 0;
    track.forEach((item, index) => {
      if (item.id === imgId) {
        num = index;
      }
    });
    if (track[num + 1]) {
      viewFullImage(track[num + 1]);
    } else {
      message.warn('没有图片啦!');
    }
  };

  return (
    <div className={styles.footer}>
      <h2 className={styles.title}>轨迹详情</h2>
      <div className={styles.slick}>
        <div className={cx('f-arrow-prev', styles.slickPrev)} onClick={handlePrevClick} />
        <div className={cx('f-arrow-next', styles.slickNext)} onClick={handleNextClick} />
        <div className={styles.slickList} ref={listRef}>
          <div className={styles.slickTrack}>
            {track.map((item) => (
              <div className={styles.slickSlide} key={item.id}>
                <Avatar
                  className={styles.avatar}
                  src={item.imageUrl}
                  onClick={() => viewFullImage(item)}
                  shape="square"
                  size={60}
                  icon={<UserOutlined />}
                />
                <div className={styles.content}>
                  <p className="ellipsis" title="金牛山互联网产业园">
                    车牌：{item.cph}
                  </p>
                  <p className="ellipsis">时间：{item.time}</p>
                </div>
              </div>
            ))}

            {/* <div className={styles.slickSlide}>
              <div className={cx(styles.circle, styles.circleGreen)}>上班</div>
              <div className={styles.content}>
                <p className="ellipsis" title="金牛山互联网产业园">
                  地点：金牛山互联网产业园
                </p>
                <p className="ellipsis">频率：24</p>
              </div>
            </div> */}
            <Viewer
              switching
              image={fullImage}
              onClose={onClose}
              onPrev={onPrev}
              onNext={onNext}
              relativePositions={[relativePosition]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
