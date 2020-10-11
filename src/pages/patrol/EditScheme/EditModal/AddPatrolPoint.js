import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'dva';
import { Modal, Button, Table, message, Form, Select, InputNumber, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { initMap } from '@/utils/leafletMap';
import MarqueeArea from '@/components/MarqueeArea';
import styles from './index.less';

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};
const { Option } = Select;

export default function({
  pointModalVisible = false,
  switchChecked,
  pointModalType = 'add',
  updatePointInfo = {},
  handlePointCancel = () => {},
  handlePointOk = () => {},
}) {
  const dispatch = useDispatch();
  const mapRef = useRef(null);
  const markerLayer = useRef();
  const clusterGroupLayer = useRef();
  const [form] = Form.useForm();
  const [isMap, setIsMap] = useState(false);
  const [eventModalVisible, setEventModalVisible] = useState(false);
  const [selectedPointInfo, setSelectedPointInfo] = useState({});
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [editEventIndex, setEditEventIndex] = useState(null);
  const { eventList, cameraList } = useSelector(({ editPatrol }) => editPatrol);

  const eventColumns = [
    {
      title: '事件',
      dataIndex: 'xcsfMc',
      key: 'xcsfMc',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record, index) => (
        <Space size="middle">
          <Button style={{ margin: '-8px 0' }} type="link" onClick={() => { 
            setEventModalVisible(true);
            setEditEventIndex(index);
          }}>
            编辑
          </Button>
          <Button
            style={{ margin: '-8px 0' }}
            type="link"
            onClick={() => {
              if(editEventIndex === index) {
                message.warning('请先完成事件编辑再删除！')
              }else {
                setSelectedEvents(selectedEvents.filter((item, i) => index !== i))
              }
            }}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  /**
   * 循环遍历设置点位标记 --setIcon
   * @param {*Array} layers
   * @param {*String} layerId
   */
  const changePointIcon = (layers, layerId = null) => {
    layers.forEach((markerNode) => {
      if (markerNode.options.icon.options.html === '<div class="map-patrol-point-checked"></div>') {
        markerNode.setIcon(
          L.divIcon({
            html: `<div class="map-patrol-point"></div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 28],
          }),
        );
      }
      if (markerNode.options.id === layerId) {
        markerNode.setIcon(
          L.divIcon({
            html: `<div class="map-patrol-point-checked"></div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 28],
          }),
        );
      }
    });
  };

  const initMapRef = useCallback(
    (node) => {
      if (node !== null) {
        mapRef.current = initMap('addPointMap', { zoom: 18 });
        markerLayer.current = L.featureGroup();
        clusterGroupLayer.current = L.markerClusterGroup({
          zoomToBoundsOnClick: false,
          maxClusterRadius: (zoom) => (zoom === 18 ? 1 : 80),
        }).addTo(mapRef.current);

        cameraList.forEach((i) => {
          markerLayer.current.addLayer(
            L.marker([i.lat, i.lng], {
              icon: L.divIcon({
                html: `<div class="map-patrol-point"></div>`,
                iconSize: [32, 32],
                iconAnchor: [16, 28],
              }),
              title: i.address,
              id: i.spbfbm,
            }),
          );
        });
        if(Array.isArray(cameraList) && cameraList.length !== 0) {
          mapRef.current.fitBounds(
            cameraList.map((i) => ({ lng: Number(i.lng), lat: Number(i.lat) })),
          );
        }
        clusterGroupLayer.current.addLayer(markerLayer.current);
        setIsMap(true);
        return () => {
          markerLayer.current.clearLayers();
          clusterGroupLayer.current.clearLayers();
          setIsMap(false);
        };
      }
    },
    [cameraList],
  );

  useEffect(() => {
    if (!isMap) return;
    markerLayer.current.on('click', (e) => {
      if(pointModalType === 'add') {
        const { lat, lng} = e.latlng;
        const { id, title } = e.layer.options;
        setSelectedPointInfo({ id, title, lat, lng });
        changePointIcon(markerLayer.current.getLayers(), e.layer.options.id);
      }
    });
  }, [pointModalType, isMap])

  useEffect(() => {
    dispatch({ type: 'editPatrol/getModelArithmeticList', payload: { showArea: 1 } });
  }, [dispatch]);

  useEffect(() => {
    if (!isMap) return;
    if (!pointModalVisible) {
      changePointIcon(markerLayer.current.getLayers());
      setSelectedEvents([]); // 关闭地图框时清除事件框记录
      setSelectedPointInfo({}); // 关闭地图框时清除点位记录
      setEventModalVisible(false);
      setEditEventIndex(null);
    } else {
      if (!updatePointInfo.info) return;
      changePointIcon(markerLayer.current.getLayers(), updatePointInfo.info.pointInfo.id);
      mapRef.current.fitBounds([{lng: updatePointInfo.info.pointInfo.lng, lat: updatePointInfo.info.pointInfo.lat}]);
      setSelectedEvents(updatePointInfo.info.events);
      setSelectedPointInfo(updatePointInfo.info.pointInfo);
    }
  }, [pointModalVisible, updatePointInfo, isMap]);

  useEffect(() => {
    if (!eventModalVisible) {
      form.resetFields();
      setEditEventIndex(null);
    }
  }, [form, eventModalVisible]);

  useEffect(() => {
    if(editEventIndex !== null) {
      const editEventInfo = selectedEvents[editEventIndex];
      form.setFieldsValue({
        eventId: editEventInfo.xcsfId,
        occupyTime: Number(editEventInfo.thresholdValue) || 5,
        eventType: editEventInfo.detectionType ? editEventInfo.detectionType.split(',') : [],
        editVedioArea: JSON.parse(editEventInfo.areaCount),
      });
    }else {
      form.resetFields();
      setEditEventIndex(null);
    }
  }, [form, editEventIndex, selectedEvents])

  const handleFinalOk = () => {
    if (!selectedPointInfo.id) {
      message.warning('请选择预警点位!');
      return;
    }
    if(!switchChecked) {
      handlePointOk({ events: selectedEvents, pointInfo: selectedPointInfo });
      handlePointCancel();
      return;
    }
    if (eventModalVisible) {
      form
        .validateFields()
        .then((res) => {
          if (res.editVedioArea.length === 0) {
            message.warning('请在视频区域内点击框选需要预警的区域。');
          } else {
            const getDetectionType = () => {
              switch (res.eventId) {
                case 1:
                  return '1';
                case 3:
                  return '5';
                
                default:
                  return res.eventType.join(',');
              }
            }
            if(editEventIndex === null) {
              setSelectedEvents([
                ...selectedEvents,
                {
                  areaCount: JSON.stringify(res.editVedioArea),
                  detectionType: getDetectionType(),
                  thresholdValue: res.occupyTime,
                  xcsfId: res.eventId,
                  taskId: null,
                  warnType: eventList.filter((item) => item.id === res.eventId)[0].warnType,
                  xcsfMc: eventList.filter((item) => Number(item.id) === Number(res.eventId))[0]
                    .modelName,
                },
              ]);
            }else {
              const newSelectedEvents = [...selectedEvents];
              newSelectedEvents[editEventIndex] = {
                areaCount: JSON.stringify(res.editVedioArea),
                detectionType: getDetectionType(),
                thresholdValue: res.occupyTime,
                xcsfId: res.eventId,
                taskId: selectedEvents[editEventIndex].taskId,
                warnType: eventList.filter((item) => item.id === res.eventId)[0].warnType,
                xcsfMc: eventList.filter((item) => Number(item.id) === Number(res.eventId))[0]
                  .modelName,
              }
              setSelectedEvents([...newSelectedEvents]);
            }
            setEventModalVisible(false);
          }
          return null;
        })
        .catch((errorInfo) => console.log(errorInfo));
    }else {
      if (!eventModalVisible && selectedEvents.length === 0) {
        message.warning('请选择预警事件!');
        return;
      }
      handlePointOk({ events: selectedEvents, pointInfo: selectedPointInfo });
      handlePointCancel();
    }
  };

  const handleCancel = () => {
    if (eventModalVisible) {
      setEventModalVisible(false);
    } else {
      handlePointCancel();
    }
  };

  /**
   * 点击新增预警事件
   */
  const openEventModal = () => {
    if (!selectedPointInfo.id) {
      message.warning('请先选择预警点位!');
      return;
    }
    setEventModalVisible(true);
    setEditEventIndex(null);
  };

  /**
   * 检测事件类型返回时间lable展示
   * @param {Number} code
   */
  const detectionType = (code) => {
    switch (code) {
      case 1:
        return '脱岗';
      case 2:
        return '占用';
      default:
        return '检测';
    }
  };

  return (
    <Modal
      visible={pointModalVisible}
      footer={null}
      width={eventModalVisible ? 982 : 492}
      className={styles.addModal}
      maskClosable={false}
      destroyOnClosed
      onCancel={handlePointCancel}
    >
      <div className={styles.addModalContain}>
        <div className={styles.addModalContainLeft}>
          <p className={styles.addModalTitle}>{`${
            pointModalType === 'add' ? '新增' : '更新'
          }巡逻点`}</p>
          <div ref={initMapRef} id="addPointMap" className={styles.addModalMap} />
          {switchChecked && (
            <div className={styles.addModalListTitle}>
              <span>预警事件</span>
              <Button
                type="primary"
                size="small"
                shape="circle"
                icon={<PlusOutlined />}
                onClick={() => openEventModal()}
              />
            </div>
          )}
          {switchChecked && selectedEvents.length !== 0 && (
            <Table
              rowKey={(record, index) => record.xcsfId+index}
              style={{ marginTop: 12 }}
              dataSource={selectedEvents}
              columns={eventColumns}
              pagination={false}
              scroll={{ y: 165 }}
            />
          )}
        </div>
        <div
          className={styles.addModalContainRight}
          style={{ display: eventModalVisible ? null : 'none' }}
        >
          <div className={styles.rightContent}>
            <Form
              {...layout}
              form={form}
              colon={false}
              labelAlign="left"
              hideRequiredMark
              // onFinish={handleFinish}
            >
              <Form.Item
                label="事件名称"
                name="eventId"
                rules={[
                  {
                    required: true,
                    message: '请输入事件名称！',
                  },
                ]}
              >
                <Select onChange={() => form.setFieldsValue({ eventType: [] })}>
                  {eventList.map((item) => (
                    <Option value={item.id} key={item.id}>
                      {item.modelName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) =>
                  prevValues.eventId !== currentValues.eventId
                }
              >
                {({ getFieldValue }) =>
                  getFieldValue('eventId') && (
                    <Form.Item label={`${detectionType(getFieldValue('eventId'))}时间`}>
                      <div style={{ display: 'flex' }}>
                        <Form.Item
                          name="occupyTime"
                          rules={[
                            {
                              required: true,
                              message: '请输入时间！',
                            },
                          ]}
                          noStyle
                        >
                          <InputNumber min={5} step={5} />
                        </Form.Item>
                        <span style={{ marginLeft: 10 }}>分钟</span>
                        <span className={styles.messageSpan}>{`${detectionType(
                          getFieldValue('eventId'),
                        )}超过预定时间自动预警`}</span>
                      </div>
                    </Form.Item>
                  )
                }
              </Form.Item>
              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) =>
                  prevValues.eventId !== currentValues.eventId
                }
              >
                {({ getFieldValue }) =>
                  getFieldValue('eventId') === 2 && (
                    <Form.Item
                      label="检测类型"
                      name="eventType"
                      rules={[
                        {
                          required: true,
                          message: '请选择检测类型！',
                        },
                      ]}
                    >
                      <Select mode="multiple" placeholder="请选择检测类型">
                        <Option value="1">行人</Option>
                        <Option value="2">汽车</Option>
                        <Option value="3">电动车</Option>
                        <Option value="4">动物</Option>
                      </Select>
                    </Form.Item>
                  )
                }
              </Form.Item>

              <p className={styles.messageSpan} style={{ marginLeft: 0 }}>
                温馨提示：请在视频区域内点击框选需要预警的区域。
              </p>
              <Form.Item noStyle name="editVedioArea">
                <MarqueeArea
                  selectedPointId={selectedPointInfo.id}
                />
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
      <div className={styles.addModalBottom}>
        <Button type="primary" onClick={handleFinalOk}>
          确定
        </Button>
        <Button style={{ marginLeft: 8 }} onClick={handleCancel}>
          取消
        </Button>
      </div>
    </Modal>
  );
}
