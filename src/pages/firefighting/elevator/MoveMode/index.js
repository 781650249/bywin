import React, { useCallback, useState } from 'react';
import { useSelector } from 'dva';
import liftError from './images/lift-error.png';
import liftNormal from './images/lift-normal.png';
import liftWarn from './images/lift-warn.png';
import styles from './index.less';

const liftLogo = {
  1: liftWarn,
  2: liftNormal,
  3: liftError,
}
const liftTooltopColor = {
  1: '#f5222d',
  2: '#34d6ff',
  3: '#faad14',
}

export default function({ layers = [] }) {
  const [graphHeight, setgraphHeight] = useState(0);
  const { elevatorList } = useSelector(({ elevator }) => elevator);

  const graphRef = useCallback(node => {
    if(node !== null) {
      const { offsetHeight } = node;
      setgraphHeight(offsetHeight)
      if (layers.length !== 0) {
        setgraphHeight(offsetHeight / layers.length);
      }
    }
  }, [layers])

  return (
    <>
      <div className={styles.titleBar}>
        <span className={styles.title}>金牛山互联网基地</span>
        <div className={styles.legendWrapper}>
          <span>正常运行</span>
          <span>故障</span>
          <span>预警</span>
        </div>
      </div>
      <div ref={graphRef} className={styles.content}>
        <div className={styles.axisY}>
          {Array.isArray(layers) &&
            [...layers].reverse().map((item, index) => (
              <div className={styles.axisYScale} key={index}>
                {item}F
              </div>
            ))}
        </div>
        <div className={styles.series}>
          {[...elevatorList].slice(0, 8).map((item, index) => (
              <div key={index} className={styles.seriesBox}>
                <div
                  className={styles.seriesBoxContent}
                  style={{
                    bottom:
                      (item.stopFloor - 1) * graphHeight +
                      graphHeight / 2 -
                      21.5 -
                      7,
                  }}
                >
                  <img src={liftLogo[item.showStatus]} alt="" />
                  <div
                    className={styles.tooltip}
                    style={{ width: (elevatorList.length - 1) * 48 }}
                  >
                    <div className={styles.tooltipContent}>
                      <p><span style={{ color: liftTooltopColor[item.showStatus] }}>{item.stopFloor}</span><span>F</span></p>
                      <p>{item.name}</p>
                    </div>
                  </div>
                </div>
                <div className={styles.seriesBoxContent} style={{ bottom: -24 }}>
                  {item.currentLoad}KG
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}
