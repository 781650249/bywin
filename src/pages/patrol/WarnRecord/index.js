import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'dva';
import { Form, DatePicker, Button, Avatar, Input, Empty, Spin, Modal, message } from 'antd';
import Icon, {
  ClockCircleFilled,
  PictureOutlined,
  LoadingOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import InfiniteScroll from 'react-infinite-scroller';
import { Viewer } from '@/components';
import ShallowMark from '@/assets/patrol/shallow-mark.png';
import ArtificialCard from './ArtificialCard';
import styles from './index.less';

const userSvg = () => (
  <svg width="1em" height="1em" viewBox="0 0 1024 1024" fill="currentColor">
    <path
      d="M511.435945 302.584307m-302.584307 0a302.584307 302.584307 0 1 0 605.168614 0 302.584307 302.584307 0 1 0-605.168614 0Z"
      fill="#ffffff"
      p-id="4898"
    />
    <path
      d="M803.763157 603.459098c-23.933222-18.804674-58.123539-17.095159-80.347245 5.128548-54.704508 54.704508-129.923205 88.894825-213.689483 88.894825s-158.984975-34.190317-213.689482-88.894825c-22.223706-22.223706-56.414023-25.642738-80.347245-5.128548C123.375845 682.096828 54.995211 782.958264 32.771505 921.429048c-8.547579 56.414023 30.771285 102.570952 88.894824 102.570952H902.915077c56.414023 0 97.442404-46.156928 88.894825-102.570952-23.933222-138.470785-92.313856-239.33222-188.046745-317.96995z"
      fill="#ffffff"
      p-id="4899"
    />
  </svg>
);

export default function() {
  const dispatch = useDispatch();
  const { isEditShow, selectedSchemeObj } = useSelector(({ patrolMain }) => patrolMain);
  const { warnRecordList, totalWarn } = useSelector(({ warnRecord }) => warnRecord);
  const [form] = Form.useForm();
  const videoRef = useRef(null);
  const scrollRef = useRef(null); // 用于控制滚动条位置
  const [formFactor, setFormFactor] = useState({ staffName: null, startTime: null, endTime: null });
  const [vedioPlayer, setVedioPlayer] = useState({
    isShowVideo: false,
    VideoUrl: '',
    coordinate: '',
  });
  const [marquee, setMarquee] = useState({ top: 0, left: 0, width: 0, height: 0 });
  const [page, setPage] = useState(1);
  const size = 20;
  const videoRefWidth = 800;
  const [loading, setLoading] = useState(false);
  const { Aliplayer } = window;

  const [largeImgUrl, setLargeImgUrl] = useState('');
  const [largeImgId, setLargeImgId] = useState('');
  const [relativePosition, setRelativePosition] = useState([]);

  const getWarnList = useCallback(
    (params) => {
      dispatch({
        type: 'warnRecord/getPatrolWarnLog',
        payload: {
          taskType: selectedSchemeObj.taskType === '0' ? 'people' : 'machine',
          xcxlxxbz: selectedSchemeObj.taskId,
          page: 1,
          size,
          ...params,
        },
        callback: () => {
          setLoading(false);
        },
      });
    },
    [dispatch, selectedSchemeObj],
  );

  useEffect(() => {
    if (selectedSchemeObj.taskId) {
      scrollRef.current.scrollTop = 0;
      getWarnList({ page: 1 });
      setLoading(true);
      setPage(1);
      form.resetFields();
    }
  }, [form, selectedSchemeObj, getWarnList]);

  useEffect(() => {
    dispatch({ type: 'eventList/getCommunityList' });
  }, [dispatch]);

  useEffect(() => {
    setTimeout(() => {
      if (vedioPlayer.isShowVideo) {
        videoRef.current = new Aliplayer(
          {
            id: 'warnVedio-player',
            source: vedioPlayer.VideoUrl,
            width: '100%',
            height: '100%',
            autoplay: true,
            isLive: false,
            rePlay: false,
            playsinline: false,
            preload: true,
            controlBarVisibility: 'hover',
            useH5Prism: true,
            skinLayout: [
              {
                name: 'bigPlayButton',
                align: 'blabs',
                x: 30,
                y: 80,
              },
              {
                name: 'H5Loading',
                align: 'cc',
              },
              {
                name: 'infoDisplay',
              },
              {
                name: 'tooltip',
                align: 'blabs',
                x: 0,
                y: 56,
              },
              {
                name: 'thumbnail',
              },
              {
                name: 'controlBar',
                align: 'blabs',
                x: 0,
                y: 0,
                children: [
                  {
                    name: 'progress',
                    align: 'blabs',
                    x: 0,
                    y: 44,
                  },
                  {
                    name: 'playButton',
                    align: 'tl',
                    x: 15,
                    y: 12,
                  },
                  {
                    name: 'timeDisplay',
                    align: 'tl',
                    x: 10,
                    y: 7,
                  },
                  {
                    name: 'fullScreenButton',
                    align: 'tr',
                    x: 10,
                    y: 12,
                  },
                ],
              },
            ],
          },
          (player) => {
            player.on('canplay', () => {
              if(player.getStatus() === 'loading') {
                const coor = vedioPlayer.coordinate ? JSON.parse(vedioPlayer.coordinate) : [];
                if(Array.isArray(coor) && coor.length !== 0) {
                  const box = coor[0];
                  setMarquee({
                    top: parseInt((box[0][1] * videoRefWidth) / 1920, 10),
                    left: parseInt((box[0][0] * videoRefWidth) / 1920, 10),
                    width: parseInt(((box[1][0] - box[0][0]) * videoRefWidth) / 1920, 10),
                    height: parseInt(((box[3][1] - box[0][1]) * videoRefWidth) / 1920, 10),
                  })
                }
              }
            });
          },
        );
      }
    }, 200);
  }, [Aliplayer, vedioPlayer]);

  const handleFilter = (values) => {
    scrollRef.current.scrollTop = 0;
    setLoading(true);
    setFormFactor({ ...values });
    setPage(1);
    getWarnList({
      startTime: values.startTime && values.endTime ? moment(values.startTime).format('x') : null,
      endTime: values.startTime && values.endTime ? moment(values.endTime).format('x') : null,
      xm: values.staffName,
    });
  };

  const handleInfiniteOnLoad = () => {
    setLoading(true);
    setPage(page + 1);
    getWarnList({
      startTime:
        formFactor.startTime && formFactor.endTime
          ? moment(formFactor.startTime).format('x')
          : null,
      endTime:
        formFactor.startTime && formFactor.endTime ? moment(formFactor.endTime).format('x') : null,
      xm: formFactor.staffName,
      page: page + 1,
    });
  };

  const viewLargeImg = (record) => {
    setLargeImgUrl(record.imagesUrl);
    setLargeImgId(record.key);
    setRelativePosition(record.coords.map((item) => ({
      startX: item[0],
      startY: item[1],
      endX: item[2],
      endY: item[3],
    })))
  }

  /**
   * 原图上一张下一张
   */
  const onPrev = () => {
    let num = 0;
    warnRecordList.forEach((item, index) => {
      if (item.key === largeImgId) {
        num = index;
      }
    });
    if (warnRecordList[num - 1]) {
      viewLargeImg(warnRecordList[num - 1]);
    } else {
      message.warn('没有图片啦!');
    }
  };

  const onNext = () => {
    let num = 0;
    warnRecordList.forEach((item, index) => {
      if (item.key === largeImgId) {
        num = index;
      }
    });
    if (warnRecordList[num + 1]) {
      viewLargeImg(warnRecordList[num + 1])
    } else {
      message.warn('没有图片啦!');
    }
  };

  return (
    <div className={styles.patrolRightColumn} style={{ width: isEditShow ? 0 : 310 }}>
      <div className={styles.warnTitle}>
        <span>预警记录</span>
      </div>
      <div style={{ padding: '0 16px 16px 16px' }}>
        <Form form={form} onFinish={handleFilter}>
          {selectedSchemeObj.taskType === '0' && (
            <div className={styles.timeWrap}>
              <div className={styles.timeHead}>
                <Icon component={userSvg} />
              </div>
              <Form.Item name="staffName">
                <Input className={styles.timeBox} placeholder="巡逻员" />
              </Form.Item>
            </div>
          )}

          <div className={styles.timeWrap}>
            <div className={styles.timeHead}>
              <ClockCircleFilled />
            </div>
            <Form.Item name="startTime">
              <DatePicker
                className={styles.timeBox}
                placeholder="开始时间"
                format="YYYY-MM-DD HH:mm:ss"
                showTime
              />
            </Form.Item>
          </div>
          <div className={styles.timeWrap}>
            <div className={styles.timeHead}>
              <ClockCircleFilled />
            </div>
            <Form.Item name="endTime">
              <DatePicker
                className={styles.timeBox}
                placeholder="结束时间"
                format="YYYY-MM-DD HH:mm:ss"
                showTime
              />
            </Form.Item>
          </div>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              确定
            </Button>
          </Form.Item>
        </Form>
      </div>

      <div className={styles.warnListWrap}>
        <Spin spinning={loading} indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}>
          <div className={styles.warnList} ref={scrollRef}>
            <InfiniteScroll
              initialLoad={false}
              pageStart={0}
              loadMore={handleInfiniteOnLoad}
              hasMore={!loading && totalWarn > page * size}
              threshold={20}
              useWindow={false}
            >
              {selectedSchemeObj.taskType === '0' &&
                warnRecordList.map((item, index) => (
                  <ArtificialCard data={item} cardIndex={index} key={index} />
                ))}
              {selectedSchemeObj.taskType === '1' &&
                warnRecordList.map((item, index) => (
                  <div className={styles.warnListItem} key={index}>
                    <Avatar
                      style={{ flexShrink: 0, cursor: 'pointer' }}
                      src={item.imagesUrl}
                      shape="square"
                      size={80}
                      icon={<PictureOutlined />}
                      onClick={() => {
                        if(item.abnormalTheme === '垃圾检测') {
                          viewLargeImg(item);
                        }else {
                          setVedioPlayer({
                            isShowVideo: true,
                            VideoUrl: item.videoUrl,
                            coordinate: item.areaCount,
                          })
                        }
                      }}
                    />
                    <div className={styles.warnListItemDesc}>
                      <p>{item.abnormalTheme}</p>
                      <p>{item.abnormalTime}</p>
                      <div>
                        <img style={{ width: 16, height: 20 }} src={ShallowMark} alt="" />
                        <span style={{ marginLeft: 10 }} title={item.azdd}>
                          {item.azdd}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              {!loading && Array.isArray(warnRecordList) && warnRecordList.length === 0 && (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="暂无预警事件"
                  style={{ margin: '136px 0' }}
                />
              )}
            </InfiniteScroll>
          </div>
        </Spin>
      </div>
      <Modal
        width={800}
        bodyStyle={{ height: 450 }}
        visible={vedioPlayer.isShowVideo}
        closable={false}
        footer={null}
        destroyOnClose
        wrapClassName={styles.modelWrap}
      >
        <div
          className={styles.closeIcon}
          onClick={() => {
            videoRef.current = null;
            setMarquee([]);
            setVedioPlayer({ isShowVideo: false, VideoUrl: '', coordinate: [] });
          }}
        >
          <CloseOutlined />
        </div>
        <div ref={videoRef} id="warnVedio-player" style={{ width: '100%', height: '100%' }} />
        {1 && (
          <div
            className={styles.vedioBorder}
            style={
              {
                top: marquee.top,
                left: marquee.left,
                width: marquee.width,
                height: marquee.height,
              }
            }
          />
        )}
      </Modal>
      <Viewer
        switching
        defaultBorder="#ee3f4d"
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
    </div>
  );
}
