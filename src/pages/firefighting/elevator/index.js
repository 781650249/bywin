import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'dva';
import { Tree, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import cx from 'classnames';
import ListMode from './ListMode';
import MoveMode from './MoveMode';
import BobmBox from './BobmBox';
import styles from './index.less';

// const { Search } = Input;

export default function() {
  const dispatch = useDispatch();
  const [showMode, setShowMode] = useState('moving'); // 展示方式  moving-动态展示  list-列表展示
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [layers, setLayers] = useState([]);  // 几层楼?
  const [bobmBoxInfo, setBobmBoxInfo] = useState({ visible: false, title: '关闭中...' });
  const [playCameraId, setPlayCameraId] = useState(null);
  const elevatorTreeList = useSelector(({ elevator }) => elevator.elevatorTreeList);
  const loading = useSelector((state) => {
    const { effects } = state.loading;
    return effects['elevator/getListOperationInfo'];
  });


  useEffect(() => {
    dispatch({ type: 'elevator/getElevatorTree' });
  }, [dispatch]);

  useEffect(() => {
    if (Array.isArray(elevatorTreeList) && elevatorTreeList.length !== 0) {
      const foo = (data) => {
        if (data[0].disabled) {
          return foo(data[0].children);
        }
        return {key: data[0].key, floorList: data[0].floorList};
      };
      setSelectedKeys([foo(elevatorTreeList).key]);
      setLayers(foo(elevatorTreeList).floorList)
    }
  }, [elevatorTreeList]);

  useEffect(() => {
    const [selectedKey] = selectedKeys;
    if (selectedKey) {
      const [, ldxxbz, elevatorId] = selectedKey.split('-');
      dispatch({
        type: 'elevator/getListOperationInfo',
        payload: {
          elevatorId,
          ldxxbz,
          pageNum: 1,
          pageSize: 20,
        },
      });
    } else {
      dispatch({
        type: 'elevator/setState',
        payload: { elevatorList: [] },
      });
    }
  }, [dispatch, selectedKeys]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.leftBar}>
          <h3>电梯呼叫</h3>
          <div className={styles.treeWrapper}>
            {/* <Search placeholder="请输入内容" onSearch={(value) => console.log(value)} enterButton /> */}
            {Array.isArray(elevatorTreeList) && elevatorTreeList.length !== 0 && (
              <Tree
                selectedKeys={selectedKeys}
                onSelect={(keys, { node }) => {
                  setSelectedKeys(keys.length === 0 ? selectedKeys : keys);
                  setLayers(node.floorList)
                }}
                treeData={elevatorTreeList}
                defaultExpandAll
              />
            )}
          </div>
        </div>

        <div className={styles.rightBar}>
          <Spin spinning={loading} indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}>
            <div className={styles.navWrapper}>
              <div className={styles.navBtn}>
                <div
                  className={cx(
                    styles.navBtnItem,
                    showMode === 'moving' ? styles.navBtnChecked : null,
                  )}
                  onClick={() => setShowMode('moving')}
                >
                  动态展示
                </div>
                <div
                  className={cx(
                    styles.navBtnItem,
                    showMode === 'list' ? styles.navBtnChecked : null,
                  )}
                  onClick={() => setShowMode('list')}
                >
                  电梯列表
                </div>
              </div>
              <div
                className={styles.recordBtn}
                onClick={() => setBobmBoxInfo({ visible: true, title: '预警记录' })}
              >
                预警记录
              </div>
            </div>
            <div className={styles.rightContent}>
              {showMode === 'list' && (
                <ListMode
                  selectedKeys={selectedKeys}
                  bobmBoxInfo={bobmBoxInfo}
                  setBobmBoxInfo={setBobmBoxInfo}
                  setPlayCameraId={setPlayCameraId}
                />
              )}
              {showMode === 'moving' && <MoveMode loading={loading} layers={layers} />}
            </div>
          </Spin>
        </div>
      </div>
      <BobmBox
        bobmBoxInfo={bobmBoxInfo}
        playCameraId={playCameraId}
        closeBobmBox={() => {
          setPlayCameraId(null);
          dispatch({
            type: 'elevator/setState',
            payload: {
              elevatorBasicInfo: {},
            },
          });
          setBobmBoxInfo({ visible: false, title: '关闭中...' });
        }}
      />
    </div>
  );
}
