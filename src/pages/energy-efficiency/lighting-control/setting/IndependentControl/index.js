import React from 'react';
import { Row, Col, Form, Switch, Select, Modal, TimePicker, message } from 'antd';
import {
  ClockCircleOutlined,
  PoweroffOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import classNames from 'classnames';
import moment from 'moment';
import { Icon } from '@/components';
import { update } from '@/services/lighting-control';
import { Dimming } from '../components';
import styles from './index.less';

const { RangePicker } = TimePicker;
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

export default function(props) {
  const { deviceList = [], setDeviceList = () => {} } = props;

  /**
   * 更新设备
   * @param {String} key
   * @param {String|Number} value
   */
  const handleValueChange = async (id, key, value) => {
    const payload = { id };
    if (key === 'times') {
      if (Array.isArray(value) && value.length === 2) {
        const [startTime, endTime] = value;
        payload.gmtBegin = startTime.format('HH:mm');
        payload.gmtEnd = endTime.format('HH:mm');
      } else {
        payload.gmtBegin = '';
        payload.gmtEnd = '';
      }
    } else {
      payload[key] = value;
    }
    const success = await update(payload);
    if (success) {
      setDeviceList(
        deviceList.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              ...payload,
            };
          }
          return { ...item };
        }),
      );
    }
    return success;
  };
  /**
   * 运行时间格式化
   */
  const runTimeFormat = (runTime) => {
    if (!runTime) return null;
    const minute = runTime % 60;
    const hour = Math.floor(runTime / 60);
    return `${hour < 10 ? `0${hour}` : hour}:${minute < 10 ? `0${minute}` : minute}`;
  };

  return deviceList.map((item) => {
    const { openStatus, luminance } = item;
    let times = null;
    if (item.gmtBegin && item.gmtEnd) {
      times = [moment(item.gmtBegin, 'HH:mm'), moment(item.gmtEnd, 'HH:mm')];
    }
    let haloOpacity = 0;
    if (openStatus === 1) {
      const opacity = Math.ceil(item.luminance / 10) / 10;
      haloOpacity = opacity < 0.3 ? 0.3 : opacity;
    }
    return (
      <div className={styles.wrapper} key={item.id}>
        <div className={styles.header}>
          {item.lightName}
          <div className={styles.actions}>
            <span
              className={styles.action}
              onClick={() => {
                if (openStatus === 2) {
                  message.warning('该设备故障，无法开启！');
                  return;
                }
                Modal.confirm({
                  title: `是否${openStatus === 1 ? '关闭' : '开启'}当前设备！`,
                  icon: <ExclamationCircleOutlined />,
                  okText: '是',
                  cancelText: '否',
                  style: {
                    top: 200,
                  },
                  onOk: () => {
                    handleValueChange(item.id, 'openStatus', openStatus === 1 ? 0 : 1);
                  },
                });
              }}
            >
              <PoweroffOutlined />
            </span>
          </div>
        </div>
        <div className={styles.content}>
          <div className={classNames(styles.contentImg)}>
            <div className={styles.halo} style={{ opacity: haloOpacity }} />
            <div
              className={classNames(styles.light, {
                [styles.lightOpen]: openStatus === 1,
                [styles.lightOff]: openStatus === 0,
                [styles.lightFault]: openStatus === 2,
              })}
            />
          </div>
          <div className={styles.contentText}>
            <span>
              <Icon type="consume-power" className="mr-4" />
              <span style={{ fontSize: 16 }}>{item.electricity} </span>
              kw
            </span>
            <span className="ml-16">
              <ClockCircleOutlined className="mr-4" />
              {runTimeFormat(item.runTime)}
            </span>
          </div>
        </div>
        <div className={styles.footer}>
          <Dimming
            value={luminance}
            onChange={(value) => {
              handleValueChange(item.id, 'luminance', value);
            }}
          />
          <Form {...layout} component={false} colon={false} labelAlign="left">
            <Row>
              <Col span={8}>
                <Form.Item label="光控">
                  <Switch
                    checkedChildren="开"
                    unCheckedChildren="关"
                    checked={item.lightControlStatus === 1}
                    onChange={(checked) => {
                      handleValueChange(item.id, 'lightControlStatus', Number(checked));
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="智能">
                  <Switch
                    checkedChildren="开"
                    unCheckedChildren="关"
                    checked={item.intelligentStatus === 1}
                    onChange={(checked) => {
                      handleValueChange(item.id, 'intelligentStatus', Number(checked));
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="定时">
                  <Switch
                    checkedChildren="开"
                    unCheckedChildren="关"
                    checked={item.timingStatus === 1}
                    onChange={(checked) => {
                      handleValueChange(item.id, 'timingStatus', Number(checked));
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={11}>
                <Form.Item label="重复" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                  <Select
                    size="small"
                    value={item.repeatMode}
                    disabled={item.timingStatus !== 1}
                    getPopupContainer={(triggerNode) => triggerNode.parentElement}
                    onChange={(value) => {
                      handleValueChange(item.id, 'repeatMode', value);
                    }}
                  >
                    <Select.Option value={0}>仅一次</Select.Option>
                    <Select.Option value={1}>每日</Select.Option>
                    <Select.Option value={2}>法定工作日</Select.Option>
                    <Select.Option value={3}>自定义</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={13}>
                <Form.Item label=" " labelCol={{ span: 1 }} wrapperCol={{ span: 23 }}>
                  <RangePicker
                    format="HH:mm"
                    size="small"
                    disabled={item.timingStatus !== 1}
                    value={times}
                    onChange={(value) => {
                      handleValueChange(item.id, 'times', value);
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    );
  });
}
