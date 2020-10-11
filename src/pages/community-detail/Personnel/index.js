import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'dva';
import { Input, Tabs, Avatar, Descriptions, Button, Popconfirm } from 'antd';
import { UserOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import cx from 'classnames';
import AddModal from './AddModal';
import HourseInfo from './HourseInfo';
import UnitInfo from './UnitInfo'
import styles from './index.less';

const { Search } = Input;
const { TabPane } = Tabs;

const typeList = [
  { title: '全部', key: '0' },
  { title: '常住人口', key: '1' },
  { title: '暂住人口', key: '2' },
  { title: '重点人口', key: '3' },
];

export default function({ match }) {
  const dispatch = useDispatch();
  const { params } = match;
  const { personnelInfoList, selectedBuilding, unitKey, houseKey, fwxxbz, xqxxbz, hourseInfoList = {}, unitInfoList = {} } = useSelector(
    ({ communityDetail }) => communityDetail,
  );
  const [keyword, setKeyword] = useState('');
  const [peopleType, setPeopleType] = useState('0');
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editPersonBz, setEditPersonBz] = useState('');
  const [dataType, setDataType] = useState('0');
  const [isHouseInfo, setIsHouseInfo] = useState(false);
  const [isUnitInfo, setIsUnitInfoInfo] = useState(false);

  useEffect(() =>{
    if(Object.keys(hourseInfoList).length !== 0) {
      setIsHouseInfo(true)
    }
  }, [hourseInfoList])

  useEffect(() => {
    if(Object.keys(unitInfoList).length !== 0) {
      setIsUnitInfoInfo(true)
    }
  }, [unitInfoList])

  useEffect(() => {
    if (selectedBuilding && houseKey) {
      setKeyword('');
      setPeopleType('0');
      setDataType('0')
    }
  }, [selectedBuilding, houseKey]);

  const getPersonnelInfo = (values) => {
    dispatch({
      type: 'communityDetail/getPersonnelInfoByHouse',
      payload: {
        xqbh: params.id,
        ldxxbz: selectedBuilding,
        dyxxbz: unitKey,
        fwbh: houseKey,
        queryKey: keyword,
        rylx: 0,
        ...values,
      },
    });
  };

  /**
   * 判断迁入迁出
   */
  const getActionType = (isQuit) => {
    switch (isQuit) {
      case '0':
        return { name: '迁入', color: '#F46464' };
      case '1':
        return { name: '迁出', color: '#4751F1' };
      case '2':
        return { name: '未知', color: '#9D9D9D' };
      default:
        return { name: '未知', color: '#9D9D9D' };
    }
  };

  return (
    <div className={styles.container}>
      <AddModal
        editPersonBz={editPersonBz}
        drawerVisible={drawerVisible}
        getPersonnelInfo={getPersonnelInfo}
        onClose={() => setDrawerVisible(false)}
      />
      <div className={styles.header}>
        <span
          className={cx(styles.defaultSpan, dataType === '0' ? styles.checkedSpan : null)}
          onClick={() => setDataType('0')}
        >
          人员信息
        </span>
        {isHouseInfo && <span
          className={cx(styles.defaultSpan, dataType === '1' ? styles.checkedSpan : null)}
          onClick={() => setDataType('1')}
        >
          房屋信息
        </span>}
        {isUnitInfo && <span
          className={cx(styles.defaultSpan, dataType === '2' ? styles.checkedSpan : null)}
          onClick={() => setDataType('2')}
        >
          单位信息
        </span>}
      </div>
      <div style={{ display: dataType === '1' ? null : 'none', padding: 6 }}>
        <HourseInfo />
      </div>
      <div style={{ display: dataType === '2' ? null : 'none', padding: 6 }}>
        <UnitInfo />
      </div>
      <Tabs
        // type="card"
        style={{ display: dataType === '0' ? null : 'none', padding: 6 }}
        activeKey={peopleType}
        onChange={(activeKey) => {
          setPeopleType(activeKey);
          getPersonnelInfo({ rylx: Number(activeKey) });
        }}
        className={styles.containerTab}
        tabBarExtraContent={
          <Search
            style={{ width: 316 }}
            placeholder="姓名/身份证"
            enterButton="搜索"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onSearch={() => {
              setPeopleType('0');
              getPersonnelInfo();
            }}
          />
        }
      >
        {typeList.map(({ title, key }) => (
          <TabPane tab={title} key={key}>
            <div style={{ textAlign: 'right' }}>
              <Button
                type="primary"
                ghost
                icon={<PlusOutlined />}
                onClick={() => setDrawerVisible(true)}
              >
                添 加
              </Button>
            </div>
            {Array.isArray(personnelInfoList) &&
              personnelInfoList.map((item, index) => (
                <div className={styles.columnWrap} key={index}>
                  <div
                    className={styles.mark}
                    style={{ background: getActionType(item.isQuit).color }}
                  >
                    {getActionType(item.isQuit).name}
                  </div>
                  <div className={styles.edit}>
                    <Button
                      className={styles.editBtn}
                      type="link"
                      icon={<EditOutlined />}
                      onClick={() => {
                        setEditPersonBz(item.ryxxbz);
                        setDrawerVisible(true);
                        dispatch({
                          type: 'communityDetail/getPersonnelById',
                          payload: {
                            xqbh: params.id,
                            fwbh: houseKey,
                            ldxxbz: selectedBuilding,
                            dyxxbz: unitKey,
                            ryxxbz: item.ryxxbz,
                          },
                        });
                      }}
                    >
                      编辑
                    </Button>
                    <Popconfirm
                      title="确定删除该人员信息?"
                      onConfirm={() => {
                        dispatch({
                          type: 'communityDetail/deletePersonnelInfo',
                          payload: {
                            xqxxbz,
                            fwxxbz,
                            ryxxbz: item.ryxxbz,
                          },
                          callback: () => {
                            getPersonnelInfo();
                          },
                        });
                      }}
                    >
                      <Button className={styles.editBtn} type="link" icon={<DeleteOutlined />}>
                        删除
                      </Button>
                    </Popconfirm>
                  </div>
                  <div className={styles.rightContent}>
                    <Avatar
                      src={item.txurl || ''}
                      shape="square"
                      size={118}
                      icon={<UserOutlined />}
                    />
                  </div>
                  <Descriptions>
                    <Descriptions.Item>
                      <span className={styles.nameBox}>{item.name}</span>
                    </Descriptions.Item>
                    <Descriptions.Item label="身份证">{item.idCar}</Descriptions.Item>
                    <Descriptions.Item label="手机号">{item.phone}</Descriptions.Item>
                    <Descriptions.Item label="出生日期">
                      {item.birth ? item.birth.split(' ')[0] : ''}
                    </Descriptions.Item>
                    <Descriptions.Item label="住址">{item.address}</Descriptions.Item>
                    <Descriptions.Item label="籍贯">{item.nativePlace}</Descriptions.Item>
                    <Descriptions.Item label="文化程度">{item.education}</Descriptions.Item>
                    <Descriptions.Item label="关系人">{item.relation}</Descriptions.Item>
                    <Descriptions.Item />
                    <Descriptions.Item label="标签:">
                      {item.customizeLabel &&
                        item.customizeLabel.split(',').map(
                          (el, sub) =>
                            el !== '' && (
                              <div
                                key={sub}
                                className={cx('f-tag', 'mr-8', 'f-tag-primary', styles.blueTags)}
                              >
                                {el}
                              </div>
                            ),
                        )}
                      {item.warningLabel &&
                        item.warningLabel.split(',').map(
                          (el, sub) =>
                            el !== '' && (
                              <div
                                key={sub}
                                className={cx('f-tag', 'mr-8', 'f-tag-primary', styles.redTags)}
                              >
                                {el}
                              </div>
                            ),
                        )}
                      {item.labelName &&
                        item.labelName.split(',').map(
                          (el, sub) =>
                            el !== '' && (
                              <div
                                key={sub}
                                className={cx(
                                  'f-tag',
                                  'mr-8',
                                  'f-tag-primary',
                                  el === '常住' ? styles.greenTags : styles.yellowTags,
                                )}
                              >
                                {el}
                              </div>
                            ),
                        )}
                    </Descriptions.Item>
                  </Descriptions>
                </div>
              ))}
          </TabPane>
        ))}
      </Tabs>
    </div>
  );
}
