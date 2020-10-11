import React from 'react';
import { DatePicker } from 'antd';
import { useDispatch, useSelector } from 'dva';
import moment from 'moment';
import Map from './Map';
import Footer from './Footer';
import styles from './index.less';

const { RangePicker } = DatePicker;

export default function() {
  const dispatch = useDispatch();
  const { allTrack } = useSelector(({ vehicleFile }) => vehicleFile);
  const handleDateChange = (dates) => {
    if (dates === null) {
      dispatch({
        type: 'vehicleFile/setState',
        payload: {
          track: [...allTrack],
        },
      });
      return;
    }
    if (!Array.isArray(dates) || dates.length !== 2) {
      return;
    }
    dispatch({
      type: 'vehicleFile/setState',
      payload: {
        track: allTrack.filter((item) => {
          const time = moment(item.time, 'YYYY-MM-DD HH:mm:ss');
          return time >= dates[0] && time <= dates[1];
        }),
      },
    });
  };
  return (
    <>
      <div className={styles.action}>
        <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" onChange={handleDateChange} />
      </div>
      <Map />
      <Footer />
    </>
  );
}
