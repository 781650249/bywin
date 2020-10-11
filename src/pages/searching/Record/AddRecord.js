import React, { Component } from 'react';
import { connect } from 'dva';
import { Modal, Form, Input, Radio, Tabs, Table, Spin, message } from 'antd';
import logger from '@/utils/logger';

const { TabPane } = Tabs;

const { Item: FormItem } = Form;
// const { Option } = AutoComplete;
const { TextArea } = Input;
const { confirm } = Modal;

class AddRecord extends Component {
  constructor(props) {
    super(props);
    this.updateType = '0';
    this.formRef = React.createRef();
  }

  componentDidMount() {
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'addRecord/getCaseNameList',
    //   payload: {},
    // });
    this.getTableData();
  }

  changeState = (params) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'addRecord/changeState',
      payload: params,
    });
  };

  handleOk = () => {
    const {
      selectedResult,
      prevParams: oldParams,
      dispatch,
      caseNameList,
      cameraIdList,
      tabs,
      record,
      content,
      faceContent: face,
      currentKey: current,
      multRelation: keyValue,
      multSelectedResult: selectedMultipleSearch,
    } = this.props;

    const imgIds = [];
    selectedResult.forEach((card) => {
      imgIds.push(card.imageUrl);
    });
    if (tabs === '2') {
      if (!record) {
        message.error('请选择要合并的档案');
        return;
      }
      const params = {
        ...record,
        imgIds: imgIds.join(';'),
        details: JSON.stringify(selectedResult),
        conditions: JSON.stringify({
          ...oldParams,
          current,
          keyValue,
          selectedMultipleSearch,
          cameraIds: cameraIdList,
        }),
      };
      const par = {
        ...params,
        updateType: '1',
      };
      this.update(par, () => {});
    } else {
      this.formRef.current
        .validateFields()
        .then((values) => {
          const { name, type, id } = caseNameList.find((obj) => obj.name === values.actionName) || {
            name: values.actionName,
          };
          const clearFormat = (string) => {
            if (/^data:image\/(jpeg|png|gif);base64,/.test(string)) {
              return string.replace(/^data:image\/(jpeg|png|gif);base64,/, '');
            }
            return string;
          };
          const params = {
            ...values,
            actionName: name,
            type,
            jqId: id,
            imgIds: imgIds.join(';'),
            details: JSON.stringify(selectedResult),
            conditions: JSON.stringify({
              ...oldParams,
              prevImages: {
                content: oldParams.content || null,
                faceContent: oldParams.faceContent || null,
              },
              content: Array.isArray(content)
                ? content.map((base64) => clearFormat(base64)).join(',')
                : null,
              faceContent: Array.isArray(face)
                ? face.map((base64) => clearFormat(base64)).join(',')
                : null,
              current,
              keyValue,
              selectedMultipleSearch,
              cameraIds: cameraIdList,
            }),
          };
          logger.log('归档params===', params);
          dispatch({
            type: 'addRecord/getGdId',
            payload: params,
            callback: (payload, calltype) => {
              if (calltype) return this.formRef.current.resetFields();
              confirm({
                title: '更新或合并研判档案',
                centered: true,
                content: (
                  <div>
                    <p>同名档案已存在，请选择更新或者合并</p>
                    <Radio.Group
                      onChange={(e) => {
                        this.updateType = e.target.value;
                      }}
                    >
                      <Radio value="0">更新</Radio>
                      <Radio value="1">合并</Radio>
                    </Radio.Group>
                  </div>
                ),
                onOk: (callback) => {
                  const par = {
                    ...payload,
                    updateType: this.updateType,
                  };
                  this.update(par, callback);
                },
                onCancel: (callback) => {
                  callback();
                },
              });
            },
          });
        })
        .catch((error) => {
          logger.log('归档', error);
        });
    }
  };

  update = (payload, callbackFun) => {
    const { dispatch } = this.props;
    callbackFun();
    dispatch({
      type: 'addRecord/updateStudy',
      payload,
      callback: () => {
        this.formRef.current.resetFields();
      },
    });
  };

  onSelectCaseChange = (e) => {
    const { dispatch } = this.props;
    if (!e || e === '') return;
    dispatch({
      type: 'addRecord/getCaseNameList',
      payload: { name: e },
    });
  };
  // merge = (payload, callback) => {
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: 'addRecord/merge',
  //     payload,
  //     callback,
  //   });
  // };

  handleCancel = () => {
    this.formRef.current.resetFields();
    this.changeState({ visible: false });
  };

  // onChange = (e) => {
  //   console.log('e====', e);
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: 'addRecord/changeState',
  //     payload: { caseName: e },
  //   });
  // };

  changeTabs = (key) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'addRecord/changeState',
      payload: { tabs: key },
    });
  };

  getTableData = (pageNum = 1, pageSize = 10) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'addRecord/changeCurrent',
      payload: { pageNum, pageSize },
    });
  };

  clickRow = (e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'addRecord/changeState',
      payload: { record: e },
    });
  };

  setRowClassName = (obj) => {
    const { record } = this.props;
    if (obj && record && obj.id === record.id) {
      return 'table-checked';
    }
    return 'table-else';
  };

  tablePaginationChange = (page, pageSize) => {
    this.getTableData(page, pageSize);
  };

  render() {
    const {
      confirmLoading,
      visible,
      selectedResult,
      recordList,
      recordTableLoading,
      page,
      addLoading,
      total,
      tabs,
    } = this.props;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    // const type = {
    //   aj: '案件',
    //   jjd: '警情',
    // };

    const columns = [
      {
        title: '研判名称',
        dataIndex: 'videoReseachName',
        key: 'videoReseachName',
        width: 100,
      },
      // {
      //   title: '案件名称',
      //   dataIndex: 'actionName',
      //   key: 'actionName',
      //   width: 100,
      // },
    ];
    const pagination = {
      page,
      total,
      hideOnSinglePage: true,
      showHeader: false,
      showQuickJumper: true,
      onChange: this.tablePaginationChange,
    };
    return (
      <Modal
        zIndex={999}
        title="添加归档"
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        confirmLoading={confirmLoading}
      >
        <Spin spinning={addLoading}>
          <Tabs onChange={this.changeTabs} activeKey={tabs}>
            <TabPane tab="新建档案" key="1">
              <Form ref={this.formRef}>
                <FormItem
                  {...formItemLayout}
                  label="研判名称"
                  name="videoReseachName"
                  rules={[
                    { required: true, message: '请输入研判名称!' },
                    { max: 30, message: '长度应小于30!' },
                  ]}
                >
                  <Input style={{ width: 200 }} autoComplete="off" />
                </FormItem>
                {/* <FormItem
                  {...formItemLayout}
                  label="案件名称"
                  name="actionName"
                  rules={[{ required: true, message: '请选择案件名称!' }]}
                >
                  <AutoComplete
                    onSearch={this.onSelectCaseChange}
                    dataSource={caseNameList.map((v) => `(${type[v.type]})${v.name}`)}
                    style={{ width: 200 }}
                  />
                </FormItem> */}
                <FormItem {...formItemLayout} label="图片">
                  {selectedResult.map((v, index) => {
                    const { imageUrl } = v;
                    return (
                      <img
                        src={imageUrl}
                        key={`${index}-img`}
                        style={{
                          width: 50,
                          height: 50,
                          marginLeft: 10,
                          marginBottom: 5,
                        }}
                        alt=""
                      />
                    );
                  })}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="备注"
                  name="remark"
                  rules={[{ max: 150, message: '长度应小于150!' }]}
                >
                  <TextArea autoSize={{ minRows: 2 }} style={{ width: 200 }} />
                </FormItem>
              </Form>
            </TabPane>
            <TabPane tab="合并档案" key="2">
              <div>
                {/* <div style={{ marginLeft: 50, marginTop: 20, color: 'red' }}>
                  注意：合并到档案中只有图片轨迹合并，其它线索只能统一选择保留原有的或者覆盖原有的
                </div>
                <div style={{ marginLeft: 50, marginTop: 20 }}>
                  <Radio.Group
                    name="radiogroup"
                    defaultValue={1}
                    onChange={(e) => {
                      this.changeAddType(e);
                    }}
                  >
                    <Radio value={1}>保留</Radio>
                    <Radio value={2}>覆盖</Radio>
                  </Radio.Group>
                </div> */}

                <div style={{ marginLeft: 50, marginTop: 20 }}>
                  图片组：
                  <div style={{ width: 360, marginBottom: 10 }}>
                    {selectedResult.map((v, index) => {
                      const { imageUrl } = v;
                      return (
                        <img
                          src={imageUrl}
                          key={`${index}-img`}
                          style={{
                            width: 50,
                            height: 50,
                            marginLeft: 10,
                            marginBottom: 5,
                            marginTop: 10,
                          }}
                          alt=""
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
              <div style={{}}>
                <Table
                  rowKey="id"
                  dataSource={recordList}
                  columns={columns}
                  pagination={pagination}
                  onRowClick={(e) => this.clickRow(e)}
                  rowClassName={(e) => this.setRowClassName(e)}
                  loading={recordTableLoading}
                />
              </div>
            </TabPane>
          </Tabs>
        </Spin>
      </Modal>
    );
  }
}
function mapStateToProps(state) {
  const { searchPanel, loading } = state;

  const {
    selectedResult,
    content,
    faceContent,
    prevParams,
    currentKey,
    multRelation,
    multSelectedResult,
  } = searchPanel;

  return {
    ...state.searchingMap,
    ...state.addRecord,
    selectedResult,
    content,
    faceContent,
    prevParams,
    currentKey,
    multRelation,
    multSelectedResult,
    confirmLoading:
      loading.effects['addRecord/getGdId'] ||
      loading.effects['addRecord/saveStudy'] ||
      loading.effects['addRecord/updateStudy'],
  };
}
export default connect(mapStateToProps)(AddRecord);
