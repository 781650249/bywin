import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import { message, notification } from 'antd';
import Icon, {
  CheckOutlined,
  CloseOutlined,
  LeftOutlined,
  RightOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from '@ant-design/icons';
import cx from 'classnames';
import Cropper from 'cropperjs';
import { Move, Crop } from '../components/icon';
import 'cropperjs/dist/cropper.css';
import styles from './viewer.less';

export default class Viewer extends PureComponent {
  constructor(props) {
    super(props);
    this.imgRef = React.createRef();
    this.state = {
      left: 0,
      top: 0,
      imgMark: {},
      markVisible: false,
    };
    this.cropper = null;
    this.el = document.createElement('div');
    this.timeOut = null;
  }

  componentDidMount() {
    document.body.appendChild(this.el);
    document.addEventListener('keydown', this.handleKeyDown);
    this.imgRef.current.oncontextmenu = () => false;
    this.cropperInit();
  }

  componentDidUpdate(prevProps) {
    const { picture, currentIndex } = this.props;
    if (picture.fullUrl !== prevProps.picture.fullUrl && this.cropper) {
      this.cropperDestroy();
    }
    if (currentIndex === -1 && currentIndex !== prevProps.currentIndex) {
      this.cropperDestroy();
    }
  }

  // componentWillReceiveProps() {}

  componentWillUnmount() {
    document.body.removeChild(this.el);
    document.removeEventListener('keydown', this.handleKeyDown);
    if (this.cropper) this.cropper.destroy();
  }

  handleImgLoad = () => {
    this.cropperInit();
  };

  cropperDestroy = () => {
    if (this.cropper !== null) {
      this.cropper.destroy();
      this.cropper = null;
    }
  };

  cropperInit = (option = {}) => {
    const { current: image } = this.imgRef;
    if (!image) return;
    this.showMark();
    this.cropper = new Cropper(image, {
      autoCrop: false,
      dragMode: 'move',
      background: false,
      ready: () => {},
      crop: () => {
        const { markVisible } = this.state;
        if (markVisible) {
          this.setState({
            markVisible: false,
          });
        }
      },
      cropend: () => {
        const { offsetWidth, offsetHeight } = this.imgRef.current.parentNode;
        this.cropping = true;
        const data = this.cropper.getCropBoxData();
        if (Object.keys(data).length > 0) {
          this.setState({
            showCropTool: true,
            left: `calc(50% - ${Math.ceil(offsetWidth / 2)}px + ${Math.ceil(
              data.width,
            )}px + ${Math.ceil(data.left)}px)`,
            top: `calc(50% - ${Math.ceil(offsetHeight / 2)}px + ${Math.ceil(
              data.height,
            )}px + ${Math.ceil(data.top)}px)`,
          });
        }
      },
      ...option,
    });
  };

  crop = (e) => {
    e.preventDefault();
    if (this.cropping) {
      this.cropped = true;
      this.cropping = false;
      const url = this.cropper.getCroppedCanvas().toDataURL('image/jpeg');
      const { onCrop } = this.props;
      onCrop(url);
      this.setState({
        showCropTool: false,
      });
      this.cropper.clear();
      // this.destroy();
    } else {
      notification.warn({
        message: '没有框选截图',
        description: '请先框选截图区域！',
        style: {
          zIndex: 3000,
        },
      });
    }
  };

  resetCrop = (e) => {
    e.preventDefault();
    if (this.cropper) {
      this.cropper.clear();
    }
    this.setState({
      showCropTool: false,
    });
  };

  setDragMode = (mode) => {
    if (this.cropper) {
      this.cropper.setDragMode(mode);
    }
  };

  zoom = (scale) => {
    if (this.cropper && typeof scale === 'number') {
      this.cropper.zoom(scale);
    }
  };

  handleClose = () => {
    const { setCurrentIndex } = this.props;
    setCurrentIndex(-1);
  };

  setImgMark = (imgMark = {}) => {
    this.setState({
      imgMark,
      markVisible: true,
    });
  };

  prev = () => {
    if (this.timeOut) {
      clearTimeout(this.timeOut);
      this.timeOut = null;
    }
    const { currentIndex, setCurrentIndex } = this.props;
    if (currentIndex === 0) {
      message.warning('已经是第一张了！');
    } else {
      setCurrentIndex(currentIndex - 1);
    }
  };

  next = () => {
    if (this.timeOut) {
      clearTimeout(this.timeOut);
      this.timeOut = null;
    }
    const { total, currentIndex, setCurrentIndex } = this.props;
    if (currentIndex === total - 1) {
      message.warning('已经最后一张了！');
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  handleKeyDown = (e) => {
    const { currentIndex } = this.props;
    if (currentIndex === -1) return;
    if (e.key === 'ArrowLeft') {
      this.prev();
    }
    if (e.key === 'ArrowRight') {
      this.next();
    }
  };

  showMark = () => {
    const { picture, currentIndex } = this.props;
    if (currentIndex === -1) return;
    const { naturalWidth, naturalHeight } = this.imgRef.current;
    if (naturalWidth !== 0 && naturalHeight !== 0) {
      const left = typeof picture.zsjxzb === 'number' ? picture.zsjxzb : picture.zsjXzb;
      const top = typeof picture.zsjyzb === 'number' ? picture.zsjyzb : picture.zsjYzb;
      const yxjxzb = typeof picture.yxjxzb === 'number' ? picture.yxjxzb : picture.yxjXzb;
      const yxjyzb = typeof picture.yxjyzb === 'number' ? picture.yxjyzb : picture.yxjYzb;
      this.setImgMark({
        left: Number(left) / naturalWidth,
        top: Number(top) / naturalHeight,
        width: (yxjxzb - left) / naturalWidth,
        height: (yxjyzb - top) / naturalHeight,
      });
    }
  };

  render() {
    const { picture, currentIndex, moreActions } = this.props;
    const { showCropTool, top, left, imgMark, markVisible } = this.state;
    const imgUrl = picture ? picture.fullUrl : '';
    return ReactDOM.createPortal(
      <div
        className={cx(styles.wrap, 'shadow', {
          [styles.show]: currentIndex > -1,
        })}
      >
        <div className={cx(styles.fullscreen)}>
          <div className={styles.content}>
            <div className={styles.imgWrap}>
              <div
                className={styles.mark}
                style={{
                  display: imgMark.width && imgMark.height && markVisible ? 'block' : 'none',
                  left: `${imgMark.left * 100}%`,
                  top: `${imgMark.top * 100}%`,
                  width: `${imgMark.width * 100}%`,
                  height: `${imgMark.height * 100}%`,
                }}
              />
              <img id="fullImg" src={imgUrl} alt="" ref={this.imgRef} onLoad={this.handleImgLoad} />
            </div>
          </div>
          {showCropTool ? (
            <div className={styles.cropTool} style={{ top, left }}>
              <a title="确认" onClick={this.crop} href="">
                <CheckOutlined className={styles.toolIcon} />
              </a>
              <a title="取消" onClick={this.resetCrop} href="">
                <CloseOutlined className={styles.toolIcon} />
              </a>
            </div>
          ) : null}
          <div className={styles.close} onClick={this.handleClose}>
            <CloseOutlined />
          </div>
          <div className={styles.prev} onClick={this.prev}>
            <LeftOutlined />
          </div>
          <div className={styles.next} onClick={this.next}>
            <RightOutlined />
          </div>
          <div className={styles.tool}>
            <Icon component={Crop} onClick={() => this.setDragMode('crop')} />
            <Icon component={Move} onClick={() => this.setDragMode('move')} />
            <ZoomInOutlined onClick={() => this.zoom(0.1)} />
            <ZoomOutOutlined onClick={() => this.zoom(-0.1)} />
            {moreActions()}
          </div>
        </div>
      </div>,
      this.el,
    );
  }
}

Viewer.defaultProps = {
  picture: {},
  currentIndex: -1,
  setCurrentIndex: () => {},
  onCrop: () => {},
};
