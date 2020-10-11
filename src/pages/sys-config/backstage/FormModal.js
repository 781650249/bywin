import React, { useEffect } from 'react';
import { Form, Modal, Input } from 'antd';

export default function({
  visible = false,
  confirmLoading = false,
  type = '新增',
  formData = {},
  onSave = () => {},
  onCancel = () => {},
}) {
  const [form] = Form.useForm();

  useEffect(() => {
    const { id } = formData;
    if (!id) return;
    form.setFieldsValue({
      ...formData,
    });
  }, [form, formData]);

  const handleCancel = () => {
    onCancel();
    form.resetFields();
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      onSave({ ...values, id: formData.id }, () => {
        handleCancel();
      });
    });
  };
  return (
    <Modal
      getContainer={false}
      title={type}
      visible={visible}
      confirmLoading={confirmLoading}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form form={form}>
        <Form.Item name="businessName" rules={[{ required: true, message: '请输入名称!' }]}>
          <Input placeholder="请输入名称" />
        </Form.Item>
        <Form.Item name="businessValue" rules={[{ required: true, message: '请输入值!' }]}>
          <Input placeholder="请输入值" />
        </Form.Item>
        <Form.Item name="businessDescribe" rules={[{ required: true, message: '请输入描述!' }]}>
          <Input placeholder="请输入描述" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
