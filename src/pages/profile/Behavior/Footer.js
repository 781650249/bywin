import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'dva';
import { Avatar, message, Popover } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Viewer } from '@/components';
import cx from 'classnames';
import styles from './index.less';

export default function() {
  const dispatch = useDispatch();
  const [timer, setTimer] = useState(false);
  const [fullImage, setFullImage] = useState('');
  const [relativePosition, setRelativePosition] = useState({});
  const [imgId, setImgId] = useState(0);
  const listRef = useRef(null);
  const childRef = useRef(null);

  const { allBehavior, behavior } = useSelector(({ profile }) => profile);

  /**
   * 上一页
   */
  const handlePrevClick = (type) => {
    if (timer) return;
    setTimer(true);
    const { current } = type === 'child' ? childRef : listRef;
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
  const handleNextClick = (type) => {
    if (timer) return;
    setTimer(true);
    const { current } = type === 'child' ? childRef : listRef;
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
    behavior.forEach((item, index) => {
      if (item.id === imgId) {
        num = index;
      }
    });
    if (behavior[num - 1]) {
      viewFullImage(behavior[num - 1]);
    } else {
      message.warn('没有图片啦!');
    }
  };

  /**
   * 下一张图
   */
  const onNext = () => {
    let num = 0;
    behavior.forEach((item, index) => {
      if (item.id === imgId) {
        num = index;
      }
    });
    if (behavior[num + 1]) {
      viewFullImage(behavior[num + 1]);
    } else {
      message.warn('没有图片啦!');
    }
  };

  const changePopover = (values) => {
    if(Array.isArray(behavior) && behavior.length === 0) {
      dispatch({
        type: 'profile/setState',
        payload: {
          behavior: [...values],
        },
      })
    }else {
      dispatch({
        type: 'profile/setState',
        payload: {
          behavior: behavior[0].sxtid === values[0].sxtid ? [] : [...values],
        },
      })
    }
  }

  useEffect(() => () => {
    dispatch({
      type: 'profile/setState',
      payload: {
        behavior: [],
      },
    })

  }, [dispatch])

  return (
    <div className={styles.footer}>
      {/* <h2 className={styles.title}>行为详情</h2> */}
      <div className={styles.slick}>
        <div className={cx('f-arrow-prev', styles.slickPrev)} onClick={() => handlePrevClick('parent')} />
        <div className={cx('f-arrow-next', styles.slickNext)} onClick={() => handleNextClick('parent')} />
        <div className={styles.slickList} ref={listRef}>
          <div className={styles.slickTrack}>
            {allBehavior.map((item, index) => (
              <Popover
                content={
                  <div className={styles.slick}>
                    <div
                      className={cx('f-arrow-prev', styles.slickPrev)}
                      onClick={() => handlePrevClick('child')}
                    />
                    <div
                      className={cx('f-arrow-next', styles.slickNext)}
                      onClick={() => handleNextClick('child')}
                    />
                    <div className={styles.slickList} ref={childRef}>
                      <div className={styles.slickTrack}>
                        {behavior.map((child, childIndex) => (
                          <div className={styles.slickSlide} key={childIndex}>
                            <Avatar
                              className={styles.avatar}
                              src={child.imageUrl}
                              onClick={() => viewFullImage(child)}
                              shape="square"
                              size={60}
                              icon={<UserOutlined />}
                            />
                            <div className={styles.content}>
                              {/* <p className="ellipsis" title={child.address}>
                                地点：{child.address}
                              </p> */}
                              <p className="ellipsis">时间：{child.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                }
                getPopupContainer={(el) => el.parentNode.parentNode.parentNode.parentNode}
                key={index}
                trigger="click"
                visible={behavior.length > 0 && behavior[0].sxtid === item.sxtid}
              >
                <div className={styles.slickSlide} key={index}  onClick={() => changePopover(item.modelColleaguesList)}>
                  <Avatar
                    className={styles.avatar}
                    src={item.imageUrl}
                    // onClick={() => viewFullImage(item)}
                    shape="square"
                    size={60}
                    icon={<UserOutlined />}
                  />
                  <div className={styles.content}>
                    <p className="ellipsis" title={item.address}>
                      出现次数：{item.cxcs}
                    </p>
                    <p className="ellipsis" title={item.address}>
                      出现地点：{item.address}
                    </p>
                    <p className="ellipsis">最新时间：{item.time}</p>
                  </div>
                </div>
              </Popover>
            ))}
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
