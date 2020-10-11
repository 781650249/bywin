import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'dva';
import { Button, Modal, message } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import cx from 'classnames';
import ArtificialIcon from '@/assets/patrol/artificial-icon.png';
import IntelligentIcon from '@/assets/patrol/intelligent-icon.png';
import EditModal from './EditModal';
import styles from './index.less';

const { confirm } = Modal;

export default function() {
  const dispatch = useDispatch();
  const { isEditShow, patrolSchemeList } = useSelector(({ patrolMain }) => patrolMain);
  const editLineId = useSelector(({ editPatrol }) => editPatrol.editLineId);

  useEffect(() => {
    dispatch({ type: 'editPatrol/getPatrolCameraList' })
  }, [dispatch]);

  const toEditPatrolLine = (id) => {
    dispatch({ type: 'editPatrol/setState', payload: { editMode: 'update', editLineId: id } });
    dispatch({ type: 'editPatrol/getPatrolLineById', payload: { xcxlxxbz: id.toString() } });
  };

  return (
    <>
      <div className={styles.patrolLeftColumn} style={{ width: !isEditShow ? 0 : 310 }}>
        <div className={styles.patrolScheme}>
          <div className={styles.topTitleRow}>
            <div className={styles.toptitle}>巡逻方案设置</div>
          </div>
          <div className={styles.topContent}>
            {patrolSchemeList.map((item, index) => (
              <div
                key={index}
                className={cx(
                  styles.topContentCol,
                  editLineId === item.taskId ? styles.checkedFont : null,
                )}
              >
                <img
                  style={{ width: 18, height: 18 }}
                  src={item.taskType === '0' ? ArtificialIcon : IntelligentIcon}
                  alt=""
                />
                <span onClick={() => toEditPatrolLine(item.taskId)}>{item.taskName}</span>
                <div>
                  <DeleteOutlined
                    style={{ cursor: 'pointer' }}
                    onClick={() =>
                      confirm({
                        content: '删除巡逻方案将不可恢复,是否继续？',
                        okText: '确定',
                        cancelText: '取消',
                        onOk() {
                          dispatch({ 
                            type: 'editPatrol/deletePatrolLine', 
                            payload: { xcxlxxbz: item.taskId },
                            callback: () => {
                              message.success('删除成功');
                              dispatch({ type: 'patrolMain/getAllInspection' });
                              if(item.taskId === editLineId) {
                                dispatch({ type: 'editPatrol/setState', payload: { editMode: 'add', editLineId: null } });
                              }
                            }  
                          });
                        },
                      })
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <Button
          type="primary"
          block
          onClick={() =>
            dispatch({
              type: 'editPatrol/setState',
              payload: { editMode: 'add', editLineId: null },
            })
          }
        >
          新增巡逻方案
        </Button>
      </div>
      <EditModal isEditShow={isEditShow} />
    </>
  );
}
