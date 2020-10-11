import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'dva';
import { Radio, DatePicker, message, Input, Descriptions, Tooltip, Tree } from 'antd';
import { SearchOutlined, ClockCircleOutlined, CloseOutlined } from '@ant-design/icons';
import cx from 'classnames';
import moment from 'moment';
import Aliplayer from '@/components/Aliplayer';
import { getDeviceInfo, getTreeList } from '@/services/video-archives';
import { LngLat } from '@/utils/leafletMap';
import IMAGE from './components/image';
import Map from './Map';
import styles from './index.less';

const { RangePicker } = DatePicker;
const { Search } = Input;

function range(start, end) {
  const result = [];
  for (let i = start; i < 24 - end; i += 1) {
    const newVal = end + i;
    result.push(newVal);
  }
  return result;
}

export default function() {
  const [searchValue, setSearchValue] = useState(''); // 搜索关键字
  const [autoExpand, setAutoExpand] = useState(false); // 展开的树节点
  const [expandedKeys, setExpandedKeys] = useState([]); // 搜索展示的行
  const [treeList, setTreeList] = useState([]); // 树节点
  const [splitScreen, setSplitScreen] = useState(1); // 分屏
  const [playMode, setPlayMode] = useState('live'); // 播放模式
  const [selectedTime, setSelectedTime] = useState([]); // 回放时间
  const [deviceCamera, setDeviceCamera] = useState(null); // 设备信息
  const [lnglats, setLnglats] = useState([]); // 传递的经纬度
  const [clickIndex, setClickIndex] = useState(0); // 选中的框
  const [currentCameraId, setCurrentCameraId] = useState(null); // eslint-disable-line no-unused-vars
  const dispatch = useDispatch();
  const { selectedCameraKeys } = useSelector(({ relaTimeProtection }) => relaTimeProtection);

  useEffect(() => {
    const getData = async () => {
      const data = await getTreeList();
      setTreeList(data);
    };
    getData();
    dispatch({
      type: 'relaTimeProtection/getCameraLists',
    });
  }, [dispatch]);

  const setState = useCallback(
    (params = {}, type = 'relaTimeProtection/setState') => {
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
    const selectCamera = { spbfbm: null, azdd: null };
    if (selectCamera) {
      setState({
        selectedCameraKeys: [selectCamera],
      });
    }
    return () => {
      setState({
        selectedCameraKeys: [],
      });
    };
  }, [setState]);

  const loop = (data) =>
    data.map((item) => {
      const index = item.title.indexOf(searchValue);
      const beforeStr = item.title.substr(0, index);
      const afterStr = item.title.substr(index + searchValue.length);
      const title =
        index > -1 ? (
          <span>
            {beforeStr}
            <span className="site-tree-search-value">{searchValue}</span>
            {afterStr}
          </span>
        ) : (
          <span>{item.title}</span>
        );
      if (item.children) {
        return { title, key: item.key, selectable: false, children: loop(item.children) };
      }

      return {
        title,
        key: item.key,
        isOnline: item.isOnline,
        gdJd: item.gdJd,
        gdWd: item.gdWd,
        id: item.id,
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

  // 节点选中
  const handleClick = (_, { node }) => {
    let keys = [];
    if (selectedCameraKeys.map((i) => i.spbfbm).includes(node.spbfbm)) {
      message.warning('该视频处于播放中');
      return null;
    }
    // if(!node.isOnline){
    //   message.warning('该设备处于离线状态')
    // }
    if (splitScreen === 1) {
      keys = [node];
    } else if (splitScreen === 'map') {
      setPlayMode('live');
      const { gdJd: lng, gdWd: lat } = node;
      const lnglat = LngLat(lng, lat);
      lnglats.push(lnglat);
      if (lnglats && lnglats.length > 1) {
        lnglats.pop();
      }
      setLnglats(lnglats);
    } else {
      keys = [...selectedCameraKeys];
      keys.splice(clickIndex, 1, node); // 替换选中的那个位置
    }
    setState({
      selectedCameraKeys: keys,
    });
    const randomIndex = (clickIndex + 1) % splitScreen;
    setClickIndex(randomIndex);
  };

  // 框选
  const handleChecked = (e, index) => {
    setClickIndex(index);
    setCurrentCameraId({
      currentCameraId: e,
    });
  };

  const timeChange = (date) => {
    const newDate = date || [];
    setSelectedTime(newDate);
  };

  // 展示设备信息
  const showDeviceInfo = async (el) => {
    if (el) {
      setDeviceCamera(null);
      const { data } = await getDeviceInfo({ sxtid: el });
      setDeviceCamera(data.rows[0]);
    }
  };

  const deviceInfoModal = () => (
    <Descriptions
      style={{
        borderRadius: '8px',
      }}
      size="small"
      title="设备信息"
    >
      <Descriptions.Item span={3} label="设备名称">
        {(deviceCamera && deviceCamera.sxtmc) || ''}
      </Descriptions.Item>
      <Descriptions.Item span={3} label="设备类型">
        {(deviceCamera && deviceCamera.cameraType) || ''}
      </Descriptions.Item>
      <Descriptions.Item span={3} label="设备ID">
        {(deviceCamera && deviceCamera.spbfbm) || ''}
      </Descriptions.Item>
      <Descriptions.Item span={3} label="经度">
        {(deviceCamera && deviceCamera.gdJd) || ''}
      </Descriptions.Item>
      <Descriptions.Item span={3} label="纬度">
        {(deviceCamera && deviceCamera.gdWd) || ''}
      </Descriptions.Item>
      <Descriptions.Item span={3} label="高度">
        {(deviceCamera && deviceCamera.cameraType) || ''}
      </Descriptions.Item>
      <Descriptions.Item span={3} label="是否可用">
        {deviceCamera && deviceCamera.playable && Boolean(deviceCamera.isOnline)
          ? '是'
          : '否' || ''}
      </Descriptions.Item>
      <Descriptions.Item span={3} label="设备描述">
        {(deviceCamera && deviceCamera.cameraType) || ''}
      </Descriptions.Item>
    </Descriptions>
  );

  // 删除直播
  const handleDel = (el, index) => {
    let deleItem = selectedCameraKeys.filter((item) => item.spbfbm === el.spbfbm);
    const a = {
      spbfbm: null,
      azdd: null,
      azddxzqymc: null,
      cameraType: null,
      gdJd: null,
      gdWd: null,
      isOnline: null,
      sxtmc: null,
    };
    deleItem = a;
    selectedCameraKeys.splice(index, 1, deleItem);
    dispatch({
      type: 'relaTimeProtection/setState',
      payload: {
        selectedCameraKeys,
      },
    });
  };

  // 扩展子树
  const handleOnExpand = (expandedKey) => {
    setExpandedKeys(expandedKey);
    setAutoExpand(true);
  };

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

  // 值搜索
  const handleChange = (value) => {
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

  // 视频渲染
  const renderVideos = () => {
    switch (splitScreen) {
      case 1:
        return (
          <>
            {Array.isArray(selectedCameraKeys) &&
              selectedCameraKeys.map((el, index) => (
                <div
                  key={el.spbfbm}
                  className={styles.video}
                  style={{ height: '88%', backgroundColor: '#000000', width: '100%' }}
                >
                  <span className={styles.title}>{el.azdd}</span>
                  <div className={cx({ [styles.closed]: !el.spbfbm })}>
                    {' '}
                    <CloseOutlined
                      className={styles.videoClose}
                      onClick={() => handleDel(el, index)}
                    />
                    <Tooltip
                      placement="rightBottom"
                      trigger="click"
                      title={() => deviceInfoModal()}
                    >
                      <span
                        onClick={() => showDeviceInfo(el.spbfbm)}
                        className={styles.deviceInfo}
                      />
                    </Tooltip>
                  </div>
                  <Aliplayer
                    id={el.spbfbm}
                    cameraId={el.spbfbm}
                    selectTime={playMode === 'live' ? [] : selectedTime}
                  />
                </div>
              ))}
          </>
        );

      case 2:
        return (
          <>
            {Array.isArray(selectedCameraKeys) &&
              selectedCameraKeys.map((el, index) => (
                <div
                  key={index}
                  className={styles.wrapTwo}
                  style={{ height: '43%', width: '100%' }}
                >
                  <div
                    onClick={() => handleChecked(el.spbfbm, index)}
                    key={index}
                    className={cx(styles.vi, {
                      [styles.checked]: clickIndex === index,
                      [styles.third]: index === 1,
                    })}
                    style={{ width: '100%', height: '100%' }}
                  >
                    <span className={styles.title}>{el.azdd}</span>
                    <div className={cx({ [styles.closed]: !el.spbfbm })}>
                      <CloseOutlined
                        className={styles.videoCloseTwo}
                        onClick={() => handleDel(el, index)}
                      />
                      <Tooltip
                        placement="rightBottom"
                        trigger="click"
                        title={() => deviceInfoModal()}
                      >
                        <span
                          onClick={() => showDeviceInfo(el.spbfbm)}
                          className={styles.deviceInfo}
                        />
                      </Tooltip>
                    </div>
                    <div style={{ width: '100%', height: '100%', backgroundColor: '#000000' }}>
                      <Aliplayer
                        id={el.spbfbm}
                        cameraId={el.spbfbm}
                        selectTime={playMode === 'live' ? [] : selectedTime}
                      />
                    </div>
                  </div>
                </div>
              ))}
          </>
        );
      case 4:
        return (
          <div className={styles.fourVideo} style={{ height: '97%', width: '100%' }}>
            {Array.isArray(selectedCameraKeys) &&
              selectedCameraKeys.map((el, index) => (
                <div
                  onClick={() => handleChecked(el.spbfbm, index)}
                  key={index}
                  className={cx(styles.video, {
                    [styles.checked]: clickIndex === index,
                    [styles.fourVideoTwo]: index === 2,
                    [styles.fourVideoThree]: index === 3,
                  })}
                  style={{ width: '45%', height: '44%' }}
                >
                  <span className={styles.title}>{el.azdd}</span>
                  <div className={cx({ [styles.closed]: !el.spbfbm })}>
                    <CloseOutlined
                      className={styles.videoClose}
                      onClick={() => handleDel(el, index)}
                    />
                    <Tooltip
                      placement="rightBottom"
                      trigger="click"
                      title={() => deviceInfoModal()}
                    >
                      <span
                        onClick={() => showDeviceInfo(el.spbfbm)}
                        className={styles.deviceInfo}
                      />
                    </Tooltip>
                  </div>
                  <Aliplayer
                    id={el.spbfbm}
                    cameraId={el.spbfbm}
                    selectTime={playMode === 'live' ? [] : selectedTime}
                  />
                </div>
              ))}
          </div>
        );
      case 6:
        return (
          <div className={styles.sixVideo}>
            {Array.isArray(selectedCameraKeys) &&
              selectedCameraKeys.map((el, index) => (
                <div
                  onClick={() => handleChecked(el.spbfbm, index)}
                  key={index}
                  className={cx(styles.videoSix, {
                    [styles.checked]: clickIndex === index,
                    [styles.firstOne]: index === 0,
                    [styles.twoVideo]: index === 1,
                    [styles.threeVideo]: index === 2,
                    [styles.sansiwu]: index === 3 || index === 4 || index === 5,
                  })}
                >
                  <span className={styles.title}>{el.azdd}</span>
                  <div className={cx({ [styles.closed]: !el.spbfbm })}>
                    <CloseOutlined
                      className={styles.videoClose}
                      onClick={() => handleDel(el, index)}
                    />
                    <Tooltip
                      placement="rightBottom"
                      trigger="click"
                      title={() => deviceInfoModal()}
                    >
                      <span
                        onClick={() => showDeviceInfo(el.spbfbm)}
                        className={styles.deviceInfo}
                      />
                    </Tooltip>
                  </div>
                  <Aliplayer
                    id={el.spbfbm}
                    cameraId={el.spbfbm}
                    selectTime={playMode === 'live' ? [] : selectedTime}
                  />
                </div>
              ))}
          </div>
        );
      case 'map':
        return (
          <>
            <Map lnglats={lnglats} />
          </>
        );
      default:
        return null;
    }
  };
  return (
    <div className={styles.videoWrap}>
      <div className={styles.camera} style={{ padding: '-3px' }}>
        <div className={styles.search}>
          <Search
            placeholder="请输入地点"
            enterButton="搜索"
            prefix={<SearchOutlined />}
            onSearch={handleChange}
          />
        </div>

        <div className={styles.list}>
          <Tree
            showIcon
            onSelect={handleClick}
            onExpand={handleOnExpand}
            expandedKeys={expandedKeys}
            autoExpandParent={autoExpand}
            treeData={loop(treeList)}
          />
        </div>
      </div>
      <div className={styles.videos}>
        <div className={styles.actions}>
          <div className={styles.inputGroup}>
            <Radio.Group
              value={splitScreen}
              buttonStyle="solid"
              onChange={(e) => {
                const { value } = e.target;
                const a2 = new Array(6).fill(null).map(() => ({
                  azdd: '',
                  azddxzqymc: '',
                  cameraType: '',
                  gdJd: '',
                  gdWd: '',
                  isOnline: '',
                  spbfbm: '',
                  sxtmc: '',
                }));
                const cameraListFill = [];
                cameraListFill.unshift(...a2);
                if (value === 'map') {
                  setClickIndex(0);
                  setSearchValue('');
                  dispatch({
                    type: 'relaTimeProtection/setState',
                    payload: {
                      selectedCameraKeys: [],
                    },
                  });
                } else if (value === 4) {
                  setClickIndex(0);
                  setState({
                    selectedCameraKeys: cameraListFill.slice(0, 4),
                  });
                } else if (value === 2) {
                  setClickIndex(0);
                  setState({
                    selectedCameraKeys: cameraListFill.slice(0, 2),
                  });
                } else if (value === 6) {
                  setClickIndex(0);
                  setState({
                    selectedCameraKeys: cameraListFill.slice(0, 6),
                  });
                } else if (value === 1) {
                  setClickIndex(0);
                  setState({
                    selectedCameraKeys: cameraListFill.slice(0, 1),
                  });
                }
                setSplitScreen(value);
              }}
            >
              <Radio.Button value="map">地图展示</Radio.Button>
              <Radio.Button value={1}>一分屏</Radio.Button>
              <Radio.Button value={2}>二分屏</Radio.Button>
              <Radio.Button value={4}>四分屏</Radio.Button>
              <Radio.Button value={6}>六分屏</Radio.Button>
            </Radio.Group>
          </div>
        </div>
        {renderVideos()}
        <div className={styles.videoHistory}>
          <Radio.Group
            className={cx({ [styles.hide]: splitScreen === 'map' })}
            value={playMode}
            buttonStyle="solid"
            onChange={(e) => setPlayMode(e.target.value)}
          >
            <Radio.Button value="live">实时</Radio.Button>
            <Radio.Button value="history">历史</Radio.Button>
          </Radio.Group>
          <div
            className={cx(styles.rangePicker, {
              [styles.hide]: playMode !== 'history' || splitScreen === 'map',
            })}
          >
            <RangePicker
              placeholder={['起始时间', '结束时间']}
              showTime
              suffixIcon={<ClockCircleOutlined />}
              onChange={(data) => timeChange(data)}
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
          </div>
        </div>
      </div>
    </div>
  );
}
