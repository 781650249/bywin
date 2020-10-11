import React, { useState, useEffect } from 'react';
import { Form, Select, Radio, Input, Space, Button, message } from 'antd';
import { getPrewarningEventList, saveEvent } from '@/services/around-prevention';
import PersonnelSelection from './PersonnelSelection';

export default function({ deviceId = '', deviceType = '' }) {
  const [defaultValues, setDefaultValues] = useState({});
  const [form] = Form.useForm();
  useEffect(() => {
    const getEventData = async () => {
      if (deviceType !== 'infrared') return;
      const data = await getPrewarningEventList({
        deviceId,
        deviceType,
      });
      if (data.length === 0) return;
      const [configData] = data;
      const values = {
        ...configData,
        eventId: String(configData.eventId),
        notifyPerson: configData.notifyPerson.split(','),
      };
      setDefaultValues(values);
      form.setFieldsValue(values);
    };
    getEventData();
  }, [deviceId, deviceType, form]);

  /**
   * 重置表单
   */
  const handleReset = () => {
    form.resetFields();
  };

  /**
   * 表单提交
   * @param {Object} values
   */
  const handleSubmit = async (values) => {
    const payload = {
      ...values,
      deviceId,
      deviceType,
    };
    if (payload.eventId) {
      payload.eventName = '红外感应翻墙进入';
    }
    if (Array.isArray(payload.notifyPerson)) {
      payload.notifyPerson = payload.notifyPerson.join(',');
    }
    if (defaultValues.id) {
      payload.id = defaultValues.id;
    }
    const success = await saveEvent(payload);
    if (success) {
      message.success('保存成功！')
    }
  };
  if (deviceType !== 'infrared') {
    return null;
  }

  return (
    <Form form={form} onFinish={handleSubmit} style={{ width: 430 }}>
      <Form.Item label="事件名称" name="eventId">
        <Select getPopupContainer={(triggerNode) => triggerNode.parentElement}>
          <Select.Option value="0">红外感应翻墙进入</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item label="预警类型" name="notifyType">
        <Radio.Group>
          <Radio.Button value="message">短信</Radio.Button>
          <Radio.Button value="phone">电话</Radio.Button>
        </Radio.Group>
      </Form.Item>
      <Form.Item label="通知人员" name="notifyPerson">
        <PersonnelSelection />
      </Form.Item>
      <Form.Item label="通知内容" name="notifyContent">
        <Input.TextArea rows={4} />
      </Form.Item>
      <Form.Item className="text-right">
        <Space>
          <Button type="primary" htmlType="submit">
            确定
          </Button>
          <Button onClick={handleReset}>重置</Button>
        </Space>
      </Form.Item>
    </Form>
  );
}
