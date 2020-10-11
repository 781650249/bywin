import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import cx from 'classnames';
import { useSelector, useDispatch } from 'dva';
import {
  Col,
  Row,
  Form,
  Select,
  Input,
  Button,
  Space,
  Drawer,
  Spin,
  DatePicker,
  Pagination,
  message,
} from 'antd';
import { ClockCircleOutlined, EnvironmentOutlined } from '@ant-design/icons';
import Avatar from 'antd/lib/avatar/avatar';
import { MyIcon } from '../../car-manager/icons/utils';
import styles from './index.less';
import Results from './components/Results';

export default function() {
  const { RangePicker } = DatePicker;
  const { Option } = Select;
  const { communityList } = useSelector(({ global }) => global);
  const { queryParams, repairTotal, repairDetail, repairList, perSonList } = useSelector(
    ({ repair }) => repair,
  );
  const loading = useSelector((state) => state.loading.effects['repair/getList']);
  const [isShow, setIsShow] = useState(false); // 展示
  const [searchValue, setsearchValue] = useState('');
  const results =
    searchValue.length < 1
      ? []
      : perSonList
          .map((item) => ({ xm: item.xm, sjhm: item.sjhm, ygxxbz: item.ygxxbz }))
          .filter((item) => item.xm.includes(searchValue) || item.sjhm.includes(searchValue))
          .slice(0, 20);
  const elRef = useRef();
  const [addRepairDrawer, setAddRepairDrawer] = useState(false);
  const [showDetailDrawer, setShowDetailDrawer] = useState(false);
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const getRepairList = useCallback(
    (params = {}, type = 'repair/getList') => {
      dispatch({
        type,
        payload: {
          pageNum: queryParams.pageNum,
          pageSize: queryParams.pageSize,
          ...queryParams,
          ...params,
        },
      });
    },
    [dispatch, queryParams],
  );

  useEffect(() => {
    dispatch({
      type: 'repair/getPersonnelList',
    });
  }, [dispatch]);

  useEffect(() => {
    getRepairList();
  }, [dispatch, getRepairList]);

  const handleQueryList = (params) => {
    const timeConfine = params.timeRange;
    if (timeConfine) {
      const startTime = timeConfine[0].format('YYYY-MM-DD');
      const endTime = timeConfine[1].format('YYYY-MM-DD');
      getRepairList({
        ...queryParams,
        keyWord: params.keyValue,
        status: params.status,
        xqxxbz: params.xqxxbz,
        startTime,
        endTime,
      });
    } else {
      getRepairList({
        ...queryParams,
        keyWord: params.keyValue,
        status: params.status,
        xqxxbz: params.xqxxbz,
      });
    }
  };

  const handleDesignate = () => {
    if (repairDetail.status === 0) {
      const handleId = perSonList.filter((item) => item.xm === elRef.current.state.value);
      if (elRef.current.state.value && handleId) {
        dispatch({
          type: 'repair/designatePerson',
          payload: {
            id: repairDetail.id,
            handlePersonId: handleId[0].ygxxbz,
          },
        }).then((res) => {
          if (res.code === 'SUCCESS') {
            message.success('通知成功');
            setsearchValue('');
          }
        });
      }
    }
    setShowDetailDrawer(false);
  };

  // 查看详情
  const handleShowDetail = ({ id }) => {
    dispatch({
      type: 'repair/getDetail',
      payload: {
        id,
      },
    }).then((detail) => {
      dispatch({
        type: 'repair/setState',
        payload: {
          repairDetail: detail,
        },
      });
    });
    setShowDetailDrawer(true);
  };

  const isNumber = (val) => {
    if (parseFloat(val).toString() === 'NaN') return false;
    return true;
  };

  const renderList = useMemo(
    () => (
      <>
        {Array.isArray(repairList) &&
          repairList.length > 0 &&
          repairList.map((item, index) => (
            <div key={index} className={styles.card} onClick={() => handleShowDetail(item)}>
              <div className={styles.cardTop}>
                <div className={cx(styles.listTitle, 'ellipsis')}>{item.title}</div>
              </div>
              <div className={styles.infoName}>
                <div className={styles.infoItemIcon}>
                  <MyIcon type="icon-renyuan" />
                </div>
                <div className={styles.infoItemText}>{item.createUser || ''}</div>
              </div>

              <div className={styles.infoName}>
                <div className={styles.infoItemIcon}>
                  <ClockCircleOutlined />
                </div>
                <div className={styles.infoItemText}>{item.createDateFormat}</div>
              </div>

              <div className={styles.infoName}>
                <div className={styles.infoItemIcon}>
                  <EnvironmentOutlined />
                </div>
                <div className={cx(styles.infoItemText, 'ellipsis')}>{item.address}</div>
              </div>

              <div
                className={cx(styles.handleSet, {
                  [styles.handleing]: `${item.status}` === '1',
                  [styles.handled]: `${item.status}` === '2',
                  [styles.nohandle]: `${item.status}` === '0',
                  [styles.handleFail]: `${item.status}` === '3',
                })}
              />
            </div>
          ))}
        {Array.from({ length: 3 }).map((_, index) => (
          <div className={cx(styles.card, styles.hiddenBox)} key={index} />
        ))}
      </>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [repairList],
  );

  const callback = (msg, inner) => {
    const extra = msg.substr(msg.lastIndexOf('>') + 1);
    if (isNumber(inner)) {
      elRef.current.state.value = msg;
    } else {
      const msgCN = inner + extra;
      elRef.current.state.value = msgCN;
    }
  };

  // 新增报修
  const handleAddRepair = () => {
    const handleId = perSonList.filter((item) => item.xm === elRef.current.state.value);
    if (elRef.current.state.value && handleId) {
      form.validateFields().then((res) => {
        dispatch({
          type: 'repair/saveInfo',
          payload: {
            communityId: res.communityId,
            description: res.description,
            handlePersonId: handleId[0].ygxxbz,
            address: res.address,
            title: res.title,
          },
        }).then((data) => {
          if (data.code === 'SUCCESS') {
            message.success('新增成功');
            elRef.current.state.value = '';
            form.resetFields();
            setAddRepairDrawer(false);
            getRepairList();
          }
        });
      });
    } else {
      message.error('请搜索指派责任人');
    }
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.title}>报修管理</div>
      <div className={styles.top}>
        <div className={styles.left}>
          <Form style={{ width: '100%' }} onFinish={handleQueryList}>
            <Row gutter={8}>
              <Col span={5}>
                <Form.Item name="timeRange">
                  <RangePicker format="YYYY/MM/DD" />
                </Form.Item>
              </Col>

              <Col span={3}>
                <Form.Item name="xqxxbz">
                  <Select placeholder="选择园区" allowClear>
                    {communityList.length > 0 &&
                      communityList.map((item, i) => (
                        <Option key={i} value={item.xqxxbz}>
                          {item.communityName}
                        </Option>
                      ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={3}>
                <Form.Item name="status">
                  <Select placeholder="选择状态">
                    <Option value="0">未处理</Option>
                    <Option value="1">处理中</Option>
                    <Option value="2">已处理</Option>
                    <Option value="3">已作废</Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col span={3}>
                <Form.Item name="keyValue">
                  <Input placeholder="请输入搜索内容" />
                </Form.Item>
              </Col>

              <Col span={4}>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    查询
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
        <div className={styles.right}>
          <Space>
            <div onClick={() => setAddRepairDrawer(true)} className={styles.add} />
          </Space>
        </div>
      </div>
      <Spin spinning={loading} wrapperClassName={styles.spin}>
        <div className={styles.content}>{renderList}</div>
      </Spin>

      <div className={styles.pagination}>
        <Pagination
          pageSize={queryParams.pageSize}
          total={repairTotal}
          current={queryParams.pageNum}
          onChange={(value) => {
            dispatch({
              type: 'repair/setState',
              payload: {
                queryParams: {
                  ...queryParams,
                  pageNum: value,
                },
              },
            });
            // getRepairList({ pageNum: value });
          }}
        />
      </div>

      <Drawer
        closable
        className={styles.drawWrap}
        title="新增报修"
        bodyStyle={{ padding: 20 }}
        placement="right"
        onClose={() => setAddRepairDrawer(false)}
        visible={addRepairDrawer}
      >
        <Form form={form}>
          <Form.Item
            label="报修园区"
            rules={[
              {
                required: true,
                message: '请选择报修园区',
              },
            ]}
            name="communityId"
          >
            <Select placeholder="请选择报修园区" allowClear>
              {communityList.length > 0 &&
                communityList.map((item, i) => (
                  <Option key={i} value={item.xqxxbz}>
                    {item.communityName}
                  </Option>
                ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="报修地点"
            rules={[
              {
                required: true,
                message: '请输入报修地点',
              },
            ]}
            name="address"
          >
            <Input placeholder="请输入报修地点" />
          </Form.Item>

          <Form.Item
            label="报修标题"
            rules={[
              {
                required: true,
                message: '请输入报修标题',
              },
            ]}
            name="title"
          >
            <Input placeholder="请输入报修标题" />
          </Form.Item>

          <Form.Item
            label="报修内容"
            rules={[
              {
                required: true,
                message: '请输入报修内容',
              },
            ]}
            name="description"
          >
            <Input.TextArea rows={4} placeholder="请输入报修内容" />
          </Form.Item>

          <Form.Item
            label="指派责任人"
            // name="personId"
            rules={[
              {
                required: true,
                message: '请指派责任人',
              },
            ]}
          >
            <Input
              style={{ minHeight: '30px' }}
              placeholder="请输入姓名或手机号检索"
              onBlur={() => setIsShow(false)}
              allowClear
              ref={elRef}
              onFocus={() => setIsShow(true)}
              onChange={(e) => setsearchValue(e.target.value)}
            />

            <Results data={results} isShow={isShow} callback={callback} searchValue={searchValue} />
          </Form.Item>

          <Form.Item>
            <div className="text-right">
              <Button onClick={() => setAddRepairDrawer(false)} className="mr-8">
                取消
              </Button>
              <Button onClick={handleAddRepair} type="primary">
                确定
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Drawer>

      <Drawer
        closable
        className={styles.drawWrap}
        title="报修详情"
        bodyStyle={{ padding: 20 }}
        placement="right"
        onClose={() => setShowDetailDrawer(false)}
        footer={
          <div className="text-right">
            <Button onClick={() => setShowDetailDrawer(false)} className="mr-8">
              取消
            </Button>
            <Button onClick={() => handleDesignate()} type="primary">
              确定
            </Button>
          </div>
        }
        visible={showDetailDrawer}
      >
        <div className={styles.wrap}>
          {/* <Tooltip title={<span>{repairDetail.title}</span>}> */}
          <div className={cx(styles.title, 'ellipsis')}>{repairDetail.title || ''}</div>{' '}
          {/* </Tooltip> */}
          <div className={styles.con}>{repairDetail.description}</div>
          <div className={styles.pic}>
            {repairDetail.imageUrlList &&
              repairDetail.imageUrlList.map((item, index) => (
                <Avatar
                  key={index}
                  style={{
                    width: '100%',
                    height: '264px',
                    marginTop: '20px',
                    marginBottom: '10px',
                  }}
                  shape="square"
                  src={item}
                />
              ))}
          </div>
          <div className={styles.row} style={{ marginTop: '20px' }}>
            <div className={styles.rowLabel}>报修园区:</div>
            <div className={cx(styles.rowTitle, 'ellipsis')}>{repairDetail.address}</div>
          </div>
          <div className={styles.row}>
            <div className={styles.rowLabel}>报修对象:</div>
            <div className={styles.rowTitle}>{repairDetail.contactName || '超级管理员'}</div>
          </div>
          <div className={styles.row}>
            <div className={styles.rowLabel}>报修时间:</div>
            <div className={styles.rowTitle}>{repairDetail.createDateFormat}</div>
          </div>
          <div className={styles.row}>
            <div className={styles.rowLabel}>
              状<i />
              态:
            </div>
            <div className={styles.rowTitle}>
              <div
                className={cx(styles.ballStatus, {
                  [styles.handleing]: repairDetail.status === 1,
                  [styles.handled]: repairDetail.status === 2,
                  [styles.nohandle]: repairDetail.status === 0,
                  [styles.handleFail]: repairDetail.status === 3,
                })}
              />
              {repairDetail.statusCn}
            </div>
          </div>
          {/* <div className={styles.row}>
            <div className={styles.rowLabel}>处理内容:</div>
            <div className={styles.rowTitle}>已处理了，水龙头松动导致</div>
          </div> */}
          <div className={styles.row}>
            <div className={styles.rowLabel}>处理时间:</div>
            <div className={styles.rowTitle}>{repairDetail.designateDateFormat}</div>
          </div>
          <div className={cx(styles.row, styles.checkSeach)}>
            <div className={styles.rowLabel}>指派责任人:</div>
            {repairDetail.status === 0 && (
              <div className={styles.rowTitle}>
                <Input
                  style={{ minHeight: '30px' }}
                  placeholder="请输入姓名或手机号检索"
                  onBlur={() => setIsShow(false)}
                  allowClear
                  ref={elRef}
                  onFocus={() => setIsShow(true)}
                  onChange={(e) => setsearchValue(e.target.value)}
                />
                <Results
                  data={results}
                  isShow={isShow}
                  callback={callback}
                  searchValue={searchValue}
                />
              </div>
            )}

            {repairDetail.status !== 0 && (
              <div className={styles.rowTitle}> {repairDetail.handlePersonName} </div>
            )}
          </div>
        </div>
      </Drawer>
    </div>
  );
}
