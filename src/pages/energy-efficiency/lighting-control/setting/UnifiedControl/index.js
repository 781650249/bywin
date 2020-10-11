import React, { useState, useEffect, useMemo } from 'react';
import { Form, Switch, Select, TimePicker, message } from 'antd';
// import { PoweroffOutlined } from '@ant-design/icons';
import { uniq, mean, toInteger } from 'lodash';
import classNames from 'classnames';
import { update } from '@/services/lighting-control';
import { RealTimePower, Dimming } from '../components';
import styles from './index.less';

const { RangePicker } = TimePicker;

export default function({ deviceList = [], setDeviceList = () => {}, params = {} }) {
  // 开灯 1 开灯 2 关灯
  const [openStatus, setOpenStatus] = useState(1);
  // 亮度 1~100
  const [brightness, setBrightness] = useState(1);
  // 运行时长
  const [runTime, setRunTime] = useState(0);
  // 功率
  const [energy, setEnergy] = useState(0);

  const [isLightControl, setIsLightControl] = useState(false);
  const [isIntelligent, setIsIntelligent] = useState(false);
  const [isTiming, setIsTiming] = useState(false);
  const [repeat, setRepeat] = useState(0);

  useEffect(() => {
    const energyList = [];
    const runTimeList = [];
    const brightnessList = [];
    const isLightControlList = [];
    const isIntelligentList = [];
    const isTimingList = [];
    const repeatList = [];
    const statusList = [];
    deviceList.forEach((item) => {
      energyList.push(Number(item.electricity));
      runTimeList.push(Number(item.runTime));
      brightnessList.push(Number(item.luminance));
      isLightControlList.push(item.lightControlStatus);
      isIntelligentList.push(item.intelligentStatus);
      isTimingList.push(item.timingStatus);
      repeatList.push(item.repeatMode);
      statusList.push(item.openStatus);
    });
    if (energyList.length > 0) {
      setEnergy(toInteger(mean(energyList)));
    } else {
      setEnergy(0);
    }
    if (runTimeList.length > 0) {
      setRunTime(toInteger(mean(runTimeList)));
    } else {
      setRunTime(0);
    }
    if (brightnessList.length > 0) {
      setBrightness(toInteger(mean(brightnessList)));
    } else {
      setBrightness(1);
    }

    if (uniq(isTimingList).length === 1 && uniq(isTimingList)[0] === 1) {
      setIsTiming(true);
    } else {
      setIsTiming(false);
    }
    if (uniq(isIntelligentList).length === 1 && uniq(isIntelligentList)[0] === 1) {
      setIsIntelligent(true);
    } else {
      setIsIntelligent(false);
    }
    if (uniq(isLightControlList).length === 1 && uniq(isLightControlList)[0] === 1) {
      setIsLightControl(true);
    } else {
      setIsLightControl(false);
    }
    if (uniq(repeatList).length === 1) {
      setRepeat(uniq(repeatList)[0]);
    } else {
      setRepeat(0);
    }
    if (uniq(statusList).length === 1) {
      setOpenStatus(uniq(statusList)[0]);
    } else {
      setOpenStatus(-1);
    }
  }, [deviceList]);

  const handleUpdate = async (key, value) => {
    if (deviceList.length === 0) {
      message.warn('当前区域没有空调可以控制！');
      return;
    }
    const payload = { ...params };
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
          if (key === 'times') {
            return {
              ...item,
              gmtBegin: payload.gmtBegin,
              gmtEnd: payload.gmtEnd,
            };
          }
          return {
            ...item,
            [key]: value,
          };
        }),
      );
    }
    return success;
  };

  const runTimeFormat = useMemo(() => {
    const minute = runTime % 60;
    const hour = Math.floor(runTime / 60);
    return `${hour < 10 ? `0${hour}` : hour}:${minute < 10 ? `0${minute}` : minute}`;
  }, [runTime]);

  // 灯光亮度
  let haloOpacity = 0;
  if (openStatus === 1) {
    const opacity = Math.ceil(brightness / 10) / 10;
    haloOpacity = opacity < 0.3 ? 0.3 : opacity;
  }

  return (
    <div className={classNames(styles.unifiedControl)}>
      <div className={styles.item1}>
        <div>
          <RealTimePower value={energy} runTime={runTimeFormat} />
          <p>实时能耗</p>
        </div>
      </div>
      <div className={styles.brightness}>
        <h3 className="f-title mb-8">设定亮度</h3>
        <div className={styles.lightWrapper}>
          <div className={styles.halo} style={{ opacity: haloOpacity }} />
          <div
            className={classNames(styles.light, {
              [styles.lightOpen]: openStatus === 1,
              [styles.lightOff]: openStatus === 0,
              [styles.lightFault]: openStatus === 2,
            })}
          />
        </div>
        <Dimming
          disabled={openStatus !== 1}
          value={brightness}
          onChange={(value) => {
            handleUpdate('luminance', value);
          }}
        />
      </div>
      <div className={styles.form}>
        <h3 className="f-title mb-8">智能设定</h3>
        <Form colon={false}>
          <Form.Item label="光控">
            <Switch
              checkedChildren="开"
              unCheckedChildren="关"
              checked={isLightControl}
              onChange={(checked) => handleUpdate('lightControlStatus', Number(checked))}
            />
          </Form.Item>
          <Form.Item label="智能">
            <Switch
              checkedChildren="开"
              unCheckedChildren="关"
              checked={isIntelligent}
              onChange={(checked) => handleUpdate('intelligentStatus', Number(checked))}
            />
            <i className={styles.tip}>根据是否有人自动开关灯</i>
          </Form.Item>
          <Form.Item label="定时">
            <Switch
              checkedChildren="开"
              unCheckedChildren="关"
              checked={isTiming}
              onChange={(checked) => handleUpdate('timingStatus', Number(checked))}
            />
            <RangePicker format="HH:mm" size="small" style={{ width: 176, marginLeft: 8 }} />
          </Form.Item>
          <Form.Item label="重复">
            <Select
              size="small"
              value={repeat}
              onChange={(value) => handleUpdate('repeatMode', value)}
              getPopupContainer={(triggerNode) => triggerNode.parentElement}
              style={{ maxWidth: 228 }}
            >
              <Select.Option value={0}>仅一次</Select.Option>
              <Select.Option value={1}>每日</Select.Option>
              <Select.Option value={2}>法定工作日</Select.Option>
              <Select.Option value={3}>自定义</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </div>
      <div className={styles.switch}>
        <h3 className="f-title mb-8">设定状态</h3>
        <div className={styles.switchBtnGroup}>
          <div className={styles.btnWrapper}>
            <div
              className={classNames('f-btn-poweroff', {
                'f-btn-poweroff-active': openStatus === 1,
              })}
              onClick={() => handleUpdate('openStatus', 1)}
            />
            <p>开启</p>
          </div>
          <div className={styles.btnWrapper}>
            <div
              className={classNames('f-btn-poweroff', {
                'f-btn-poweroff-active': [0, 2].includes(openStatus),
              })}
              onClick={() => handleUpdate('openStatus', 0)}
            />
            <p>关闭</p>
          </div>
        </div>
      </div>
    </div>
  );
}
