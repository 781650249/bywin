import React, { Component } from 'react';
import { connect } from 'dva';
import { orderBy, uniqBy } from 'lodash';
import { Row, Col, message } from 'antd';
import Icon, {
  PlayCircleOutlined,
  DownloadOutlined,
  DeleteOutlined,
  UpOutlined,
  DownOutlined,
} from '@ant-design/icons';
import cx from 'classnames';
import moment from 'moment';
import Aliplayer from '@/components/previous/aliplayer';
import { saveImage } from '@/utils/previous/tools';
import { Select, Delete } from '../components/icon';
import Slick from '../components/slick';
import Picture from './Picture';
import Viewer from './Viewer';
import styles from './PictureList.less';

@connect(({ searchPanel }) => {
  const {
    content,
    prevParams,
    currentKey,
    retrievalQueryId,
    searchResult,
    selectedResult,
    currentPoint,
  } = searchPanel;
  const selectedKeys = selectedResult.map((item) => item.id);
  return {
    content,
    prevParams,
    currentKey,
    retrievalQueryId,
    searchResult,
    selectedResult,
    selectedKeys,
    currentPoint,
  };
})
class PictureList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      isHide: false,
      currentIndex: -1,
      lastIndex: -1,
    };
    this.contentRef = React.createRef();
    this.imgRef = React.createRef();
    this.wrapRef = React.createRef();
    this.cropper = null;
    this.isScrollLoad = true;
    this.scrollTop = 0;
    this.state = {
      startTime: moment(),
      endTime: moment(),
      cameraId: '',
      visible: false,
    };
  }

  componentDidMount() {
    // const { current } = this.contentRef;
    // current.addEventListener('wheel', throttle(this.handleMouseWheel, 750))
  }

  handleMouseWheel = (e) => {
    const { dispatch, prevParams, currentKey, retrievalQueryId } = this.props;
    const { current } = this.contentRef;
    const { scrollHeight, scrollTop, offsetHeight } = current;
    if (e.deltaY <= 0) return;
    if (scrollHeight <= offsetHeight + scrollTop + 30 && this.isScrollLoad) {
      this.isScrollLoad = false;
      setTimeout(() => {
        this.isScrollLoad = true;
      }, 2000);
      dispatch({
        type: 'searchPanel/nextPage',
        payload: {
          ...prevParams,
          ...(currentKey ? retrievalQueryId[currentKey] : retrievalQueryId),
          pageNum: prevParams.pageNum + 1,
        },
      });
    }
  };

  /**
   * 上方小箭头 隐藏和还原组件
   */
  handleHide = () => {
    const { isHide } = this.state;
    this.setState({ isHide: !isHide });
  };

  /**
   * 下方小箭头 展开和还原组件
   */
  handleOpen = () => {
    const { isOpen } = this.state;
    this.setState({ isOpen: !isOpen });
  };

  /**
   * 视频播放
   */
  handlePlay = (item) => {
    this.setState(
      {
        visible: false,
      },
      () => {
        this.setState({
          startTime: moment(Number(item.entryTime)).subtract(20, 'seconds'),
          endTime: moment(Number(item.leaveTime)).add(20, 'seconds'),
          cameraId: item.cameraId,
          visible: true,
        });
      },
    );
  };

  /**
   * 关闭视频
   */
  vedioClose = () => {
    this.setState({
      visible: false,
    });
  };

  handleDownload = (img) => {
    saveImage(img);
  };

  handleDelete = (key) => {
    const { dispatch, searchResult, selectedResult } = this.props;
    dispatch({
      type: 'searchPanel/setState',
      payload: {
        searchResult: searchResult.filter((item) => item.id !== key),
        selectedResult: selectedResult.filter((item) => item.id !== key),
      },
    });
  };

  handleSelect = (current) => {
    const {
      dispatch,
      searchResult: prevSearchResult,
      selectedResult: prevSelectedResult,
      selectedKeys,
      currentPoint,
    } = this.props;
    let selectedResult = [];
    let searchResult = [];
    let isAdd = false;
    if (selectedKeys.includes(current.id)) {
      selectedResult = prevSelectedResult.filter((item) => item.id !== current.id);
      searchResult = uniqBy([...selectedResult, ...prevSearchResult], 'id');
    } else {
      isAdd = true;
      selectedResult = orderBy([...prevSelectedResult, current], 'wzbjsj', 'desc');
      searchResult = uniqBy([...selectedResult, ...prevSearchResult], 'id');
    }
    dispatch({
      type: 'searchPanel/setState',
      payload: {
        selectedResult,
        searchResult,
        currentPoint: isAdd ? current : currentPoint,
      },
    });
  };

  /**
   * 查看大图
   */
  handleView = (index) => {
    this.setState({
      currentIndex: index,
    });
  };

  /**
   * 遍历生成缩略图
   */
  renderPictures = () => {
    const { searchResult, selectedKeys } = this.props;
    const { lastIndex } = this.state;
    return searchResult.map((item, i) => {
      const { id, imageUrl, cph, wzbjsj, azdd: address } = item;
      const number = selectedKeys.includes(id) ? selectedKeys.length - i : 0;
      return (
        <Picture
          key={i}
          imgUrl={imageUrl}
          info={{
            cph,
            address,
            time: moment(wzbjsj, 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss'),
          }}
          className={cx({ active: number > 0, scale: i === lastIndex })}
          actions={() => (
            <>
              <div onClick={() => this.handlePlay(item)}>
                <PlayCircleOutlined />
              </div>
              <div onClick={() => this.handleDownload(imageUrl)}>
                <DownloadOutlined />
              </div>
              <div onClick={() => this.handleDelete(id)}>
                <DeleteOutlined />
              </div>
              <div onClick={() => this.handleSelect(item)}>
                <Icon component={Select} />
              </div>
            </>
          )}
          onClick={(e) => {
            e.stopPropagation();
            this.handleView(i);
          }}
          number={number}
          style={{ marginRight: 4, marginBottom: 4 }}
        />
      );
    });
  };

  /**
   * 大图切换图片
   */
  setCurrentIndex = (currentIndex) => {
    if (currentIndex === -1) {
      const { currentIndex: prevCurrentIndex } = this.state;
      this.setState({
        lastIndex: prevCurrentIndex,
      });
    }
    this.setState({
      currentIndex,
    });
  };

  handleViewerSelect = (current) => {
    const { selectedKeys } = this.props;
    const { currentIndex: prevIndex } = this.state;
    if (!selectedKeys.includes(current.id)) {
      message.success('选中图片成功');
      this.setState({
        currentIndex: prevIndex + 1,
      });
    } else {
      message.success('已取消选中该图片');
    }
    this.handleSelect(current);
  };

  /**
   * 加载大图查看组件
   */
  renderViewer = () => {
    const { dispatch, content, searchResult, selectedKeys } = this.props;
    const { currentIndex } = this.state;
    const current = currentIndex > -1 ? searchResult[currentIndex] : {};
    return (
      <Viewer
        picture={current}
        currentIndex={currentIndex}
        setCurrentIndex={this.setCurrentIndex}
        onCrop={(base64) => {
          dispatch({
            type: 'searchPanel/setState',
            payload: {
              content: [...content, base64],
            },
          });
        }}
        total={searchResult.length}
        moreActions={() => (
          <span>
            <DownloadOutlined onClick={() => this.handleDownload(current.fullUrl)} />
            <Icon component={Delete} onClick={() => this.handleDelete(current.id)} />
            <PlayCircleOutlined onClick={() => this.handlePlay(current)} />
            <Icon
              component={Select}
              onClick={() => this.handleViewerSelect(current)}
              style={{
                color: selectedKeys.includes(current.id) ? '#1890ff' : '#ffffff',
              }}
            />
          </span>
        )}
      />
    );
  };

  /**
   * 状态栏文字
   */
  statusBarText = () => {
    const { searchResult, selectedKeys } = this.props;
    const total = searchResult.length;
    const selectNumber = selectedKeys.length;
    return `共${total}张，已选择 ${selectNumber} 张图，进行第 1 轮检索`;
  };

  /**
   * 截图
   */
  snapshoted = (img) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'pictureUpload/setState',
      payload: {
        cropperVisible: true,
        image: img,
      },
    });
    // 截图后关闭视频
    this.vedioClose();
  };

  render() {
    const { searchResult } = this.props;
    const { visible, startTime, endTime, cameraId } = this.state;
    if (searchResult.length > 0) {
      const { isHide, isOpen } = this.state;
      return (
        <div className={cx(styles.wrap)}>
          <div
            className={cx(styles.container, 'shadow', {
              [styles.open]: isOpen,
              [styles.hide]: isHide,
            })}
          >
            <div className={styles.content} ref={this.contentRef} onWheel={this.handleMouseWheel}>
              {this.renderPictures()}
            </div>
            {!isOpen && (
              <Slick
                key="slick"
                style={{ paddingTop: 16 }}
                wrapStyle={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  zIndex: 1,
                  width: '100%',
                  backgroundColor: 'transparent',
                }}
              >
                {this.renderPictures()}
              </Slick>
            )}
            <footer className={styles.footer}>
              <Row>
                <Col span={6} />
                <Col span={12}>{this.statusBarText()}</Col>
                <Col span={6} />
              </Row>
            </footer>
          </div>
          <>
            <div className={styles.hideBtn} onClick={this.handleHide}>
              <UpOutlined />
            </div>
            <div className={styles.openBtn} onClick={this.handleOpen}>
              <DownOutlined />
            </div>
          </>
          {this.renderViewer()}
          <Aliplayer
            playFormat="hls"
            visible={visible}
            startTime={startTime}
            endTime={endTime}
            cameraId={cameraId}
            close={this.vedioClose}
            snapshoted={this.snapshoted}
          />
        </div>
      );
    }
    return null;
  }
}
export default PictureList;
