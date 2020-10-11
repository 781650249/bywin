import React, { useEffect } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'dva';
import styles from './index.less';
import RelationDiagram from './RelationDiagram';
import List from './List';

export default function(props) {
  const dispatch = useDispatch();
  const { gxObject = {} } = useSelector(({ profile }) => profile, shallowEqual);
  const { id } = props;
  const { links = [] } = gxObject;
  const number = links.filter((item) => id === item.pidtx || id === item.pid);
  useEffect(
    () => () => {
      dispatch({
        type: 'profile/clearRelation',
      });
    },
    [dispatch],
  );
  return (
    <>
      <div className={styles.header}>
        <div style={{ float: 'left' }}>
          摘要：该人有关的实体共{number.length > 0 ? number.length : 0}个，与其中
          {links.length > 0 ? links.length : 0}人有同行记录
        </div>
      </div>
      <div className={styles.container}>
        <div className={styles.chartWrapper}>
          <RelationDiagram />
        </div>
        <div className={styles.recordWrapper}>
          <List />
        </div>
      </div>
    </>
  );
}
