import React, { PureComponent } from 'react';
import { Tooltip } from 'antd';
import Icon, {
  SyncOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from '@ant-design/icons';
import cx from 'classnames';
import Cropper from 'cropperjs';
import styles from './ImageCrop.less';
import { Move, Crop } from './IconComponent';
import 'cropperjs/dist/cropper.css';

class ImageCrop extends PureComponent {
  constructor(props) {
    super(props);
    this.wrapRef = React.createRef();
    this.imgRef = React.createRef();
    this.Cropper = null;
    this.cropData = {};
  }

  componentDidMount() {
    this.cropperInit();
  }

  componentDidUpdate(prevProps) {
    const { image, column } = this.props;
    if (image !== prevProps.image && this.cropper !== null) {
      if (!/^(data:image|http|blob)/.test(image)) {
        this.cropper.replace(`data:image/jpeg;base64,${image}`);
      } else {
        this.cropper.replace(image);
      }
      this.cropper.replace(image);
    }
    if (column !== prevProps.column) {
      setTimeout(() => {
        const { width, height } = this.cropData;
        this.cropper.destroy();
        this.cropperInit(
          {
            autoCrop: width && height,
          },
          () => {
            this.cropper.setData(this.cropData);
          },
        );
      }, 300);
    }
  }

  componentWillUnmount() {
    if (this.cropper !== null) {
      this.cropper.destroy();
      this.cropper = null;
      this.cropData = {};
    }
  }

  cropperInit = (option = {}, callback = () => {}) => {
    const { image, getCropImage, onCropEnd } = this.props;
    const { current: img } = this.imgRef;
    if (!/^(data:image|http|blob)/.test(image)) {
      img.src = `data:image/jpeg;base64,${image}`;
    } else {
      img.src = image;
    }

    const getCropped = () => this.cropper.getCroppedCanvas().toDataURL('image/jpeg');
    this.cropper = new Cropper(img, {
      autoCrop: false,
      dragMode: 'move',
      background: false,
      ready: () => {
        if (/^data:image/.test(img.src)) {
          onCropEnd(img.src);
          getCropImage(img.src);
        } else {
          const cropData = getCropped();
          onCropEnd(cropData);
          getCropImage(cropData);
        }
        callback();
      },
      crop: () => {
        this.cropData = this.cropper.getData(true);
      },
      cropend: () => {
        getCropImage(getCropped());
        onCropEnd(getCropped());
      },
      zoom: () => {
        this.cropData = this.cropper.getData(true);
        getCropImage(getCropped());
      },
      ...option,
    });
  };

  dragReset = () => {
    if (this.cropper) {
      this.cropper.reset();
      this.cropper.clear();
      const { getCropImage, onCropEnd } = this.props;
      const image = this.cropper.getCroppedCanvas().toDataURL('image/jpeg');
      if (!/((^data:image)|(^http))\S+/.test(image)) {
        getCropImage(`data:image/jpeg;base64,${image}`);
        onCropEnd(`data:image/jpeg;base64,${image}`);
      } else {
        getCropImage(image);
        onCropEnd(image);
      }
    }
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

  render() {
    const { className, image } = this.props;
    return (
      <div className={cx(styles.container, className)} ref={this.wrapRef}>
        <img src={image} alt="" ref={this.imgRef} />
        <div className={styles.tools}>
          <Tooltip title="裁剪">
            <div className={styles.tool} onClick={() => this.setDragMode('crop')}>
              <Icon component={Crop} />
            </div>
          </Tooltip>
          <Tooltip title="移动">
            <div className={styles.tool} onClick={() => this.setDragMode('move')}>
              <Icon component={Move} />
            </div>
          </Tooltip>
          <Tooltip title="重置">
            <div className={styles.tool} onClick={this.dragReset}>
              <SyncOutlined />
            </div>
          </Tooltip>
          <Tooltip title="放大">
            <div className={styles.tool} onClick={() => this.zoom(0.1)}>
              <ZoomInOutlined />
            </div>
          </Tooltip>
          <Tooltip title="缩小">
            <div className={styles.tool} onClick={() => this.zoom(-0.1)}>
              <ZoomOutOutlined />
            </div>
          </Tooltip>
        </div>
      </div>
    );
  }
}
ImageCrop.defaultProps = {
  className: '',
  image: '',
};
export default ImageCrop;
// getCroppedImg = (imageData, callback) => {
//   const { image } = this.props;
//   const img = document.createElement('img');
//   img.onload = () => {
//     const canvas = document.createElement('canvas');
//     const ctx = canvas.getContext('2d');
//     const { naturalWidth, naturalHeight } = img;
//     const { x, y, width, height } = imageData;
//     if (width && height) {
//       canvas.width = width;
//       canvas.height = height;
//       ctx.drawImage(
//         img,
//         x,
//         y,
//         width,
//         height,
//         0,
//         0,
//         width,
//         height,
//       );
//     } else {
//       canvas.width = naturalWidth
//       canvas.height = naturalHeight
//       ctx.drawImage(
//         img,
//         0,
//         0,
//         naturalWidth,
//         naturalHeight,
//       );
//     }

//     const base64Image = canvas.toDataURL('image/jpeg', 1);
//     callback(base64Image);
//   };
//   img.src = image;
// };
