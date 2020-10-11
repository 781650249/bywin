import React, { useState } from 'react';
import { useDispatch, useSelector } from 'dva';
import { Badge, Row, Col, Form, InputNumber, Button, Select, Modal, Descriptions } from 'antd';
import {
  PlusOutlined,
  MinusOutlined,
  PoweroffOutlined,
  ExclamationCircleOutlined,
  CreditCardOutlined,
} from '@ant-design/icons';
import { debounce } from 'lodash';
import { RealTimePower, RealTimeState } from '../components';
import styles from './index.less';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const InputDigital = ({ value = 22, onChange = () => {} }) => (
  <div className={styles.inputDigital}>
    <Button icon={<MinusOutlined />} onClick={() => onChange(value - 1)} />
    <InputNumber formatter={(v) => `${v}℃`} value={value} onChange={onChange} />
    <Button icon={<PlusOutlined />} onClick={() => onChange(value + 1)} />
  </div>
);

export default function({ title = '', data = {} }) {
  const dispatch = useDispatch();
  const { status, runTime, energy, temperature, windPower: windSpeed, sweepMode, mode } = data;
  const { deviceList } = useSelector((state) => state.airConditioningControl);
  const [visible, setVisible] = useState(false);

  const handleValueChange = async (value, key) => {
    const { id } = data;
    const bool = await dispatch({
      type: 'airConditioningControl/update',
      payload: {
        id,
        [key]: value,
      },
    });
    if (bool) {
      dispatch({
        type: 'airConditioningControl/setState',
        payload: {
          deviceList: deviceList.map((item) => {
            if (item.id === id) {
              return {
                ...item,
                [key]: value,
              };
            }
            return { ...item };
          }),
        },
      });
    }
  };

  const runTimeFormat = () => {
    const minute = runTime % 60;
    const hour = Math.floor(runTime / 60);
    return `${hour < 10 ? `0${hour}` : hour}:${minute < 10 ? `0${minute}` : minute}`;
  };

  let color = '';
  switch (status) {
    case '运行中':
      color = '#66eaf8';
      break;
    case '未开启':
      color = '#666';
      break;
    case '故障':
      color = '#FF5029';
      break;
    default:
      color = 'transparent';
      break;
  }
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <Badge color={color} text={status} style={{ marginRight: 8 }} />
        {title}
        <div className={styles.actions}>
          <span className={styles.action} onClick={() => setVisible(true)}>
            <CreditCardOutlined />
          </span>
          <Modal
            visible={visible}
            centered
            width={320}
            footer={null}
            onCancel={() => setVisible(false)}
          >
            <Descriptions title="设备信息" column={1}>
              <Descriptions.Item label="空调名称">{`${data.id}号空调`}</Descriptions.Item>
              <Descriptions.Item label="空调地址">{data.address}</Descriptions.Item>
              <Descriptions.Item label="空调品牌">{data.brand}</Descriptions.Item>
              <Descriptions.Item label="空调功率">{data.workPower}</Descriptions.Item>
              <Descriptions.Item label="工作方式">{data.workMethod}</Descriptions.Item>
              <Descriptions.Item label="空调类型">{data.airType}</Descriptions.Item>
              <Descriptions.Item label="冷暖类型">{data.tempType}</Descriptions.Item>
              <Descriptions.Item label="使用面积">{data.usableArea}</Descriptions.Item>
              <Descriptions.Item label="能效等级">{data.efficiencyLevel}</Descriptions.Item>
            </Descriptions>
          </Modal>
          <span
            className={styles.action}
            onClick={() => {
              Modal.confirm({
                title: `是否${status === '运行中' ? '关闭' : '开启'}当前设备！`,
                icon: <ExclamationCircleOutlined />,
                okText: '是',
                cancelText: '否',
                style: {
                  top: 200,
                },
                onOk() {
                  handleValueChange(status === '运行中' ? '已停止' : '运行中', 'status');
                },
              });
            }}
          >
            <PoweroffOutlined />
          </span>
        </div>
      </div>
      <div className={styles.content}>
        <div>
          <RealTimePower value={Number(energy)} runTime={runTimeFormat()} />
          <p>实时能耗</p>
        </div>
        <div>
          <RealTimeState temperature={temperature} mode={mode} />
          <p>实时温度</p>
        </div>
      </div>
      <div className={styles.footer}>
        <Form component={false} {...layout} size="small">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item colon={false} label="温度">
                <InputDigital
                  value={Number(temperature)}
                  onChange={debounce((value) => handleValueChange(value, 'temperature'), 300)}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item colon={false} label="风速">
                <Select
                  getPopupContainer={(triggerNode) => triggerNode.parentElement}
                  value={windSpeed}
                  onChange={(value) => handleValueChange(value, 'windPower')}
                >
                  <Select.Option value="低风">低风</Select.Option>
                  <Select.Option value="中风">中风</Select.Option>
                  <Select.Option value="高风">高风</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item colon={false} label="扫风">
                <Select
                  getPopupContainer={(triggerNode) => triggerNode.parentElement}
                  value={sweepMode}
                  onChange={(value) => handleValueChange(value, 'sweepMode')}
                >
                  <Select.Option value="无扫风">无扫风</Select.Option>
                  <Select.Option value="左右扫风">左右扫风</Select.Option>
                  <Select.Option value="上下扫风">上下扫风</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item colon={false} label="模式">
                <Select
                  getPopupContainer={(triggerNode) => triggerNode.parentElement}
                  value={mode}
                  onChange={(value) => handleValueChange(value, 'mode')}
                >
                  <Select.Option value="自动">自动</Select.Option>
                  <Select.Option value="制冷">制冷</Select.Option>
                  <Select.Option value="制热">制热</Select.Option>
                  <Select.Option value="除湿">除湿</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  );
}
