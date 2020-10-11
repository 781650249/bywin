import React, { useState, useEffect, useCallback } from 'react';
import {
  Row,
  Col,
  Spin,
  Button,
  Form,
  Select,
  Radio,
  Input,
  InputNumber,
  Space,
  Popconfirm,
  message,
} from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import { getPrewarningEventList, deleteEvent, saveEvent } from '@/services/around-prevention';
import MarqueeArea from '@/components/MarqueeArea';
import PersonnelSelection from './PersonnelSelection';
import styles from './index.less';

const allEvent = [
  {
    key: '0',
    text: '入侵检测',
  },
  {
    key: '2',
    text: '徘徊预警',
  },
  // {
  //   key: '4',
  //   text: '越线检测',
  // },
  {
    key: '3',
    text: '翻墙检测',
  },
];

export default function({ deviceId = '', deviceType = '' }) {
  const [eventList, setEventList] = useState([]);
  const [eventLoading, setEventLoading] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [selectedEventKey, setSelectedEventKey] = useState('');

  const [form] = Form.useForm();

  const getEventData = useCallback(async () => {
    if (deviceType !== 'camera') return;
    setEventLoading(true);
    const data = await getPrewarningEventList({
      deviceId,
      deviceType,
    });
    setEventLoading(false);
    setEventList(data);
  }, [deviceId, deviceType]);

  useEffect(() => {
    getEventData();
  }, [getEventData]);

  /**
   * 取消按钮点击事件
   */
  const handleCancel = () => {
    setSelectedEventKey('');
    setFormVisible(false);
  };

  /**
   * 点击预警事件列表进行编辑
   * @param {Object} values
   */
  const update = (values) => {
    setFormVisible(true);
    setSelectedEventKey(values.id);
    let areaPoint = [];
    try {
      areaPoint = JSON.parse(values.areaPoint);
    } catch (error) {
      areaPoint = [];
    }

    form.setFieldsValue({
      ...values,
      areaPoint,
      eventId: String(values.eventId),
      notifyPerson: values.notifyPerson.split(','),
    });
  };

  /**
   * 新增预警事件
   */
  const add = () => {
    form.resetFields();
    setSelectedEventKey('');
    setFormVisible(true);
  };

  /**
   * 删除事件
   * @param {String|Number} id
   */
  const del = async (id) => {
    const success = await deleteEvent({ id });
    if (success) {
      setEventList(eventList.filter((item) => item.id !== id));
      if (selectedEventKey === id) {
        handleCancel()
      }
    }
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
      areaPoint: JSON.stringify(values.areaPoint),
    };
    if (payload.eventId) {
      const currentEvent = allEvent.find((item) => item.key === payload.eventId) || {};
      payload.eventName = currentEvent.text;
    }
    if (Array.isArray(payload.notifyPerson)) {
      payload.notifyPerson = payload.notifyPerson.join(',');
    }
    if (selectedEventKey) {
      payload.id = selectedEventKey;
    }
    const success = await saveEvent(payload);
    if (success) {
      message.success('保存成功！');
      handleCancel();
      if (selectedEventKey) getEventData();
    }
  };

  return (
    <Row
      style={{ display: deviceType === 'camera' ? 'flex' : 'none', height: 'calc(100% - 36px)' }}
    >
      <Col flex="240px" className={styles.event}>
        <div className={styles.eventTitle}>预警事件</div>
        <Spin spinning={eventLoading}>
          {eventList.map((item) => (
            <div
              key={item.id}
              className={classNames(styles.eventItem, {
                [styles.active]: selectedEventKey === item.id,
              })}
              onClick={() => update(item)}
            >
              {item.eventName}
              <Popconfirm
                title="确认移除当前事件?"
                onConfirm={() => del(item.id)}
                okText="是"
                cancelText="否"
              >
                <div className={styles.eventItemDelete} onClick={(e) => e.stopPropagation()}>
                  <DeleteOutlined />
                </div>
              </Popconfirm>
            </div>
          ))}
        </Spin>
        <Button ghost block onClick={add}>
          添加
        </Button>
      </Col>
      <Col flex="auto" style={{ height: '100%', overflow: 'auto' }}>
        <Form
          className={classNames({
            hide: !formVisible,
          })}
          form={form}
          onFinish={handleSubmit}
        >
          <Form.Item
            label="事件名称"
            name="eventId"
            rules={[
              {
                required: true,
                message: '请选择事件！',
              },
            ]}
          >
            <Select getPopupContainer={(triggerNode) => triggerNode.parentElement}>
              {allEvent.map((item) => (
                <Select.Option key={item.key}>{item.text}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="占用时间" required>
            <Input.Group compact>
              <Form.Item
                noStyle
                name="occupyTime"
                rules={[
                  {
                    required: true,
                    message: '请选择占用时间！',
                  },
                ]}
              >
                <InputNumber min={0} />
              </Form.Item>
              <Form.Item noStyle>
                <p style={{ margin: 0, textIndent: 8, lineHeight: '32px' }}>
                  分钟
                  <span style={{ paddingLeft: 16, color: '#fdbe32' }}>
                    占用超过预定时间自动预警
                  </span>
                </p>
              </Form.Item>
            </Input.Group>
          </Form.Item>
          <Form.Item
            label="检测类型"
            name="detectType"
            rules={[
              {
                required: true,
                message: '请选择检测类型！',
              },
            ]}
          >
            <Select getPopupContainer={(triggerNode) => triggerNode.parentElement}>
              <Select.Option value="1">行人</Select.Option>
              <Select.Option value="2">汽车</Select.Option>
              <Select.Option value="3">电动车</Select.Option>
              <Select.Option value="4">动物</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="预警区域" required style={{ maxWidth: 500 }}>
            <p style={{ margin: 0, color: '#fdbe32', textIndent: 16 }}>
              温馨提示：请在视频区域内点击框选需要预警的区域。
            </p>
          </Form.Item>
          <Form.Item
            style={{ maxWidth: 500 }}
            name="areaPoint"
            rules={[
              {
                required: true,
                message: '请选择预警区域！',
              },
            ]}
          >
            {/* <div style={{ height: 276, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}> </div> */}
            <MarqueeArea selectedPointId={deviceId} />
          </Form.Item>
          <Form.Item
            label="预警类型"
            name="notifyType"
            rules={[
              {
                required: true,
                message: '请选择预警类型！',
              },
            ]}
          >
            <Radio.Group>
              <Radio.Button value="message">短信</Radio.Button>
              <Radio.Button value="phone">电话</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label="通知人员"
            name="notifyPerson"
            rules={[
              {
                required: true,
                message: '请选择要通知的人员！',
              },
            ]}
          >
            <PersonnelSelection />
          </Form.Item>
          <Form.Item
            label="通知内容"
            name="notifyContent"
            rules={[
              {
                required: true,
                message: '请选择事件！',
              },
            ]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item className="text-right">
            <Space>
              <Button type="primary" htmlType="submit">
                确定
              </Button>
              <Button onClick={handleCancel}>取消</Button>
            </Space>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
}
