import React, { useState, useEffect } from 'react';
// import cx from 'classnames';
import { useSelector, useDispatch } from 'dva';
import cx from 'classnames';
import {
  Form,
  Select,
  Input,
  Button,
  Drawer,
  Switch,
  Table,
  Row,
  Checkbox,
  Col,
  Space,
  message,
} from 'antd';
import QuillTemplate from '../quillTemplate';
import styles from './index.less';

export default function() {
  const { Option } = Select;
  const [addNoticevisible, setAddNoticevisible] = useState(false);
  const [richText, setRichText] = useState('');
  const [chooseType, setChooseType] = useState(1);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [checkedAreaId, setCheckedAreaId] = useState([]);
  const { communityList } = useSelector(({ global }) => global);
  const { typeList, temList, buildingList, perSonList, personParams, queryParams } = useSelector(
    ({ notice }) => notice,
  );
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const handleGetVal = (msg) => {
    setRichText(msg);
  };

  useEffect(() => {
    dispatch({
      type: 'notice/getTypeList',
    });
  }, [dispatch]);

  const layout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 12,
    },
  };

  const sureLayout = {
    wrapperCol: {
      offset: 15,
    },
  };

  const columns = [
    {
      title: '序号',
      key: 'number',
      width: 70,
      render: (_, record, index) => index + 1,
    },
    {
      title: '姓名',
      dataIndex: 'xm',
      key: 'xm',
      width: 90,
    },
    {
      title: '岗位',
      dataIndex: 'positionName',
      key: 'positionName',
      width: 100,
    },
    {
      title: '性别',
      dataIndex: 'xbmc',
      key: 'xbmc',
      width: 60,
    },

    {
      title: '手机号码',
      dataIndex: 'sjhm',
      key: 'sjhm',
      width: 120,
    },
    {
      title: '归属企业',
      dataIndex: 'qymc',
      key: 'qymc',
      width: 100,
    },
    {
      title: '地址',
      dataIndex: 'dz',
      width: 140,
      key: 'dz',
      ellipsis: true,
    },
  ];

  const handleAdd = () => {
    setAddNoticevisible(true);
  };

  // 切换小区
  const handleChangeArea = (value) => {
    const filterArea = communityList.filter((item) => item.xqxxbz === value);
    dispatch({
      type: 'notice/getBuilding',
      payload: {
        xqbh: filterArea[0].communityId,
      },
    });
    dispatch({
      type: 'notice/getPersonnelList',
      payload: {
        yqxxbz: value,
      },
    });
  };

  const handleSearch = (value) => {
    dispatch({
      type: 'parkWarn/getPersonnelList',
      payload: {
        ...personParams,
        ...value,
      },
    });
  };

  const handleChangeType = (value) => {
    setChooseType(value);
  };

  const handleChangeTem = (value) => {
    const chooseTem = temList.filter((item) => item.typeId === value);
    form.setFieldsValue({
      typeId: chooseTem[0].typeId,
      title: chooseTem[0].title,
    });
    setRichText(chooseTem[0].content);
  };

  const handleSaveAnnoucement = (params) => {
    dispatch({
      type: 'notice/saveAnnoucement',
      payload: {
        title: params.title,
        typeId: params.typeId,
        needNotify: params.needNotify === true ? 1 : 0,
        communityId: params.communityId,
        templateId: params.templateId,
        content: richText,
        notifyRange: chooseType,
        notifyRangeList:
          (chooseType === 2 && checkedAreaId) ||
          (chooseType === 3 && selectedRowKeys) ||
          (chooseType === 1 && null),
      },
    }).then((res) => {
      if (res.code === 'SUCCESS') {
        message.success('新增成功');
        form.resetFields();
        setRichText('');
        setAddNoticevisible(false);
        setSelectedRowKeys([]);
        setCheckedAreaId([]);
        setChooseType(1);
        dispatch({
          type: 'notice/getManageList',
          payload: {
            ...queryParams,
          },
        });
      }
    });
  };

  return (
    <>
      <div onClick={() => handleAdd()} className={styles.add} />
      <Drawer
        zIndex={1}
        className={styles.drawWrap}
        closable
        title="新增公告"
        bodyStyle={{ padding: 20 }}
        placement="right"
        visible={addNoticevisible}
        onClose={() => setAddNoticevisible(false)}
      >
        <Form
          form={form}
          {...layout}
          name="basic"
          labelAlign="right"
          onFinish={handleSaveAnnoucement}
          rules={[
            {
              required: true,
              message: '请选择公告模板',
            },
          ]}
        >
          <Form.Item
            label="公告模板"
            rules={[
              {
                required: true,
                message: '请选择公告模板',
              },
            ]}
            name="templateId"
          >
            <Select placeholder="请选择公告模板" onChange={(value) => handleChangeTem(value)}>
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
            {/* <Input.TextArea rows={4} placeholder="请选择公告内容" /> */}

            <QuillTemplate noAddNotice={Boolean(!0)} content={richText} callback={handleGetVal} />
          </Form.Item>

          <Form.Item label="短信通知" name="needNotify">
            <Switch checkedChildren="开" unCheckedChildren="关" />
          </Form.Item>

          <Form.Item
            label="公告对象"
            name="communityId "
            rules={[
              {
                required: true,
                message: '请选择园区',
              },
            ]}
          >
            <Select placeholder="请选择园区" onChange={(value) => handleChangeArea(value)}>
              {communityList.length > 0 &&
                communityList.map((item, i) => (
                  <Option key={i} value={item.xqxxbz}>
                    {item.communityName}
                  </Option>
                ))}
            </Select>
          </Form.Item>

          <Form.Item label="选择范围">
            <div className={styles.con}>
              <div className={styles.conTop}>
                <div
                  className={cx(styles.conTopItem, {
                    [styles.conTopActive]: chooseType === 1,
                  })}
                  onClick={() => handleChangeType(1)}
                >
                  全部
                </div>
                <div
                  className={cx(styles.conTopItem, {
                    [styles.conTopActive]: chooseType === 2,
                  })}
                  onClick={() => handleChangeType(2)}
                >
                  楼栋
                </div>
                <div
                  className={cx(styles.conTopItem, {
                    [styles.conTopActive]: chooseType === 3,
                  })}
                  onClick={() => handleChangeType(3)}
                >
                  人员
                </div>
              </div>
            </div>
          </Form.Item>

          {chooseType === 3 && (
            <Row justify="center">
              <div style={{ textAlign: 'center', width: '65%' }}>
                <Form
                  layout="inline"
                  className={styles.conCenter}
                  onFinish={handleSearch}
                  style={{ marginLeft: '19px' }}
                >
                  <Form.Item name="value">
                    <Input placeholder="请输入搜索内容" />
                  </Form.Item>

                  <Form.Item name="position">
                    <Select
                      getPopupContainer={(triggerNode) => triggerNode.parentElement}
                      style={{ width: 160 }}
                      placeholder="选择岗位"
                      allowClear
                    >
                      <Select.Option value="2">保安</Select.Option>
                      <Select.Option value="1">巡查员</Select.Option>
                      <Select.Option value="3">企业员工</Select.Option>
                    </Select>
                  </Form.Item>

                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      查询
                    </Button>
                  </Form.Item>
                </Form>

                <div style={{ marginTop: '10px', marginLeft: '20px' }}>
                  <Table
                    dataSource={perSonList}
                    columns={columns}
                    pagination={false}
                    // size="small"
                    scroll={{ y: 333 }}
                    rowSelection={{
                      selectedRowKeys,
                      onChange: (selectedRowKey) => {
                        setSelectedRowKeys(selectedRowKey);
                      },
                    }}
                  />
                </div>
              </div>
            </Row>
          )}
          {chooseType === 2 && (
            <Row justify="center">
              <Checkbox.Group
                onChange={(value) => {
                  setCheckedAreaId(value);
                }}
              >
                <Row justify="start">
                  {Array.isArray(buildingList) &&
                    buildingList.length > 0 &&
                    buildingList.map((item, i) => (
                      <Col span={24}>
                        <Checkbox key={i} value={item.id}>
                          {item.label}
                        </Checkbox>
                      </Col>
                    ))}
                </Row>
              </Checkbox.Group>
            </Row>
          )}

          <Form.Item {...sureLayout} style={{ marginLeft: '66px', marginTop: '20px' }}>
            <Space>
              <Button>取消</Button>
              <Button type="primary" htmlType="submit">
                确定
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
}
