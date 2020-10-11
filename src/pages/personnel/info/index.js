import React, { useCallback, useMemo } from 'react';
import {
  Row,
  Col,
  Form,
  Input,
  Select,
  Button,
  Space,
  Pagination,
  Avatar,
  Modal,
  Spin,
  message,
} from 'antd';
import {
  SearchOutlined,
  DownloadOutlined,
  UserOutlined,
  MobileOutlined,
  EnvironmentOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { router } from 'umi';
import classNames from 'classnames';
import { usePersonnelList, usePositionList, useCompanyList } from '@/hooks';
import { Icon } from '@/components';
import { del } from '@/services/personnel/info';
import ImportPersonnel from './ImportPersonnel';
import AddPersonnel from './AddPersonnel';
import styles from './index.less';

export default function() {
  const { list, pagination, loading, getList, setParams } = usePersonnelList({
    defaultParams: {
      page: 1,
      pageSize: 20,
    },
  });
  const [positionList] = usePositionList();
  const [companyList] = useCompanyList();

  /**
   *
   * @param {Object} values 搜索参数
   */
  const handleSearch = (values) => {
    setParams({ ...values, page: 1 });
  };

  const handleDelete = useCallback(
    (id) => {
      Modal.confirm({
        title: '是否删除当前人员！',
        icon: <ExclamationCircleOutlined />,
        okText: '是',
        cancelText: '否',
        style: {
          top: 200,
        },
        onOk: async () => {
          const success = await del({ id });
          if (success) {
            message.success('删除成功');
            getList();
          }
        },
      });
    },
    [getList],
  );

  const renderCard = useMemo(
    () => (
      <>
        {list.map((item, i) => (
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
              <div className={styles.infoItem}>
                <div className={styles.infoItemIcon}>
                  <Icon type="position" />
                </div>
                <div className={styles.infoItemText}>{item.positionName}</div>
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
            </div>
            <div className={styles.cardExtra}>
              <div className={styles.cardExtraItem} onClick={() => handleDelete(item.ygxxbz)}>
                <DeleteOutlined />
              </div>
            </div>
          </div>
        ))}
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={classNames(styles.card, styles.fill)}
            style={{ paddingTop: 0, paddingBottom: 0 }}
          />
        ))}
      </>
    ),
    [list, handleDelete],
  );

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>人员信息</h2>
      <Row align="middle">
        <Col flex="auto">
          <Form layout="inline" className={styles.form} onFinish={handleSearch}>
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
            {/* <Form.Item>
              <Select
                getPopupContainer={(triggerNode) => triggerNode.parentElement}
                style={{ width: 160 }}
                placeholder="选择名单"
              >
                <Select.Option value={1}>1</Select.Option>
                <Select.Option value={2}>2</Select.Option>
              </Select>
            </Form.Item> */}
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
        <Col flex="128px" className="text-right">
          <Space>
            <ImportPersonnel onRefresh={getList} />
            <a href="/api/excel/EmployeeInfo.xlsx" download className={styles.action}>
              <DownloadOutlined />
            </a>
            <AddPersonnel
              positionList={positionList}
              companyList={companyList}
              onRefresh={getList}
            />
          </Space>
        </Col>
      </Row>
      <Spin spinning={loading} wrapperClassName={styles.spin}>
        <div className={styles.content}>{renderCard}</div>
      </Spin>
      <div className={styles.pagination}>
        <Pagination
          current={pagination.page}
          pageSize={pagination.pageSize}
          total={pagination.total}
          onChange={(page, pageSize) => {
            setParams({ page, pageSize });
          }}
        />
      </div>
    </div>
  );
}
