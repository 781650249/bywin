import React, { useState } from 'react';
import { useDispatch, useSelector } from 'dva';
import { Drawer, Form, Input, Select, Button, Cascader } from 'antd';
import cx from 'classnames';
import { ImageUpload } from '@/components/ImageUpload';
import styles from './index.less';

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

export default function() {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [types, setTypes] = useState([]);
  const [cascaderOptions, setCascaderOptions] = useState([]);

  const { visible, currentKey, communityList, warningRuleList, tagList } = useSelector(
    (state) => state.personManage,
  );
  const list = useSelector((state) => ({
    keyPerson: state.keyPerson,
    careTarget: state.careTarget,
  }));
  /**
   * 窗口关闭
   */
  const handleClose = () => {
    dispatch({
      type: 'personManage/setState',
      payload: {
        visible: false,
      },
    });
    form.resetFields();
    setTypes([]);
  };

  const clear = () => {
    form.resetFields();
    setTypes([]);
    setCascaderOptions([]);
    dispatch({
      type: 'personManage/setState',
      payload: { visible: false },
    });
  };

  /**
   * 表单提交
   * @param {Object} values
   */
  const handleFinish = (values) => {
    const { fwxxbz, faceUrl, ...formData } = values;
    dispatch({
      type: `${currentKey}/add`,
      payload: {
        ...formData,
        fwxxbz: fwxxbz[2] || '',
        personType: types,
        faceUrl: Array.isArray(faceUrl) ? faceUrl.join('') : faceUrl,
      },
    }).then(() => {
      dispatch({
        type: `${currentKey}/getList`,
        payload: { page: list[currentKey].page, pageSize: 20 },
      });
      clear();
    });
  };
  return (
    <Drawer
      className={styles.drawer}
      visible={visible}
      width={500}
      bodyStyle={{ padding: 20 }}
      onClose={handleClose}
    >
      <h1 className={styles.title}>
        {`添加${currentKey === 'keyPerson' ? '重点人员' : '关怀对象'}`}
      </h1>
      <Form {...layout} form={form} onFinish={handleFinish}>
        <Form.Item
          label="姓名"
          name="name"
          labelAlign="left"
          rules={[
            {
              required: true,
              message: '请输入姓名！',
            },
          ]}
        >
          <Input autoComplete="off" />
        </Form.Item>
        <Form.Item
          label="手机号"
          name="phone"
          labelAlign="left"
          rules={[
            {
              required: true,
              message: '请输入手机号！',
            },
            {
              pattern: /^1\d{10}$/,
              message: '请输入正确的手机号',
            },
          ]}
        >
          <Input autoComplete="off" />
        </Form.Item>
        <Form.Item
          label="身份证"
          name="cardId"
          labelAlign="left"
          rules={[
            {
              required: true,
              message: '请输入身份证号！',
            },

            {
              len: 18,
              message: '请输入正确的身份证号',
            },
          ]}
        >
          <Input autoComplete="off" />
        </Form.Item>
        <Form.Item
          label="居住小区"
          name="communityId"
          labelAlign="left"
          rules={[
            {
              required: true,
              message: '请选择居住小区！',
            },
          ]}
        >
          <Select
            onSelect={(value) =>
              dispatch({
                type: 'personManage/getBuildingCascade',
                payload: {
                  id: value,
                },
                callback: (roomList) => {
                  setCascaderOptions(roomList);
                },
              })
            }
          >
            {communityList.map((item) => (
              <Select.Option key={item.key} value={item.key}>
                {item.text}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="楼层信息" name="fwxxbz">
          <Cascader placeholder="" options={cascaderOptions} />
        </Form.Item>
        {/* <Form.Item label="楼层信息" labelAlign="left" style={{ marginBottom: 0 }}>
          <Form.Item
            name="unit"
            style={{ display: 'inline-block', width: 'calc(33.3333% - 32px)' }}
          >
            <InputNumber min={0} />
          </Form.Item>
          <span className={styles.inputAfter} style={{ width: '48px' }}>
            单元
          </span>
          <Form.Item
            name="floor"
            style={{ display: 'inline-block', width: 'calc(33.3333% - 32px)' }}
          >
            <InputNumber min={-1} />
          </Form.Item>
          <span className={styles.inputAfter} style={{ width: '24px' }}>
            楼
          </span>
          <Form.Item
            name="room"
            style={{ display: 'inline-block', width: 'calc(33.3333% - 32px)' }}
          >
            <InputNumber min={0} />
          </Form.Item>
          <span className={styles.inputAfter} style={{ width: '24px' }}>
            室
          </span>
        </Form.Item> */}
        <Form.Item
          label="预警规则"
          name="warningRule"
          labelAlign="left"
          rules={[
            {
              required: true,
              message: '请选择预警规则！',
            },
          ]}
        >
          <Select>
            {warningRuleList.map((item) => (
              <Select.Option key={item.key} value={item.key}>
                {item.text}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="人员类型"
          labelAlign="left"
          name="types"
          required
          // validateStatus="error"
          // help={types.length > 0 ? '' : ''}
          rules={[
            {
              validator: (rule, value, callback) => {
                try {
                  if (types.length > 0) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('请选择类型!'));
                } catch (err) {
                  callback(err);
                }
              },
            },
          ]}
        >
          <div className={styles.tags}>
            {tagList.map(({ key, text }) => (
              <div
                key={key}
                className={cx(
                  'f-tag',
                  'mr-8',
                  types.includes(key) ? 'f-tag-primary' : 'f-tag-default',
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  setTypes(
                    types.includes(key) ? types.filter((type) => type !== key) : [...types, key],
                  );
                }}
              >
                {text}
              </div>
            ))}
          </div>
        </Form.Item>
        <Form.Item label="人脸图片" labelAlign="left" name="faceUrl">
          <ImageUpload max={1} />
        </Form.Item>
        <div className={cx(styles.footer, 'text-right')}>
          <Button type="primary" htmlType="submit" className="mr-8">
            确定
          </Button>
          <Button onClick={handleClose}>取消</Button>
        </div>
      </Form>
    </Drawer>
  );
}
