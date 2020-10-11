import React from 'react';
import { Modal } from 'antd';
import { connect } from 'dva';
import ImageSelect from '../SearchPanel/IncrementalSearch/ImageSelect';

@connect(({ reconfirm }) => {
  const { visible, content, faceContent, selectedContent, selectedFaceContent } = reconfirm;
  return {
    visible,
    content,
    faceContent,
    selectedContent,
    selectedFaceContent,
  };
})
class Reconfirm extends React.Component {
  handleOk = () => {
    const { dispatch, selectedContent, selectedFaceContent } = this.props;
    dispatch({
      type: 'searchPanel/setState',
      payload: {
        content: selectedContent,
        faceContent: selectedFaceContent,
      },
    });
    this.handleCencel();
  };

  handleCencel = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'reconfirm/clear' });
  };

  handleFaceContentChange = (selectedFaceContent) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'reconfirm/setState',
      payload: {
        selectedFaceContent,
      },
    });
  };

  handleContentChange = (selectedContent) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'reconfirm/setState',
      payload: {
        selectedContent,
      },
    });
  };

  render() {
    const { visible, content, faceContent, selectedContent, selectedFaceContent } = this.props;
    return (
      <Modal visible={visible} width={960} onOk={this.handleOk} onCancel={this.handleCencel}>
        {faceContent.length > 0 && (
          <div className="mb-24">
            <h3>选择要加入搜索条件的人脸</h3>
            <ImageSelect
              images={faceContent}
              selectedKeys={selectedFaceContent}
              onChange={this.handleFaceContentChange}
            />
          </div>
        )}
        {content.length > 0 && (
          <div className="mb-24">
            <h3>选择要加入搜索条件的人体</h3>
            <ImageSelect
              images={content}
              selectedKeys={selectedContent}
              onChange={this.handleContentChange}
            />
          </div>
        )}
      </Modal>
    );
  }
}

export default Reconfirm;
