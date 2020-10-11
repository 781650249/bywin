import React, { Component } from 'react';
import { Row, Col, Table, Button, Popconfirm, message, Switch } from 'antd';
import URL from '@/services/url';
import request from '@/utils/request';
import logger from '@/utils/logger';
import FormModal from './FormModal';
import Breadcrumb from '../BreadcrumbItems';

const STATUS = {
  0: false,
  1: true,
};
export default class TimeTask extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableLoading: false,
      confirmLoading: false,
      columns: [
        {
          title: '序号',
          key: 'key',
          width: 64,
          render: (text, record, index) => index + 1,
        },
        {
          title: 'cron表达式',
          dataIndex: 'cron',
        },
        // {
        //   title: '创建时间',
        //   dataIndex: 'gmtCreate',
        // },
        // {
        //   title: '修改时间',
        //   dataIndex: 'gmtModify',
        // },
        {
          title: 'id',
          dataIndex: 'id',
        },
        {
          title: '描述',
          dataIndex: 'jobDesc',
        },
        {
          title: '名称',
          dataIndex: 'jobName',
        },
        {
          title: '要执行的任务类路径',
          dataIndex: 'runClazzPath',
        },
        {
          title: '状态',
          dataIndex: 'status',
          render: (text, record) => (
            <Switch
              checked={STATUS[text]}
              onChange={(checked) => this.handleStartOrStop(checked, record.id)}
              checkedChildren="启"
              unCheckedChildren="停"
              style={{ marginRight: 6 }}
            />
          ),
        },
        {
          title: '操作',
          key: 'action',
          width: 260,
          render: (text, record) => (
            <div>
              <Button
                type="primary"
                ghost
                onClick={() => this.showModal('修改', record)}
                style={{ marginRight: 6 }}
              >
                修改
              </Button>
              <Popconfirm title="是否确认删除？" onConfirm={() => this.handleDelete(record.id)}>
                <Button style={{ marginRight: 6 }} type="danger" ghost>
                  删除
                </Button>
              </Popconfirm>
              <Popconfirm title="是否确认运行？" onConfirm={() => this.handleRunOnce(record.id)}>
                <Button style={{ color: '#faad14', borderColor: '#faad14' }} type="danger" ghost>
                  立即运行
                </Button>
              </Popconfirm>
            </div>
          ),
        },
      ],
      tableData: [],
      modalType: '',
      formData: {},
      visible: false,
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
    };
  }

  componentDidMount() {
    const { pagination } = this.state;
    this.fetchTableData(pagination);
  }

  fetchTableData = (pagination, values = {}) => {
    // 请求列表数据
    const { current, pageSize } = pagination;
    this.setState({ tableLoading: true });
    request
      .get(URL.QUERY_TIMEDJOB_LIST, {
        page: current,
        size: pageSize,
        ...values,
      })
      .then((res) => {
        const { code, data } = res;
        if (code === 'SUCCESS') {
          this.setState({
            tableData: data.rows,
            pagination: {
              current,
              pageSize,
              total: data.total,
            },
          });
        } else {
          message.error(res.message);
        }
        this.setState({ tableLoading: false });
      })
      .catch((err) => {
        this.setState({ tableLoading: false });
        message.error('后台服务器异常，请稍后再试');
        logger.log(err);
      });
  };

  showModal = (type, formData = {}) => {
    this.setState({ visible: true, modalType: type, formData });
  };

  handleChange = (values) => {
    const { formData } = this.state;
    this.setState({
      formData: {
        ...formData,
        ...values,
      },
    });
  };

  handleSearch = (values) => {
    const { pagination } = this.state;
    this.fetchTableData({ ...pagination, current: 1 }, values);
  };

  handleDelete = (id) => {
    this.setState({ confirmLoading: true });
    request
      .get(URL.DELETE_TIMEDJOB, { id })
      .then((res) => {
        const { code } = res;
        if (code === 'SUCCESS') {
          message.success('删除成功');
          const { pagination } = this.state;
          this.fetchTableData(pagination);
        }
        this.setState({ confirmLoading: false });
      })
      .catch((err) => {
        this.setState({ confirmLoading: false });
        message.error('后台服务器异常，请稍后再试');
        logger.log(err);
      });
  };

  handleRunOnce = (id) => {
    this.setState({ confirmLoading: true });
    request
      .get(URL.RUN_TIMEDJOB, { id })
      .then((res) => {
        const { code } = res;
        if (code === 'SUCCESS') {
          message.success('运行成功');
          const { pagination } = this.state;
          this.fetchTableData(pagination);
        } else {
          message.warn(res.message);
          const { pagination } = this.state;
          this.fetchTableData(pagination);
        }
        this.setState({ confirmLoading: false });
      })
      .catch((err) => {
        this.setState({ confirmLoading: false });
        message.error('后台服务器异常，请稍后再试');
        logger.log(err);
      });
  };

  handleSave = (formData, callback) => {
    request
      .post(formData.id === undefined ? URL.ADD_TIMEDJOB : URL.UPDATE_TIMEDJOB, { ...formData })
      .then((res) => {
        const { code } = res;
        if (code === 'SUCCESS') {
          message.success(formData.id === undefined ? '新增成功' : '修改成功');
          const { pagination } = this.state;
          this.fetchTableData(pagination);
          callback();
        } else {
          message.error(res.message);
        }
      })
      .catch((err) => {
        message.error('后台服务器异常，请稍后再试');
        logger.log(err);
      });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
      formData: {},
    });
  };

  handleStartOrStop = (checked, id) => {
    this.setState({ confirmLoading: true });
    request
      .get(checked ? URL.START_TIMEDJOB : URL.STOP_TIMEDJOB, { id })
      .then((res) => {
        const { code } = res;
        if (code === 'SUCCESS') {
          message.success(res.message);
          const { pagination } = this.state;
          this.fetchTableData(pagination);
        }
        if (code === 'FAIL') {
          message.error(res.message);
          const { pagination } = this.state;
          this.fetchTableData(pagination);
        }
        this.setState({ confirmLoading: false });
      })
      .catch((err) => {
        this.setState({ confirmLoading: false });
        message.error('后台服务器异常，请稍后再试');
        logger.log(err);
      });
  };

  handlePageChange = (current, pageSize) => {
    const { pagination } = this.state;
    this.fetchTableData({ ...pagination, current, pageSize });
  };

  render() {
    const {
      columns,
      tableData,
      visible,
      modalType,
      formData,
      pagination,
      tableLoading,
      confirmLoading,
    } = this.state;
    const { location } = this.props;
    return (
      <div style={{ flex: 1, padding: 20 }}>
        <Row>
          <Col span={16}>
            <Breadcrumb location={location} />
          </Col>
          <Col span={8} className="text-right">
            <Button type="primary" onClick={() => this.showModal('新增')}>
              新增
            </Button>
          </Col>
        </Row>
        <Table
          rowKey="id"
          loading={tableLoading}
          columns={columns}
          dataSource={tableData}
          pagination={{ ...pagination, onChange: this.handlePageChange }}
        />
        <FormModal
          visible={visible}
          confirmLoading={confirmLoading}
          type={modalType}
          formData={formData}
          onSave={this.handleSave}
          onCancel={this.handleCancel}
        />
      </div>
    );
  }
}
