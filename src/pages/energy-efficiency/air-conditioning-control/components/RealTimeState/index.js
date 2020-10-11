import React from 'react';
import cx from 'classnames';
import styles from './index.less';

export default function({ temperature = 24, mode = '自动' }) {
  let state = 'auto';
  switch (mode) {
    case '自动':
      state = 'auto';
      break;
    case '制冷':
      state = 'cooling';
      break;
    case '制热':
      state = 'heating';
      break;
    case '除湿':
      state = 'arefaction';
      break;
    default:
      break;
  }
  return (
    <div className={cx(styles.container, styles[state])}>
      <span className={styles.temperature}>{temperature}</span>
    </div>
  );
}
