import React, { Component } from 'react';
import { Row, Col, Table, Input, Button, Popconfirm, message } from 'antd';
import URL from '@/services/url';
import request from '@/utils/request';
import logger from '@/utils/logger';
import FormModal from './FormModal';
import Breadcrumb from '../BreadcrumbItems';

const { Search } = Input;

export default class Backstage extends Component {
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
          title: '名称',
          dataIndex: 'businessName',
          width: 192,
        },
        {
          title: '值',
          dataIndex: 'businessValue',
        },
        {
          title: '描述',
          dataIndex: 'businessDescribe',
        },
        {
          title: '操作',
          key: 'action',
          width: 248,
          render: (text, record) => (
            <div>
              <Button onClick={() => this.showModal('修改', record)} style={{ marginRight: 12 }}>
                修改
              </Button>
              <Popconfirm title="是否确认删除？" onConfirm={() => this.handleDelete(record.id)}>
                <Button>删除</Button>
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

  fetchTableData = (pagination, value) => {
    // 请求列表数据
    const { current = 1, pageSize = 10 } = pagination;
    this.setState({ tableLoading: true });

    request
      .post(`${URL.QUERY_CONFIG_LIST}?page=${current}&size=${pageSize}`, {
        page: current,
        size: pageSize,
        allKeys: value || null,
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
      });
  };

  showModal = (type, formData = {}) => {
    this.setState({ visible: true, modalType: type, formData });
  };

  handleSearch = (value) => {
    const { pagination } = this.state;
    this.fetchTableData({ ...pagination, current: 1 }, value);
  };

  handleDelete = (id) => {
    this.setState({ confirmLoading: true });
    request
      .post(URL.DELETE_CONFIG, { id })
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

  handleSave = (formData, callback) => {
    request
      .post(formData.id === undefined ? URL.SAVE_CONFIG : URL.UPDATE_CONFIG, { ...formData })
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
      <div
        style={{
          flex: 1,
          padding: 20,
        }}
      >
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
          title={() => <Search onSearch={this.handleSearch} enterButton />}
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
