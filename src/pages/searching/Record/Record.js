import React, { Component } from 'react';
import { connect } from 'dva';
import { Modal, Table, Button, Popover, Radio, Divider, Checkbox } from 'antd';
import moment from 'moment';
import router from 'umi/router';
import URL from '@/utils/previous/request/url';
import Search from './Search';
import ExpandedRow from './ExpandedRow';
import ArchiveEdit from './ArchiveEdit';

import styles from './Record.less';

const CheckboxGroup = Checkbox.Group;
const { confirm } = Modal;
// const { Option } = Select;

class Record extends Component {
  componentDidMount() {
    this.getTableData();
    // const { dispatch, isSearch } = this.props;
    // if (isSearch) {
    //   dispatch({
    //     type: 'addRecord/getCaseNameList',
    //     payload: {},
    //   });
    // }
  }

  componentDidUpdate(prevProps) {
    const { jqId } = this.props;
    if (prevProps.jqId && jqId !== prevProps.jqId) {
      this.getTableData();
    }
  }

  componentWillUnmount() {
    const { dispatch, exportIdAndState } = this.props;
    // 销毁时看定时器是否存在，存在就把他们都干掉
    if (exportIdAndState instanceof Object) {
      Object.keys(exportIdAndState).forEach((item) => {
        if (exportIdAndState[item] && exportIdAndState[item].timer) {
          clearInterval(exportIdAndState[item].timer);
        }
      });
    }
    // 把状态都重置
    dispatch({
      type: 'record/clear',
    });
  }

  // 还原归档提示
  confirmRestore = (obj) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'record/getRecordById',
      payload: { id: obj.id },
      callback: (data) => {
        confirm({
          title: '确定还原研判?',
          okText: '确定',
          cancelText: '取消',
          zIndex: 2000,
          onOk: () => {
            this.restore(data);
          },
          onCancel: () => {},
        });
      },
    });
  };

  // 删除归档提示
  confirmDeleteRecord = (obj, e) => {
    e.preventDefault();
    confirm({
      title: '确定删除该研判档案?',
      okText: '确定',
      cancelText: '取消',
      zIndex: 2000,
      onOk: () => {
        this.deleteRecord(obj);
      },
      onCancel: () => {},
    });
  };

  // 删除档案
  deleteRecord = (obj) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'record/deleteRecord',
      payload: { ids: `${obj.id}` },
      callback: () => {
        this.getTableData();
      },
    });
  };

  // 还原归档
  restore = (record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'searchPanel/setState',
      payload: {
        currentKey: '',
        multRelation: {},
        multSearchResult: {},
        multSelectedResult: {},
      },
    });
    dispatch({
      type: 'record/restore',
      payload: record,
    });
  };

  restoreToJudgement = (obj) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'record/getRecordById',
      payload: { id: obj.id },
      callback: (data) => {
        router.push({
          pathname: `/view/judgement`,
          params: {
            values: JSON.stringify(data),
            flag: 1,
          },
        });
      },
    });
  };

  getTableData = (page = 1, size = 10, params = {}) => {
    const { dispatch, jqId } = this.props;
    let par = { ...params };
    if (jqId) {
      par = { jqId };
    }

    dispatch({
      type: 'record/getTableData',
      payload: { ...par, pageNum: page, pageSize: size },
    });
  };

  // 关闭档案窗口
  handleRecordCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'record/changeState',
      payload: { recordVisible: false },
    });
  };

  /**
   * 搜索
   */
  handleSearch = (values) => {
    const { time } = values;
    const data = {
      ...values,
    };
    if (time) {
      data.startTime = moment(time[0]).format('YYYY/MM/DD HH:mm');
      data.endTime = moment(time[1]).format('YYYY/MM/DD HH:mm');
    }
    this.getTableData(1, 10, data);
  };

  /**
   * 选择合并的归档记录
   */
  onSelectChange = (selectedRowKeys, selectedRows) => {
    // console.log(selectedRowKeys, selectedRows);
    const { dispatch } = this.props;
    dispatch({
      type: 'record/changeState',
      payload: { selectedRowKeys, selectedRows },
    });
  };

  merge = () => {
    const { selectedRows } = this.props;
    const html = selectedRows.map((row, i) => {
      const { videoReseachName } = row;
      return (
        <Radio key={i} value={videoReseachName}>
          {videoReseachName}
        </Radio>
      );
    });
    confirm({
      title: '合并研判记录',
      content: (
        <div>
          <p>选择合并到哪个研判记录</p>
          <Radio.Group
            onChange={(e) => {
              this.merge = e.target.value;
            }}
          >
            {html}
          </Radio.Group>
        </div>
      ),
      onOk: (callback) => {
        this.mergeRequest(callback);
      },
      onCancel: (callback) => {
        callback();
      },
    });
  };

  /**
   * 合并
   */
  mergeRequest = (callback) => {
    callback();
    const { dispatch, selectedRows, jqId, searchParams } = this.props;
    const names = selectedRows.map((v) => v.videoReseachName);
    dispatch({
      type: 'record/merge',
      payload: { names, jqId, name: this.merge },
      callback: (type) => {
        if (type) {
          this.getTableData(1, 10, searchParams);
        }
      },
    });
  };

  /**
   * 列表操作 => 旧导出
   * 弹出导出内容选择窗口
   */
  download = (id, e) => {
    e.preventDefault();
    const { dispatch } = this.props;
    dispatch({
      type: 'record/exportDownload',
      payload: {
        id: String(id),
      },
      callback: (pid, data) => {
        window.open(data);
      },
    });
  };

  /**
   * 列表操作 => 新导出
   * 弹出导出内容选择窗口
   */
  newDownload = (id, e) => {
    e.preventDefault();
    const { dispatch } = this.props;
    dispatch({
      type: 'record/exportDownload',
      payload: {
        id: String(id),
      },
      callback: (pid, data) => {
        confirm({
          title: '是否确定导出?',
          content: '导出内容包括图片、视频、文档!',
          onOk: () => {
            window.open(data);
          },
          onCancel: () => {},
        });
      },
    });
  };

  /**
   * 列表操作 => 导出中打包
   * 进入打包中
   */
  pack = (id, e) => {
    e.preventDefault();
    const { dispatch, exportIdAndState } = this.props;
    // 增加定时器,如果返回成功则关闭对应的定时器
    const timer = setInterval(() => {
      // 定时请求打包任务
      this.timerPack(id);
    }, 3000);
    // 改变状态为1打包中，并且将定时器设置到相应id
    dispatch({
      type: 'record/changeState',
      payload: {
        exportIdAndState: {
          ...exportIdAndState,
          [id]: {
            state: 1,
            timer,
          },
        },
      },
    });
    // 发出打包请求
    this.timerPack(id);
  };

  timerPack = (id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'record/exportDownload',
      payload: {
        id: String(id),
      },
      callback: (pid) => {
        const { exportIdAndState } = this.props;
        // 定时器返回成功后可以清除定时器并且将对应的timer置undefined
        if (exportIdAndState[pid]) {
          clearInterval(exportIdAndState[pid].timer);
          dispatch({
            type: 'record/changeState',
            payload: {
              exportIdAndState: {
                ...exportIdAndState,
                [pid]: {
                  state: 2,
                  timer: undefined,
                },
              },
            },
          });
        }
      },
    });
  };

  /**
   * 列表操作 => 置顶
   */
  setTop = (e, id, topNum) => {
    e.preventDefault();
    const { dispatch, tablePage, tablePageSize } = this.props;
    let operate = 0;
    if (!topNum) {
      operate = 1;
    }
    dispatch({
      type: 'record/setTop',
      payload: {
        id,
        operate,
      },
      callback: () => {
        this.getTableData(tablePage, tablePageSize);
      },
    });
  };

  /**
   * 导出窗口复选框变更事件
   */
  handleExportChange = (checkedValues) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'record/changeState',
      payload: {
        exportContent: [...checkedValues],
      },
    });
  };

  /**
   * 导出窗口的确认事件
   */
  handleExportOk = () => {
    const { exportKey, exportContent } = this.props;
    window.open(`${URL.DOWNLOAD_GD_INFO}?id=${exportKey}&exportContent=${exportContent.join()}`);
    this.handleExportCancel();
  };

  /**
   * 导出窗口的确认事件
   */
  handleExportCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'record/changeState',
      payload: {
        exportKey: '',
        exportContent: ['img', 'video', 'concatTsVideo', 'word'],
        exportVisible: false,
      },
    });
  };

  edit = (values) => {
    const { dispatch, cameraIdList } = this.props;

    dispatch({
      type: 'record/getRecordConditions',
      payload: { id: values.id },
      callback: (data) => {
        dispatch({
          type: 'record/changeState',
          payload: {
            EditRecordVisible: true,
            EditRecordData: {
              ...values,
              conditions: JSON.stringify({
                ...data.conditions,
                cameraIds: cameraIdList,
              }),
            },
          },
        });
      },
    });
  };

  render() {
    const columns = [
      {
        title: '研判名称',
        dataIndex: 'videoReseachName',
        key: 'videoReseachName',
        width: 80,
      },
      {
        title: '案件名称',
        dataIndex: 'actionName',
        key: 'actionName',
        width: 80,
      },
      {
        title: '图片组',
        dataIndex: 'imgIds',
        key: 'imgIds',
        width: 200,
        render: (text, record) => {
          const imgIds = record.imgIds ? record.imgIds.split(';') : [];
          return (
            <div>
              {imgIds.map((imageUrl, i) => {
                let img = imageUrl;
                if (imageUrl.substring(0, 7) === 'base64,') {
                  const a = 'data:image/jpeg;';
                  img = a.concat(imageUrl);
                }
                return (
                  <Popover
                    placement="rightBottom"
                    content={<img src={img} style={{ minHeight: 300, maxHeight: 500 }} alt="" />}
                    trigger="hover"
                    key={`${i}-pop-t`}
                  >
                    <img
                      src={img}
                      style={{
                        width: 50,
                        height: 50,
                        marginLeft: 10,
                        marginBottom: 5,
                      }}
                      alt=""
                    />
                  </Popover>
                );
              })}
            </div>
          );
        },
      },
      {
        title: '时间',
        dataIndex: 'gmtCreate',
        key: 'gmtCreate',
        width: 100,
        render: (text) => <p>{moment(new Date(text)).format('YYYY-MM-DD HH:mm:ss')}</p>,
      },
      {
        title: '操作',
        dataIndex: 'restore',
        key: 'restore',
        width: 160,
        // fixed: 'right',
        render: (text, record) => {
          const { exportIdAndState } = this.props;
          let button;
          if ([0, 3].includes(exportIdAndState[record.id].state)) {
            button = (
              <a href="" onClick={(e) => this.pack(record.id, e)}>
                打包
              </a>
            );
          } else if (exportIdAndState[record.id].state === 1) {
            button = (
              <div style={{ cursor: 'default', opacity: 0.2, display: 'initial' }}>打包中</div>
            );
          } else if (exportIdAndState[record.id].state === 2) {
            button = (
              <a href="" onClick={(e) => this.download(record.id, e)}>
                导出
              </a>
            );
          }
          return (
            <div>
              <a onClick={(e) => this.setTop(e, record.id, record.topNum)}>
                {typeof record.topNum === 'number' && record.topNum !== 0 ? '取消置顶' : '置顶'}
              </a>
              <Divider type="vertical" />
              <a
                href=""
                onClick={(e) => {
                  e.preventDefault();
                  const { isMerge } = this.props;
                  if (isMerge) {
                    this.restoreToJudgement(record);
                  } else {
                    this.confirmRestore(record, e);
                  }
                }}
              >
                还原
              </a>
              {button ? <Divider type="vertical" /> : null}
              {button}
              <Divider type="vertical" />
              <a onClick={() => this.edit(record)}>编辑</a>
              <Divider type="vertical" />
              <a href="" onClick={(e) => this.confirmDeleteRecord(record, e)}>
                删除
              </a>
            </div>
          );
        },
      },
    ];
    const {
      tableCurrent,
      tableTotal,
      dispatch,
      dataSource,
      tableLoading,
      recordVisible,
      exportVisible,
      exportContent,
      searchParams,
      isMerge,
      selectedRowKeys = [],
      EditRecordVisible,
    } = this.props;
    const pagination = {
      tableCurrent,
      total: tableTotal,
      hideOnSinglePage: true,
      showHeader: false,
      showQuickJumper: true,
      onChange: (page, pageSize) => {
        dispatch({
          type: 'record/changeState',
          payload: { tableCurrent: page },
        });
        this.getTableData(page, pageSize, searchParams);
      },
    };
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    if (isMerge) {
      return (
        <div>
          <Table
            dataSource={dataSource}
            columns={columns}
            pagination={pagination}
            loading={tableLoading}
            scroll={{ y: 600 }}
            rowKey="id"
            rowSelection={rowSelection}
            footer={() => (
              <Button onClick={this.merge} disabled={selectedRowKeys.length < 2}>
                合并
              </Button>
            )}
          />
        </div>
      );
    }
    return (
      <Modal
        visible={recordVisible}
        onCancel={this.handleRecordCancel}
        width="80%"
        zIndex={999}
        footer={null}
        className={styles.modal}
      >
        <Search onSearch={this.handleSearch} />
        <Table
          dataSource={dataSource}
          columns={columns}
          rowClassName={(record) => (record.current ? '' : styles.expandedHide)}
          expandedRowRender={(record) => <ExpandedRow record={record} />}
          pagination={pagination}
          loading={tableLoading}
          scroll={{ y: 600 }}
          rowKey="id"
        />
        {EditRecordVisible ? <ArchiveEdit /> : null}
        <Modal
          visible={exportVisible}
          title="历史档案导出"
          onOk={this.handleExportOk}
          onCancel={this.handleExportCancel}
          okButtonProps={{
            disabled: Array.isArray(exportContent) && exportContent.length === 0,
          }}
        >
          <CheckboxGroup
            options={[
              { label: '图片', value: 'img' },
              { label: '小视频', value: 'video' },
              { label: '拼接成大视频', value: 'concatTsVideo' },
              { label: '文档', value: 'word' },
            ]}
            value={exportContent}
            onChange={this.handleExportChange}
          />
        </Modal>
      </Modal>
    );
  }
}

Record.defaultProps = {
  jqId: null,
  isSearch: true,
  isMerge: false,
};

function mapStateToProps({ record, addRecord, searchingMap }) {
  return {
    ...record,
    ...addRecord,
    ...searchingMap,
  };
}

export default connect(mapStateToProps)(Record);
