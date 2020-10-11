import React from 'react';
import { connect } from 'dva';
import ReactDOM from 'react-dom';
import cx from 'classnames';
import Dragger from 'react-dragger-r';
import { Modal } from 'antd';
import Icon, { CloseOutlined } from '@ant-design/icons';
import { saveAs } from 'file-saver';
import { dataURLtoBlob } from '@/utils/previous/tools';
import { Crop, Delete, Download } from '../../components/icon';
import styles from './PictureView.less';

const { confirm } = Modal;

@connect(({ searchPanel, pictureUpload }) => {
  const { searchType, content, faceContent, currentKey, multRelation } = searchPanel;
  const { viewVisible } = pictureUpload;
  return {
    searchType,
    content,
    faceContent,
    currentKey,
    multRelation,
    viewVisible:
      viewVisible &&
      (searchType === 'person' ? content.length + faceContent.length > 0 : content.length > 0),
  };
})
class PictureView extends React.Component {
  constructor(props) {
    super(props);
    this.el = document.createElement('div');
  }

  componentDidMount() {
    document.body.appendChild(this.el);
  }

  componentWillUnmount() {
    document.body.removeChild(this.el);
  }

  handleCrop = (img) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'pictureUpload/setState',
      payload: {
        image: this.imageFormat(img),
        cropperVisible: true,
      },
    });
  };

  handleDownload = (img) => {
    saveAs(dataURLtoBlob(img), '下载图片.jpg');
  };

  handleDelete = (img) => {
    const {
      dispatch,
      content: prevContent,
      faceContent: prevFaceContent,
      multRelation,
    } = this.props;

    const currentKey = Object.keys(multRelation).find((key) => img.includes(multRelation[key]));
    if (currentKey) {
      confirm({
        title: '是否删除该图片?',
        content: '删除后会清除对应的搜索结果',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          if (currentKey) {
            dispatch({
              type: 'searchPanel/multSearchDelete',
              currentKey,
            });
          } else {
            dispatch({
              type: 'searchPanel/setState',
              payload: {
                prevParams: {},
                searchResult: [],
                selectedResult: [],
              },
            });
          }

          const content = prevContent.filter((image) => image !== img);
          const faceContent = prevFaceContent.filter((image) => image !== img);
          dispatch({
            type: 'searchPanel/setState',
            payload: {
              content,
              faceContent,
            },
          });
        },
        onCancel() {},
      });
    } else {
      const content = prevContent.filter((image) => image !== img);
      const faceContent = prevFaceContent.filter((image) => image !== img);
      dispatch({
        type: 'searchPanel/setState',
        payload: {
          content,
          faceContent,
        },
      });
    }
  };

  imageFormat = (img) => {
    if (/^(http|data)/.test(img)) {
      return img;
    }
    return `data:image/png;base64,${img}`;
  };

  handleClose = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'pictureUpload/setState',
      payload: {
        viewVisible: false,
      },
    });
  };

  picturesRender = () => {
    const { content, faceContent } = this.props;
    return [...content, ...faceContent].map((img, index) => (
      <div className={styles.imgWrap} key={index}>
        <img src={this.imageFormat(img)} alt="" />
        <div className={styles.actions}>
          <div
            className={styles.action}
            title="裁剪"
            onClick={() => this.handleCrop(img)}
            style={{ fontSize: 18 }}
          >
            <Icon component={Crop} />
          </div>
          <div className={styles.action} title="下载" onClick={() => this.handleDownload(img)}>
            <Icon component={Download} />
          </div>
          <div className={styles.action} title="删除" onClick={() => this.handleDelete(img)}>
            <Icon component={Delete} />
          </div>
        </div>
      </div>
    ));
  };

  render() {
    const { viewVisible } = this.props;
    return ReactDOM.createPortal(
      <Dragger className={styles.wrap}>
        <div
          className={cx(styles.container, 'shadow', {
            [styles.visible]: viewVisible,
          })}
        >
          <div className={styles.header}>
            <div className={styles.close} onClick={this.handleClose}>
              <CloseOutlined />
            </div>
          </div>
          <div className={styles.content}>{this.picturesRender()}</div>
        </div>
      </Dragger>,
      this.el,
    );
  }
}

export default PictureView;
