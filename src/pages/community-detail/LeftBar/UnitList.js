import React, { useEffect, useState, useRef } from 'react';
import { LeftOutlined, RightOutlined, HomeFilled } from '@ant-design/icons';
import { useDispatch, useSelector } from 'dva';
import cx from 'classnames';
import styles from './index.less';

export default function({ match }) {
  const dispatch = useDispatch();
  const { unitList, selectedBuilding, unitKey, houseKey, fwxxbz, xqxxbz } = useSelector(
    ({ communityDetail }) => communityDetail,
  );
  const unitRef = useRef(null);
  const [timer, setTimer] = useState(false);

  const getPersonnelInfo = (params) => {
    dispatch({
      type: 'communityDetail/getPersonnelInfoByHouse',
      payload: {
        xqbh: match.params.id,
        ldxxbz: selectedBuilding,
        dyxxbz: unitKey,
        fwbh: houseKey,
        queryKey: '',
        rylx: 0,
        ...params,
      },
    });
  };

  useEffect(() => {
    if(houseKey) {
      getPersonnelInfo({ fwbh: houseKey });
    }
  }, [houseKey]);

  useEffect(() => {
    if(!fwxxbz) return;
    dispatch({
      type: 'communityDetail/getHouseInfo',
      payload: {
        fwxxbz
      }
    })
    dispatch({
      type: 'communityDetail/getCompanyList',
      payload: {
        xqxxbz,
        fwxxbz
      }
    })
  }, [dispatch, fwxxbz, xqxxbz])

  /**
   * 上一页
   */
  const handlePrevClick = () => {
    if (timer) return;
    setTimer(true);
    const { current } = unitRef;
    const { scrollLeft } = current;
    const range = 274 + 32;
    let nextScrollLeft = scrollLeft;

    if (nextScrollLeft <= 0) {
      nextScrollLeft = 0;
    } else {
      nextScrollLeft = scrollLeft - range;
    }
    current.scrollLeft = nextScrollLeft;
    setTimeout(() => {
      setTimer(false);
    }, 450);
  };

  /**
   * 下一页
   */
  const handleNextClick = () => {
    if (timer) return;
    setTimer(true);
    const { current } = unitRef;
    const { scrollWidth, scrollLeft, offsetWidth } = current;
    const maxScrollLeft = scrollWidth - offsetWidth;
    const range = 274 + 32;
    let nextScrollLeft = scrollLeft;
    if (scrollLeft + range >= maxScrollLeft - 1) {
      nextScrollLeft = maxScrollLeft;
    } else {
      nextScrollLeft = scrollLeft + range;
    }
    current.scrollLeft = nextScrollLeft;
    setTimeout(() => {
      setTimer(false);
    }, 450);
  };

  return (
    <div className={styles.unit}>
      <div className={styles.unitNav} ref={unitRef}>
        {Array.isArray(unitList) &&
          unitList.map((item) => (
            <div
              className={cx(
                styles.unitNavTab,
                unitKey === item.dyxxbz ? styles.unitNavCheckedTab : null,
              )}
              key={item.dyxxbz}
              onClick={() => {
                dispatch({
                  type: 'communityDetail/setState',
                  payload: {
                    unitKey: item.dyxxbz,
                  },
                });
              }}
            >
              {item.name}
            </div>
          ))}
      </div>
      <div className={styles.unitArrow}>
        <div onClick={handlePrevClick}>
          <LeftOutlined />
        </div>
        <div onClick={handleNextClick}>
          <RightOutlined />
        </div>
      </div>

      <div className={styles.unitContent}>
        {unitKey &&
          Array.isArray(unitList) &&
          unitList.filter((item) => item.dyxxbz === unitKey).length > 0 &&
          unitList
            .filter((item) => item.dyxxbz === unitKey)[0]
            .floorList.map((item) => (
              <div className={styles.floorCard} key={item.lch}>
                <div className={styles.floorTitle}>
                  <span>{item.lch}F</span>
                  <HomeFilled style={{ fontSize: 10 }} />
                </div>
                <div className={styles.roomList}>
                  {Array.isArray(item.houseList) &&
                    item.houseList.map((foo) => (
                      <div
                        className={houseKey === foo.fwbh ? styles.checkedCol : styles.col}
                        key={foo.fwbh}
                        onClick={() => {
                          dispatch({
                            type: 'communityDetail/setState',
                            payload: {
                              houseKey: foo.fwbh,
                              fwxxbz: foo.fwxxbz,
                            },
                          });
                        }}
                      >
                        {foo.fwbh}
                      </div>
                    ))}
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}
