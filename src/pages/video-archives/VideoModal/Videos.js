import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'dva';
import { Select, Radio, DatePicker, Pagination, message, Input } from 'antd';
import { DesktopOutlined, CloseOutlined } from '@ant-design/icons';
import cx from 'classnames';
import moment from 'moment';
import Aliplayer from '@/components/Aliplayer';
import styles from './index.less';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Search } = Input;

// function range(start, end) {
//   const result = [];
//   for (let i = start; i < end; i += 1) {
//     result.push(i);
//   }
//   return result;
// }

export default function() {
  const [splitScreen, setSplitScreen] = useState(1);
  const [playMode, setPlayMode] = useState('live');
  const [page, setPage] = useState(1);
  const [cameraFilterList, setCameraFilterList] = useState([]);
  const [cameraTotal, setCameraTotal] = useState(0);
  const [selectedTime, setSelectedTime] = useState([]);
  const pageSize = 20;

  const dispatch = useDispatch();
  const { cameraList, selectedCameraKeys } = useSelector(({ videoModal }) => videoModal);

  const setState = useCallback(
    (params = {}, type = 'videoModal/setState') => {
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
    setCameraFilterList(cameraList);
    setCameraTotal(cameraList.length);
  }, [cameraList]);

  useEffect(() => {
    const selectCamera = cameraList.length > 0 ? cameraList[0].spbfbm : '';
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
  }, [cameraList, setState]);

  const handleClick = (key) => {
    let keys = [];
    if (selectedCameraKeys.includes(key)) {
      keys = selectedCameraKeys.filter((el) => el !== key);
    } else if (splitScreen === 1) {
      keys = [key];
    } else if (selectedCameraKeys.length < splitScreen) {
      keys = [...selectedCameraKeys, key];
    } else {
      message.warning('无法播放更多的视频');
      return;
    }
    setState({
      selectedCameraKeys: keys,
    });
  };
  const timeChange = (date) => {
    const newDate = date || [];
    setSelectedTime(newDate);
  };
  const renderVideos = () => {
    switch (splitScreen) {
      case 1:
        return selectedCameraKeys.map((el) => (
          <div key={el} className={styles.video} style={{ height: '100%' }}>
            <CloseOutlined className={styles.videoClose} onClick={() => handleClick(el)} />
            <Aliplayer id={el} cameraId={el} selectTime={playMode === 'live' ? [] : selectedTime} />
          </div>
        ));
      case 2:
        return (
          <>
            {selectedCameraKeys.map((el) => (
              <div key={el} className={styles.video} style={{ width: '50%', height: '100%' }}>
                <CloseOutlined className={styles.videoClose} onClick={() => handleClick(el)} />
                <Aliplayer
                  id={el}
                  cameraId={el}
                  selectTime={playMode === 'live' ? [] : selectedTime}
                />
              </div>
            ))}
          </>
        );
      case 4:
        return (
          <>
            {selectedCameraKeys.map((el) => (
              <div key={el} className={styles.video} style={{ width: '50%', height: '50%' }}>
                <CloseOutlined className={styles.videoClose} onClick={() => handleClick(el)} />
                <Aliplayer
                  id={el}
                  cameraId={el}
                  selectTime={playMode === 'live' ? [] : selectedTime}
                />
              </div>
            ))}
          </>
        );
      case 6:
        return (
          <>
            {selectedCameraKeys.map((el) => (
              <div key={el} className={styles.video} style={{ width: '33.3333%', height: '50%' }}>
                <CloseOutlined className={styles.videoClose} onClick={() => handleClick(el)} />
                <Aliplayer
                  id={el}
                  cameraId={el}
                  selectTime={playMode === 'live' ? [] : selectedTime}
                />
              </div>
            ))}
          </>
        );
      default:
        return null;
    }
  };
  return (
    <div className={styles.videoWrap}>
      <div className={styles.videos}>
        <div className={styles.actions}>
          <div className={styles.inputGroup}>
            <div className={styles.before}>
              <DesktopOutlined />
            </div>
            <Select
              value={splitScreen}
              style={{ width: 88 }}
              onChange={(value) => {
                if (selectedCameraKeys.length > value) {
                  setState({
                    selectedCameraKeys: selectedCameraKeys.slice(0, value),
                  });
                }
                setSplitScreen(value);
              }}
            >
              <Option value={1}>单屏</Option>
              <Option value={2}>二分屏</Option>
              <Option value={4}>四分屏</Option>
              <Option value={6}>六分屏</Option>
            </Select>
          </div>
          <Radio.Group
            value={playMode}
            buttonStyle="solid"
            onChange={(e) => setPlayMode(e.target.value)}
          >
            <Radio.Button value="live">实时</Radio.Button>
            <Radio.Button value="history">历史</Radio.Button>
          </Radio.Group>
          <div className={cx(styles.rangePicker, { [styles.hide]: playMode !== 'history' })}>
            <RangePicker
              showTime
              onChange={(data) => timeChange(data)}
              disabledDate={(current) => current && current >= moment().endOf('day')}
              // disabledTime={(date) => {
              //   const currentDate = new Date();
              //   const h = currentDate.getHours();
              //   const m = currentDate.getMinutes();
              //   let disabledHours = [];
              //   let disabledMinutes = [];
              //   if (moment.isMoment(date) && date.isSame(moment(), 'day')) {
              //     disabledHours = range(0, h);
              //     disabledMinutes = range(0, m);
              //   }
              //   return {
              //     disabledHours: () => disabledHours,
              //     disabledMinutes: (selectedHour) => (selectedHour > h ? [] : disabledMinutes),
              //   };
              // }}
            />
          </div>
        </div>
        {renderVideos()}
      </div>
      <div className={styles.camera}>
        <div className={styles.header}>摄像头列表</div>
        <div className={styles.search}>
          <Search
            placeholder="请输入关键字搜索"
            enterButton="搜索"
            onSearch={(value) => {
              const filterList = cameraList.filter((item) => item.azdd.includes(value));
              setCameraFilterList(filterList);
              setPage(1);
              setCameraTotal(filterList.length);
            }}
          />
        </div>
        <div className={styles.list}>
          {cameraFilterList.slice((page - 1) * pageSize, page * pageSize).map((item, i) => (
            <div
              className={cx(styles.listItem, {
                [styles.active]: selectedCameraKeys.includes(item.spbfbm),
              })}
              key={i}
              onClick={() => handleClick(item.spbfbm)}
            >
              {/* <div className="ellipsis">名称：{item.spbfbm}</div> */}
              <div className="ellipsis">位置：{item.azdd}</div>
            </div>
          ))}
        </div>
        <div className={styles.footer}>
          <Pagination
            current={page}
            pageSize={pageSize}
            total={cameraTotal}
            size="small"
            showLessItems
            showTotal={(total) => `共 ${total} 个`}
            onChange={(current) => setPage(current)}
          />
        </div>
      </div>
    </div>
  );
}
