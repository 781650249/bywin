import React from 'react';
import { useSelector } from 'dva';
import { Descriptions } from 'antd';
import moment from 'moment';
import styles from './index.less';

export default function() {
  const { hourseInfoList } = useSelector(({ communityDetail }) => communityDetail);

  const getHouseType = (type) => {
    switch (type) {
      case '1':
        return '自主房'
      case '2':
        return '出租房'
      case '3':
        return '网约房'
      default:
        return '';
    }
  }
  
  const getIsZdfw = (type) => {
    switch (type) {
      case 1:
        return '是';
      case 2:
        return '否';
      default:
        return '';
    }
  }

  return (
    <>
      <div className={styles.listItem}>
        <h4>基本信息</h4>
        <Descriptions className={styles.itemContent}>
          <Descriptions.Item label="所属小区">{hourseInfoList.xqmc}</Descriptions.Item>
          <Descriptions.Item label="房屋编号" span={2}>{hourseInfoList.fwbh}</Descriptions.Item>
          <Descriptions.Item label="单元">{hourseInfoList.dymc}</Descriptions.Item>
          <Descriptions.Item label="地址名称" span={2}>{hourseInfoList.dzmc}</Descriptions.Item>
          <Descriptions.Item label="楼栋">{hourseInfoList.ldmc}</Descriptions.Item>
          <Descriptions.Item label="房屋详细地址" span={2}>{hourseInfoList.fwxxdz}</Descriptions.Item>
          <Descriptions.Item label="楼层号">{hourseInfoList.lch}</Descriptions.Item>
          <Descriptions.Item label="地址编码">{hourseInfoList.dzbm}</Descriptions.Item>
          <Descriptions.Item label="房屋类型代码">{hourseInfoList.fwlxdm}</Descriptions.Item>
          <Descriptions.Item label="房屋间数">{hourseInfoList.fwjs}</Descriptions.Item>
          <Descriptions.Item label="房屋所属单位">{hourseInfoList.fwssdw}</Descriptions.Item>
          <Descriptions.Item label="建筑面积">{hourseInfoList.jzMjpfm}</Descriptions.Item>
          <Descriptions.Item label="地球经度">{hourseInfoList.dqjd}</Descriptions.Item>
          <Descriptions.Item label="地球纬度">{hourseInfoList.dqwd}</Descriptions.Item>
        </Descriptions>
      </div>
      <div className={styles.listItem}>
        <h4>登记信息</h4>
        <Descriptions className={styles.itemContent}>
          <Descriptions.Item label="房主姓名">{hourseInfoList.fzXm}</Descriptions.Item>
          <Descriptions.Item label="房主身份证号">{hourseInfoList.fzGmsfzhm}</Descriptions.Item>
          <Descriptions.Item label="房主联系电话">{hourseInfoList.fzLxdh}</Descriptions.Item>
          <Descriptions.Item label="法人代表姓名" span={3}>{hourseInfoList.fwssdwFddbrxM}</Descriptions.Item>
          {/* <Descriptions.Item label="法人代表单位" span={2}>
            {hourseInfoList.fwssdw}
          </Descriptions.Item> */}
          <Descriptions.Item label="登记人姓名">{hourseInfoList.djrXm}</Descriptions.Item>
          <Descriptions.Item label="登记人身份证号">{hourseInfoList.djrGmsfzhm}</Descriptions.Item>
          <Descriptions.Item label="登记人联系电话">{hourseInfoList.djrLxdh}</Descriptions.Item>
          <Descriptions.Item label="委托代理人姓名">{hourseInfoList.wtdlrXm}</Descriptions.Item>
          <Descriptions.Item label="委托代理人身份证号" span={2}>
            {hourseInfoList.wtdlrGmsfzhm}
          </Descriptions.Item>
          <Descriptions.Item label="统一社会信用代码">{hourseInfoList.fwssdwTyshxyDm}</Descriptions.Item>
          <Descriptions.Item label="委托代理人联系电话">{hourseInfoList.wtdlrLxdh}</Descriptions.Item>
          <Descriptions.Item label="备注">{hourseInfoList.bz}</Descriptions.Item>
        </Descriptions>
      </div>
      <div className={styles.listItem}>
        <h4>使用信息</h4>
        <Descriptions className={styles.itemContent}>
          <Descriptions.Item label="居住人数">{hourseInfoList.jzRs}</Descriptions.Item>
          <Descriptions.Item label="居住情况类型">{getHouseType(hourseInfoList.jzqklx)}</Descriptions.Item>
          <Descriptions.Item label="所属警务">{hourseInfoList.zaglxxssjwzrqdm}</Descriptions.Item>
          <Descriptions.Item label="是否为重点房屋">{getIsZdfw(hourseInfoList.sfwzdfwPdbz)}</Descriptions.Item>
          <Descriptions.Item label="数据来源">{hourseInfoList.sjly}</Descriptions.Item>
          <Descriptions.Item label="数据更新时间">{moment(hourseInfoList.gxsj).format('YYYY-MM-DD HH:mm')}</Descriptions.Item>
          <Descriptions.Item label="房屋产权证号">{hourseInfoList.fwcqzh}</Descriptions.Item>
        </Descriptions>
      </div>
    </>
  );
}
