import React, { useState, useRef } from 'react';
import { Modal } from 'antd';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

export default function ImageCrop(props) {
  const { image: src, getCroppedImg, onCancel } = props;
  const [crop, setCrop] = useState({});
  const imgRef = useRef();

  const onOk = () => {
    const image = imgRef.current;
    const { x, y, width, height } = crop;

    if (!width || !height || !image) {
      getCroppedImg(src);
    } else {
      const canvas = document.createElement('canvas');
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      canvas.width = crop.width;
      canvas.height = crop.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(
        image,
        x * scaleX,
        y * scaleY,
        width * scaleX,
        height * scaleY,
        0,
        0,
        width,
        height,
      );
      const base64Image = canvas.toDataURL('image/jpeg');
      getCroppedImg(base64Image);
    }
    onCancel();
    setCrop({});
  };

  const onImageLoaded = (image) => {
    imgRef.current = image;
    return false;
  };
  const onChange = (nextCrop) => {
    setCrop(nextCrop);
  };

  return (
    <Modal
      centered
      closable={false}
      visible={!!src}
      footer={null}
      width="max-content"
      style={{ paddingBottom: 0 }}
      bodyStyle={{
        maxWidth: '80vw',
        maxHeight: '100vh',
        padding: 0,
        fontSize: 0,
        textAlign: 'center',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: '100%',
          width: 48,
          height: 96,
          color: 'rgba(255, 255, 255, .65)',
          fontSize: 24,
          textAlign: 'center',
          backgroundColor: 'rgba(0, 0, 0, .65)',
          cursor: 'pointer',
        }}
      >
        <div style={{ height: 48 }} onClick={onOk}>
          <CheckOutlined />
        </div>
        <div style={{ height: 48 }} onClick={onCancel}>
          <CloseOutlined />
        </div>
      </div>
      <ReactCrop
        src={src}
        crop={crop}
        onChange={onChange}
        onImageLoaded={onImageLoaded}
        style={{ maxHeight: '100vh' }}
        imageStyle={{ maxHeight: '100vh' }}
      />
    </Modal>
  );
}
