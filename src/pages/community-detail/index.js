import React from 'react';
import { useDispatch } from 'dva';
import { CloseOutlined } from '@ant-design/icons';
import LeftBar from './LeftBar';
import Personnel from './Personnel';
import styles from './index.less';

export default function(props) {
  const dispatch = useDispatch();
  const { match } = props;

  const handleClose = () => {
    const { goBack } = props.history;
    dispatch({ type: 'communityDetail/clear' });
    if (goBack) goBack();
  };

  return (
    <div className={styles.wrap}>
      <LeftBar match={match} />
      <Personnel match={match} />
      <div className={styles.close} onClick={handleClose}>
        <CloseOutlined />
      </div>
    </div>
  );
}
