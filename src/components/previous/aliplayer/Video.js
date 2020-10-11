import React, { Component } from 'react';
import { Tooltip, DatePicker } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import ReactDOM from 'react-dom';
import Draggable from 'react-draggable';
import cx from 'classnames';
import { connect } from 'dva';
import moment from 'moment';
import { Playback, RealTime } from '@/components/previous/icons';
// import TimeSelect from './time-select';
import style from './index.less';

@connect()
export default class AliplayerVideo extends Component {
  constructor(props) {
    super(props);
    this.vedioPlay = document.createElement('div');
    this.player = null; // 视频内容
    this.rootPath = ''; // 请求地址前缀
    const { playFormat, startTime, endTime, cameraId, isVolumn } = props;
    this.state = {
      isOnline: playFormat === 'flv', // 是否处于直播
      isDraggable: false, // 是否可以拖动,整个框
      vedioStartTime: startTime, // 视频开始时间
      vedioEndTime: endTime, // 视频结束时间
      cameraId, // 视频id
      vis: true, //
      controlVolumn: isVolumn,
    };
  }

  componentDidMount = () => {
    const { vedioStartTime, vedioEndTime, cameraId } = this.state;
    document.body.appendChild(this.vedioPlay);
    // 计算地址前缀
    this.rootPath = `${this.getHost()}/api`;
    // 播放视频
    this.doPlayLiveVideoUrl(vedioStartTime, vedioEndTime, cameraId);
  };

  // 时间变化后
  componentDidUpdate = (prveProps, prveState) => {
    const { vedioStartTime, vedioEndTime, cameraId } = this.state;
    const { vedioStartTime: nextVedioStartTime, vedioEndTime: nextVedioEndTime } = prveState;
    if (vedioStartTime !== nextVedioStartTime || vedioEndTime !== nextVedioEndTime) {
      this.doPlayLiveVideoUrl(vedioStartTime, vedioEndTime, cameraId);
    }
  };

  componentWillUnmount = () => {
    document.body.removeChild(this.vedioPlay);
    // 卸载视频
    this.removeVideo();
  };

  /**
   * 卸载视频
   * */
  removeVideo = (callback = () => {}) => {
    try {
      if (this.player) {
        this.player.dispose(); // 销毁
        this.player.off('error');
      }
    } catch (e) {
      console.log(e);
    }
    this.player = null;
    this.setState(
      {
        vis: false,
      },
      () => {
        this.setState(
          {
            vis: true,
          },
          () => {
            callback();
          },
        );
      },
    );
  };

  /**
   * 获取请求前缀
   */
  getHost = () => {
    // 获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
    const curWwwPath = window.document.location.href;
    // 获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
    const pathName = window.document.location.pathname;
    const pos = curWwwPath.indexOf(pathName);
    // 获取主机地址，如： http://localhost:8083
    const localhostPaht = curWwwPath.substring(0, pos);
    return localhostPaht;
  };

  doPlayLiveVideoUrl = (vedioStartTime, vedioEndTime, cameraId) => {
    const { dispatch } = this.props;
    const { isOnline } = this.state;
    if (isOnline) {
      dispatch({
        type: 'videoPlay/getLiveVideoUrl',
        payload: {
          protocol: 'flv',
          deviceId: cameraId,
        },
        callback: (data) => {
          // 如果存在视频的话先销毁
          this.removeVideo(() => {
            // 然后打开
            if (document.querySelector('#player-Aliplay')) {
              this.flvAliplay(data.playUrl);
            }
          });
        },
      });
    } else {
      dispatch({
        type: 'videoPlay/getHistoryVideoUrl',
        payload: {
          protocol: 'hls',
          deviceId: cameraId,
          timeShiftQuery: {
            beginTime: moment(vedioStartTime).format('YYYYMMDDHHmmss'),
            endTime: moment(vedioEndTime).format('YYYYMMDDHHmmss'),
          },
        },
        callback: (data) => {
          this.removeVideo();
          if (document.querySelector('#player-Aliplay')) {
            this.hlsAliplay(data.playUrl);
          }
        },
      });
    }
  };

  flvAliplay = (playUrl) => {
    const { width = '600px', height = '337px' } = this.props;
    const { Aliplayer } = window;
    this.player = new Aliplayer(
      {
        id: 'player-Aliplay',
        // source: 'https://vod.olympicchannel.com/NBCR_Production_-_OCS/231/1016/GEPH-ONTHERECS02E012C-_E17101101_master.m3u8', // 测试视频
        source: playUrl, // 调用视频
        width, // 播放器宽度
        height, // 播放器高度
        autoplay: true, // 自动播放
        rePlay: false, // 循环播放
        preload: true,
        autoPlayDelay: '',
        isLive: true,
        autoPlayDelayDisplayText: '',
        language: 'zh-cn',
        controlBarVisibility: 'hover',
        useH5Prism: false,
        trackLog: false, // 不打印日志
        skinLayout: [
          {
            name: 'errorDisplay',
            align: 'tlabs',
            x: 0,
            y: 0,
          },
          {
            name: 'tooltip',
            align: 'blabs',
            x: 0,
            y: 40,
          },
          {
            name: 'infoDisplay',
          },
          {
            name: 'controlBar',
            align: 'blabs',
            x: 0,
            y: 0,
            children: [
              {
                name: 'fullScreenButton',
                align: 'tr',
                x: 10,
                y: 12,
              },
              Boolean(this.state.controlVolumn) && { name: 'volume', align: 'tr', x: 10, y: 12 },
              Boolean(!this.state.controlVolumn) && {
                name: 'snapshot',
                align: 'tr',
                x: 10,
                y: 12,
              },
            ],
          },
        ],
        extraInfo: {
          crossOrigin: 'anonymous',
        },
      },
      () => {},
    );
    // /* h5截图按钮, 截图成功回调 */
    this.player.on('snapshoted', (data) => {
      const { snapshoted = () => {} } = this.props;
      if (data.paramData.base64 !== 'data:,') {
        snapshoted(data.paramData.base64);
        // let pictureData = data.paramData.base64;
        // const downloadElement = document.createElement('a');
        // downloadElement.setAttribute('href', pictureData);
        // const fileName = `Aliplayer${Date.now()}.jpg`;
        // downloadElement.setAttribute('download', fileName);
        // downloadElement.click();
        // pictureData = null;
      }
    });
  };

  hlsAliplay = (playUrl) => {
    const { width = 600, height = 337 } = this.props;
    const { Aliplayer } = window;
    // 初始化播放器
    this.player = new Aliplayer(
      {
        id: 'player-Aliplay',
        // source: 'https://vod.olympicchannel.com/NBCR_Production_-_OCS/231/1016/GEPH-ONTHERECS02E012C-_E17101101_master.m3u8', // 测试视频
        source: playUrl,
        width: `${width}px`,
        height: `${height}px`, // 播放器高度
        autoplay: true,
        isLive: false,
        rePlay: true,
        playsinline: false,
        preload: false,
        controlBarVisibility: 'hover',
        useH5Prism: false,
        trackLog: false, // 不打印日志
        // liveShiftDuration: newTime,// 单位时秒， 回放的长度
        extraInfo: {
          crossOrigin: 'anonymous',
        },
        skinLayout: [
          {
            name: 'H5Loading',
            align: 'cc',
          },
          {
            name: 'errorDisplay',
            align: 'tlabs',
            x: 0,
            y: 0,
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
                name: 'fullScreenButton',
                align: 'tr',
                x: 10,
                y: 12,
              },
              {
                name: 'snapshot',
                align: 'tr',
                x: 10,
                y: 12,
              },
            ],
          },
        ],
      },
      () => {
        // 对一些按钮进行删除和位置调整
        if (document.querySelector('.prism-setting-cc')) {
          document.querySelector('.prism-setting-cc').style.display = 'none';
        }
        if (document.querySelector('.prism-setting-audio')) {
          document.querySelector('.prism-setting-audio').style.display = 'none';
        }
        if (document.querySelector('.prism-setting-quality')) {
          document.querySelector('.prism-setting-quality').style.display = 'none';
        }
        if (document.querySelector('.prism-setting-btn')) {
          document.querySelector('.prism-setting-btn').style.width = '24px';
          document.querySelector('.prism-setting-btn').style.height = '24px';
          document.querySelector('.prism-setting-btn').style.marginTop = '25px';
        }
      },
    );
    /* h5截图按钮, 截图成功回调 */
    this.player.on('snapshoted', (data) => {
      const { snapshoted = () => {} } = this.props;
      if (data.paramData.base64 !== 'data:,') {
        snapshoted(data.paramData.base64);
      }
    });
  };

  /**
   * 视频放大
   */
  videoBig = () => {
    if (document.getElementsByClassName('prism-fullscreen-btn').length > 0) {
      document.getElementsByClassName('prism-fullscreen-btn')[0].click();
    }
    if (document.getElementsByClassName('fullscreen').length > 0) {
      document.getElementsByClassName('fullscreen')[0].click();
    }
  };

  /**
   * 关闭视频回调
   */
  closeVedio = () => {
    const { close } = this.props;
    close();
  };

  /**
   * 在video内不可以移动
   */
  OnlineMouseMove = () => {
    const { isDraggable } = this.state;
    if (isDraggable === false) {
      this.setState({
        isDraggable: true,
      });
    }
  };

  /**
   * 在video外白框可以移动
   */
  OnlineMouseLeave = () => {
    this.setState({
      isDraggable: false,
    });
  };

  /**
   * 监听时间改变
   */
  timeOnChange = (e, type) => {
    this.setState(
      {
        [type]: e,
        isOnline: false,
      },
      () => {
        const { vedioStartTime, vedioEndTime, cameraId } = this.state;
        this.doPlayLiveVideoUrl(vedioStartTime, vedioEndTime, cameraId);
      },
    );
  };

  onlineClick = () => {
    this.setState(
      {
        isOnline: true,
      },
      () => {
        const { vedioStartTime, vedioEndTime, cameraId } = this.state;
        this.doPlayLiveVideoUrl(vedioStartTime, vedioEndTime, cameraId);
      },
    );
  };

  render() {
    const { width = 600, height = 337, title } = this.props;
    const { isOnline, isDraggable, vedioStartTime, vedioEndTime, vis } = this.state;
    function range(start, end) {
      const result = [];
      for (let i = start; i < 24 - end; i += 1) {
        const newVal = end + i;
        result.push(newVal);
      }
      return result;
    }

    return ReactDOM.createPortal(
      <Draggable disabled={isDraggable}>
        <div
          className={cx(style.playerFrame)}
          style={{
            height: `${height + 70}px`,
          }}
        >
          <div className={style.player_head}>
            <span className={style.videoTitle}>{title}</span>
            <CloseOutlined className={style.player_close} onClick={this.closeVedio} />
          </div>
          <div
            onDoubleClick={this.videoBig}
            onMouseMove={this.OnlineMouseMove}
            onMouseLeave={this.OnlineMouseLeave}
            className={style.player_player}
            style={{ width, height }}
          >
            {vis ? <div id="player-Aliplay" /> : null}
          </div>
          <div className={style.player_icon}>
            <Tooltip title="实时直播">
              <span
                className={style.player_online}
                style={{
                  color: isOnline ? '#1890FF' : '#9B9EA0',
                }}
                onClick={this.onlineClick}
              >
                <RealTime style={{ color: isOnline ? '#1890FF' : '#9B9EA0' }} />
                实时
              </span>
            </Tooltip>
            <span className={style.history_span}>
              <Tooltip title="请选择历史播放时间">
                <span
                  className={style.player_histroy}
                  style={{
                    color: isOnline ? '#9B9EA0' : '#1890FF',
                  }}
                  onClick={this.historyClick}
                >
                  <Playback style={{ color: isOnline ? '#9B9EA0' : '#1890FF' }} />
                  <span>历史</span>
                </span>
              </Tooltip>
              <DatePicker
                format="MM.DD HH:mm:ss"
                showTime={{ format: 'HH:mm:ss' }}
                onChange={(e) => this.timeOnChange(e, 'vedioStartTime')}
                value={vedioStartTime}
                width={170}
                size="small"
                allowClear={false}
                disabledDate={(current) => current && current >= moment().endOf('day')}
                disabledTime={(date) => {
                  const currentDate = new Date();
                  const h = currentDate.getHours();
                  const m = currentDate.getMinutes();
                  let disabledHours = [];
                  let disabledMinutes = [];
                  if (moment.isMoment(date) && date.isSame(moment(), 'day')) {
                    disabledHours = range(0, h);
                    disabledMinutes = range(0, m);
                  }
                  return {
                    disabledHours: () => disabledHours,
                    disabledMinutes: (selectedHour) => (selectedHour > h ? [] : disabledMinutes),
                  };
                }}
              />
              <DatePicker
                format="MM.DD HH:mm:ss"
                showTime={{ format: 'HH:mm:ss' }}
                onChange={(e) => this.timeOnChange(e, 'vedioEndTime')}
                value={vedioEndTime}
                width={170}
                size="small"
                allowClear={false}
                disabledDate={(current) => current && current >= moment().endOf('day')}
                disabledTime={(date) => {
                  const currentDate = new Date();
                  const h = currentDate.getHours();
                  const m = currentDate.getMinutes();
                  let disabledHours = [];
                  let disabledMinutes = [];
                  if (moment.isMoment(date) && date.isSame(moment(), 'day')) {
                    disabledHours = range(0, h);
                    disabledMinutes = range(0, m);
                  }
                  return {
                    disabledHours: () => disabledHours,
                    disabledMinutes: (selectedHour) => (selectedHour > h ? [] : disabledMinutes),
                  };
                }}
              />
            </span>
          </div>
        </div>
      </Draggable>,
      this.vedioPlay,
    );
  }
}
