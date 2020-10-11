import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'dva';
import { Spin } from 'antd';
import moment from 'moment';
import { UserOutlined, CarOutlined } from '@ant-design/icons';
import cx from 'classnames';
import { Card, Viewer } from '@/components';
import styles from './index.less';

const tabs = [
  {
    key: 'person',
    title: '人',
    icon: <UserOutlined />,
  },
  {
    key: 'vehicle',
    title: '车',
    icon: <CarOutlined />,
  },
];

export default function() {
  const listRef = useRef(null);
  const [tabKey, setTabKey] = useState('person');
  // const [list, setList] = useState(Array.from({ length: 52 }));
  // const [page, setPage] = useState(1);
  const [timer, setTimer] = useState(false);

  const [image, setImage] = useState();

  const dispatch = useDispatch();
  const loading = useSelector((state) => {
    const { effects } = state.loading;
    return (
      effects['videoModal/getPersonPassedBy'] || effects['videoModal/getVehiclePassedBy'] || false
    );
  });
  const { selectedCameraKeys, allList } = useSelector(({ videoModal }) => videoModal);
  const list = allList[tabKey];
  const { page, pageSize, total, data } = list;
  const pageNumber = Math.ceil(total / pageSize);

  const setState = (params = {}, type = 'videoModal/setState') => {
    dispatch({
      type,
      payload: { ...params },
    });
  };

  useEffect(() => {
    function getList() {
      let type = 'videoModal/getVehiclePassedBy';
      if (tabKey === 'person') {
        type = 'videoModal/getPersonPassedBy';
      }
      dispatch({
        type,
        payload: {
          page: list.page,
          size: list.pageSize,
          sxtids: selectedCameraKeys,
          beginTime: moment()
            .subtract(5, 'm')
            .format('YYYY-MM-DD HH:mm:ss'),
          endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
          findType: '',
        },
      });
    }
    getList();
    const interval = setInterval(() => {
      getList();
    }, 1000 * 5);
    return () => {
      clearInterval(interval);
    };
  }, [dispatch, selectedCameraKeys, tabKey, list.page, list.pageSize]);

  /**
   * 列表横向滚动
   * @param {Event} e
   */
  const handleWheel = (e) => {
    if (timer) return;
    setTimer(true);
    const { current } = listRef;
    const { scrollWidth, scrollLeft, offsetWidth } = current;
    const maxScrollLeft = scrollWidth - offsetWidth;
    const range = 888;
    let nextScrollLeft = scrollLeft;
    // 滚轮向下滚动
    if (e.deltaY > 0) {
      if (scrollLeft + range >= maxScrollLeft - 1) {
        nextScrollLeft = maxScrollLeft;
      } else {
        nextScrollLeft = scrollLeft + range;
      }
    }
    // 滚轮向上滚动
    if (e.deltaY < 0) {
      if (nextScrollLeft <= 0) {
        nextScrollLeft = 0;
      } else {
        nextScrollLeft = scrollLeft - range;
      }
    }
    current.scrollLeft = nextScrollLeft;
    setTimeout(() => {
      setTimer(false);
    }, 450);
  };

  /**
   * page变更事件
   * @param {Event} e
   */
  const handlePageChange = (e) => {
    let nextPage = 1;
    switch (e.target.getAttribute('data-key')) {
      case 'next':
        if (page < pageNumber) {
          nextPage = page + 1;
        }
        break;
      case 'perv':
        if (page > 1) {
          nextPage = page - 1;
        }
        break;
      default:
        break;
    }
    setState({
      allList: {
        ...allList,
        [tabKey]: {
          ...list,
          page: nextPage,
        },
      },
    });
  };

  return (
    <Spin spinning={loading}>
      <div className={styles.tabs}>
        <div className={styles.tabsNav}>
          {tabs.map((tab) => (
            <div
              key={tab.key}
              className={cx(styles.tabsTab, {
                [styles.active]: tabKey === tab.key,
              })}
              onClick={() => setTabKey(tab.key)}
            >
              {tab.icon}
              <br />
              {tab.title}
            </div>
          ))}
        </div>
        <div className={styles.tabsContent} onWheel={handleWheel} ref={listRef}>
          {data.map((item, i) => (
            <Card
              className="mr-16"
              key={i}
              avatar={item.cjtobjectUrl}
              link={`/video-archives/${item.id}`}
              title={item.address}
              describe={item.wzbjsj}
              tags={[item.peopleType]}
              onViewer={() => setImage(item.cjtobjectUrl)}
            />
          ))}
        </div>
        <Viewer image={image} onClose={() => setImage('')} />
        <div className={styles.tabsAction}>
          <div
            className={cx('f-arrow-next', {
              'f-arrow-primary': page < pageNumber,
            })}
            style={{ fontSize: 40 }}
            data-key="next"
            onClick={handlePageChange}
          />
          <div>{`${pageNumber === 0 ? 0 : page}/${pageNumber}`}</div>
          <div
            className={cx('f-arrow-prev', {
              'f-arrow-primary': page > 1,
            })}
            style={{ fontSize: 40 }}
            data-key="prev"
            onClick={handlePageChange}
          />
        </div>
      </div>
    </Spin>
  );
}
