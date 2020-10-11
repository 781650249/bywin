import React, { useEffect } from 'react';
import Icon, { CaretDownOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'dva';
import { Select } from 'antd';
import UnitList from './UnitList';
import styles from './index.less';

const { Option } = Select;

const FloorSvg = () => (
  <svg viewBox="0 0 1024 1024" width="1em" height="1em" fill="currentColor">
    <path
      d="M298.656 298.656H384v128H298.656v-128zM469.344 298.656h85.344v128h-85.344v-128zM298.656 469.344H384v128H298.656v-128zM469.344 469.344h85.344v128h-85.344v-128zM298.656 640H384v128H298.656v-128zM469.344 640h85.344v128h-85.344v-128z"
      p-id="1231"
    />
    <path
      d="M896 853.344v-409.6L725.344 358.4V128H128v725.344H42.656v85.344h938.656v-85.344h-85.344z m-682.656 0v-640H640v640H213.344z m512-401.088l85.344 42.656v358.4h-85.344V452.256z"
      p-id="1232"
    />
  </svg>
);

export default function({ match }) {
  const { params } = match;
  const dispatch = useDispatch();
  const { buildingList, personnelCount, selectedBuilding } = useSelector(
    ({ communityDetail }) => communityDetail,
  );

  useEffect(() => {
    if (params && params.id) {
      dispatch({
        type: 'communityDetail/getBuildings',
        payload: {
          xqbh: params.id,
        },
      });
    }
  }, [dispatch, params]);

  useEffect(() => {
    if (selectedBuilding && params.id) {
      dispatch({
        type: 'communityDetail/getPersonnelCount',
        payload: {
          xqbh: params.id,
          ldxxbz: selectedBuilding,
        },
      });
      dispatch({
        type: 'communityDetail/getUnitList',
        payload: {
          xqbh: params.id,
          ldxxbz: selectedBuilding,
        },
      });
    }
  }, [dispatch, selectedBuilding]);

  return (
    <div className={styles.leftBar}>
      <div className={styles.search}>
        <div className={styles.searchTitle}>
          <Icon component={FloorSvg} style={{ fontSize: 18 }} />
          <span style={{ marginTop: -2 }}>楼宇</span>
        </div>
        <div className={styles.searchSelect}>
          <Select
            onChange={(value) => {
              dispatch({
                type: 'communityDetail/setState',
                payload: {
                  selectedBuilding: Number(value),
                }
              });
            }}
            value={selectedBuilding}
            bordered={false}
            suffixIcon={<CaretDownOutlined />}
          >
            {Array.isArray(buildingList) &&
              buildingList.map((item) => (
                <Option value={item.ldxxbz} key={item.ldxxbz}>
                  {item.ldmc}
                </Option>
              ))}
          </Select>
        </div>
      </div>

      <div className={styles.cardWraper}>
        {personnelCount.map((item) => (
          <div className={styles.card} style={{ background: item.color }} key={item.name}>
            <p>{item.count}</p>
            <p>{item.name}</p>
          </div>
        ))}
      </div>

      <UnitList match={match} />

      <div className={styles.legendWrapper}>
        <span className={styles.legendRed}>重点人员</span>
        <span className={styles.legendYellow}>房屋出租</span>
        {/* <span className={styles.legendGreen}>人户一致</span>
        <span className={styles.legendBlue}>人户不一</span> */}
      </div>
    </div>
  );
}
