import React, { useState, useEffect } from 'react';
import { Slider } from 'antd';
import classNames from 'classnames';
import { Icon } from '@/components';
import styles from './index.less';

export default function({ value = 1, onChange = () => {}, ...props }) {
  const [brightness, setBrightness] = useState();

  useEffect(() => {
    setBrightness(value);
  }, [value]);

  return (
    <div className={styles.wrapper}>
      <Icon type="brightness-reduce" className={classNames(styles.icon, styles.iconReduce)} />
      <Slider
        {...props}
        value={brightness}
        tooltipVisible={false}
        min={1}
        max={100}
        onChange={setBrightness}
        onAfterChange={onChange}
      />
      <Icon type="brightness-plus" className={classNames(styles.icon, styles.iconPlus)} />
    </div>
  );
}
