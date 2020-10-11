import React from 'react';
import Link from 'umi/link';
import { Avatar } from 'antd';
import { CloseOutlined, UserOutlined } from '@ant-design/icons';
import cx from 'classnames';
import styles from './index.less';

export default function(props) {
  const {
    className = '',
    style = {},
    closable = false,
    onClose = () => {},
    onViewer = () => {},
    avatar = '',
    title = '',
    describe = '',
    tags = [],
    link = '',
  } = props;
  return (
    <div className={cx(styles.card, className)} style={{ ...style }}>
      {closable ? <CloseOutlined className={styles.close} onClick={onClose} /> : null}
      <Avatar
        className={styles.avatar}
        src={avatar}
        shape="square"
        size={100}
        icon={<UserOutlined />}
        onClick={onViewer}
      />
      <div className={styles.info}>
        <div
          className={cx(styles.title, 'ellipsis')}
          title={typeof title === 'string' ? title : ''}
        >
          {link ? <Link to={link}>{title}</Link> : title}
        </div>
        <div
          className={cx(styles.describe, 'ellipsis')}
          title={typeof describe === 'string' ? describe : ''}
        >
          {link ? <Link to={link}>{describe}</Link> : describe}
        </div>
        <div className={styles.tags}>
          {tags.map((tag) => (
            <div
              className={cx(
                'f-tag',
                'mr-8',
                tag.includes('流动') ? 'f-tag-warning' : 'f-tag-primary',
              )}
              key={tag}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
