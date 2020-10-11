import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'dva';
import Link from 'umi/link';
import { Radio, DatePicker, Avatar, Pagination, message, Divider, Modal } from 'antd';
import { ClockCircleFilled, PictureOutlined, SettingFilled, CloseOutlined } from '@ant-design/icons';
import moment from 'moment';
import { Viewer } from '@/components';
import DisposeModal from './DisposeModal';
import styles from './index.less';

const { RangePicker } = DatePicker;

export default function({ location }) {
  const dispatch = useDispatch();
  const videoRef = useRef(null);
  const { eventValue, allEventList, allEventTotal, queryParams } = useSelector(
    ({ eventList }) => eventList,
  );
  const { handelStatus, startTime, endTime, page, quitStatus } = queryParams;
  const [largeImgUrl, setLargeImgUrl] = useState('');
  const [largeImgId, setLargeImgId] = useState('');
  const [relativePosition, setRelativePosition] = useState([]);
  const [isShowVideo, setIsShowVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const { Aliplayer } = window;

  useEffect(() => {
    dispatch({ type: 'eventList/getCommunityList' });
  }, [dispatch]);

  useEffect(() => {
    setTimeout(() => {
      if(isShowVideo) {
        videoRef.current = new Aliplayer({
          id: 'gkpw',
          source: videoUrl,
          "width": "100%",
          "height": "100%",
          "autoplay": true,
          "isLive": false,
          "rePlay": false,
          "playsinline": false,
          "preload": true,
          "controlBarVisibility": "hover",
          "useH5Prism": true,
          "skinLayout": [
            {
              "name": "bigPlayButton",
              "align": "blabs",
              "x": 30,
              "y": 80
            },
            {
              "name": "H5Loading",
              "align": "cc"
            },
            {
              "name": "infoDisplay"
            },
            {
              "name": "tooltip",
              "align": "blabs",
              "x": 0,
              "y": 56
            },
            {
              "name": "thumbnail"
            },
            {
              "name": "controlBar",
              "align": "blabs",
              "x": 0,
              "y": 0,
              "children": [
                {
                  "name": "progress",
                  "align": "blabs",
                  "x": 0,
                  "y": 44
                },
                {
                  "name": "playButton",
                  "align": "tl",
                  "x": 15,
                  "y": 12
                },
                {
                  "name": "timeDisplay",
                  "align": "tl",
                  "x": 10,
                  "y": 7
                },
                {
                  "name": "fullScreenButton",
                  "align": "tr",
                  "x": 10,
                  "y": 12
                }
              ]
            }
          ]
        }, (() => {}));
      }
    }, 200)
  }, [isShowVideo])

  const getEventList = (params) => {
    let type = '';
    if (eventValue === '来登去销') {
      type = 'eventList/getComeGoList';
    } else if (eventValue === '布控人员') {
      type = 'eventList/getZDRYList';
    } else if (eventValue === '人员聚集') {
      type = 'eventList/getPersonnelGatherList';
    } else if (eventValue === '未带口罩') {
      type = 'eventList/getUnmaskList';
    } else if (eventValue === '高空抛物') {
      type = 'eventList/getHighTossActList';
    } else if (eventValue === '人员摔倒') {
      type = 'eventList/getLiedownList';
    } else {
      return;
    }

    if(eventValue === '来登去销') {
      dispatch({
        type,
        payload: {
          page: 1,
          size: 20,
          startTime,
          endTime,
          type: handelStatus,
          tab: quitStatus,
          ...params,
        },
      });
    }else {
      dispatch({
        type,
        payload: {
          page: 1,
          size: 20,
          startTime,
          endTime,
          type: handelStatus,
          ...params,
        },
      });
    }

  };

  const setQueryParams = (params) => {
    dispatch({
      type: 'eventList/setState',
      payload: {
        queryParams: {
          ...queryParams,
          ...params,
        },
      },
    });
  };

  useEffect(() => {
    if(eventValue === '来登去销') {
      getEventList({ tab: quitStatus });
    }else {
      getEventList();
    }
    setQueryParams({ page: 1 });
  }, [eventValue, quitStatus, location.query]);

  /**
   * 根据处理状态
   */
  const changeHandelStatus = (e) => {
    setQueryParams({ handelStatus: e.target.value, page: 1 });
    getEventList({ type: e.target.value });
  };

  /**
   * 根据时间筛选
   */
  const timeChange = (_, dateString) => {
    setQueryParams({ page: 1, startTime: dateString[0], endTime: dateString[1] });
    getEventList({ startTime: dateString[0], endTime: dateString[1] });
  };

  const changePage = (current) => {
    setQueryParams({ page: current });
    getEventList({ page: current });
  };

  const onDispose = (pid) => {
    dispatch({
      type: 'eventList/setState',
      payload: {
        disposeVisible: true,
        openId: pid,
      },
    });
  };

  const onModify = (pid) => {
    dispatch({
      type: 'eventList/getPersonInfoByPid',
      payload: { pid },
    });
    dispatch({
      type: 'eventList/setState',
      payload: {
        disposeVisible: true,
        openId: pid,
      },
    });
  };

  const viewLargeImg = (record) => {
    setLargeImgUrl(record.ytUrl);
    setLargeImgId(record.id);
    setRelativePosition([{
      startX: record.zsjXzb,
      startY: record.zsjYzb,
      endX: record.yxjXzb,
      endY: record.yxjYzb,
    }])
  }

  /**
   * 原图上一张下一张
   */
  const onPrev = () => {
    let num = 0;
    allEventList.forEach((item, index) => {
      if (item.id === largeImgId) {
        num = index;
      }
    });
    if (allEventList[num - 1]) {
      viewLargeImg(allEventList[num - 1]);
    } else {
      message.warn('没有图片啦!');
    }
  };

  const onNext = () => {
    let num = 0;
    allEventList.forEach((item, index) => {
      if (item.id === largeImgId) {
        num = index;
      }
    });
    if (allEventList[num + 1]) {
      viewLargeImg(allEventList[num + 1])
    } else {
      message.warn('没有图片啦!');
    }
  };

  return (
    <>
      <div className={styles.searchBox}>
        {eventValue === '来登去销' ? (
          <div className={styles.rightBox}>
            <span
              onClick={() => {
                setQueryParams({ quitStatus: 'register', page: 1 });
              }}
              className={quitStatus === 'register' ? styles.checkedClass : styles.unCheckedClass}
            >
              来登
            </span>
            <Divider className={styles.divider} type="vertical" />
            <span
              onClick={() => {
                setQueryParams({ quitStatus: 'eliminate', page: 1 });
              }}
              className={quitStatus === 'eliminate' ? styles.checkedClass : styles.unCheckedClass}
            >
              去销
            </span>
          </div>
        ) : (
          <div />
        )}

        <div className={styles.leftBox}>
          <Radio.Group
            value={handelStatus}
            buttonStyle="solid"
            style={{ marginRight: 16 }}
            onChange={changeHandelStatus}
          >
            <Radio.Button value="unrecorded">待处理</Radio.Button>
            <Radio.Button value="record">已处理</Radio.Button>
            {/* <Radio.Button value="neglect">已忽略</Radio.Button> */}
          </Radio.Group>
          <div className={styles.timeBox}>
            <div className={styles.timeIcon}>
              <ClockCircleFilled />
            </div>
            <RangePicker
              style={{ width: 328 }}
              placeholder={['开始日期', '结束日期']}
              showTime={{ format: 'HH:mm:ss' }}
              format="YYYY-MM-DD HH:mm:ss"
              disabledDate={(current) => current && current >= moment().endOf('day')}
              onChange={timeChange}
              suffixIcon={null}
            />
          </div>
        </div>
      </div>

      <div className={styles.list}>
        {allEventList &&
          allEventList.map((item, index) => (
            <div className={styles.itemBox} key={index}>
              <div
                className={styles.addrAvatar}
                onClick={() => {
                  if(eventValue === '人员聚集' || eventValue === '未带口罩' || eventValue === '人员摔倒') {
                    viewLargeImg(item)
                  }else if(eventValue === '高空抛物') {
                    setIsShowVideo(true);
                    setVideoUrl(item.videoUrl);
                  }
                }
                }
              >
                <Avatar src={item.imgUrl} shape="square" size={92} icon={<PictureOutlined />} />
              </div>
              <div className={styles.text}>
                {eventValue === '来登去销' || eventValue === '布控人员' ? (
                  <Link
                    to={
                      eventValue === '布控人员'
                        ? `/event-hubs/${item.customId}?serviceType=keyPersonEvent`
                        : `/event-hubs/${item.id}`
                    }
                  >
                    <p>{item.address}</p>
                    <p>{item.name}</p>
                  </Link>
                ) : (
                  <div>
                    <p>{item.address}</p>
                    <p>{item.name}</p>
                  </div>
                )}
                <p>
                  <span className={styles.iconWrap}>
                    <ClockCircleFilled />
                  </span>
                  {item.time}
                </p>
                {handelStatus === 'unrecorded' && (
                  <div>
                    <span className={styles.iconWrap}>
                      <SettingFilled />
                    </span>
                    <span
                      className={styles.operatingBtn}
                      onClick={() => onDispose(item.id)}
                      href=""
                    >
                      处置
                    </span>
                    {/* <Divider type="vertical" />
                    <span className={styles.operatingBtn} href="">
                      忽略
                    </span> */}
                  </div>
                )}
                {handelStatus === 'record' && eventValue === '来登去销' && (
                  <div>
                    <span className={styles.iconWrap}>
                      <SettingFilled />
                    </span>
                    <span className={styles.operatingBtn} onClick={() => onModify(item.id)} href="">
                      修改
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        <div />
        <div />
        <div />
      </div>
      <div className={styles.pageBox}>
        <Pagination
          current={page}
          pageSize={20}
          total={allEventTotal}
          onChange={changePage}
          showSizeChanger={false}
        />
      </div>
      <Viewer
        switching
        image={largeImgUrl}
        onClose={() => {
          setLargeImgUrl('');
          setLargeImgId('');
          setRelativePosition([]);
        }}
        onNext={onNext}
        onPrev={onPrev}
        relativePositions={relativePosition}
      />
      <Modal
         width={800}
         bodyStyle={{ height: 600 }}
         visible={isShowVideo}
         closable={false}
         footer={null}
         destroyOnClose
         wrapClassName={styles.modelWrap}
      >
        <div
          className={styles.closeIcon}
          onClick={() => {
            videoRef.current = null;
            setIsShowVideo(false);
            setVideoUrl('');
          }}
        >
          <CloseOutlined />
        </div>
        <div ref={videoRef} id="gkpw" style={{ width: '100%', height: '100%' }} />
      </Modal>
      <DisposeModal getEventList={getEventList} />
    </>
  );
}
