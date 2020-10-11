import React, { useState } from 'react';
import { Button, Drawer, Form, Input, Radio, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useSelector } from 'dva';
import { ImageUpload } from '@/components/ImageUpload';
import { addOrUpdate, verifyPhone } from '@/services/personnel/info';
import styles from './index.less';

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};

export default function({ positionList = [], companyList = [], onRefresh = () => {} }) {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const { communityList } = useSelector((state) => state.global);
  const handleClose = () => {
    form.resetFields();
    setVisible(false);
  };
  // console.log(22222, communityList)
  const handleSave = () => {
    form
      .validateFields()
      .then(async (values) => {
        // eslint-disable-next-line
        console.log(values);
        const [xp] = values.xp || [];
        const success = await addOrUpdate({
          ...values,
          xp,
        });
        if (success) {
          onRefresh();
          handleClose();
        }
      })
      .catch((info) => {
        // eslint-disable-next-line
        console.log(info);
      });
  };

  const showDrawer = () => {
    setVisible(true);
  };

  return (
    <>
      <span className={styles.action} onClick={showDrawer}>
        <PlusOutlined />
      </span>
      <Drawer
        title="新增人员"
        width={520}
        onClose={handleClose}
        visible={visible}
        // getContainer={false}
        bodyStyle={{ paddingBottom: 80 }}
        footer={
          <div className="text-right">
            <Button onClick={handleClose} className="mr-8">
              取消
            </Button>
            <Button onClick={handleSave} type="primary">
              保存
            </Button>
          </div>
        }
      >
        <Form {...layout} form={form}>
          <Form.Item
            label="园区"
            name="yqxxbz"
            rules={[
              {
                required: true,
                message: '请选择园区！',
              },
            ]}
          >
            <Select getPopupContainer={(triggerNode) => triggerNode.parentElement}>
              {communityList.map((item) => (
                <Select.Option key={item.xqxxbz}>{item.communityName}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="姓名"
            name="xm"
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
            label="性别"
            name="xbdm"
            rules={[
              {
                required: true,
                message: '请选择性别！',
              },
            ]}
          >
            <Radio.Group>
              <Radio value="1">男</Radio>
              <Radio value="2">女</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label="手机号码"
            name="sjhm"
            validateTrigger={['onChange', 'onBlur']}
            rules={[
              {
                required: true,
                message: '请输入手机号码！',
              },
              {
                pattern: /^1\d{10}$/,
                message: '请输入正确的手机号码！',
              },
              {
                validator: async (_, value) => {
                  const { success, msg } = await verifyPhone({ sjhm: value });
                  if (success) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error(msg));
                },
                validateTrigger: 'onBlur',
              },
            ]}
          >
            <Input autoComplete="off" />
          </Form.Item>
          <Form.Item
            label="角色"
            name="position"
            rules={[
              {
                required: true,
                message: '请选择角色！',
              },
            ]}
          >
            <Select getPopupContainer={(triggerNode) => triggerNode.parentElement}>
              {positionList.map((item) => (
                <Select.Option key={item.key}>{item.text}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="归属企业"
            name="qyxxbz"
            rules={[
              {
                required: true,
                message: '请选择归属企业！',
              },
            ]}
          >
            <Select getPopupContainer={(triggerNode) => triggerNode.parentElement}>
              {companyList.map((item) => (
                <Select.Option key={item.key}>{item.text}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="地址"
            name="dz"
            rules={[
              {
                required: true,
                message: '请输入地址！',
              },
            ]}
          >
            <Input autoComplete="off" />
          </Form.Item>
          <Form.Item label="备注" name="bz">
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            label="照片"
            name="xp"
            rules={[
              {
                required: true,
                message: '请上传照片！',
              },
            ]}
          >
            <ImageUpload max={1} />
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
}
