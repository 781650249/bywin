import React from 'react';
import styles from './index.less';

const Results = ({ data = [], isShow, callback, searchValue }) => {

  const listItem =
    Array.isArray(data) &&
    data.map((item, index) => (
      <li
        key={index}
        className={styles.resultsItem}
        onMouseDown={(e) => callback(e.target.innerHTML, searchValue)}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html:
            item.xm.replace(
              searchValue,
              `<span id="symbol" style="color: red">${searchValue}</span>`,
            ) 
        }}
      />
    )).slice(0,5);

  if (isShow) {
    return <ul className={styles.results}>{listItem}</ul>;
  }
  return null;
};
export default Results;
