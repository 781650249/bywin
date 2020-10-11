import React from 'react';
import { useSelector } from 'dva';
import { Descriptions } from 'antd';
import moment from 'moment';
import styles from './index.less';

export default function() { 
  const { unitInfoList } = useSelector(({ communityDetail }) => communityDetail);

  return (
    <>
      <div className={styles.listItem}>
        <h4>基本信息</h4>
        <Descriptions className={styles.itemContent}>
        <Descriptions.Item label="单位名称">{unitInfoList.dwmc}</Descriptions.Item>
          <Descriptions.Item label="单位英文名称">{unitInfoList.dwywmc}</Descriptions.Item>
          <Descriptions.Item label="单位英文缩写">{unitInfoList.dwywsx}</Descriptions.Item>
          <Descriptions.Item label="联系电话">{unitInfoList.dwLxdh}</Descriptions.Item>
          <Descriptions.Item label="区划内详细地址" span={2}>{unitInfoList.dwQhnxxdz}</Descriptions.Item>
          <Descriptions.Item label="经营方式">{unitInfoList.jyfs}</Descriptions.Item>
          <Descriptions.Item label="经营范围（主营）">{unitInfoList.jyfwzy}</Descriptions.Item>
          <Descriptions.Item label="经营范围（兼营）">{unitInfoList.jyfwjy}</Descriptions.Item>
          <Descriptions.Item label="单位信息标识">{unitInfoList.dwxxbz}</Descriptions.Item>
          <Descriptions.Item label="治安管理单位编码" span={2}>{unitInfoList.zagldwbm}</Descriptions.Item>
          <Descriptions.Item label="小区信息标识">{unitInfoList.xqxxbz}</Descriptions.Item>
          <Descriptions.Item label="房屋信息标识" span={2}>{unitInfoList.fwxxbz}</Descriptions.Item>
          <Descriptions.Item label="地址编码">{unitInfoList.dzbm}</Descriptions.Item>
          <Descriptions.Item label="地址名称" span={2}>{unitInfoList.dzmc}</Descriptions.Item>
        </Descriptions>
      </div>
      <div className={styles.listItem}>
        <h4>代码</h4>
        <Descriptions className={styles.itemContent}>
          <Descriptions.Item label="统一社会信用代码">{unitInfoList.tyshxydm}</Descriptions.Item>
          <Descriptions.Item label="经济类型代码">{unitInfoList.jjlxdm}</Descriptions.Item>
          <Descriptions.Item label="行业类型代码">{unitInfoList.hylbdm}</Descriptions.Item>
        </Descriptions>
      </div>
      <div className={styles.listItem}>
        <h4>营业执照</h4>
        <Descriptions className={styles.itemContent}>
          <Descriptions.Item label="营业执照号">{unitInfoList.yyzzh}</Descriptions.Item>
          <Descriptions.Item label="有效期起始日期">{moment(unitInfoList.yyzzyxqYxqqsrq).format('YYYY-MM-DD HH:mm')}</Descriptions.Item>
          <Descriptions.Item label="有效期截止日期">{moment(unitInfoList.yyzzyxqYxqjzrq).format('YYYY-MM-DD HH:mm')}</Descriptions.Item>
        </Descriptions>
      </div>
      <div className={styles.listItem}>
        <h4>委托代理人</h4>
        <Descriptions className={styles.itemContent}>
          <Descriptions.Item label="姓名">{unitInfoList.wtdlrXm}</Descriptions.Item>
          <Descriptions.Item label="身份号">{unitInfoList.wtdlrGmsfzhm}</Descriptions.Item>
          <Descriptions.Item label="联系电话">{unitInfoList.wtdlrLxdh}</Descriptions.Item>
        </Descriptions>
      </div>
    </>
  )
}