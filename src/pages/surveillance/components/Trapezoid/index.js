import React from 'react';
import cx from 'classnames';
import styles from './index.less';

export default function({ className = null, text = '', extra = null, style = {} }) {
  return (
    <div className={cx(styles.trapezoid, className)} style={{ ...style }}>
      {text}
      {extra}
    </div>
  );
}
