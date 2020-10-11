import React, { Component } from 'react';
import { connect } from 'dva';

@connect()
export default class AliplayerVideo extends Component {

  constructor(props) {
    super(props)
    this.player = null
    this.timeOut = null
    this.useCameraId = ''
    this.useSelectTime = []
    this.state = {
      vis: true
    }
  }

  componentDidMount = () => {
    this.doPlayLiveVideoUrl();
  }

  // 时间变化时
  componentDidUpdate = (prev) => {
    const { cameraId, selectTime } = this.props
    const { cameraId: prevCameraId, selectTime: prevSelectTime } = prev;
    if ((cameraId !== prevCameraId && cameraId) || (selectTime.toString() !== prevSelectTime.toString())) {
      this.useCameraId = cameraId
      this.useSelectTime = selectTime
      // 如果存在视频的话先销毁
      this.removeVideo(() => {
        this.doPlayLiveVideoUrl();
      })
    }
    if (cameraId !== prevCameraId && !cameraId) {
      this.removeVideo()
    }
  };

  componentWillUnmount = () => {
    // 卸载视频
    this.removeVideo();
  };

  /**
   * 卸载视频
   * */
  removeVideo = (callback) => {
    try {
      if (this.player) {
        this.player.dispose(); // 销毁
        this.player.off('error');
      }
    } catch (e) {
      console.log(e)
    }
    this.player = null;
    this.setState({
      vis: false
    }, () => {
      this.setState({
        vis: true
      }, () => {
        if(callback) {
          callback()
        }
      })
    })
  };

  doPlayLiveVideoUrl = () => {
    const { cameraId, selectTime, dispatch } = this.props;
    if(!cameraId) { return }
    if(selectTime.length === 0) {
      dispatch({
        type: 'videoPlay/getLiveVideoUrl',
        payload: {
          deviceId: cameraId,
          protocol: 'flv',
        },
        callback: (data) => {
          // document.querySelector(`#aliplayer-${id}`).empty()
          this.flvAliplay(data.playUrl);
        },
      });
    } else {
      dispatch({
        type: 'videoPlay/getHistoryVideoUrl',
        payload: {
          deviceId: cameraId,
          protocol: 'hls',
          timeShiftQuery: {
            beginTime: selectTime[0].format('YYYYMMDDHHmmss'),
            endTime: selectTime[1].format('YYYYMMDDHHmmss'),
          },
        },
        callback: (data) => {
          // document.querySelector(`#aliplayer-${id}`).empty()
          this.hlsAliplay(data.playUrl);
        },
      });
    }
  };

  flvAliplay = (url) => {
    const { id } = this.props
    const { Aliplayer } = window;
    this.player = new Aliplayer(
      {
        id: `aliplayer-${id}`,
        source: url, // 调用视频
        width: '100%', // 播放器宽度
        height: '100%', // 播放器高度
        autoplay: true, // 自动播放
        rePlay: false, // 循环播放
        preload: true,
        autoPlayDelay: '',
        isLive: true,
        autoPlayDelayDisplayText: '',
        language: 'zh-cn',
        controlBarVisibility: 'hover',
        useH5Prism: true,
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
            ],
          },
        ],
        extraInfo: {
          crossOrigin: 'anonymous',
        },
      },
      () => {
        // 对一些按钮进行删除和位置调整
        if (document.querySelector('.prism-play-btn')) {
          document.querySelector('.prism-play-btn').style.display = 'none';
        }
      },
    );
    // // 抛出错误时清除定时器，并且重新请求流
    // this.player.on('error', () => {
    //   message.warn('获取视频流失败,正在尝试重新对视频进行播放');
    //   this.player.loadByUrl(url);
    // });
  };

  hlsAliplay = (url) => {
    const { id } = this.props
    const { Aliplayer } = window;
    // 初始化播放器
    this.player = new Aliplayer(
      {
        id: `aliplayer-${id}`,
        source: url,
        width: '100%',
        height: '100%', // 播放器高度
        autoplay: true,
        isLive: false,
        rePlay: true,
        playsinline: false,
        preload: false,
        controlBarVisibility: 'hover',
        useH5Prism: true,
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
          document.querySelector('.prism-setting-quality').style.display =
            'none';
        }
      },
    );
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


  render() {
    const { id } = this.props
    const { vis } = this.state
    let aliplayerId = 'aliplayer'
    if (id !== null) {
      aliplayerId = `aliplayer-${id}`
     }
    return  (
      <>
      {
        vis ? <div style={{ width: '100%', height: '100%' }} id={aliplayerId} /> : null
      }
      </>
    );
  }
}
