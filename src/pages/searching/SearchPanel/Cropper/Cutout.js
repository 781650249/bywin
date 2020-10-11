import React, { PureComponent } from 'react';
import { Tooltip } from 'antd';
import Icon, {
  ZoomInOutlined,
  ZoomOutOutlined,
  CheckOutlined,
  SyncOutlined
} from '@ant-design/icons';
import cx from 'classnames';
import { imageCorrect } from '@/utils/previous/tools';
import { Polygon } from '../../components/icon';
import styles from './Cutout.less';

export default class extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      number: 0,
      transform: {
        scale: 1,
        translateX: 0,
        translateY: 0,
      },
      path: [],
      imageData: null,
      image: {},
      status: 'pending', //  pending running complete
    };
    this.canvas = null;
    this.ctx = null;
    this.img = null;
    this.scale = 1;
    this.canvasRef = React.createRef();
  }

  componentDidMount() {
    const { src, getCropImage } = this.props;
    let image = src;
    if (/^(?!data|html)/.test(src)) {
      image = `data:image/png;base64,`;
    }
    getCropImage(image);
    imageCorrect(image, (base64) => {
      this.canvasInit(base64);
    });
  }

  componentWillUnmount() {}

  /**
   * 相对于画布的定位
   */
  relativeToCanvasPosition = (x, y) => {
    const { left, top, width } = this.canvas.getBoundingClientRect();
    const { image } = this.state;
    const multiple = image.width / width;
    return {
      x: (x - left) * multiple,
      y: (y - top) * multiple,
    };
  };

  /**
   * 返回被选中位置的图片
   */
  getCropImage = (imageData) => {
    const { getCropImage } = this.props;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    ctx.putImageData(imageData, 0, 0);
    getCropImage(canvas.toDataURL('image/png', 0.8));
  };

  /**
   * 初始化canvas
   */
  canvasInit = (src) => {
    const { transform } = this.state;
    this.canvas = this.canvasRef.current;
    this.ctx = this.canvas.getContext('2d');
    this.img = new Image();
    this.img.crossOrigin = 'anonymous';
    this.img.src = src;
    this.img.onload = () => {
      const { naturalWidth: width, naturalHeight: height } = this.img;
      const { offsetWidth, offsetHeight } = this.canvas.parentNode;
      if (offsetWidth / width < offsetHeight / height) {
        this.scale = offsetWidth / width;
      } else {
        this.scale = offsetHeight / height;
      }
      this.canvas.width = width;
      this.canvas.height = height;
      this.canvas.style.transform = `scale(${this.scale})`;
      this.ctx.drawImage(this.img, 0, 0, width, height);
      this.ctx.strokeStyle = '#1890FF';
      this.ctx.lineJoin = 'round';
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0)';
      this.ctx.lineWidth = 3 * (parseInt(width / 1000, 10) + 1);
      this.setState({
        image: {
          data: this.ctx.getImageData(0, 0, width, height),
          width,
          height,
        },
        transform: {
          ...transform,
          scale: this.scale,
        },
      });
    };
  };

  /**
   * 绘制路径时鼠标按下事件
   */
  handleCanvasMouseDown = (e) => {
    e.preventDefault();
    const { image, path } = this.state;
    const { x, y } = this.relativeToCanvasPosition(e.clientX, e.clientY);
    let { number } = this.state;
    if (number === 0) {
      this.ctx.strokeStyle = '#1890FF';
      this.ctx.beginPath();
      this.ctx.moveTo(x, y);
    } else {
      this.ctx.lineTo(x, y);
    }
    this.ctx.stroke();
    const imageData = this.ctx.getImageData(0, 0, image.width, image.height);
    this.setState({
      number: (number += 1),
      path: [...path, { x, y }],
      imageData,
    });
  };

  /**
   * 路径绘制时鼠标移动事件
   */
  handleCanvasMouseMove = (e) => {
    e.preventDefault();
    const { image, path, number, imageData } = this.state;
    const { x, y } = this.relativeToCanvasPosition(e.clientX, e.clientY);
    if (number > 0) {
      const key = number - 1;
      this.ctx.clearRect(0, 0, image.width, image.height);
      this.ctx.putImageData(imageData, 0, 0);
      this.ctx.restore();
      this.ctx.beginPath();
      this.ctx.moveTo(path[key].x, path[key].y);
      this.ctx.lineTo(x, y);
      this.ctx.closePath();
      this.ctx.stroke();
    }
  };

  /**
   * 路径绘制时鼠标双击事件（完成绘制）
   */
  handleCanvasDblClick = () => {
    this.handleEndClick();
  };

  /**
   * 开始绘制
   */
  handleStartClick = () => {
    const { status } = this.state;
    if (status === 'pending') {
      this.setState({
        status: 'running',
      });
      this.canvas.addEventListener('mousedown', this.handleCanvasMouseDown);
      this.canvas.addEventListener('mousemove', this.handleCanvasMouseMove);
      this.canvas.addEventListener('dblclick', this.handleCanvasDblClick);
    }
  };

  /**
   * 结束绘制
   */
  handleEndClick = () => {
    const { image, path, status } = this.state;
    if (path.length > 2 && status === 'running') {
      path.forEach(({ x, y }, i) => {
        if (i === 0) {
          this.ctx.beginPath();
          this.ctx.moveTo(x, y);
        } else {
          this.ctx.lineTo(x, y);
          if (i + 1 === path.length) {
            this.ctx.closePath();
          }
          this.ctx.stroke();
        }
      });
      const imageData = this.ctx.getImageData(0, 0, image.width, image.height);
      this.ctx.save();
      this.ctx.clearRect(0, 0, image.width, image.height);
      this.ctx.strokeStyle = '#ffffff00';
      this.ctx.clip();
      const xArray = path.map(({ x }) => x).sort((a, b) => a - b);
      const yArray = path.map(({ y }) => y).sort((a, b) => a - b);
      this.ctx.drawImage(this.img, 0, 0, image.width, image.height);
      this.getCropImage(
        this.ctx.getImageData(
          xArray[0],
          yArray[0],
          xArray[xArray.length - 1] - xArray[0],
          yArray[yArray.length - 1] - yArray[0],
        ),
      );
      this.ctx.restore();
      this.ctx.putImageData(imageData, 0, 0);
      this.setState({
        status: 'complete',
      });
      this.canvas.removeEventListener('mousedown', this.handleCanvasMouseDown);
      this.canvas.removeEventListener('mousemove', this.handleCanvasMouseMove);
      this.canvas.removeEventListener('dblclick', this.handleCanvasDblClick);
    }
  };

  /**
   * 重置图片，清除已绘制的路径
   */
  handleResetClick = () => {
    const { image } = this.state;
    if (image.data) {
      const { src, getCropImage } = this.props;
      this.ctx.restore();
      this.ctx.clearRect(0, 0, image.width, image.height);
      this.ctx.putImageData(image.data, 0, 0);
      getCropImage(src);
      this.setState({
        number: 0,
        transform: {
          scale: this.scale,
          translateX: 0,
          translateY: 0,
        },
        path: [],
        imageData: null,
        status: 'pending',
      });
    }
  };

  /**
   * 放大
   */
  zoomIn = () => {
    const { transform } = this.state;
    this.setState({
      transform: {
        ...transform,
        scale: transform.scale + 0.1,
      },
    });
  };

  /**
   * 缩小
   */
  zoomOut = () => {
    const { transform } = this.state;
    const { scale } = transform;
    if (scale > 0.1) {
      this.setState({
        transform: {
          ...transform,
          scale: scale - 0.1,
        },
      });
    }
  };

  /**
   * 鼠标在图片上的滚轮事件，用于放大缩小图片
   */
  mouseWheel = (e) => {
    if (e.deltaY > 0) {
      this.zoomOut();
    } else {
      this.zoomIn();
    }
  };

  /**
   * 图片的拖动事件
   */
  dragEvent = (event) => {
    event.preventDefault();
    const { transform } = this.state;
    const { translateX, translateY } = transform;
    const disX = event.clientX - translateX;
    const disY = event.clientY - translateY;

    document.onmousemove = (e) => {
      this.setState({
        transform: {
          ...transform,
          translateX: e.clientX - disX,
          translateY: e.clientY - disY,
        },
      });
    };
    document.onmouseup = () => {
      document.onmousemove = null;
      document.onmouseup = null;
    };
  };

  static dufaultProps = {
    src: '',
  };

  render() {
    const { className } = this.props;
    const { transform } = this.state;
    const { translateX, translateY, scale } = transform;
    return (
      <div className={cx(styles.container, className)} ref={this.wrapRef} onWheel={this.mouseWheel}>
        <canvas
          className={styles.canvas}
          style={{
            transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
          }}
          ref={this.canvasRef}
          onMouseDown={this.dragEvent}
        />
        <div className={styles.tools}>
          <Tooltip title="多边形套索">
            <div className={styles.tool} onClick={this.handleStartClick}>
              <Icon component={Polygon} />
            </div>
          </Tooltip>
          <Tooltip title="放大">
            <div className={styles.tool} onClick={this.zoomIn}>
              <ZoomInOutlined />
            </div>
          </Tooltip>
          <Tooltip title="缩小">
            <div className={styles.tool} onClick={this.zoomOut}>
              <ZoomOutOutlined />
            </div>
          </Tooltip>
          <Tooltip title="完成">
            <div className={styles.tool} onClick={this.handleEndClick}>
              <CheckOutlined />
            </div>
          </Tooltip>
          <Tooltip title="清除">
            <div className={styles.tool} onClick={this.handleResetClick}>
              <SyncOutlined />
            </div>
          </Tooltip>
        </div>
      </div>
    );
  }
}
