import React, { useEffect } from 'react';
import { useDispatch } from 'dva';
import Map from './Map';
import Right from './Right';
import Bottom from './Bottom';
import Left from './Left';
// import styles from './index.less';

export default function() {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch({ type: 'situation/getStatisticalData' })
    dispatch({ type: 'situation/getPeopleFlowTrend' })
    dispatch({ type: 'situation/getCarFlowTrend' })
  }, [dispatch])
  return (
    <>
      <Map />
      <Right />
      <Bottom />
      <Left />
    </>
  );
}
