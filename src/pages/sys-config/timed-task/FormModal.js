import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, Modal, Input } from 'antd';

const FormItem = Form.Item;

export default function FormModal({
  visible = false,
  confirmLoading = false,
  formData = {},
  type = '新增',
  onCancel = () => {},
  onSave = () => {},
}) {
  const [form] = Form.useForm();

  useEffect(() => {
    const { id, cron, jobDesc, jobName, runClazzPath, status } = formData;
    if (!id) return;
    form.setFieldsValue({
      cron,
      jobDesc,
      jobName,
      runClazzPath,
      status,
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
      // destroyOnClose
      getContainer={false}
      title={type}
      visible={visible}
      confirmLoading={confirmLoading}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form form={form}>
        <FormItem name="jobName" rules={[{ required: true, message: '请输入任务名称!' }]}>
          <Input placeholder="请输入任务名称" />
        </FormItem>
        <FormItem name="cron" rules={[{ required: true, message: '请输入定时任务表达式!' }]}>
          <Input placeholder="请输入定时任务表达式" />
        </FormItem>
        <FormItem
          name="runClazzPath"
          rules={[{ required: true, message: '请输入要执行的任务类路径!' }]}
        >
          <Input placeholder="请输入要执行的任务类路径" />
        </FormItem>
        <FormItem name="jobDesc" rules={[{ required: true, message: '请输入任务描述!' }]}>
          <Input placeholder="请输入任务描述" />
        </FormItem>
        {type === '修改' ? (
          <FormItem name="status" rules={[{ required: true, message: '请输入状态!' }]}>
            <Input placeholder="请输入状态" />
          </FormItem>
        ) : null}
      </Form>
    </Modal>
  );
}

FormModal.prototype = {
  visible: PropTypes.bool,
  confirmLoading: PropTypes.bool,
  type: PropTypes.string,
  handleSave: PropTypes.func,
  handleCancel: PropTypes.func,
};
