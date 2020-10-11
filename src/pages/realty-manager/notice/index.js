import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'dva';
import {
  DatePicker,
  Col,
  Row,
  Form,
  Select,
  Input,
  Button,
  Space,
  Table,
  Spin,
  Tag,
  message,
  Popconfirm,
  Drawer,
} from 'antd';
import NoticeTem from './components/noticeTem';
import AnnoucementTem from './components/annoucementTem';
import EditAnnoucement from './components/editAnnouncement';
import QuillTemplate from './components/quillTemplate';
import styles from './index.less';
import NoticeDetai from './components/noticeDetail';

export default function() {
  const { RangePicker } = DatePicker;
  const { Option } = Select;
  const [richText, setRichText] = useState('');
  const [updateId] = useState(null);
  const { communityList } = useSelector(({ global }) => global);
  const { queryParams, mangerList, temList, typeList } = useSelector(({ notice }) => notice);
  const [editVisible, setEditVisible] = useState(false);
  const loading = useSelector((state) => state.loading.effects['notice/getManageList']);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const layout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 12,
    },
  };
  const getMangeList = useCallback(
    (params = {}, type = 'notice/getManageList') => {
      dispatch({
        type,
        payload: {
          ...queryParams,
          pageSize: queryParams.pageSize,
          pageNum: queryParams.pageNum,
          ...params,
        },
      });
    },
    [dispatch, queryParams],
  );

  useEffect(() => {
    getMangeList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGetVal = (msg) => {
    setRichText(msg);
  };

  const handleEditAnnoucement = (params) => {
    dispatch({
      type: 'notice/updateNotice',
      payload: {
        typeId: params.typeId,
        title: params.title,
        content: richText,
        id: updateId,
        name: params.name,
      },
    }).then((res) => {
      if (res.code === 'SUCCESS') {
        message.success('编辑成功');
        setEditVisible(false);
      }
    });
  };

  const handleDelete = (item) => {
    dispatch({
      type: 'notice/deleteAnnounceMent',
      payload: {
        id: item.id,
      },
    }).then((res) => {
      if (res.code === 'SUCCESS') {
        message.success('删除成功');
        getMangeList();
      }
    });
  };

  const handleQuery = (params) => {
    const timeConfine = params.timeRange;
    if (timeConfine) {
      const startDate = timeConfine[0].format('YYYY-MM-DD');
      const endDate = timeConfine[1].format('YYYY-MM-DD');
      getMangeList({
        ...queryParams,
        keyword: params.keyword,
        communityId: params.xqxxbz,
        startDate,
        endDate,
      });
    } else {
      getMangeList({
        ...queryParams,
        keyword: params.keyword,
        communityId: params.xqxxbz,
      });
    }
  };

  const renderTag = (val) => {
    switch (val) {
      case '停水':
        return (
          <Tag style={{ border: '1px solid #66EAF8', borderRadius: '2px' }}>
            <span style={{ color: '#66EAF8' }}>停水</span>
          </Tag>
        );

      case '停电':
        return (
          <Tag style={{ border: '1px solid #FF5029', borderRadius: '2px' }}>
            <span style={{ color: '#FF5029' }}>停电</span>
          </Tag>
        );

      case '安全':
        return (
          <Tag style={{ border: '1px solid #FFC15B', bordeRadius: '2px' }}>
            <span style={{ color: '#FFC15B' }}>安全</span>
          </Tag>
        );
      default:
    }
  };
  const columnsData = [
    {
      title: '序号',
      key: 'number',
      width: 100,
      align: 'center',
      minWidth: 100,
      render: (_, record, index) => index + 1,
    },
    {
      title: '通知类型',
      dataIndex: 'typeName',
      key: 'typeName',
      minWidth: 120,
      render: (typeName) => renderTag(typeName),
    },
    {
      title: '公告标题',
      dataIndex: 'title',
      key: 'title',
      width: 300,
      minWidth: 300,
      ellipsis: true,
    },
    {
      title: '通知方式',
      dataIndex: 'notifyWay',
      key: 'notifyWay',
      minWidth: 150,
    },
    {
      title: '通知地址',
      dataIndex: 'communityName',
      key: 'communityName',
      minWidth: 150,
    },
    {
      title: '通知时间',
      dataIndex: 'createDateFormat',
      key: 'createDateFormat',
      minWidth: 150,
    },
    {
      title: '操作',
      dataIndex: 'needNotify',
      key: 'action',
      minWidth: 150,
      render: (needNotify, item) =>
        needNotify === 1 ? (
          <NoticeDetai item={item} />
        ) : (
          <div style={{ display: 'flex', minWidth: '113px', color: '#66EAF8', cursor: 'pointer' }}>
            <EditAnnoucement props={item} />
            <div style={{ marginRight: '10px', color: 'rgba(255,255,255,0.45)' }}>|</div>
            <Popconfirm
              title="你确定要删除吗"
              onConfirm={() => handleDelete(item)}
              okText="确定"
              cancelText="取消"
            >
              <div>删除</div>
            </Popconfirm>
          </div>
        ),
    },
  ];

  return (
    <div className={styles.wrap}>
      <div className={styles.title}>物业公告</div>
      <div className={styles.top}>
        <div className={styles.left}>
          <Form style={{ width: '100%' }} onFinish={handleQuery}>
            <Row gutter={8}>
              <Col span={6}>
                <Form.Item name="timeRange">
                  <RangePicker format="YYYY/MM/DD" />
                </Form.Item>
              </Col>

              <Col span={3}>
                <Form.Item name="xqxxbz">
                  <Select placeholder="选择园区">
                    {communityList.length > 0 &&
                      communityList.map((item, i) => (
                        <Option key={i} value={item.xqxxbz}>
                          {item.communityName}
                        </Option>
                      ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={3}>
                <Form.Item name="keyword">
                  <Input placeholder="请输入标题搜索" />
                </Form.Item>
              </Col>

              <Col span={4}>
                <Form.Item>
                  <Button loading={loading} type="primary" htmlType="submit">
                    查询
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
        <div className={styles.right}>
          <Space>
            <NoticeTem />

            <AnnoucementTem />
          </Space>
        </div>
      </div>

      <Spin spinning={false} wrapperClassName={styles.spin}>
        <Table
          bordered={false}
          dataSource={mangerList}
          columns={columnsData}
          pagination={false}
          size="middle"
          scroll={{ y: 608 }}
          loading={loading}
          rowClassName={styles.noticeRow}
          // eslint-disable-next-line react/jsx-no-duplicate-props
          pagination={{ position: ['none', 'bottomRight'] }}
        />
      </Spin>

      <Drawer
        visible={editVisible}
        zIndex={1}
        className={styles.drawWrap}
        closable
        title="编辑公告"
        bodyStyle={{ padding: 20 }}
        placement="right"
        onClose={() => setEditVisible(false)}
      >
        <Form
          form={form}
          {...layout}
          name="basic"
          labelAlign="right"
          onFinish={handleEditAnnoucement}
        >
          <Form.Item label="公告模板" name="templateId">
            <Select placeholder="请选择公告模板" allowClear>
              {communityList.length > 0 &&
                temList.map((item, i) => (
                  <Option key={i} value={item.typeId}>
                    {item.name}
                  </Option>
                ))}
            </Select>
          </Form.Item>

          <Form.Item label="公告类别" name="typeId">
            <Select placeholder="请选择公告类别" allowClear>
              {typeList.length > 0 &&
                typeList.map((item, i) => (
                  <Option key={i} value={item.id}>
                    {item.typeName}
                  </Option>
                ))}
            </Select>
          </Form.Item>

          <Form.Item label="公告标题" name="title">
            <Input placeholder="请选择公告标题" />
          </Form.Item>

          <Form.Item label="公告内容" name="content">
            <QuillTemplate content={richText} callback={handleGetVal} />
          </Form.Item>

          <Form.Item style={{ float: 'right' }}>
            <Space>
              <Button>取消</Button>
              <Button type="primary" htmlType="submit">
                确定
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
}
