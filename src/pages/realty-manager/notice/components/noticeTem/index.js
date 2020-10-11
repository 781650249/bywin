import React, { useState, useEffect, useCallback } from 'react';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Form, Input, Button, Space, Drawer, message, Popconfirm, Select } from 'antd';
import { useSelector, useDispatch } from 'dva';
import cx from 'classnames';
import QuillTemplate from '../quillTemplate';
import styles from './index.less';

export default function() {
  const [templateVisible, setTemplateVisible] = useState(false);
  const [temType, setTemType] = useState('add'); // 公用模板
  const [temEdit, setTemEdit] = useState(false);
  const [addTemplatevisible, setAddTemplatevisible] = useState(false);
  const [isBoolean, setIsBoolean] = useState(false);
  const [form] = Form.useForm();
  const { Option } = Select;
  const { temList, temParams, typeList } = useSelector(({ notice }) => notice);
  const [richText, setRichText] = useState('');
  const [updateId, setUpdateId] = useState(null);
  const dispatch = useDispatch();

  const getNoticeList = useCallback(
    (params = {}, type = 'notice/getNotice') => {
      dispatch({
        type,
        payload: {
          pageNum: temParams.pageNum,
          // pageSize: temParams.pageSize,
          ...params,
        },
      });
    },
    [dispatch, temParams.pageNum],
  );

  useEffect(() => {
    getNoticeList();
  }, [dispatch]);

  const handleAddEditTem = (type, item) => {
    setTemplateVisible(true);
    setTemEdit(true);
    if (type === 'add') {
      form.resetFields();
      setRichText('');
      setTemType('add');
      setIsBoolean(false);
    } else {
      // 回填表单
      setIsBoolean(true);
      setTemType('edit');
      form.setFieldsValue({
        name: item.name,
        title: item.title,
        typeId: item.typeId,
      });
      setUpdateId(item.id);
      setRichText(item.content);
    }
  };

  const handleBack = () => {
    setTemplateVisible(false);
    setAddTemplatevisible(false);
  };

  const handleSaveTem = (tem) => {
    if (temType === 'edit') {
      dispatch({
        type: 'notice/updateNotice',
        payload: {
          content: tem.content,
          name: tem.name,
          title: tem.title,
          id: updateId,
          typeId: tem.typeId,
        },
      }).then((res) => {
        if (res.code === 'SUCCESS') {
          message.success('编辑成功');
          setAddTemplatevisible(false);
          getNoticeList();
          setTemplateVisible(false);
          form.resetFields();
          setRichText('');
        }
      });
    } else {
      setRichText(tem.content);
      // 新增公告
      dispatch({
        type: 'notice/saveNotice',
        payload: {
          content: tem.content,
          name: tem.name,
          title: tem.title,
          typeId: tem.typeId,
        },
      }).then((res) => {
        if (res.code === 'SUCCESS') {
          message.success('新增成功');
          setAddTemplatevisible(false);
          getNoticeList();
          setTemplateVisible(false);
          form.resetFields();
          setRichText('');
        }
      });
    }
  };

  // 父组件拿到子组件的值
  const handleGetVal = (msg) => {
    form.setFieldsValue({
      content: msg,
    });
  };
  const handleAddTemplate = () => {
    setAddTemplatevisible(true);
  };

  const handleDelete = ({ id }) => {
    dispatch({
      type: 'notice/delNotice',
      payload: {
        id,
      },
    }).then((res) => {
      if (res.code === 'SUCCESS') {
        message.success('删除成功');
        getNoticeList();
        setTemplateVisible(false);
      }
    });
  };

  // 模板搜索
  const handleSearchTem = (value) => {
    getNoticeList({
      keyword: value,
    });
  };

  const subStrMethod = (val) => {
    if (val) return val.substring(0, 6);
    return val;
  };
  return (
    <>
      <div onClick={() => handleAddTemplate()} className={styles.action} />
      <Drawer
        zIndex={1}
        closable
        className={styles.drawWrap}
        title="公告模板"
        bodyStyle={{ padding: 20 }}
        placement="right"
        visible={addTemplatevisible}
        onClose={() => handleBack()}
      >
        <div className={styles.wrap}>
          <div className={styles.left}>
            <div className={styles.temTitle}>模板列表</div>
            <Input.Search
              placeholder="搜索模板"
              onSearch={(value) => handleSearchTem(value)}
              style={{ marginBottom: '5px', marginTop: '15px' }}
            />
            <div className={styles.temList}>
              {Array.isArray(temList) &&
                temList.length > 0 &&
                temList.map((item, index) => (
                  <div className={styles.tem} key={index}>
                    <div className={styles.temRow}>
                      <div className={styles.temRowIndex}>{index + 1}</div>
                      <span className={cx(styles.temRowCon)}>{subStrMethod(item.name)}</span>
                    </div>

                    <Space>
                      <div onClick={() => handleAddEditTem('edit', item)}>
                        {' '}
                        <EditOutlined />
                      </div>
                      <div>
                        <Popconfirm
                          title="你确定要删除吗"
                          onConfirm={() => handleDelete(item)}
                          okText="确定"
                          cancelText="取消"
                        >
                          <DeleteOutlined />
                        </Popconfirm>
                      </div>
                    </Space>
                  </div>
                ))}
              {temList.length === 0 && <div className={styles.temListData} />}
            </div>

            <Button
              className={styles.addTem}
              type="primary"
              onClick={() => handleAddEditTem('add')}
            >
              新增
            </Button>

            {/* <div className={styles.pagination}>
              <Pagination
                current={temParams.pageNum}
                total={temListTotal}
                onChange={(value) => {
                  dispatch({
                    type: 'notice/setState',
                    payload: {
                      temParams: {
                        ...temParams,
                        pageNum: value,
                      },
                    },
                  });
                  getNoticeList({ pageNum: value });
                }}
              />
            </div> */}
          </div>

          {templateVisible && (
            <div className={styles.right}>
              <div className={cx(styles.temTitle, styles.extra)}>
                {temEdit ? `${temType === 'add' ? '新增模板' : '编辑模板'}` : '新增模板'}
              </div>
              <div className={styles.temCon}>
                <Form form={form} onFinish={handleSaveTem}>
                  <Form.Item label="模板名称" name="name">
                    <Input />
                  </Form.Item>

                  <Form.Item label="公告类别" name="typeId">
                    <Select placeholder="请选择公告模板">
                      {typeList.length > 0 &&
                        typeList.map((item, i) => (
                          <Option key={i} value={item.id}>
                            {item.typeName}
                          </Option>
                        ))}
                    </Select>
                  </Form.Item>

                  <Form.Item label="公告标题" name="title">
                    <Input />
                  </Form.Item>

                  <Form.Item label="公告内容" name="content">
                    {/* <Input /> */}
                    <QuillTemplate
                      noAddNotice={isBoolean}
                      content={richText}
                      callback={handleGetVal}
                    />
                  </Form.Item>

                  <Form.Item>
                    <div className="text-right">
                      <Button onClick={handleBack} className="mr-8">
                        取消
                      </Button>
                      <Button htmlType="submit" type="primary">
                        确定
                      </Button>
                    </div>
                  </Form.Item>
                </Form>
              </div>
            </div>
          )}
        </div>
      </Drawer>
    </>
  );
}
