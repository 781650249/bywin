import React, { useState } from 'react';
import { Modal, Upload, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { putImageByBase64 } from '@/services/global';
import ImageCrop from './ImageCrop';

export default function(props) {
  const [visible, setVisible] = useState(false);
  const [cropImage, setCropImage] = useState('');
  const [preview, setPreview] = useState('');
  const {
    value = [],
    onChange = () => {},
    max = 99,
    types = ['image/jpeg', 'image/png', 'image/gif'],
  } = props;

  const beforeUpload = (file) => {
    const { type } = file;
    if (!types.includes(type)) {
      message.error(`文件格式只能是${types}`);
      return;
    }

    const reader = new FileReader();
    reader.addEventListener('load', () => {
      setCropImage(reader.result);
    });
    reader.readAsDataURL(file);
    return false;
  };

  const getCroppedImg = async (image) => {
    const imageUrl = await putImageByBase64({
      base64: image,
    });
    if (imageUrl) {
      onChange([...value, imageUrl]);
    } else {
      message.warning('上传图片失败！');
    }
  };

  const handlePreview = (file) => {
    setVisible(true);
    setPreview(file.url);
  };

  const handleRemove = (file) => {
    onChange(value.filter((image) => image !== file.url));
  };

  const handleCancel = () => setVisible(false);

  return (
    <>
      <Upload
        action=""
        listType="picture-card"
        fileList={value.map((image, index) => ({ url: image, uid: index }))}
        onRemove={handleRemove}
        onPreview={handlePreview}
        beforeUpload={beforeUpload}
      >
        {value.length < max && (
          <>
            <PlusOutlined />
            <div className="ant-upload-text">上传图片</div>
          </>
        )}
      </Upload>
      <ImageCrop
        image={cropImage}
        getCroppedImg={getCroppedImg}
        onCancel={() => setCropImage('')}
      />
      <Modal
        centered
        visible={visible}
        onCancel={handleCancel}
        footer={null}
        width="max-content"
        style={{ paddingBottom: 0 }}
        bodyStyle={{
          maxWidth: '100vw',
          maxHeight: '100vh',
          padding: 0,
          fontSize: 0,
          textAlign: 'center',
        }}
      >
        <img
          src={preview}
          alt="原图"
          style={{ minWidth: 300, maxWidth: '100%', maxHeight: '100vh' }}
        />
      </Modal>
    </>
  );
}