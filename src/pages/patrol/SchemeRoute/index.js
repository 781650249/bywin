import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'dva';
import { Modal } from 'antd';
import Icon, { SettingOutlined } from '@ant-design/icons';
import cx from 'classnames';
import ArtificialIcon from '@/assets/patrol/artificial-icon.png';
import IntelligentIcon from '@/assets/patrol/intelligent-icon.png';
import ShallowMark from '@/assets/patrol/shallow-mark.png';
import MonitorIcon from '@/assets/patrol/monitor-icon.png';
import Aliplayer from '@/components/Aliplayer';
import styles from './index.less';

const warnSvg = () => (
  <svg width="1em" height="1em" viewBox="0 0 1024 1024" fill="currentColor">
    <path
      d="M861.090909 930.909091h116.363636a46.545455 46.545455 0 0 1 0 93.090909H46.545455a46.545455 46.545455 0 0 1 0-93.090909h116.363636V488.727273c0-192.791273 156.299636-349.090909 349.090909-349.090909 192.791273 0 349.090909 156.299636 349.090909 349.090909v442.181818zM375.249455 650.984727l139.473454 1.349818-46.266182 122.484364 87.086546 32.907636 93.370182-247.156363-139.799273-1.396364 46.475636-123.927273-87.179636-32.674909-93.160727 248.413091zM418.909091 0h186.181818v93.090909h-186.181818V0z m389.306182 84.130909l131.653818 131.653818-65.838546 65.838546L742.4 149.969455l65.838545-65.838546zM1024 418.909091v186.181818h-93.090909v-186.181818h93.090909zM0 605.090909v-186.181818h93.090909v186.181818H0zM84.130909 215.784727l131.653818-131.653818 65.838546 65.838546L149.969455 281.6 84.130909 215.784727z"
      fill="#FF5A30"
      p-id="11466"
    />
  </svg>
);

export default function({
  isShowplayer = false,
  play = { playId: '', playName: '' },
  changeMapCenter = () => {},
  handleOpen = () => {},
  handleClose = () => {},
  handleChangePlay = () => {},
}) {
  const dispatch = useDispatch();
  const {
    isEditShow,
    patrolSchemeList,
    selectedSchemeObj,
    patrolRouteList,
    patrolRouteDetail,
  } = useSelector(({ patrolMain }) => patrolMain);
  const {
    taskCount,
    taskTypeCn,
    sxsjKs = '',
    sxsjJs = '',
    taskCountTimeList = [],
  } = patrolRouteDetail;

  useEffect(() => {
    dispatch({ type: 'patrolMain/getAllInspection' });
  }, [dispatch]);

  useEffect(() => {
    if (selectedSchemeObj.taskId) {
      // console.log(selectedSchemeObj)
      dispatch({
        type: 'patrolMain/getInspectionSiteById',
        payload: { xcxlxxbz: selectedSchemeObj.taskId },
      });
    }
  }, [dispatch, selectedSchemeObj]);

  return (
    <div className={styles.patrolLeftColumn} style={{ width: isEditShow ? 0 : 310 }}>
      <div className={styles.patrolScheme}>
        <div className={styles.topTitleRow}>
          <div className={styles.toptitle}>巡逻方案</div>
          <div
            className={styles.topSetIcon}
            onClick={() => dispatch({ type: 'patrolMain/setState', payload: { isEditShow: true } })}
          >
            <SettingOutlined />
          </div>
        </div>
        <div className={styles.topContent}>
          {patrolSchemeList.map((item) => (
            <div
              key={item.taskId}
              className={cx(
                styles.topContentCol,
                selectedSchemeObj.taskId === item.taskId ? styles.checkedFont : null,
              )}
              onClick={() => {
                if (selectedSchemeObj.taskId === item.taskId) return;
                dispatch({
                  type: 'patrolMain/setState',
                  payload: {
                    selectedSchemeObj: {
                      taskId: item.taskId,
                      taskName: item.taskName,
                      taskType: item.taskType,
                    },
                  },
                });
              }}
            >
              <img
                style={{ width: 18, height: 18 }}
                src={item.taskType === '0' ? ArtificialIcon : IntelligentIcon}
                alt=""
              />
              <span>{item.taskName}</span>
              <span>{item.warningStatus ? <Icon component={warnSvg} /> : null}</span>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.patrolRoute}>
        <div className={styles.bottomTitle}>
          <span>{selectedSchemeObj.taskName}</span>
        </div>
        <div className={styles.routeList}>
          <p>
            总共 <span style={{ color: '#FF5029' }}>{patrolRouteList.length}</span> 个巡逻点
          </p>
          {patrolRouteList.map((item, index) => (
            <div className={styles.routeListItem} key={index}>
              <div className={styles.routeListItemImg}>
                <img style={{ width: '100%', height: '100%' }} src={ShallowMark} alt="" />
                <span className={styles.serialNum}>{index + 1}</span>
              </div>
              <span title={item.sxtName}>{item.sxtName}</span>
              <img
                style={{ width: 12, height: 14 }}
                src={MonitorIcon}
                alt=""
                onClick={() => {
                  handleOpen()
                  handleChangePlay({ playId: item.sxtId, playName: item.sxtName });
                  changeMapCenter({ lng: item.lng, lat: item.lat });
                }}
              />
            </div>
          ))}
        </div>
        <div className={styles.partingBar} />
        <div className={styles.routeDesc}>
          <p>
            <span>每天巡检次数：</span>
            <span>{taskCount ? `${taskCount}次` : '实时'}</span>
          </p>
          {taskCount > 0 &&
            taskCountTimeList.map((item, index) => (
              <p key={index}>
                <span>巡逻时间段：</span>
                <span>{`${item.beginTime}~${item.endTime}`}</span>
              </p>
            ))}
          <p>
            <span>巡 逻 人 员：</span>
            <span>{taskTypeCn}</span>
          </p>
          <p>
            <span>生 效 时 间：</span>
            <span>{`${sxsjKs} ~ ${sxsjJs}`}</span>
          </p>
        </div>
      </div>

      <Modal
        width={408}
        bodyStyle={{ height: 232 }}
        visible={isShowplayer}
        title={play.playName}
        footer={null}
        onCancel={() => {
          handleClose();
          handleChangePlay({ playId: '', playName: '' });
        }}
        wrapClassName={styles.modelWrap}
      >
        <Aliplayer id={play.playId} cameraId={play.playId} selectTime={[]} />
      </Modal>
    </div>
  );
}
