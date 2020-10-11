import React from 'react';
import { connect } from 'dva';
import cx from 'classnames';
import { Upload, Badge, message } from 'antd';
import { UploadOutlined, PictureOutlined } from '@ant-design/icons';
import styles from './PictureUpload.less';
import Cropper from '../Cropper';
import PictureView from './PictureView';

const PictureUpload = (props) => {
  const { dispatch, className = '', searchType, content, faceContent } = props;
  const beforeUpload = (file) => {
    if (file.size > 3 * 1024 * 1024) {
      message.warn('文件不得超过3M');
      return false;
    }
    const reader = new FileReader();
    reader.addEventListener(
      'load',
      () => {
        // 图片加载完成后获取图片的base64
        dispatch({
          type: 'pictureUpload/setState',
          payload: {
            image: reader.result,
            cropperVisible: true,
          },
        });
      },
      false,
    );
    reader.readAsDataURL(file);
    return false
  };

  const count = () => {
    if (searchType === 'person') {
      return content.length + faceContent.length;
    }
    return content.length;
  };

  const openUploadedPictures = () => {
    dispatch({
      type: 'pictureUpload/setState',
      payload: {
        viewVisible: true,
      },
    });
  };
  return (
    <div className={cx(styles.wrap, className)}>
      <Upload
        className={styles.upload}
        accept="image/gif,image/jpeg,image/png,image/bmp"
        showUploadList={false}
        beforeUpload={beforeUpload}
      >
        <UploadOutlined />
        点击上传图片
      </Upload>
      <Badge count={count()} overflowCount={9}>
        <div className={styles.icon} onClick={openUploadedPictures}>
          <PictureOutlined style={{ color: '#1890ff' || '#9b9ea0' }} />
        </div>
      </Badge>
      <Cropper />
      <PictureView />
    </div>
  );
};
export default connect(({ searchPanel }) => {
  const { searchType, content, faceContent } = searchPanel;
  return {
    searchType,
    content,
    faceContent,
  };
})(PictureUpload);
