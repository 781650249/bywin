import React, { Component } from 'react';
import { connect } from 'dva';
import { Modal, Form, Input, Upload, Tabs } from 'antd';
import { isJSONString } from '@/utils/previous/tools';

const { TabPane } = Tabs;
const { Item: FormItem } = Form;
const { confirm } = Modal;
// const { Option } = AutoComplete;
const { TextArea } = Input;

class ArchiveEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
      previewImage: '',
      fileList: [],
      EditRecordObject: {},
      conditions: {},
      activeKey: '',
    };
  }

  componentDidMount() {
    const { EditRecordData } = this.props;
    const { conditions } = EditRecordData;
    if (isJSONString(conditions)) {
      this.setState({
        conditions: JSON.parse(conditions),
      });
    }
    this.setFileList(EditRecordData);
  }

  // componentWillReceiveProps = (next) => {
  //   const { EditRecordData } = this.props;
  //   const { EditRecordData: nextEditRecordData } = next;
  //   if (EditRecordData !== nextEditRecordData) {
  //     this.setFileList(nextEditRecordData)
  //   }
  // }

  setFileList = (record) => {
    const { details = [] } = record;
    const fileList = [];
    details.forEach((p) => {
      const object = {
        uid: p.id,
        url: p.imageUrl,
      };
      fileList.push(object);
    });
    this.setState({
      fileList,
      EditRecordObject: record,
    });
  };

  handleTabsChange = (activeKey) => {
    this.setState({
      activeKey,
    });
  };

  /**
   * 同行归档对图片的删除操作
   */
  handleImageChange = ({ fileList }) => {
    const { EditRecordObject, activeKey, conditions } = this.state;
    const newConditions = { ...conditions };
    const ids = fileList.map((file) => file.uid);
    if (conditions.current === activeKey) {
      const currentImageList = conditions.selectedMultipleSearch[activeKey];
      const newImageList = [];
      currentImageList.forEach((item) => {
        if (ids.includes(item.id)) {
          newImageList.push(item);
        }
      });
      newConditions.selectedMultipleSearch = {
        ...newConditions.selectedMultipleSearch,
        [activeKey]: newImageList,
      };
      this.setState({
        conditions: newConditions,
        EditRecordObject: {
          ...EditRecordObject,
          details: newImageList,
          imgIds: newImageList.map((item) => item.imageUrl).join(';'),
          conditions: JSON.stringify(newConditions),
        },
      });
    } else {
      const currentImageList = conditions.selectedMultipleSearch[activeKey];
      const newImageList = [];
      currentImageList.forEach((item) => {
        if (ids.includes(item.id)) {
          newImageList.push(item);
        }
      });
      newConditions.selectedMultipleSearch = {
        ...newConditions.selectedMultipleSearch,
        [activeKey]: newImageList,
      };
      this.setState({
        conditions: newConditions,
        EditRecordObject: {
          ...EditRecordObject,
          conditions: JSON.stringify(newConditions),
        },
      });
    }
  };

  multipleSearchRender = () => {
    const { conditions, activeKey, previewImage, previewVisible, fileList } = this.state;
    if (conditions.current && Object.keys(conditions.keyValue).length > 0) {
      const { selectedMultipleSearch, keyValue } = conditions;
      return (
        <Tabs type="card" activeKey={activeKey} onChange={this.handleTabsChange}>
          {Object.keys(keyValue).map((key) => {
            const imageList = selectedMultipleSearch[key].map((item) => ({
              uid: item.id,
              url: item.imageUrl,
            }));
            const { activeKey: newActiveKey } = this.state;
            if (!newActiveKey) {
              this.setState({
                activeKey: key,
              });
            }
            return (
              <TabPane
                tab={
                  <span>
                    <img
                      src={`data:image/jpeg;base64,${keyValue[key]}`}
                      alt=""
                      style={{
                        width: 40,
                        height: 40,
                        borderWidth: 1,
                        borderStyle: 'solid',
                        borderColor: activeKey === key ? '#1890ff' : '#fff',
                      }}
                    />
                  </span>
                }
                key={key}
              >
                <div>
                  <Upload
                    listType="picture-card"
                    fileList={imageList}
                    onPreview={this.handlePreview}
                    onChange={this.handleImageChange}
                  />
                  <Modal visible={previewVisible} footer={null} onCancel={this.previewHandleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                  </Modal>
                </div>
              </TabPane>
            );
          })}
        </Tabs>
      );
    }
    return (
      <>
        <Upload
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        />
        <Modal visible={previewVisible} footer={null} onCancel={this.previewHandleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </>
    );
  };

  handleOk = () => {
    const { dispatch } = this.props;
    const { EditRecordObject } = this.state;
    const parmas = {
      ...EditRecordObject,
      updateType: '0',
    };
    confirm({
      title: '确定更新该研判档案?',
      okText: '确定',
      cancelText: '取消',
      zIndex: 2000,
      onOk: () => {
        dispatch({
          type: 'record/editRecord',
          payload: parmas,
          callback: () => {
            this.getTableData();
            this.editRecordVisible(false);
          },
        });
      },
      onCancel: () => {},
    });
  };

  handleCancel = () => {
    this.editRecordVisible(false);
  };

  getTableData = (page = 1, size = 10) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'record/getTableData',
      payload: { pageNum: page, pageSize: size },
    });
  };

  // 打开和关闭编辑Model
  editRecordVisible = (bool) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'record/changeState',
      payload: {
        EditRecordVisible: bool,
      },
    });
  };

  handleChange = ({ fileList }) => {
    const { EditRecordObject = {} } = this.state;
    const a = EditRecordObject.details;
    const b = [];
    const imgIds = [];
    a.forEach((p) => {
      if (fileList.filter((x) => x.uid === p.id).length > 0) {
        b.push(p);
      }
    });
    b.forEach((p) => {
      imgIds.push(p.imageUrl);
    });
    this.setState({
      fileList,
      EditRecordObject: {
        ...EditRecordObject,
        details: b,
        imgIds: imgIds.join(';'),
      },
    });
  };

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  previewHandleCancel = () => {
    this.setState({
      previewVisible: false,
    });
  };

  render() {
    const { EditRecordVisible, EditRecordData } = this.props;
    const { videoReseachName, actionName, remark } = EditRecordData;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };

    return (
      <div style={{ flex: 1 }}>
        <Modal
          zIndex={999}
          title="编辑档案"
          visible={EditRecordVisible}
          onOk={this.handleOk}
          onCancel={() => {
            this.handleCancel();
          }}
        >
          <Form {...formItemLayout}>
            <FormItem label="研判名称">
              <Input
                style={{ width: 200 }}
                autoComplete="off"
                placeholder={videoReseachName}
                disabled
              />
            </FormItem>
            <FormItem label="案件名称">
              <Input style={{ width: 200 }} autoComplete="off" placeholder={actionName} disabled />
            </FormItem>

            <FormItem label="图片组">
              {this.multipleSearchRender()}
            </FormItem>
            <FormItem
              label="备注"
              name="remark"
              rules={[{ max: 150, message: '长度应小于150!' }]}
            >
              <TextArea
                autosize={{ minRows: 2 }}
                style={{ width: 200 }}
                placeholder={remark}
                disabled
              />
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    ...state.record,
    ...state.cluesForm,
  };
}
export default connect(mapStateToProps)(ArchiveEdit);
