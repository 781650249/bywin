import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'dva';
import { Slider, message } from 'antd';
// import { PoweroffOutlined } from '@ant-design/icons';
import { uniq, mean, toInteger } from 'lodash';
import cx from 'classnames';
import { RealTimePower, RealTimeState } from '../components';
import styles from './index.less';

export default function() {
  const dispatch = useDispatch();
  const { deviceList, currentArea } = useSelector((state) => state.airConditioningControl);
  const [energy, setEnergy] = useState(0);
  const [temperature, setTemperature] = useState(16);
  const [mode, setMode] = useState('');
  const [windSpeed, setWindSpeed] = useState('');
  const [sweepMode, setSweepMode] = useState('');
  const [status, setStatus] = useState('');
  const [runTime, setRunTime] = useState(0);
  useEffect(() => {
    const energyList = [];
    const runTimeList = [];
    const temperatureList = [];
    const modeList = [];
    const windSpeedList = [];
    const sweepModeList = [];
    const statusList = [];
    deviceList.forEach((item) => {
      if (item.status === '运行中') {
        energyList.push(Number(item.energy));
        runTimeList.push(Number(item.runTime));
        temperatureList.push(Number(item.temperature));
        modeList.push(item.mode);
        windSpeedList.push(item.windPower);
        sweepModeList.push(item.sweepMode);
      }
      statusList.push(item.status);
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
    if (temperatureList.length > 0) {
      setTemperature(toInteger(mean(temperatureList)));
    } else {
      setEnergy(16);
    }
    if (uniq(modeList).length === 1) {
      setMode(uniq(modeList)[0]);
    } else {
      setMode('');
    }
    if (uniq(windSpeedList).length === 1) {
      setWindSpeed(uniq(windSpeedList)[0]);
    } else {
      setWindSpeed('');
    }
    if (uniq(sweepModeList).length === 1) {
      setSweepMode(uniq(sweepModeList)[0]);
    } else {
      setSweepMode('');
    }
    if (uniq(statusList).length === 1) {
      setStatus(uniq(statusList)[0]);
    } else {
      setStatus('');
    }
  }, [deviceList]);

  const handleUpdate = async (key, value) => {
    if (deviceList.length === 0) {
      message.warn('当前区域没有空调可以控制！');
      return;
    }
    const bool = await dispatch({
      type: 'airConditioningControl/update',
      payload: {
        ...currentArea,
        [key]: value,
      },
    });
    if (bool) {
      dispatch({
        type: 'airConditioningControl/setState',
        payload: {
          deviceList: deviceList.map((item) => {
            if (item.status === '运行中' || key === 'status') {
              return {
                ...item,
                [key]: value,
              };
            }
            return {
              ...item,
            };
          }),
        },
      });
    }
  };

  const runTimeFormat = useMemo(() => {
    const minute = runTime % 60;
    const hour = Math.floor(runTime / 60);
    return `${hour < 10 ? `0${hour}` : hour}:${minute < 10 ? `0${minute}` : minute}`;
  }, [runTime]);

  return (
    <div className={cx(styles.unifiedControl)}>
      <div className={styles.status}>
        <div>
          <RealTimePower value={energy} runTime={runTimeFormat} />
          <p>实时能耗</p>
        </div>
        <div>
          <RealTimeState temperature={temperature} mode={mode} />
          <p>实时温度</p>
        </div>
      </div>
      <div className={styles.temperature}>
        <h3 className="f-title mb-8">设定温度</h3>
        <div className="text-right">{`${temperature}℃`}</div>
        <Slider
          value={temperature}
          tooltipVisible={false}
          min={16}
          max={30}
          onChange={(value) => setTemperature(value)}
          onAfterChange={(value) => handleUpdate('temperature', value)}
        />
        <div className={styles.panel}>
          <div className={styles.panelItem}>
            <div
              className={cx(styles.panelItemBtn, {
                [styles.active]: mode === '自动',
              })}
              onClick={() => handleUpdate('mode', '自动')}
            >
              自动
            </div>
          </div>
          <div className={styles.panelItem}>
            <div
              className={cx(styles.panelItemBtn, {
                [styles.active]: mode === '制冷',
              })}
              onClick={() => handleUpdate('mode', '制冷')}
            >
              制冷
            </div>
          </div>
          <div className={styles.panelItem}>
            <div
              className={cx(styles.panelItemBtn, {
                [styles.active]: mode === '制热',
              })}
              onClick={() => handleUpdate('mode', '制热')}
            >
              制热
            </div>
          </div>
          <div className={styles.panelItem}>
            <div
              className={cx(styles.panelItemBtn, {
                [styles.active]: mode === '除湿',
              })}
              onClick={() => handleUpdate('mode', '除湿')}
            >
              除湿
            </div>
          </div>
        </div>
      </div>
      <div className={styles.windSpeed}>
        <h3 className="f-title mb-8">设定风速</h3>
        <div className={styles.windSpeedBtnGroup}>
          <div
            className={cx(styles.btnCircle, { [styles.active]: windSpeed === '低风' })}
            onClick={() => handleUpdate('windPower', '低风')}
          >
            低风
          </div>
          <div
            className={cx(styles.btnCircle, { [styles.active]: windSpeed === '中风' })}
            onClick={() => handleUpdate('windPower', '中风')}
          >
            中风
          </div>
          <div
            className={cx(styles.btnCircle, { [styles.active]: windSpeed === '高风' })}
            onClick={() => handleUpdate('windPower', '高风')}
          >
            高风
          </div>
        </div>
        <div className={styles.windSpeedRadioGroup}>
          <div
            className={cx(styles.radioButton, { [styles.active]: sweepMode === '无扫风' })}
            onClick={() => handleUpdate('sweepMode', '无扫风')}
          >
            无扫风
          </div>
          <div
            className={cx(styles.radioButton, { [styles.active]: sweepMode === '左右扫风' })}
            onClick={() => handleUpdate('sweepMode', '左右扫风')}
          >
            左右扫风
          </div>
          <div
            className={cx(styles.radioButton, { [styles.active]: sweepMode === '上下扫风' })}
            onClick={() => handleUpdate('sweepMode', '上下扫风')}
          >
            上下扫风
          </div>
        </div>
      </div>
      <div className={styles.switch}>
        <h3 className="f-title mb-8">设定状态</h3>
        <div className={styles.switchBtnGroup}>
          <div className={styles.btnWrapper}>
            <div
              className={cx('f-btn-poweroff', { 'f-btn-poweroff-active': status === '运行中' })}
              onClick={() => handleUpdate('status', '运行中')}
             />
            <p>开启</p>
          </div>
          <div className={styles.btnWrapper}>
            <div
              className={cx('f-btn-poweroff', {
                'f-btn-poweroff-active': status && status !== '运行中',
              })}
              onClick={() => handleUpdate('status', '未开启')}
             />
            <p>关闭</p>
          </div>
        </div>
      </div>
    </div>
  );
}
