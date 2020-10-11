import React from 'react';
import { Badge, Popover } from 'antd';
import moment from 'moment';

export const recordColumns = [
  {
    title: '状态',
    dataIndex: 'flag',
    render: (text) =>
      text === 1 ? (
        <Badge status="success" text="已推送" />
      ) : (
        <Badge status="warning" text="未推送" />
      ),
    width: 128,
  },
  {
    title: '研判名称',
    dataIndex: 'videoReseachName',
    width: 240,
  },
  {
    title: '案件名称',
    dataIndex: 'actionName',
    width: 240,
  },
  {
    title: '时间',
    dataIndex: 'gmtModified',
    width: 160,
    render: (text) => text && moment(text).format('YYYY-MM-DD HH:mm:ss'),
  },
  {
    title: '图片组',
    dataIndex: 'imgIds',
    render: (text, record) => {
      const imgIds = record.imgIds ? record.imgIds.split(';') : [];
      return (
        <div>
          {imgIds.map(
            (imageUrl, i) =>
              /^http/.test(imageUrl) && (
                <Popover
                  content={<img src={imageUrl} style={{ height: 500 }} alt="" />}
                  trigger="hover"
                  key={i}
                >
                  <a style={{ marginRight: 8 }}>{`图${i + 1}`}</a>
                </Popover>
              ),
          )}
        </div>
      );
    },
  },
  {
    title: '备注',
    dataIndex: 'remark',
    render: (text) => <div className="ellipsis">{text}</div>,
  },
];

export const areaColumns = [
  {
    title: '序号',
    dataIndex: 'policeOrder',
    width: 64,
  },
  {
    title: '名称',
    dataIndex: 'policeName',
    width: 128,
  },
  {
    title: '描述',
    dataIndex: 'remark',
    width: 192,
  },
];

export const formManageColumns = [
  {
    title: '名称',
    dataIndex: 'name',
    width: 192,
  },
  {
    title: '类型',
    dataIndex: 'type',
    width: 128,
  },
  {
    title: '字段',
    dataIndex: 'column',
    width: 128,
  },
  {
    title: '选项',
    dataIndex: 'value',
  },
  {
    title: '搜索类型',
    dataIndex: 'searchType',
    width: 128,
  },
];

const STATUS = {
  0: '未处理',
  1: '解决中',
  2: '已解决',
};

const STATUSBADGE = {
  0: 'default',
  1: 'processing',
  2: 'success',
};

export const feedbackColumns = [
  {
    title: '标题',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: '时间',
    dataIndex: 'gmtCreate',
    key: 'gmtCreate',
    render: (text) => <div>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</div>,
  },
  {
    title: '具体建议/问题描述',
    dataIndex: 'adviceDesc',
    key: 'adviceDesc',
    render: (text) => <div className="ellipsis">{text}</div>,
  },
  {
    title: '优先级',
    dataIndex: 'priority',
    key: 'priority',
  },
  {
    title: '提交用户',
    dataIndex: 'userId',
    key: 'userId',
  },
  {
    title: '手机号',
    dataIndex: 'phoneNo',
    key: 'phoneNo',
  },
  {
    title: '负责人',
    dataIndex: 'solver',
    key: 'solver',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: (text) => <Badge status={STATUSBADGE[text]} text={STATUS[text]} />,
  },
];
