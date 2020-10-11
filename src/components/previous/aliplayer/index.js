import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import Video from './Video';

@connect()
export default class Aliplayer extends Component {
  /**
   * 关闭视频调用外部方法
   */

  vedioClose = () => {
    const { close = () => {} } = this.props;
    close();
  };

  render() {
    const {
      playFormat = '',
      visible = false,
      startTime = moment(),
      endTime = moment(),
      cameraId = '',
      snapshoted,
      title,
      isVolumn,
    } = this.props;
    let content;
    // 如果使用宇视播放器
    if (visible) {
      content = (
        <Video
          isVolumn={isVolumn}
          title={title}
          playFormat={playFormat}
          startTime={startTime}
          endTime={endTime}
          cameraId={cameraId}
          close={this.vedioClose}
          snapshoted={snapshoted}
        />
      );
    } else {
      content = null;
    }

    return <div>{content}</div>;
  }
}
