import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import Carousel from './Carousel';
import RelationChart from './RelationChart';
import PeerRecord from './PeerRecord';
import styles from './index.less';

function OrgList(props) {
  const { dispatch, orgList, isRequest, selectedOrgType } = props;
  const [expands, setExpands] = useState([]);

  useEffect(() => {
    setExpands([]);
  }, [selectedOrgType]);

  const clearPeer = () => {
    dispatch({
      type: 'discover/setState',
      payload: {
        relationChartData: [],
        peerRecordList: [],
        selectedPeerList: {},
      },
    });
  };

  const orgExpand = (members, index) => {
    if (expands.includes(index)) {
      setExpands([]);
      clearPeer();
    } else {
      clearPeer();
      setExpands([index]);
      dispatch({
        type: 'discover/getOrgPicByPids',
        payload: {
          pids: members.map((i) => i.pid).join(','),
        },
      });
    }
  };

  return (
    <div className={styles.rightBar}>
      {orgList &&
        orgList.map((item, index) => {
          const isExpand = expands.includes(index);
          return (
            <div className={isExpand ? styles.openItemBox : styles.itemBox} key={index}>
              <div className={styles.title}>
                <span>{item.member}: 关联{item.members.length}人</span>
                <span onClick={() => orgExpand(item.members, index)}>
                  {isExpand ? '收起 ' : '展开 '} 
                  {isExpand ? <UpOutlined /> : <DownOutlined />}
                </span>
              </div>
              <Carousel members={item.members} />
              <div className={styles.chartWrap}>
                <div className={styles.chartImg}>
                  {isExpand && !isRequest ? <RelationChart /> : null}
                  <Spin spinning={isRequest}>
                    {isRequest ? <div style={{ height: 500 }} /> : null}
                  </Spin>
                </div>
                <div className={styles.chartDesc}>
                  <PeerRecord />
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
}

export default connect(({ discover, loading }) => {
  const { orgList, selectedOrgType } = discover;
  return {
    orgList,
    selectedOrgType,
    isRequest: loading.effects['discover/getOrgPicByPids'],
  };
})(OrgList);
