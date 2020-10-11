import React from 'react';
import { Checkbox } from 'antd';
import cx from 'classnames';
import styles from './ImageSelect.less';

const ImageSelect = (props) => {
  const {
    targetKey = '',
    targetUrl = '',
    images = [],
    selectedKeys = [],
    onChange = () => {},
  } = props;
  let checked = false;
  let indeterminate = false;
  if (selectedKeys.length > 0) {
    if (selectedKeys.length === images.length) {
      checked = true;
    } else {
      indeterminate = true;
    }
  }
  const selectedNumber = `${selectedKeys.length} / ${images.length}`
  const handleCheckChange = (e) => {
    if (e.target.checked) {
      if (targetKey) {
        onChange(images.map((img) => img[targetKey]));
      } else {
        onChange(images);
      }
    } else {
      onChange([]);
    }
  };

  const handleSelect = (currentKey) => {
    if (selectedKeys.includes(currentKey)) {
      onChange(selectedKeys.filter((key) => key !== currentKey));
    } else {
      onChange([...selectedKeys, currentKey]);
    }

  };
  const urlFormat = (url) => /^(data|http|blob)/.test(url) ? url : `data:image/jpeg;base64,${url}`
  return (
    <div>
      <div style={{ marginBottom: 8 }}>
        <Checkbox
          indeterminate={indeterminate}
          onChange={handleCheckChange}
          checked={checked}
        >
          全选
        </Checkbox>
        {selectedNumber}
      </div>

      <div className={styles.content}>
        {images.map((image, index) => {
          let key = image
          let url = image
          if (targetKey && targetUrl) {
            key = image[targetKey]
            url = image[targetUrl]
          }
          return (
            <div
              className={cx(styles.imgWrap, {
                [styles.active]: selectedKeys.includes(key),
              })}
              key={index}
            >
              <img src={urlFormat(url)} alt="" onClick={() => handleSelect(key)} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ImageSelect;
