import React, { PureComponent } from 'react';
// import JSZip from 'jszip';
// import { saveAs } from 'file-saver/FileSaver';
import { Modal, Radio, Checkbox, Spin, Button, message } from 'antd';
import { connect } from 'dva';
import md5 from 'md5';
import cx from 'classnames';
import { uniq, uniqBy } from 'lodash';
import styles from './index.less';
import ImageCrop from './ImageCrop';
import Cutout from './Cutout';

const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

@connect(({ searchPanel, pictureUpload, loading }) => {
  const { searchType, faceContent, content } = searchPanel;

  const { image, cropperVisible, allFaces, allBodys } = pictureUpload;
  return {
    cropperVisible,
    image,
    allFaces,
    allBodys,
    searchType,
    faceContent,
    content,
    loading: loading.effects['pictureUpload/getBodyAndFace'],
  };
})
class Cropper extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      mode: 'rect',
      column: 0,
      cropImage: {
        rect: null,
        path: null,
      },
      selectedBodys: [],
      faceContent: '',
      selectedFaces: [],
      previewChecked: true,
      manualBodys: [],
      manualFaces: [],
    };
  }

  componentDidUpdate(prevProps) {
    const { dispatch, cropperVisible } = this.props;
    if (!cropperVisible && cropperVisible !== prevProps.cropperVisible) {
      dispatch({
        type: 'pictureUpload/setState',
        payload: {
          allFaces: [],
          allBodys: [],
        },
      });
    }
  }

  componentWillUnmount() {
    this.resetState();
  }

  fetchBodyAndFace = (base64) => {
    const { dispatch } = this.props;
    const { faceContent } = this.state;
    if (faceContent === base64) {
      return false;
    }
    this.setState({
      faceContent: base64,
    });
    let content = base64;
    let picFormatSuffix = 'jpeg';
    if (typeof base64 === 'string' && this.isHaveImageFormat(base64)) {
      content = base64.replace(/^data:image\/(jpeg|png|gif);base64,/, '');
      const matchObj = /^data:image\/(jpeg|png|gif);base64,/.exec(base64);
      picFormatSuffix = String(matchObj[1]);
    }
    dispatch({
      type: 'pictureUpload/getBodyAndFace',
      payload: {
        content,
        picFormatSuffix,
      },
    });
  };

  isHaveImageFormat = (base64 = '') => /^data:image\/(jpeg|png|gif);base64,/.test(base64);

  onPreviewChange = (e) => {
    const { checked } = e.target;
    this.setState({
      previewChecked: checked,
    });
  };

  onBodyChange = (e) => {
    const { allBodys } = this.props;
    const { manualBodys, selectedBodys, selectedFaces } = this.state;
    const { checked } = e.target;

    const selectFaceKeys = selectedFaces.map((body) => body.key);
    const nextManualBodys = manualBodys.filter((face) => !selectFaceKeys.includes(face.key));
    if (nextManualBodys.length !== manualBodys.length) {
      message.warn('人脸里存在和已选中人体相同的图片，无法全选');
    }
    const nextSelectedBodys = uniqBy([...allBodys, ...nextManualBodys, ...selectedBodys], 'image');
    this.setState({
      selectedBodys: checked ? nextSelectedBodys : [],
    });
  };

  onFaceChange = (e) => {
    const { allFaces } = this.props;
    const { manualFaces, selectedFaces, selectedBodys } = this.state;
    const { checked } = e.target;
    const selectBodyKeys = selectedBodys.map((body) => body.key);
    const nextManualFaces = manualFaces.filter((face) => !selectBodyKeys.includes(face.key));
    if (nextManualFaces.length !== manualFaces.length) {
      message.warn('人体里存在和已选中人体相同的图片，无法全选');
    }
    const nextSelectedFaces = uniqBy([...allFaces, ...nextManualFaces, ...selectedFaces], 'image');
    this.setState({
      selectedFaces: checked ? nextSelectedFaces : [],
    });
  };

  onSelectFace = (selectedFace) => {
    const { selectedBodys, selectedFaces } = this.state;
    if (selectedBodys.some((body) => body.image === selectedFace.image)) {
      message.warning('所选中的人体中存在与当前相同的图片');
      return;
    }

    let faces = [];
    if (selectedFaces.some((face) => face.key === selectedFace.key)) {
      faces = selectedFaces.filter((face) => face.key !== selectedFace.key);
    } else {
      faces = [...selectedFaces, selectedFace];
    }
    this.setState({
      selectedFaces: faces,
    });
  };

  onSelectBody = (selectedBody) => {
    const { selectedFaces, selectedBodys } = this.state;
    if (selectedFaces.some((face) => face.image === selectedBody.image)) {
      message.warning('所选中的人脸中存在与当前相同的图片');
      return;
    }
    let bodys = [];
    if (selectedBodys.some((face) => face.key === selectedBody.key)) {
      bodys = selectedBodys.filter((face) => face.key !== selectedBody.key);
    } else {
      bodys = [...selectedBodys, selectedBody];
    }
    this.setState({
      selectedBodys: bodys,
    });
  };

  onOk = () => {
    const { mode, cropImage, selectedFaces, selectedBodys, previewChecked } = this.state;
    const { dispatch, searchType, content: prevContent, faceContent: prevFaceContent } = this.props;

    const faceContent = uniq([...prevFaceContent, ...selectedFaces.map((face) => face.image)]);
    let content = uniq([...prevContent, ...selectedBodys.map((body) => body.image)]);

    if (searchType !== 'person' && previewChecked) {
      content = uniq([
        ...content,
        cropImage[mode].replace(/^data:image\/(jpeg|png|gif);base64,/, ''),
      ]);
    }

    dispatch({
      type: 'searchPanel/setState',
      payload: {
        content,
        faceContent,
      },
    });
    this.resetState();
  };

  onCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'pictureUpload/setState',
      payload: {
        cropperVisible: false,
        image: '',
        allFaces: [],
        allBodys: [],
      },
    });
    this.resetState();
  };

  resetState = () => {
    this.setState({
      mode: 'rect',
      column: 0,
      cropImage: {
        rect: null,
        path: null,
      },
      faceContent: '',
      selectedBodys: [],
      selectedFaces: [],
      manualBodys: [],
      manualFaces: [],
      previewChecked: false,
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'pictureUpload/setState',
      payload: {
        cropperVisible: false,
        image: '',
        allFaces: [],
        allBodys: [],
      },
    });
  };

  /**
   * 生成人体列表
   */
  renderBodyList = () => {
    const { allBodys, searchType } = this.props;
    const { selectedBodys, manualBodys } = this.state;
    if (searchType !== 'person') {
      return null;
    }
    return uniqBy([...allBodys, ...manualBodys, ...selectedBodys], 'image').map((body) => {
      const { key, image } = body;
      return (
        <div
          key={key}
          className={cx(styles.imgWrap, {
            [styles.active]: selectedBodys.some((v) => v.image === image),
          })}
          onClick={() => this.onSelectBody(body)}
        >
          <img
            src={this.isHaveImageFormat(image) ? image : `data:image/png;base64,${image}`}
            alt=""
          />
        </div>
      );
    });
  };

  /**
   * 生成人脸列表
   */
  renderFaceList = () => {
    const { allFaces, searchType } = this.props;
    const { selectedFaces, manualFaces } = this.state;
    if (searchType !== 'person') {
      return null;
    }
    return uniqBy([...allFaces, ...manualFaces, ...selectedFaces], 'image').map((face) => {
      const { key, image } = face;
      return (
        <div
          key={key}
          className={cx(styles.imgWrap, {
            [styles.active]: selectedFaces.some((v) => v.image === image),
          })}
          onClick={() => this.onSelectFace(face)}
        >
          <img
            src={this.isHaveImageFormat(image) ? image : `data:image/png;base64,${image}`}
            alt=""
          />
        </div>
      );
    });
  };

  clearBase64 = (base64) => {
    if (base64) {
      return base64.replace(/^data:image\/(jpeg|png|gif);base64,/, '');
    }
    return '';
  };

  handleAddBody = () => {
    const { cropImage, mode, manualBodys } = this.state;
    const current = this.clearBase64(cropImage[mode]);
    // 去掉格式后的base64经过md5压缩后当做key
    const currentKey = md5(current);
    if (manualBodys.map((face) => face.key).includes(currentKey)) return;
    const newManualBodys = uniqBy([...manualBodys, { image: current, key: currentKey }], 'image');
    this.setState({
      manualBodys: newManualBodys,
    });
  };

  /**
   * 将预览图添加到人脸
   */
  handleAddFace = () => {
    const { manualFaces, cropImage, mode } = this.state;

    const current = this.clearBase64(cropImage[mode]);
    const currentKey = md5(current);
    if (manualFaces.map((face) => face.key).includes(currentKey)) return;
    const newManualFaces = uniqBy([...manualFaces, { image: current, key: currentKey }], 'image');
    this.setState({
      manualFaces: newManualFaces,
    });
  };

  render() {
    const { cropperVisible, image, allBodys, allFaces, searchType, loading } = this.props;
    const {
      mode,
      column,
      cropImage,
      previewChecked,
      selectedBodys,
      selectedFaces,
      manualBodys,
      manualFaces,
    } = this.state;

    const bodyChecked =
      selectedBodys.length > 0 &&
      selectedBodys.length ===
        uniqBy([...allBodys, ...manualBodys, ...selectedBodys], 'image').length;
    const faceChecked =
      selectedFaces.length > 0 &&
      selectedFaces.length ===
        uniqBy([...allFaces, ...manualFaces, ...selectedFaces], 'image').length;
    return (
      <Modal
        visible={cropperVisible}
        centered
        destroyOnClose
        closable={false}
        footer={null}
        zIndex={1001}
        width="calc(100% - 64px)"
        style={{ paddingBottom: 0 }}
        bodyStyle={{ padding: 0 }}
        wrapClassName={styles.modalWrap}
      >
        <div className={styles.cropWrap} style={{ height: 'calc(100vh - 64px)' }}>
          <div className={cx(styles.crop)}>
            <RadioGroup
              className={styles.modeChange}
              onChange={(e) => this.setState({ mode: e.target.value })}
              value={mode}
            >
              <RadioButton value="rect">自动结构化</RadioButton>
              <RadioButton value="path">自定义截图</RadioButton>
            </RadioGroup>
            {mode === 'path' ? (
              <Cutout
                src={image}
                image={image}
                getCropImage={(img) => this.setState({ cropImage: { ...cropImage, path: img } })}
                className={styles.imgWrap}
              />
            ) : (
              <ImageCrop
                column={column}
                image={image}
                getCropImage={(img) => this.setState({ cropImage: { ...cropImage, rect: img } })}
                onCropEnd={this.fetchBodyAndFace}
                className={styles.imgWrap}
              />
            )}
          </div>
          <div className={styles.preview}>
            <div className={styles.screenshot}>
              {searchType === 'person' ? (
                <div style={{ marginBottom: 3 }}>编辑预览</div>
              ) : (
                <Checkbox
                  checked={previewChecked}
                  onChange={this.onPreviewChange}
                  style={{ marginBottom: 3 }}
                >
                  编辑预览
                </Checkbox>
              )}

              <div className={styles.imgWrap}>
                <img
                  src={cropImage[mode]}
                  alt=""
                  onClick={() => {
                    if (searchType !== 'person') {
                      this.setState({ previewChecked: !previewChecked });
                    }
                  }}
                />
              </div>
              <div
                className={cx('text-right', 'mt-8', {
                  hide: searchType !== 'person',
                })}
              >
                <Button size="small" onClick={this.handleAddFace}>
                  添加到人脸
                </Button>
                <Button size="small" onClick={this.handleAddBody} className="ml-8">
                  添加到人体
                </Button>
              </div>
            </div>
            <div className={styles.face}>
              <Checkbox
                indeterminate={!faceChecked && selectedFaces.length > 0}
                checked={faceChecked}
                disabled={loading}
                onChange={this.onFaceChange}
                style={{
                  marginBottom: 3,
                  visibility: searchType === 'person' ? 'visible' : 'hidden',
                }}
              >
                人脸预览
              </Checkbox>
              <Spin spinning={loading}>
                <div className={styles.items}>{this.renderFaceList()}</div>
              </Spin>
            </div>
            <div className={styles.body}>
              <Checkbox
                indeterminate={!bodyChecked && selectedBodys.length > 0}
                checked={bodyChecked}
                disabled={loading}
                onChange={this.onBodyChange}
                style={{
                  marginBottom: 3,
                  visibility: searchType === 'person' ? 'visible' : 'hidden',
                }}
              >
                人体预览
              </Checkbox>
              <div className={styles.items}>
                {allFaces.length === 0 && (
                  <Spin
                    spinning={loading}
                    style={{
                      flex: 1,
                      display: 'flex',
                      flexShrink: 0,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  />
                )}

                {this.renderBodyList()}
              </div>
            </div>

            <div className={styles.actions}>
              <Button onClick={this.onCancel}>取消</Button>
              <Button type="primary" onClick={this.onOk}>
                提交
              </Button>
            </div>
          </div>
          <div />
        </div>
      </Modal>
    );
  }
}

export default Cropper;
