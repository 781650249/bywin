import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'dva';
import { CloseOutlined, DeleteOutlined } from '@ant-design/icons';
// import cx from 'classnames';
import {
  Tree,
  Input,
  Form,
  InputNumber,
  Radio,
  Button,
  Avatar,
  Divider,
  DatePicker,
  message,
  Modal,
} from 'antd';
import moment from 'moment';
import IMAGE from '../../../relaTimeProtection/components/image';
import styles from './index.less';
import AddPerson from './AddPerson';
import MarqueeArea from './MarqueeArea';

export default function WarnParkModal({ isWarnParkShow }) {
  const [form] = Form.useForm();
  const { treeList, selectedCameras, savePeople, personParams } = useSelector(
    ({ parkWarn }) => parkWarn,
  );
  const { Search } = Input;
  const { confirm } = Modal;
  const dispatch = useDispatch();
  const [autoExpand, setAutoExpand] = useState(false); // 展开的树节点
  const [expandedKeys, setExpandedKeys] = useState([]); // 搜索展示的行
  const [searchValue, setSearchValue] = useState('');
  const [editVedioArea, setEditVedioArea] = useState([]); // 编辑(非添加)事件时的视频选框坐标[[[],[],[],[]]]
  const [, setBoxCoordinate] = useState([]);
  const [warnType, setWarnType] = useState(null);
  const { RangePicker } = DatePicker;
  const [subTitle, setSubTitle] = useState('');

  useEffect(() => {
    form.validateFields(['notifyContent']);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [warnType]);

  const dataList = [];
  const generateList = (data) => {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      const { key, title } = node;
      dataList.push({ key, title });
      if (node.children) {
        generateList(node.children);
      }
    }
  };
  generateList(treeList);

  const handleOnExpand = (expandedKey) => {
    setExpandedKeys(expandedKey);
    setAutoExpand(true);
  };

  const getParentKey = (key, tree) => {
    let parentKey;
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.children) {
        if (node.children.some((item) => item.key === key)) {
          parentKey = node.key;
        } else if (getParentKey(key, node.children)) {
          parentKey = getParentKey(key, node.children);
        }
      }
    }
    return parentKey;
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setSearchValue(value);
    const expandRows = dataList
      .map((item) => {
        if (item.title.indexOf(value) > -1) {
          return getParentKey(item.key, treeList);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    setExpandedKeys(expandRows);
    setAutoExpand(true);
  };

  const setState = useCallback(
    (params = {}, type = 'parkWarn/setState') => {
      dispatch({
        type,
        payload: {
          ...params,
        },
      });
    },
    [dispatch],
  );
  useEffect(() => {
    dispatch({
      type: 'parkWarn/getTreesList',
    });
    dispatch({
      type: 'parkWarn/clear',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const setAddPersons = (params) => {
    dispatch({
      type: 'parkWarn/getPersonnelList',
      payload: {
        ...personParams,
        ...params,
      },
    });
  };

  // 清空表单
  const clearFrom = () => {
    form.setFieldsValue({
      notifyContent: '',
      notifyWay: '',
      thresholdValue: null,
      selectedTime: [],
    });
    setEditVedioArea([]);
    setBoxCoordinate([]);
  };

  const closePage = () => {
    // clearFrom();
    dispatch({
      type: 'parkWarn/setState',
      payload: {
        isWarnParkShow: false,
      },
    });
    // setSubTitle('')
  };

  const handleChecked = (e) => {
    clearFrom();
    const { node } = e;
    setSubTitle(node.title);
    setState({
      selectedCameras: [node],
    });
    const filterXq = node.xqxxbz;
    dispatch({
      type: 'parkWarn/setState',
      payload: {
        personParams: {
          ...personParams,
          yqxxbz: filterXq,
        },
      },
    });
    setAddPersons({
      yqxxbz: filterXq,
    });
    dispatch({
      type: 'parkWarn/getWarnConfigByCameraId',
      payload: {
        cameraId: node.id,
      },
    }).then((item) => {
      if (item) {
        const date1 = moment(item.warnStartTime, 'YYYY-MM-DD HH:mm:ss');
        const date2 = moment(item.warnEndTime, 'YYYY-MM-DD HH:mm:ss');
        const filterArea = JSON.parse(item.areaCode);
        setEditVedioArea(filterArea);
        form.setFieldsValue({
          notifyContent: item.notifyContent || '',
          notifyWay: item.notifyWay || '',
          thresholdValue: item.thresholdValue || '',
          selectedTime: [date1, date2],
          areaCode: editVedioArea,
        });
        dispatch({
          type: 'parkWarn/setState',
          payload: {
            savePeople: item.notifyPersonList,
          },
        });
      } else {
        message.warn('当前地点并无预警配置，请填写');
        dispatch({
          type: 'parkWarn/setState',
          payload: {
            savePeople: [],
          },
        });
      }
    });
  };

  const handleSaveWarnInfo = (config) => {
    const startTime = config.selectedTime[0];
    const endTime = config.selectedTime[1];
    if (selectedCameras[0]) {
      if (editVedioArea) {
        dispatch({
          type: 'parkWarn/saveWarnConfig',
          payload: {
            areaCode: JSON.stringify(editVedioArea),
            cameraId: selectedCameras[0].id,
            notifyContent: config.notifyContent,
            notifyPeople: savePeople.map((item) => item.ygxxbz).join(','),
            notifyWay: config.notifyWay,
            thresholdValue: config.thresholdValue,
            warnEndTime: moment(endTime).format('YYYY-MM-DD HH:mm:ss'),
            warnStartTime: moment(startTime).format('YYYY-MM-DD HH:mm:ss'),
          },
        }).then((res) => {
          if (res) {
            // message.success('预警配置修改成功');
            confirm({
              content: '添加成功,是否返回主页面',
              okText: '确定',
              cancelText: '取消',
              onOk() {
                dispatch({
                  type: 'parkWarn/setState',
                  payload: {
                    isWarnParkShow: false,
                  },
                });
              },
            });
          }
        });
      } else {
        message.warn('请选择预警区域');
      }
    } else {
      message.warn('请选择预警点位');
    }
  };

  const handleDel = (_, i) => {
    savePeople.splice(i, 1);
    dispatch({
      type: 'parkWarn/setState',
      payload: {
        savePeople,
      },
    });
  };

  const loop = (data) =>
    data.map((item) => {
      const filterTitle = item.title.substr(0, 10);
      const index = filterTitle.indexOf(searchValue);
      const beforeStr = filterTitle.substr(0, index);
      const afterStr = filterTitle.substr(index + searchValue.length);
      const title =
        index > -1 ? (
          <span>
            {beforeStr}
            <span style={{ color: 'red' }}>{searchValue}</span>
            {afterStr}
          </span>
        ) : (
          <span>{filterTitle}</span>
        );
      if (item.children) {
        return { title, key: item.key, children: loop(item.children), selectable: false };
      }

      return {
        title,
        key: item.key,
        isOnline: item.isOnline,
        gdJd: item.gdJd,
        gdWd: item.gdWd,
        id: item.id,
        xqxxbz: item.xqxxbz,
        spbfbm: item.spbfbm,
        icon: ({ selected }) =>
          selected ? (
            <img
              style={{ width: '15px', height: '15px', marginBottom: '3px' }}
              src={IMAGE.JK2}
              alt=""
            />
          ) : (
            <img
              style={{ width: '15px', height: '15px', marginBottom: '3px' }}
              src={IMAGE.JK1}
              alt=""
            />
          ),
      };
    });

  // 视频框选坐标集合
  const handleMarqueeOk = (muster) => {
    setBoxCoordinate(muster);
  };

  return (
    <div className={styles.wrap} style={{ display: !isWarnParkShow ? 'none' : 'block' }}>
      <div className={styles.top}>
        <div className={styles.title}>违停警告</div>

        <div className={styles.closed} onClick={() => closePage()}>
          {' '}
          <CloseOutlined />
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.left}>
          <Search
            placeholder="请输入内容"
            onChange={handleChange}
            style={{ marginBottom: '8px' }}
          />
          <div className={styles.tree}>
            <Tree
              showIcon
              onSelect={(_, e) => handleChecked(e)}
              treeData={loop(treeList)}
              onExpand={handleOnExpand}
              expandedKeys={expandedKeys}
              autoExpandParent={autoExpand}
            />
          </div>
        </div>
        <span className={styles.subTitle}>{subTitle}</span>
        {subTitle && (
          <div className={styles.right}>
            <div className={styles.conleft}>
              <div className={styles.setting}>{'   '}预警设置</div>
              <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 24 }}
                form={form}
                colon={false}
                labelAlign="left"
                hideRequiredMark
                onFinish={(value) => handleSaveWarnInfo(value)}
              >
                <Form.Item label="事件名称">违规占道</Form.Item>
                <Form.Item>
                  <div style={{ display: 'flex', marginBottom: '-19px' }}>
                    <Form.Item
                      label="占用时间"
                      rules={[
                        {
                          required: true,
                          message: '请输入时间！',
                        },
                      ]}
                    >
                      <span style={{ paddingLeft: '9px' }}>
                        <Form.Item name="thresholdValue" noStyle>
                          <InputNumber min={5} step={5} />
                        </Form.Item>
                      </span>
                    </Form.Item>
                    <span style={{ marginLeft: 10 }}>分钟</span>
                    <span style={{ color: '#FDBE32', marginLeft: '5px' }}>
                      超过预定时间自动预警
                    </span>
                  </div>
                </Form.Item>

                <Form.Item label="预警时间" name="selectedTime">
                  <RangePicker suffixIcon={null} placeholder={['开始时间', '结束时间']} showTime />
                </Form.Item>

                <Form.Item
                  label="预警类型"
                  rules={[
                    {
                      required: true,
                      message: '请选择预警类型！',
                    },
                  ]}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Form.Item name="notifyWay" noStyle>
                      <Radio.Group
                        value={warnType}
                        buttonStyle="solid"
                        onChange={(e) => setWarnType(e.target.value)}
                      >
                        <Radio.Button style={{ borderRadius: '16px 0 0 16px' }} value={1}>
                          短信
                        </Radio.Button>
                        <Radio.Button style={{ borderRadius: '0 16px 16px 0' }} value={2}>
                          电话
                        </Radio.Button>
                      </Radio.Group>
                    </Form.Item>
                  </div>
                </Form.Item>

                <Form.Item label="通知人员">
                  <AddPerson />
                  <div style={{ overflowY: 'auto', height: '200px', maxHeight: '400px' }}>
                    {Array.isArray(savePeople) &&
                      savePeople.map((item, i) => (
                        <div key={i} className={styles.cardContent}>
                          <Avatar
                            src={item.xp || ''}
                            shape="square"
                            size={60}
                            style={{ margin: '8px' }}
                          />
                          <div className={styles.cardright}>
                            <div className={styles.title}>{item.xm}</div>
                            <div className={styles.number}>{item.sjhm}</div>
                          </div>
                          <div className={styles.del} onClick={(e) => handleDel(e, i)}>
                            <DeleteOutlined />
                          </div>
                        </div>
                      ))}
                  </div>
                </Form.Item>

                <Form.Item
                  label="通知内容"
                  name="notifyContent"
                  rules={[
                    {
                      required: warnType === 1,
                      message: '请填写通知内容！',
                    },
                  ]}
                >
                  <Input.TextArea autoSize={{ minRows: 2, maxRows: 4 }} />
                </Form.Item>

                <div className={styles.footer}>
                  <Button className={styles.ensure} type="primary" htmlType="submit">
                    确定
                  </Button>
                  <Button onClick={() => closePage()}>取消</Button>
                </div>
              </Form>
            </div>

            <Divider type="vertical" style={{ height: '90%', color: 'red' }} />

            <div className={styles.conRight}>
              <div className={styles.areaTitle}>预警区域</div>

              <Form.Item label="占用类型">车辆</Form.Item>
              <p style={{ color: '#FDBE32' }}>温馨提示：请在视频区域内点击框选需要预警的区域</p>

              <MarqueeArea
                editVedioArea={editVedioArea}
                handleMarqueeOk={handleMarqueeOk}
                selectedPointInfo={selectedCameras[0]}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
