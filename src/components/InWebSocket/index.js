import React from 'react';
import Websocket from 'react-websocket';
import { wsBaseUrl } from '@/config'

/**
 * type是用于判断哪个页面调用的Websocket组件
 * suffix是地址后缀
 */
export default function({ type = [], suffix, onNewData = () => {} }) {

  const handleData = (jsonData) => {
    const newData = JSON.parse(jsonData);
    if (type.includes('car') && Array.isArray(newData.carCtrl) && newData.carCtrl.length !== 0) {
      onNewData(newData.carCtrl)
    } 
    
    if (type.includes('pop') && Array.isArray(newData.pesonnelCtrl) && newData.pesonnelCtrl.length !== 0) {
      onNewData(newData.pesonnelCtrl)
    }
  }

  return (
    <Websocket url={`${wsBaseUrl}/pushData/${suffix}`} onMessage={handleData} />
  )
}