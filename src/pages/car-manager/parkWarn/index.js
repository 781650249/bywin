import React, { useState, useEffect, useCallback } from 'react';
import moment from 'moment';
import { DatePicker, Button, Avatar, Drawer, Pagination, Form, Select, Modal,Spin } from 'antd';
import cx from 'classnames';
import Aliplayer from '@/components/Aliplayer';
import { useDispatch, useSelector } from 'dva';
import { ClockCircleOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { Jcjg, Ld, Txr, List, Yj } from '../icons/utils';
import styles from './index.less';
import WarnParkModal from './WarnParkModal';

export default function ParkWarn() {
  const dispatch = useDispatch();
  const { isWarnParkShow, queryParams, carWarnList, carWarnListTotal } = useSelector(
    ({ parkWarn }) => parkWarn,
  );
  const loading = useSelector((state) => state.loading.effects['parkWarn/getCarWarnList']);
  const { RangePicker } = DatePicker;
  const [detailvisible, setDetailvisible] = useState(false);
  const [selectedTime, setSelectedTime] = useState([]); // eslint-disable-line no-unused-vars
  const [detail, setDetail] = useState({});
  const [cameraVisible, setCameraVisible] = useState(false);
  const [cameraId, setCameraId] = useState(null);

  const setQuery = useCallback(
    (params = {}, type = 'parkWarn/getCarWarnList') => {
      dispatch({
        type,
        payload: {
          ...queryParams,
          pageNum: queryParams.pageNum,
          ...params,
        },
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, queryParams.pageNum],
  );

  useEffect(() => {
    setQuery();
    return () => {
      dispatch({
        type: 'parkWarn/clear',
      });
    };
  }, [dispatch, setQuery]);

  const timeChange = (_, dateString) => {
    setSelectedTime(dateString);
  };

  const handlePlay = (e, item) => {
    e.stopPropagation();
    setCameraVisible(true);
    setCameraId(item.cameraId);
  };

  const handleDetail = (e, item) => {
    e.stopPropagation();
    dispatch({
      type: 'parkWarn/getCarWarnDetail',
      payload: {
        id: item.id,
      },
    }).then((data) => {
      setDetail(data);
    });
    setDetailvisible(true);
  };

  const handleClose = () => {
    setDetailvisible(false);
  };
  
  const range = (start, end) => {
    const result = [];
    for (let i = start; i < end; i += 1) {
      result.push(i);
    }
    return result;
  };

  const handleQueryCar = ({ warnStatus }) => {
    dispatch({
      type: 'parkWarn/setState',
      payload: {
        queryParams: {
          ...queryParams,
          pageNum: 1,
        },
      },
    });
    setQuery({
      warnStatus,
      beginTime: selectedTime[0],
      endTime: selectedTime[1],
    });
  };

  const handleClear = () => {
    setCameraVisible(false);
    setCameraId(null);
  };

  const renderList = (
    <Spin spinning={loading} wrapperClassName={styles.spin}>
      <div className={styles.list}>
        {Array.isArray(carWarnList) &&
          carWarnList.map((item, i) => (
            <div
              key={i}
              className={styles.cardWrap}
              onClick={(e) => {
                handleDetail(e, item);
              }}
            >
              <div className={styles.left}>
                <Avatar src={item.warningImage || ''} shape="square" size={92} />
              </div>
              <div className={styles.right}>
                <div className={styles.rightCarNum}>{item.modelName || ''}</div>
                <div className={styles.rightItem}>
                  <div className={styles.rightItemIcon}>
                    <Yj type="icon-yujing" />
                  </div>
                  <div className={styles.rightItemTxt}>{item.warningDate || ''}</div>
                </div>

                <div className={styles.rightItem}>
                  <div className={styles.rightItemIcon}>
                    <Jcjg type="icon-jiechubangding" />
                  </div>
                  <div className={styles.rightItemTxt}>
                    {item.warnStatus === 1 ? (
                      <span className={styles.warnRed}>{item.warnStatusCn}</span>
                    ) : (
                      item.warningEndDate
                    )}
                  </div>
                </div>

                <div className={styles.rightItem}>
                  <div className={styles.rightItemIcon}>
                    <EnvironmentOutlined />
                  </div>
                  <div className={styles.rightItemTxt}>{item.warningSite || ''}</div>
                </div>
              </div>
              <div className={styles.del} onClick={(e) => handlePlay(e, item)} />
            </div>
          ))}

        {[...Array(3).keys()].map((_, index) => (
          <div key={index} className={cx(styles.hiddenCard, 'mr-16 mb-16')} />
        ))}
      </div>
    </Spin>
  );
  return (
    <>
      <div className={styles.wrap} style={{ display: !isWarnParkShow ? 'block' : 'none' }}>
        <div className={styles.title}>违停告警</div>
        <div className={styles.querySearch}>
          <Form layout="inline" className={styles.form} onFinish={(value) => handleQueryCar(value)}>
            <Form.Item name="warnStatus">
              <Select style={{ width: 160 }} placeholder="全部状态" allowClear>
                <Select.Option value={1}>未解除</Select.Option>
                <Select.Option value={2}>已解除</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item>
              <RangePicker
                showTime
                onChange={timeChange}
                disabledDate={(current) => current && current >= moment().endOf('day')}
                disabledTime={(date) => {
                  const currentDate = new Date();
                  const h = currentDate.getHours();
                  const m = currentDate.getMinutes();
                  let disabledHours = [];
                  let disabledMinutes = [];
                  if (moment.isMoment(date) && date.isSame(moment(), 'day')) {
                    disabledHours = range(0, h);
                    disabledMinutes = range(0, m);
                  }
                  return {
                    disabledHours: () => disabledHours,
                    disabledMinutes: (selectedHour) => (selectedHour > h ? [] : disabledMinutes),
                  };
                }}
              />
            </Form.Item>
            <Form.Item>
              <div className={styles.btn}>
                {' '}
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
              </div>
            </Form.Item>
          </Form>

          <div
            className={styles.setting}
            onClick={() =>
              dispatch({
                type: 'parkWarn/setState',
                payload: {
                  isWarnParkShow: true,
                },
              })
            }
          />
        </div>

        {renderList}

        <div className={styles.pagination}>
          <Pagination
            current={queryParams.pageNum}
            total={carWarnListTotal}
            onChange={(value) => {
              dispatch({
                type: 'parkWarn/setState',
                payload: {
                  queryParams: {
                    ...queryParams,
                    pageNum: value,
                  },
                },
              });
              setQuery({ pageNum: value });
            }}
          />
        </div>

        <Drawer
          className={styles.drawWrap}
          closable
          title="详情"
          placement="right"
          onClose={handleClose}
          visible={detailvisible}
        >
          <div className={styles.pic}>
            <Avatar
              style={{ width: '100%', height: '338px' }}
              shape="square"
              src={detail.warningImage}
            />
          </div>
          <div className={styles.con}>{detail.modelName}</div>
          <div className={styles.cam} onClick={(e) => handlePlay(e, detail)} />
          <div className={styles.conTop}>
            {' '}
            <ClockCircleOutlined />
            {'  '}
            {detail.warningDate}
          </div>
          <div className={styles.conTop}>
            <Ld type="icon-lingdang" /> {detail.notifyWayCn}
          </div>
          <div className={styles.conTop}>
            {' '}
            <EnvironmentOutlined /> {detail.warningSite}
          </div>
          <div className={styles.conTop}>
            <Txr type="icon-renyuan" /> {detail.notifyPeople || ''}
          </div>

          <div className={styles.conTop}>
            <List type="icon-List" /> {detail.notifyContent}
          </div>
        </Drawer>

        <Modal
          maskClosable
          centered
          className={styles.modalVideo}
          visible={cameraVisible}
          footer={null}
          bodyStyle={{ height: '300px', padding: '7px' }}
          onCancel={() => handleClear()}
        >
          <Aliplayer className={styles.video} id={cameraId} cameraId={cameraId} selectTime={[]} />
        </Modal>
      </div>
      <WarnParkModal isWarnParkShow={isWarnParkShow} />
    </>
  );
}
