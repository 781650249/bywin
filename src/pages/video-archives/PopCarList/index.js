import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'dva';
import { Divider, Radio, DatePicker, Pagination } from 'antd';
import { ClockCircleFilled } from '@ant-design/icons';
import moment from 'moment';
import ListSection from './ListSection';
import CameraPoint from './CameraPoint';
import styles from './index.less';

const { RangePicker } = DatePicker;
// function range(start, end) {
//   const result = [];
//   for (let i = start; i < end; i += 1) {
//     result.push(i);
//   }
//   return result;
// }

export default function PopCarList() {
  const dispatch = useDispatch();
  const { passTotal, queryParams, selectedCommunity } = useSelector(
    ({ videoArchives }) => videoArchives,
  );
  const { popOrCar, popType, beginTime, endTime, page } = queryParams;

  const getPassedBy = (params) => {
    let type = 'videoArchives/getPersonPassedBy';
    if (popOrCar === 'car') {
      type = 'videoArchives/getVehiclePassedBy';
    }
    dispatch({
      type,
      payload: {
        page: 1,
        size: 20,
        beginTime,
        endTime,
        findType: popType,
        ...params,
      },
    });
  };

  const setQueryParams = (params) => {
    dispatch({
      type: 'videoArchives/setState',
      payload: {
        queryParams: {
          ...queryParams,
          ...params,
        },
      },
    });
  };

  useEffect(() => {
    if (!selectedCommunity) return;
    if (popOrCar !== 'pop' && popOrCar !== 'car') return;
    setQueryParams({ page: 1, popType: '' });
    getPassedBy({ page: 1, findType: '' });
  }, [popOrCar, selectedCommunity]);

  const selectPopOrCar = (value) => {
    setQueryParams({ popOrCar: value });
  };

  /**
   * 根据时间筛选
   */
  const timeChange = (_, dateString) => {
    setQueryParams({ beginTime: dateString[0], endTime: dateString[1], page: 1 });
    getPassedBy({ beginTime: dateString[0], endTime: dateString[1] });
  };

  /**
   * 根据常住访客筛选
   */
  const selectPopType = (e) => {
    setQueryParams({ page: 1, popType: e.target.value });
    getPassedBy({ findType: e.target.value });
  };

  const changePage = (current) => {
    setQueryParams({ page: current });
    getPassedBy({ page: current });
  };

  return (
    <>
      <div className={styles.searchBox}>
        <div className={styles.rightBox} style={{ visibility: 'hidden' }}>
          <span
            onClick={() => selectPopOrCar('pop')}
            className={popOrCar === 'pop' ? styles.checkedClass : styles.unCheckedClass}
          >
            人员信息
          </span>
          <Divider className={styles.divider} type="vertical" />
          <span
            onClick={() => selectPopOrCar('car')}
            className={popOrCar === 'car' ? styles.checkedClass : styles.unCheckedClass}
          >
            车辆信息
          </span>
          <Divider className={styles.divider} type="vertical" />
          <span
            onClick={() => selectPopOrCar('mac')}
            className={popOrCar === 'mac' ? styles.checkedClass : styles.unCheckedClass}
          >
            点位信息
          </span>
        </div>
        <div className={styles.leftBox} style={{ display: popOrCar === 'mac' ? 'none' : null }}>
          <Radio.Group
            value={popType}
            onChange={selectPopType}
            buttonStyle="solid"
            style={{ marginRight: 16 }}
          >
            <Radio.Button value="">全部</Radio.Button>
            <Radio.Button value="1">常住</Radio.Button>
            <Radio.Button value="2">流动</Radio.Button>
          </Radio.Group>
          <div className={styles.timeBox}>
            <div className={styles.timeIcon}>
              <ClockCircleFilled />
            </div>
            <RangePicker
              style={{ width: 328 }}
              placeholder={['开始日期', '结束日期']}
              showTime={{ format: 'HH:mm:ss' }}
              format="YYYY-MM-DD HH:mm:ss"
              disabledDate={(current) => current && current >= moment().endOf('day')}
              // disabledTime={(date) => {
              //   const currentDate = new Date();
              //   const h = currentDate.getHours();
              //   const m = currentDate.getMinutes();
              //   let disabledHours = [];
              //   let disabledMinutes = [];
              //   if (moment.isMoment(date) && date.isSame(moment(), 'day')) {
              //     disabledHours = range(0, h);
              //     disabledMinutes = range(0, m);
              //   }
              //   return {
              //     disabledHours: () => disabledHours,
              //     disabledMinutes: (selectedHour) => (selectedHour > h ? [] : disabledMinutes),
              //   };
              // }}
              value={[
                beginTime ? moment(beginTime, 'YYYY-MM-DD HH-mm-ss') : null,
                endTime ? moment(endTime, 'YYYY-MM-DD HH-mm-ss') : null,
              ]}
              suffixIcon={null}
              // disabledTime={(_, type) => {
              //   if(type === 'start') {
              //     return {
              //       disabledHours: () => [1,2,3,4,5,6,7],
              //       disabledMinutes: () => [1,2,3,4,5,6,7],
              //       disabledSeconds: () => [55, 56],
              //     };
              //   }
              //   return {
              //     disabledHours: () => [1,2,3,4,5,6,7],
              //     disabledMinutes: () => [1,2,3,4,5,6,7],
              //     disabledSeconds: () => [55, 56],
              //   };
              // }}
              onChange={timeChange}
            />
          </div>
        </div>
      </div>
      {popOrCar !== 'mac' && (
        <>
          <ListSection />
          <div className={styles.pageBox}>
            <Pagination
              current={page}
              pageSize={20}
              onChange={changePage}
              total={passTotal}
              showSizeChanger={false}
            />
          </div>
        </>
      )}
      {popOrCar === 'mac' && <CameraPoint />}
    </>
  );
}
