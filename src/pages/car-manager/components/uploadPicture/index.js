import React, { Component } from 'react';
import { Upload, Modal, message } from 'antd';
import PropTypes from 'prop-types';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { PlusOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import styles from './index.less';

class UploadPicture extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cropImage: '',
      previewVisible: false,
      previewType: 'sc',
      previewImage: '',
      crop: {},
    };
  }

  /**
   * 图片选择后上传前操作
   */
  beforeUpload = (file) => {
    const img = ['image/jpeg', 'image/png', 'image/gif'];
    if (img.indexOf(file.type) === -1) {
      message.error(`文件只能是${img}格式`);
      return;
    }
    this.setState({ previewType: 'sc' });
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      this.setState({
        cropImage: reader.result,
        previewVisible: true,
      });
    });
    reader.readAsDataURL(file);
    return false;
  };

  /**
   * 关闭弹出框
   */
  closePreview = () => {
    this.setState({
      previewVisible: false,
      previewImage: '',
      crop: {},
      previewType: '',
      cropImage: '',
    });
  };

  /**
   * 裁剪图片
   */
  changeImage = (crop) => {
    this.setState({ crop });
  };

  onImageLoaded = (image) => {
    this.image = image;
  };

  /**
   * 拖动/调整大小时的回调
   */
  onCropComplete = () => {
    const { crop } = this.state;
    if (!crop.width) {
      return this.image.src;
    }
    if (crop.width === 0 && crop.height === 0) {
      return this.image.src;
    }
    const canvas = document.createElement('canvas');
    const scaleX = this.image.naturalWidth / this.image.width;
    const scaleY = this.image.naturalHeight / this.image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      this.image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height,
    );
    return canvas.toDataURL('image/jpeg');
  };

  onOk = () => {
    const croppedImg = this.onCropComplete();
    this.props.selecteImage(croppedImg);
    this.closePreview();
  };

  handlePreview = (file) => {
    this.setState({
      previewType: 'yl',
      previewImage: file.url,
      previewVisible: true,
    });
  };

  render() {
    const { props } = this;
    const { max = 10 } = props;
    const { previewVisible, cropImage, crop, previewType, previewImage } = this.state;
    return (
      <>
        <Upload
          action=""
          listType="picture-card"
          className={props.isIcon ? null : styles.hideIcon}
          fileList={props.fileList}
          beforeUpload={this.beforeUpload}
          onPreview={this.handlePreview}
          onRemove={props.onRemove}
        >
          {props.fileList.length >= max ? null : (
            <>
              <PlusOutlined />
              <div className="ant-upload-text">上传照片</div>
            </>
          )}
        </Upload>
        <Modal
          visible={previewVisible}
          onCancel={this.closePreview}
          footer={null}
          closable={false}
          wrapClassName={styles.wrap}
        >
          {previewType === 'yl' && <img alt="" style={{ width: '100%' }} src={previewImage} />}
          {previewType === 'sc' && (
            <>
              <ReactCrop
                src={cropImage}
                crop={crop}
                onImageLoaded={this.onImageLoaded}
                onComplete={this.onCropComplete}
                onChange={this.changeImage}
              />
              <div className={styles.footer}>
                <p onClick={() => this.onOk()}>
                  <CheckOutlined />
                </p>
                <p onClick={this.closePreview}>
                  <CloseOutlined />
                </p>
              </div>
            </>
          )}
        </Modal>
      </>
    );
  }
}

UploadPicture.propTypes = {
  fileList: PropTypes.arrayOf(PropTypes.object),
  isIcon: PropTypes.bool,
  onRemove: PropTypes.func,
};
UploadPicture.defaultProps = {
  fileList: [],
  isIcon: true,
  onRemove: () => {},
};
export default UploadPicture;
