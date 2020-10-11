import React from 'react';
import { Modal } from 'antd';
import { connect } from 'dva';
import { uniq } from 'lodash';
import { imageCorrect } from '@/utils/previous/tools';
import ImageSelect from './ImageSelect';

@connect(({ searchPanel, searchingMap, incrementalSearch }) => {
  const {
    searchType,
    prevParams,
    content,
    faceContent,
    selectedResult,
    currentKey,
    multRelation,
  } = searchPanel;
  const { cameraIdList } = searchingMap;
  const {
    visible,
    faces,
    bodys,
    selectedFaceKeys,
    selectedBodyKeys,
    selectedKeys,
  } = incrementalSearch;
  return {
    searchType,
    prevParams,
    content,
    faceContent,
    selectedResult,
    currentKey,
    multRelation,

    cameraIdList,

    visible,
    faces,
    bodys,
    selectedFaceKeys,
    selectedBodyKeys,
    selectedKeys,
  };
})
class IncrementalSearch extends React.Component {
  componentDidUpdate(prevProps) {
    const { visible, searchType, selectedResult } = this.props;
    if (
      visible &&
      visible !== prevProps.visible &&
      searchType === 'person' &&
      selectedResult.length > 0
    ) {
      const isFace = selectedResult[0].searchType === 'face';
      this.fetchFacesOrBodys(isFace ? 'getBodys' : 'getFaces');
    }
  }

  setStore = (payload) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'incrementalSearch/setState',
      payload: {
        ...payload,
      },
    });
  };

  /**
   * 自动获取人脸或人体的卡片
   */
  fetchFacesOrBodys = (type) => {
    const { dispatch, selectedResult } = this.props;
    dispatch({
      type: `incrementalSearch/${type}`,
      payload: selectedResult.map((el) => el.imageUrl),
    });
  };

  handleSelect = (selectedKeys) => {
    this.setStore({ selectedKeys });
  };

  handleFaceSelect = (selectedFaceKeys) => {
    this.setStore({ selectedFaceKeys });
  };

  handleBodySelect = (selectedBodyKeys) => {
    this.setStore({ selectedBodyKeys });
  };

  handleOk = () => {
    const {
      dispatch,
      prevParams,
      content: prevContent,
      faceContent: prevFaceContent,
      currentKey,
      multRelation,
      selectedBodyKeys,
      selectedFaceKeys,
      selectedResult,
      onSearch,
    } = this.props;
    const content = uniq([...prevContent, ...selectedBodyKeys]);
    const faceContent = uniq([...prevFaceContent, ...selectedFaceKeys]);

    let prevSearchContent = [];
    let prevSearchFaceContent = [];
    if (prevParams.content) {
      prevSearchContent = prevParams.content.split(',');
    }

    if (prevParams.faceContent) {
      prevSearchFaceContent = prevParams.faceContent.split(',');
    }

    // 是否有新图片加入人体或人脸

    const prevSerachImgNumber = prevSearchContent.length + prevSearchFaceContent.length;
    const searchImgNumber = content.length + faceContent.length;
    if (
      currentKey
        ? searchImgNumber === Object.keys(multRelation).length
        : searchImgNumber === prevSerachImgNumber
    ) {
      onSearch();
      this.handleCencel();
    } else {
      const params = {
        content: content.filter((key) => !prevSearchContent.includes(key)).join(',') || null,
        faceContent:
          faceContent.filter((key) => !prevSearchFaceContent.includes(key)).join(',') || null,
      };

      if (prevSearchContent.length + prevSearchFaceContent.length === 0) {
        imageCorrect(selectedResult[0].imageUrl, (dataURL) => {
          dispatch({
            type: 'searchPanel/setState',
            payload: {
              content: [dataURL.replace(/^data:image\/(jpeg|png|gif);base64,/, ''), ...content],
              faceContent,
            },
          });
          this.search(params);
        });
      } else {
        dispatch({
          type: 'searchPanel/setState',
          payload: {
            content,
            faceContent,
          },
        });
        this.search(params);
      }
    }
  };

  search = ({ content, faceContent }) => {
    const { dispatch, onSearch, prevParams, cameraIdList } = this.props;
    if (content || faceContent) {
      const params = {
        ...prevParams,
        content,
        faceContent,
        cameraIds: cameraIdList.join(','),
        ids: null,
        idsType: null,
        pageNum: 1,
        isNewImage: true,
      };

      dispatch({
        type: 'searchPanel/search',
        payload: {
          ...params,
        },
        callback: () => {
          onSearch();
          this.handleCencel();
        },
      });
    } else {
      onSearch();
      this.handleCencel();
    }
  };

  handleCencel = () => {
    this.setStore({
      visible: false,
      bodys: [],
      faces: [],
      selectedBodyKeys: [],
      selectedFaceKeys: [],
      selectedKeys: [],
    });
  };

  render() {
    const {
      selectedResult,
      selectedKeys,
      faces,
      bodys,
      selectedFaceKeys,
      selectedBodyKeys,
      visible,
    } = this.props;
    return (
      <Modal visible={visible} width={960} onOk={this.handleOk} onCancel={this.handleCencel}>
        <div className="mb-24">
          <h3>选择要进行检索的图片</h3>
          <ImageSelect
            targetKey="id"
            targetUrl="imageUrl"
            images={selectedResult}
            selectedKeys={selectedKeys}
            onChange={this.handleSelect}
          />
        </div>
        {faces.length > 0 && (
          <div className="mb-24">
            <h3>选择要加入同行检索的人脸</h3>
            <ImageSelect
              images={faces}
              selectedKeys={selectedFaceKeys}
              onChange={this.handleFaceSelect}
            />
          </div>
        )}
        {bodys.length > 0 && (
          <div className="mb-24">
            <h3>选择要加入同行检索的人体</h3>
            <ImageSelect
              images={bodys}
              selectedKeys={selectedBodyKeys}
              onChange={this.handleBodySelect}
            />
          </div>
        )}
      </Modal>
    );
  }
}

IncrementalSearch.defaultProps = {
  onSearch: () => {},
};

export default IncrementalSearch