import React, { useState, useEffect } from 'react';
import cx from 'classnames';
import styles from './index.less';

export default React.memo(function TrendControl({ keyPerson = [], caringObject = [] }) {
  const [type, setType] = useState('keyPerson');
  const [maxValue, setMaxValue] = useState(0);
  const data = type === 'keyPerson' ? keyPerson : caringObject;

  useEffect(() => {
    setMaxValue(Math.max(...data.map((item) => item.value)));
  }, [data]);

  return (
    <div className={styles.container}>
      <div>
        <div className="title-2">动向管控</div>
      </div>
      <div className={styles.buttonGroup}>
        <div
          className={cx(styles.button1, { [styles.active]: type === 'keyPerson' })}
          onClick={() => setType('keyPerson')}
        >
          重点人员
        </div>
        <div
          className={cx(styles.button2, { [styles.active]: type === 'caringObject' })}
          onClick={() => setType('caringObject')}
        >
          关怀对象
        </div>
      </div>
      <div className={styles.items}>
        {data.map((item, i) => {
          const { count, name } = item;
          const height = count / maxValue;
          return (
            <div className={styles.item} key={i}>
              <div
                className={styles.count}
                style={{
                  bottom: `calc(${height * 100}% - ${height * 56}px + 4px)`,
                }}
              >
                {count}
              </div>
              <div className={styles.bar} style={{ height: `${height * 100}%` }}>
                <div className={styles.base} />
              </div>
              <div className={styles.label}>{name}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
});
