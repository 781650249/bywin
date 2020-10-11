import React, { useState, useEffect, useCallback } from 'react';
import {
  Row,
  Col,
  Form,
  Select,
  Input,
  DatePicker,
  Button,
  Modal,
  Avatar,
  Spin,
  Pagination,
} from 'antd';
import {
  SearchOutlined,
  UserOutlined,
  MobileOutlined,
  EnvironmentOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import classNames from 'classnames';
import { router } from 'umi';
import { usePositionList } from '@/hooks';
import { Icon } from '@/components';
import { getRecord, addWhitelist, deleteWhitelist } from '@/services/personnel/access-control';
import AddPersonnel from './AddPersonnel';
import styles from './index.less';

const { RangePicker } = DatePicker;
const defaultPagination = { page: 1, pageSize: 10 };
export default function({ id = '' }) {
  const [type, setType] = useState('0');
  const [loading, setLoading] = useState(false);
  const [recordList, setRecordList] = useState([]);
  const [total, setTotal] = useState(0);
  const [payload, setPayload] = useState({ ...defaultPagination });
  const [positionList] = usePositionList();
  /**
   * 获取白名单或通行记录
   */
  const getRecordList = useCallback(async () => {
    if (!payload.barrierId) {
      setRecordList([]);
      setTotal(0);
      return;
    }
    setLoading(true);
    const data = await getRecord({
      ...payload,
    });
    setLoading(false);
    setRecordList(data.rows);
    setTotal(data.total);
  }, [payload]);
  /**
   * payload改变时触发请求
   */
  useEffect(() => {
    getRecordList();
  }, [getRecordList]);

  /**
   * 门禁改变时设置payload
   */
  useEffect(() => {
    setPayload((state) => ({
      ...state,
      ...defaultPagination,
      barrierId: id,
    }));
  }, [id]);

  /**
   * 当前类型改变时设置payload
   */
  useEffect(() => {
    setPayload((state) => ({
      ...state,
      ...defaultPagination,
      type,
    }));
  }, [type]);

  /**
   * 搜索
   * @param {Object} values
   */
  const handleSearch = (values) => {
    const { time, ...params } = values;
    let beginTime = null;
    let endTime = null;
    if (Array.isArray(time) && time.length === 2) {
      beginTime = time[0].format('YYYY-MM-DD');
      endTime = time[1].format('YYYY-MM-DD');
    }
    setPayload((state) => ({
      ...state,
      ...params,
      beginTime,
      endTime,
    }));
  };

  /**
   * 新增白名单
   * @param {Array} keys
   */
  const handleOk = async (keys) => {
    const success = await addWhitelist({
      barrierId: id,
      employeeIds: keys,
    });
    if (success) {
      getRecordList();
    }
    return success;
  };

  const handleDelete = (key) => {
    Modal.confirm({
      title: '是否删除当前人员！',
      icon: <ExclamationCircleOutlined />,
      okText: '是',
      cancelText: '否',
      style: {
        top: 200,
      },
      onOk: async () => {
        const success = await deleteWhitelist({
          barrierId: id,
          employeeIds: [key],
        });
        if (!success) return;
        if (payload.page > 1 && recordList.length === 1) {
          setPayload((state) => ({ ...state, page: payload.page - 1 }));
        } else {
          getRecordList();
        }
      },
    });
  };

  return (
    <Spin spinning={loading} wrapperClassName={styles.spin}>
      <div className={styles.sort}>
        <div
          className={classNames(styles.sortItem, {
            [styles.active]: type === '0',
          })}
          onClick={() => setType('0')}
        >
          白名单
        </div>
        <div
          className={classNames(styles.sortItem, { [styles.active]: type === '1' })}
          onClick={() => setType('1')}
        >
          进入记录
        </div>
        <div
          className={classNames(styles.sortItem, { [styles.active]: type === '2' })}
          onClick={() => setType('2')}
        >
          出去记录
        </div>
        <div
          className={classNames(styles.sortItem, { [styles.active]: type === '3' })}
          onClick={() => setType('3')}
        >
          访客记录
        </div>
      </div>
      <Row className={styles.form}>
        <Col flex="auto">
          <Form layout="inline" onFinish={handleSearch}>
            <Form.Item name="position">
              <Select
                allowClear
                getPopupContainer={(triggerNode) => triggerNode.parentElement}
                style={{ width: 160 }}
                placeholder="选择角色"
              >
                {positionList.map((item) => (
                  <Select.Option key={item.key}>{item.text}</Select.Option>
                ))}
              </Select>
            </Form.Item>
            {type !== '0' && (
              <Form.Item name="time">
                <RangePicker showTime={{ format: 'HH:mm' }} />
              </Form.Item>
            )}
            <Form.Item name="key">
              <Input
                style={{ width: 224 }}
                autoComplete="off"
                placeholder="请输入人员姓名/手机号码/地址"
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />} loading={loading}>
                查询
              </Button>
            </Form.Item>
          </Form>
        </Col>
        <Col flex="32px" className="text-right">
          <AddPersonnel id={id} positionList={positionList} onOk={handleOk} />
        </Col>
      </Row>
      <div className={styles.content}>
        {recordList.map((item, i) => (
          <div key={i} className={styles.card}>
            <div className={styles.avatar}>
              <Avatar shape="square" size={92} icon={<UserOutlined />} src={item.xp} />
            </div>
            <div className={styles.info}>
              <div
                className={styles.infoName}
                onClick={() => {
                  router.push(`/personnel-file/${item.ygxxbz}`);
                }}
              >
                {item.xm}
              </div>
              <div
                className={classNames(styles.infoItem, {
                  [styles.absolute]: type !== '0',
                  hide: !item.position,
                })}
              >
                <div className={styles.infoItemIcon}>
                  <Icon type="position" />
                </div>
                <div className={styles.infoItemText}>{item.position}</div>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.infoItemIcon}>
                  <MobileOutlined />
                </div>
                <div className={styles.infoItemText}>{item.sjhm}</div>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.infoItemIcon}>
                  <Icon type="city" />
                </div>
                <div className={styles.infoItemText}>{item.qymc}</div>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.infoItemIcon}>
                  <EnvironmentOutlined />
                </div>
                <div className={styles.infoItemText}>{item.dz}</div>
              </div>
              <div className={classNames(styles.infoItem, { hide: type === '0' })}>
                <div className={styles.infoItemIcon}>
                  <ClockCircleOutlined />
                </div>
                <div className={styles.infoItemText}>{item.fwsj}</div>
              </div>
            </div>
            <div className={classNames(styles.cardExtra, { hide: type !== '0' })}>
              <div className={styles.cardExtraItem} onClick={() => handleDelete(item.ygxxbz)}>
                <DeleteOutlined />
              </div>
            </div>
          </div>
        ))}
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className={classNames(styles.card, styles.fill)} />
        ))}
      </div>
      <div className={styles.footer}>
        <Pagination
          current={payload.page}
          pageSize={payload.pageSize}
          total={total}
          onChange={(page, pageSize) => setPayload((state) => ({ ...state, page, pageSize }))}
        />
      </div>
    </Spin>
  );
}
