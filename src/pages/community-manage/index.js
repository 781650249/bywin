import React, { useEffect } from 'react';
// import { useDispatch, useSelector  } from 'dva';
// import {  } from 'antd';
// import cx from 'classnames';
import OrgList from './orgList'
import RightBar from './RightBar'
import styles from './index.less';

export default function() {
  
  useEffect(() => {}, [])

  return (
    <div className={styles.wrap}>
      <OrgList />
      <RightBar />
    </div>
  );
}