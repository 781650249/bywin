import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'dva';
import OrgList from './OrgList';
import styles from './index.less';

export default function() {
  const dispatch = useDispatch();
  const orgTypeList = useSelector(({ discover }) => discover.orgTypeList);
  const selectedOrgType = useSelector(({ discover }) => discover.selectedOrgType);

  useEffect(() => {
    dispatch({ type: 'discover/getOrgTypeList' });
    return () => {
      dispatch({ 
        type: 'discover/setState',
        payload: {
          selectedOrgType: null,
        },  
      })
    }
  }, [dispatch]);

  useEffect(() => {
    if(selectedOrgType) {
      dispatch({
        type: 'discover/getOrgList',
        payload: {
          labelId: selectedOrgType,
        },
      });
    }
  }, [dispatch, selectedOrgType])

  return (
    <div className={styles.wrap}>
      <div className={styles.tabsBar}>
        {orgTypeList &&
          orgTypeList.map((item, index) => (
            <div
              key={index}
              onClick={() => {
                dispatch({
                  type: 'discover/setState',
                  payload: {
                    selectedOrgType: item.labelId,
                  },
                });
              }}
            >
              <span className={selectedOrgType === item.labelId ? styles.checkedStatus : null}>{item.labelName}</span>
              {selectedOrgType !== item.labelId && <span className={styles.notificationCount}>{item.num}</span>}
            </div>
          ))}
      </div>

      <OrgList />
    </div>
  );
}
