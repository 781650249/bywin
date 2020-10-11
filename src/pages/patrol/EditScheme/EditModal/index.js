import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'dva';
import {
  Button,
  Form,
  Input,
  Switch,
  Radio,
  InputNumber,
  DatePicker,
  TimePicker,
  Avatar,
  Popconfirm,
  Modal,
  message,
} from 'antd';
import { PlusOutlined, UserOutlined, DeleteOutlined, FormOutlined } from '@ant-design/icons';
import moment from 'moment';
import { initMap } from '@/utils/leafletMap';
import ShallowMark from '@/assets/patrol/shallow-mark.png';
import AddPatrolPoint from './AddPatrolPoint';
import AddPatrolStaff from './AddPatrolStaff';
import styles from './index.less';

const { RangePicker: DateRangePicker } = DatePicker;
const { RangePicker: TimeRangePicker } = TimePicker;
const { confirm } = Modal;
const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 },
};

export default function({ isEditShow }) {
  const mapRef = useRef(null);
  const markerLayer = useRef(L.featureGroup());
  const [patrolPoints, setPatrolPoints] = useState([]);
  const [switchChecked, setSwitchChecked] = useState(true);
  const [patrolStaffs, setPatrolStaffs] = useState([]);
  const [patrolPeriod, setPatrolPeriod] = useState('realtime'); // 巡逻周期  实时/次数
  const [patrolBout, setPatrolBout] = useState(1); // 巡逻多少次?
  const [patrolTimeList, setPatrolTimeList] = useState([{ beginTime: '', endTime: '' }]);
  const [pointModalType, setPointModalType] = useState('add'); // 更新or新增巡逻点
  const [updatePointInfo, setUpdatePointInfo] = useState({}); // 将要更新的对应巡逻点信息
  const [pointModalVisible, setPointModalVisible] = useState(false);
  const [staffModalVisible, setStaffModalVisible] = useState(false);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { editMode } = useSelector(({ editPatrol }) => editPatrol);
  const editLineDetail = useSelector(({ editPatrol }) => editPatrol.editLineDetail);
  const editLineId = useSelector(({ editPatrol }) => editPatrol.editLineId);

  useEffect(() => {
    if (isEditShow && !mapRef.current) {
      setTimeout(() => {
        mapRef.current = initMap('editPatrolMap', { zoom: 18 });
        markerLayer.current.addTo(mapRef.current);
      }, 200);
    }
  }, [isEditShow]);

  useEffect(() => {
    markerLayer.current.clearLayers();
    if(Array.isArray(patrolPoints) && patrolPoints.length !== 0 && mapRef.current) {
      patrolPoints.forEach((el) => {
        markerLayer.current.addLayer(
          L.marker([el.pointInfo.lat, el.pointInfo.lng], {
            icon: L.divIcon({
              html: `<div class="map-patrol-point"></div>`,
              iconSize: [32, 32],
              iconAnchor: [16, 28],
            }),
            title: el.pointInfo.title,
            id: el.pointInfo.id,
          }),
        );
      })

      mapRef.current.fitBounds(
        patrolPoints.map((el) => ({ lng: Number(el.pointInfo.lng), lat: Number(el.pointInfo.lat) })),
      );
    }
  }, [patrolPoints])

  useEffect(() => {
    if (!switchChecked) {
      setPatrolPeriod('frequency');
    }
  }, [switchChecked]);

  useEffect(() => {
    // 编辑线路方案时表单赋值
    if (editLineDetail.xcxlxxbz) {
      form.setFieldsValue({
        xcxlMc: editLineDetail.xcxlMc,
        rwms: editLineDetail.rwms,
        sxsj: [moment(editLineDetail.sxsjKs), moment(editLineDetail.sxsjJs)],
      });
      setSwitchChecked(editLineDetail.taskType === '1');
      setPatrolPeriod(editLineDetail.taskCount === 0 ? 'realtime' : 'frequency');
      setPatrolBout(editLineDetail.taskCount);
      setPatrolTimeList(editLineDetail.taskTimeList);
      setPatrolStaffs(
        editLineDetail.employeeList.map((employee, index) => ({
          ...employee,
          num: index + 1,
          key: employee.xcygxxbz,
          sex: employee.xbdm === '1' ? '男' : '女',
        })),
      );
      setPatrolPoints(editLineDetail.xcwzjhList.map((item) => ({
        events: [...item.xcsf],
        pointInfo: {
          id: item.xcwzid,
          lng: item.jd,
          lat: item.wd,
          title: item.sxtName,
        }
      })))
    }
  }, [form, editLineDetail]);

  useEffect(() => {
    if (pointModalVisible) return;
    setUpdatePointInfo({});
  }, [pointModalVisible]);

  /**
   * 切换是否智能巡逻
   * @param {*Boolean} values
   */
  const handleSwitch = (values) => {
    if (Array.isArray(patrolPoints) && patrolPoints.length > 0) {
      confirm({
        content: '切换将清除已添加的巡逻点位,是否继续？',
        okText: '确定',
        cancelText: '取消',
        onOk() {
          setPatrolPoints([]);
          setSwitchChecked(values);
        },
      });
    } else {
      setSwitchChecked(values);
    }
  };

  /**
   * 验证是否有时间框未填
   * @param {Array} arr
   */
  const testTimeList = (times) => {
    let flag = 0;
    times.forEach((i) => {
      if (i.beginTime === '' || i.endTime === '') {
        flag = 1;
        return flag;
      }
    });
    return flag;
  };

  /**
   * 清空表单
   */
  const resetFormData = useCallback(() => {
    form.resetFields();
    setPatrolBout(1);
    setPatrolTimeList([{ beginTime: '', endTime: '' }]);
    setPatrolPoints([]);
    setPatrolStaffs([]);
  }, [form]);

  useEffect(() => {
    if (!editLineId) {
      resetFormData();
    }
  }, [editLineId, resetFormData]);

  /**
   * 是否返回返回首页
   */
  const goPatrolHome = (typeCn) => {
    confirm({
      content: `${typeCn}成功,是否返回主页面？`,
      okText: '确定',
      cancelText: '取消',
      onOk() {
        dispatch({ type: 'patrolMain/setState', payload: { isEditShow: false } })
      },
    });
  }

  /**
   * 表单提交
   * @param {Object} values
   */
  const handleFinish = () => {
    form
      .validateFields()
      .then((res) => {
        if (patrolPoints.length === 0) {
          message.warning('请配置巡逻点信息!');
          return;
        }
        if (!switchChecked && patrolStaffs.length === 0) {
          message.warning('人工巡逻时请添加巡逻人员!');
          return;
        }
        if (patrolPeriod === 'frequency' && testTimeList(patrolTimeList)) {
          message.warning('请选择巡逻时间!');
          return;
        }
        const paramsObj = {
          xcxlMc: res.xcxlMc,
          rwms: res.rwms,
          sxsjKs: moment(res.sxsj[0]).format('YYYY-MM-DD'),
          sxsjJs: moment(res.sxsj[1]).format('YYYY-MM-DD'),
          taskCount: patrolPeriod === 'realtime' ? 0 : patrolBout,
          taskTimeList:
            patrolPeriod === 'realtime'
              ? []
              : patrolTimeList.map((i) => ({
                  beginTime: i.beginTime,
                  endTime: i.endTime,
                })),
          taskType: switchChecked ? '1' : '0',
          userIdList: switchChecked ? [] : patrolStaffs.map((i) => i.xcygxxbz),
          xcwzjh: patrolPoints.map((i) => ({
            xcsf: [...i.events],
            xcwzid: i.pointInfo.id,
          })),
        }
        if(editLineId) {
          paramsObj.xcxlxxbz = editLineId;
        }
        dispatch({
          type: 'editPatrol/editPatrolLine',
          payload: {
            ...paramsObj,
          },
          callback: () => {
            if(editLineId) {
              dispatch({ type: 'patrolMain/getAllInspection' });
              goPatrolHome('更新');
            }else {
              resetFormData();
              dispatch({ type: 'patrolMain/getAllInspection' });
              goPatrolHome('新增');
            }
          },
        });
      })
      .catch((err) => console.log(err));
  };

  const changeTimeArrayBybout = (values) => {
    if (values < patrolTimeList.length) {
      setPatrolTimeList([...patrolTimeList].filter((_, index) => index < values));
    } else {
      setPatrolTimeList([
        ...patrolTimeList,
        ...[...Array(values - patrolTimeList.length).keys()].map(() => ({
          beginTime: '',
          endTime: '',
        })),
      ]);
    }
  };

  /**
   * 改变巡逻次数时进行过滤，只能是整数
   * @param {Number} values
   */
  const changePatrolBout = (values) => {
    if (!values) {
      setPatrolBout(1);
      changeTimeArrayBybout(1);
    } else if (values > 24) {
      setPatrolBout(24);
      changeTimeArrayBybout(24);
    } else if (values < 1) {
      setPatrolBout(1);
      changeTimeArrayBybout(1);
    } else if (values % 1 === 0) {
      setPatrolBout(values);
      changeTimeArrayBybout(values);
    } else {
      setPatrolBout(Math.trunc(values));
      changeTimeArrayBybout(Math.trunc(values));
    }
  };

  const changeTimeArray = (timeString, key) => {
    const timeArr = [...patrolTimeList];
    timeArr[key] = { beginTime: `${timeString[0]}:00`, endTime: `${timeString[1]}:00` };
    setPatrolTimeList([...timeArr]);
  };

  const handleStaffOk = (rows) => {
    setPatrolStaffs(rows);
    setStaffModalVisible(false);
  };

  const handlePointOk = (rows) => {
    if (pointModalType === 'add') {
      setPatrolPoints([...patrolPoints, rows]);
    } else {
      const newArr = [...patrolPoints];
      newArr[updatePointInfo.mark] = rows;
      setPatrolPoints(newArr);
    }
  };

  return (
    <div
      className={styles.modalWrapper}
      style={{ height: isEditShow ? 'calc(100vh - 64px - 24px)' : 0 }}
    >
      <div className={styles.modalTitle}>
        <span>{editMode === 'add' ? '新增巡逻方案' : '更新巡逻方案'}</span>
      </div>
      <div className={styles.modalContent}>
        <div className={styles.modalContentLeft}>
          <Form {...layout} form={form} colon={false} labelAlign="left" hideRequiredMark>
            <Form.Item
              label="方案名称"
              name="xcxlMc"
              rules={[
                {
                  required: true,
                  message: '请输入方案名称！',
                },
              ]}
            >
              <Input autoComplete="off" />
            </Form.Item>
            <Form.Item
              label="方案简述"
              name="rwms"
              rules={[
                {
                  required: true,
                  message: '请输入方案简述！',
                },
              ]}
            >
              <Input.TextArea rows={4} autoComplete="off" style={{ resize: 'none' }} />
            </Form.Item>
            <Form.Item label="智能巡逻">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Switch
                  className={styles.switch}
                  checkedChildren="开"
                  unCheckedChildren="关"
                  checked={switchChecked}
                  onChange={handleSwitch}
                />
                {!switchChecked && (
                  <Button
                    type="primary"
                    size="small"
                    shape="circle"
                    icon={<PlusOutlined />}
                    onClick={() => setStaffModalVisible(true)}
                  />
                )}
              </div>
              {!switchChecked &&
                patrolStaffs.map((item, index) => (
                  <div key={index} className={styles.staffCard}>
                    <Avatar shape="square" size={60} src={item.xp} icon={<UserOutlined />} />
                    <div className={styles.staffCardInfo}>
                      <p>{item.xm}</p>
                      <p>{item.sjhm}</p>
                    </div>
                    <div
                      className={styles.staffDelete}
                      onClick={() =>
                        setPatrolStaffs(
                          patrolStaffs.filter((info) => info.xcygxxbz !== item.xcygxxbz),
                        )
                      }
                    >
                      <DeleteOutlined />
                    </div>
                  </div>
                ))}
            </Form.Item>
            <Form.Item label="巡逻次数">
              <div className={styles.formContent}>
                <Radio.Group
                  value={patrolPeriod}
                  buttonStyle="solid"
                  onChange={(e) => setPatrolPeriod(e.target.value)}
                >
                  <Radio.Button
                    style={{ borderRadius: '16px 0 0 16px' }}
                    value="realtime"
                    disabled={!switchChecked}
                  >
                    实时
                  </Radio.Button>
                  <Radio.Button style={{ borderRadius: '0 16px 16px 0' }} value="frequency">
                    次数
                  </Radio.Button>
                </Radio.Group>
                {patrolPeriod === 'frequency' && (
                  <InputNumber
                    value={patrolBout}
                    formatter={(value) => `${value} 次`}
                    onChange={(values) => changePatrolBout(values)}
                  />
                )}
              </div>
            </Form.Item>
            {patrolPeriod === 'frequency' && (
              <Form.Item
                label="巡逻时间"
                // name="time"
              >
                {patrolTimeList.map((item, index) => (
                  <TimeRangePicker
                    format="HH:mm"
                    value={[
                      item.beginTime ? moment(item.beginTime, 'HH:mm') : null,
                      item.endTime ? moment(item.endTime, 'HH:mm') : null,
                    ]}
                    style={{ width: '100%', marginBottom: 12 }}
                    key={index}
                    onChange={(_, timeString) => changeTimeArray(timeString, index)}
                  />
                ))}
              </Form.Item>
            )}
            <Form.Item
              label="生效日期"
              name="sxsj"
              rules={[
                {
                  required: true,
                  message: '请选择生效日期！',
                },
              ]}
            >
              <DateRangePicker format="YYYY-MM-DD" />
            </Form.Item>
            <Form.Item label="巡逻点">
              {patrolPoints.map((item, index) => (
                <div className={styles.pointCard} key={index}>
                  <p>
                    <img style={{ width: 16, height: 20 }} src={ShallowMark} alt="" />
                    <span style={{ marginLeft: 10 }}>{item.pointInfo.title}</span>
                  </p>
                  <p>{item.events.map((event) => event.xcsfMc).join('/')}</p>
                  <div className={styles.pointCardAction}>
                    <Popconfirm
                      title="确定删除?"
                      onConfirm={() =>
                        setPatrolPoints(patrolPoints.filter((_, xb) => xb !== index))
                      }
                      okText="是"
                      cancelText="否"
                    >
                      <DeleteOutlined />
                    </Popconfirm>
                    <FormOutlined
                      onClick={() => {
                        setPointModalVisible(true);
                        setPointModalType('update');
                        setUpdatePointInfo({ mark: index, info: item });
                      }}
                    />
                  </div>
                </div>
              ))}
              <Button
                type="primary"
                size="small"
                shape="circle"
                icon={<PlusOutlined />}
                onClick={() => {
                  setPointModalVisible(true);
                  setPointModalType('add');
                }}
              />
            </Form.Item>
          </Form>
        </div>
        <div className={styles.modalContentRight}>
          <div className={styles.modalContentRightTitle}>巡逻路线预览</div>
          <div className={styles.modalContentRightMap}>
            <div id="editPatrolMap" className={styles.smallMap} />
          </div>
        </div>
      </div>
      <div className={styles.modalBottom}>
        <Button type="primary" onClick={handleFinish}>
          确定
        </Button>
        <Button
          style={{ marginLeft: 8 }}
          onClick={() => dispatch({ type: 'patrolMain/setState', payload: { isEditShow: false } })}
        >
          取消
        </Button>
      </div>
      <AddPatrolPoint
        pointModalVisible={pointModalVisible}
        switchChecked={switchChecked}
        pointModalType={pointModalType}
        updatePointInfo={updatePointInfo}
        handlePointCancel={() => setPointModalVisible(false)}
        handlePointOk={handlePointOk}
      />
      <AddPatrolStaff
        staffModalVisible={staffModalVisible}
        patrolStaffs={patrolStaffs}
        handleStaffCancel={() => setStaffModalVisible(false)}
        handleStaffOk={handleStaffOk}
      />
    </div>
  );
}
