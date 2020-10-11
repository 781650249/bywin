import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Form, Input, Radio, Button, Pagination, Empty, message } from 'antd';
import { CloseOutlined, ClockCircleOutlined, PlusOutlined, EnvironmentOutlined } from '@ant-design/icons';
import cx from 'classnames';
import moment from 'moment';
import { getCarWarnDetail, addWarnNotify, getWarnNotifyList } from '@/services/surveillance';
import { Viewer } from '@/components';
import { Trapezoid } from '../../components';
import styles from './index.less';

const layout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21 },
};
const tailLayout = {
  wrapperCol: { offset: 3, span: 21 },
};
const tagBg = {
  短信: '#2C369E',
  电话: '#1685C6',
};

export default function({ history }) {
  const { dispositionId, motorVehicleId, resourceId, plateNo } = history.location.query;
  const [form] = Form.useForm();
  const cardListRef = useRef()
  const [carWarnDetail, setCarWarnDetail] = useState({});
  const [notifyStaffs, setNotifyStaffs] = useState(1);
  const [notifyList, setNotifyList] = useState({ data: [], total: 0 });

  const [largeImgUrl, setLargeImgUrl] = useState('');
  const [largeImgId, setLargeImgId] = useState('');
  const [relativePosition, setRelativePosition] = useState([]);

  useEffect(() => {
    getCarWarnDetail({ dispositionId, motorVehicleId, plateNo }).then((res) => {
      if (JSON.stringify(res) !== '{}') {
        // setCarWarnDetail(res);
        setCarWarnDetail({
          ...res,
          warnMessageVOList: res.warnMessageVOList.map((item, index) => ({ ...item, key: index })),
        });
      }
      return () => {
        setCarWarnDetail({});
      }
    });
  }, [dispositionId, motorVehicleId]);

  const getNotifyData = useCallback(async () => {
    const res = await getWarnNotifyList({ businessType: 2, resourceId });
    if (res.rows) {
      setNotifyList({ data: res.rows, total: res.total });
    }
  }, [resourceId]);

  useEffect(() => {
    getNotifyData();
  }, [getNotifyData]);

  const handleClosePage = () => {
    const { goBack } = history;
    if (goBack) goBack();
  };

  const onFinish = (values) => {
    const { content, notifyWay } = values;
    addWarnNotify({
      phoneList: Object.values(values.phoneList).filter((item) => item),
      businessType: 2,
      resourceId,
      content,
      notifyWay,
    }).then((res) => {
      if (res) {
        getNotifyData();
        form.resetFields();
        setNotifyStaffs(1);
      }
    });
  };

  const onScoll = (type) => {
    const { current } = cardListRef;
    const { scrollWidth, scrollLeft, offsetWidth } = current;
    const maxScrollLeft = scrollWidth - offsetWidth;
    const range = offsetWidth - 281;
    let nextScrollLeft = scrollLeft;
    if (type === 'next') {
      if (scrollLeft + range >= maxScrollLeft - 1) {
        nextScrollLeft = maxScrollLeft;
      } else {
        nextScrollLeft = scrollLeft + range;
      }
    }

    if (type === 'pref') {
      if (nextScrollLeft <= 0) {
        nextScrollLeft = 0;
      } else {
        nextScrollLeft = scrollLeft - range;
      }
    }
    current.scrollLeft = nextScrollLeft;
  };

  const viewLargeImg = (record) => {
    setLargeImgUrl(record.storageUrl1);
    setLargeImgId(record.key);
    setRelativePosition([{
      startX: record.zsjXzb,
      startY: record.zsjYzb,
      endX: record.yxjXzb,
      endY: record.yxjYzb,
    }])
  }

  /**
   * 原图上一张下一张
   */
  const onPrev = () => {
    let num = 0;
    carWarnDetail.warnMessageVOList.forEach((item, index) => {
      if (item.key === largeImgId) {
        num = index;
      }
    });
    if (carWarnDetail.warnMessageVOList[num - 1]) {
      viewLargeImg(carWarnDetail.warnMessageVOList[num - 1]);
    } else {
      message.warn('没有图片啦!');
    }
  };

  const onNext = () => {
    let num = 0;
    carWarnDetail.warnMessageVOList.forEach((item, index) => {
      if (item.key === largeImgId) {
        num = index;
      }
    });
    if (carWarnDetail.warnMessageVOList[num + 1]) {
      viewLargeImg(carWarnDetail.warnMessageVOList[num + 1])
    } else {
      message.warn('没有图片啦!');
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.containner}>
        <div className={styles.closeBtn} onClick={handleClosePage}>
          <CloseOutlined />
        </div>
        <div className={styles.drawingBar}>
          <div className={styles.drawingBarTitle}>车辆预警详情</div>
          <div className={styles.modelBar}>
            <div className={styles.modelBarContain}>
              <div className={styles.rightTopBox}>
                <div className={styles.rightTopBoxInfo}>
                  <p>企业:  {carWarnDetail.companyName}</p>
                  <p>地址:  {carWarnDetail.address}</p>
                </div>
              </div>
              <div className={styles.leftBox}>
                <div className={styles.leftBoxInfo}>
                  <p>车主:  {carWarnDetail.carOwner}</p>
                  <p>电话:  {carWarnDetail.phoneNumber}</p>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.cardList}>
            <div className={cx('f-arrow-prev', styles.cardListPref)} onClick={() => onScoll('pref')} />
            <div className={styles.cardListContent} ref={cardListRef}>
              {carWarnDetail.warnMessageVOList && carWarnDetail.warnMessageVOList.map((item, index) => (
                <div key={index} className={styles.cardItem}>
                  <div className={styles.cardItemHeader}>
                    <div><EnvironmentOutlined /><span>{item.nameOfPassRoad}</span></div>
                    <span>{moment(item.triggerTime).format('MM/DD HH:mm')}</span>
                  </div>
                  <div className={styles.cardItemContent} onClick={() => viewLargeImg(item)}>
                    <img style={{ width: '100%', height: '100%' }} src={item.storageUrl1} alt=""/>
                  </div>
                </div>
              ))}
            </div>
            <div className={cx('f-arrow-next', styles.cardListNext)} onClick={() => onScoll('next')} />
          </div>
        </div>
        <div className={styles.rightContent}>
          <Trapezoid style={{ width: '66.32%', flexShrink: 0 }} text="预警通知" />
          <Form
            {...layout}
            form={form}
            colon={false}
            hideRequiredMark
            labelAlign="right"
            style={{ marginTop: 20 }}
            onFinish={onFinish}
          >
            <Form.Item label="类型" name="notifyWay" initialValue="m">
              <Radio.Group buttonStyle="solid">
                <Radio.Button value="m">短信</Radio.Button>
                <Radio.Button value="p">电话</Radio.Button>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="人员">
              {[...Array(notifyStaffs).keys()].map((item, index) => (
                <Form.Item noStyle name={['phoneList', `${item}`]} key={index}>
                  <Input autoComplete="off" style={{ marginBottom: 12, width: '86%' }} />
                </Form.Item>
              ))}
              <Button
                style={{ color: '#4751F1', marginLeft: 6 }}
                size="small"
                shape="circle"
                icon={<PlusOutlined />}
                onClick={() => setNotifyStaffs(notifyStaffs + 1)}
              />
            </Form.Item>
            <Form.Item
              label="内容"
              name="content"
              rules={[
                {
                  required: true,
                  message: '请输入通知内容！',
                },
              ]}
              style={{ marginTop: -12 }}
            >
              <Input.TextArea
                rows={4}
                autoComplete="off"
                style={{ resize: 'none', width: '86%' }}
              />
            </Form.Item>
            <Form.Item {...tailLayout}>
              <Button type="primary" block htmlType="submit" style={{ width: '86%' }}>
                通知
              </Button>
            </Form.Item>
          </Form>
          <Trapezoid style={{ flexShrink: 0, width: '66.32%', marginTop: 22 }} text="通知记录" />
          <div className={styles.noticeRecord}>
            {notifyList.data.map((item, index) => (
              <div key={index} className={styles.noticeRecordItem}>
                <div className={styles.cornerMark}>
                  <ClockCircleOutlined />{' '}
                  <span>{moment(item.createDate).format('YYYY/MM/DD HH:mm')}</span>
                </div>
                <p>
                  <span>通知类型</span>{' '}
                  <span className={styles.tag} style={{ background: tagBg[item.notifyWay] }}>
                    {item.notifyWay}
                  </span>
                </p>
                <p>
                  <span>通知人员</span> <span>{item.phone}</span>
                </p>
                <p>
                  <span>通知内容</span> <span>{item.content}</span>
                </p>
              </div>
            ))}
            {notifyList.total === 0 && (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="暂无通知记录"
                style={{ margin: '126px 0' }}
              />
            )}
          </div>
          <div style={{ textAlign: 'right' }}>
            {notifyList.total ? <Pagination total={notifyList.total} /> : null}
          </div>
        </div>
      </div>
      <Viewer
        switching
        image={largeImgUrl}
        onClose={() => {
          setLargeImgUrl('');
          setLargeImgId('');
          setRelativePosition([]);
        }}
        onNext={onNext}
        onPrev={onPrev}
        relativePositions={relativePosition}
      />
    </div>
  );
}
