import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'dva';
import { Spin, Row, Col, Button, Modal, Pagination } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import cx from 'classnames';
import { Card } from '@/components';
import styles from './index.less';
import FormInDrawer from './FormInDrawer';

const { confirm } = Modal;

export default function({ history, location }) {
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [list, setList] = useState([]);
  const [checkedLabels, setCheckedlabels] = useState([]);
  const dispatch = useDispatch();
  const pageSize = 20;

  const { currentKey, tagList } = useSelector((state) => state.personManage);
  const keyPerson = useSelector((state) => state.keyPerson, shallowEqual);
  const careTarget = useSelector((state) => state.careTarget, shallowEqual);
  const loading = useSelector(
    (state) =>
      state.loading.effects['keyPerson/getList'] || state.loading.effects['careTarget/getList'],
  );

  useEffect(() => {
    dispatch({
      type: 'personManage/getCommunityList',
    });

    return () => {
      dispatch({ type: 'personManage/clear' });
      dispatch({ type: 'keyPerson/clear' });
      dispatch({ type: 'careTarget/clear' });
    };
  }, [dispatch]);

  useEffect(() => {
    const { current } = location.query;
    if (current) {
      dispatch({
        type: 'personManage/setState',
        payload: {
          currentKey: current,
        },
      });
    }
  }, [dispatch, location.query]);

  /**
   * 重点人员和关怀对象切换时请求对应规则和标签
   */
  useEffect(() => {
    dispatch({ type: 'personManage/getWarningRule' });
    dispatch({ type: 'personManage/getTagList' });
  }, [dispatch, currentKey]);

  useEffect(() => {
    switch (currentKey) {
      case 'keyPerson':
        setPage(keyPerson.page);
        setTotal(keyPerson.total);
        setList([...keyPerson.list]);
        break;
      case 'careTarget':
        setPage(careTarget.page);
        setTotal(careTarget.total);
        setList([...careTarget.list]);
        break;
      default:
        break;
    }
  }, [currentKey, keyPerson, careTarget]);

  useEffect(() => {
    dispatch({
      type: 'keyPerson/getList',
      payload: {
        page,
        size: pageSize,
        personType: checkedLabels,
      },
    });
    dispatch({
      type: 'careTarget/getList',
      payload: {
        page,
        size: pageSize,
        personType: checkedLabels,
      },
    });
  }, [dispatch, page, pageSize, checkedLabels]);

  /**
   * 重点人员和关怀对象切换
   * @param {Event} e
   */
  const handleTabClick = (e) => {
    setCheckedlabels([]);
    const key = e.target.getAttribute('data-key');
    history.push(`${location.pathname}?current=${key}`);
  };

  /**
   * 新增按钮 点击右侧弹出表单窗口
   */
  const handleAddClick = () => {
    dispatch({
      type: 'personManage/setState',
      payload: {
        visible: true,
      },
    });
  };

  /**
   * 人员删除
   * @param {Number || String} id  人员id
   */
  const handleDelete = (id) => {
    confirm({
      title: '是否删除当前人员?',
      icon: <ExclamationCircleOutlined />,
      okText: '是',
      cancelText: '否',
      onOk() {
        dispatch({
          type: `${currentKey}/delete`,
          payload: { id },
        }).then(() => {
          dispatch({
            type: `${currentKey}/getList`,
            payload: {
              page,
              size: pageSize,
            },
          });
        });
      },
    });
  };

  /**
   * 分页点击事件
   * @param { Number } current
   */
  const handlePageChange = (current) => {
    dispatch({
      type: `${currentKey}/setState`,
      payload: { page: current },
    });
  };
  const linkType = currentKey === 'keyPerson' ? 'keyPerson' : 'caringPerson';
  return (
    <Spin spinning={loading}>
      <div className={styles.wrapper}>
        <div className={styles.main}>
          <div className={styles.tabsBar}>
            <div>
              <span
                className={cx({ [styles.active]: currentKey === 'keyPerson' })}
                onClick={handleTabClick}
                data-key="keyPerson"
              >
                重点人员
              </span>
            </div>
            <div>
              <span
                className={cx({ [styles.active]: currentKey === 'careTarget' })}
                onClick={handleTabClick}
                data-key="careTarget"
              >
                关怀对象
              </span>
            </div>
          </div>
          <div className={styles.list}>
            <FormInDrawer />
            <Row className={styles.header}>
              <Col span={20}>
                <div className={styles.labelsWrap}>
                  {tagList.map((item) => (
                    <div
                      className={cx(
                        styles.label,
                        checkedLabels.includes(item.key) ? styles.checkedLabel : null,
                      )}
                      key={item.key}
                      onClick={() => {
                        setCheckedlabels(
                          checkedLabels.includes(item.key)
                            ? checkedLabels.filter((i) => i !== item.key)
                            : [...checkedLabels, item.key],
                        );
                      }}
                    >
                      {item.text}
                    </div>
                  ))}
                  {/* <span
                  className={cx({ [styles.active]: currentKey === 'keyPerson' })}
                  onClick={handleTabClick}
                  data-key="keyPerson"
                >
                  重点人员
                </span>
                <Divider type="vertical" />
                <span
                  className={cx({ [styles.active]: currentKey === 'careTarget' })}
                  onClick={handleTabClick}
                  data-key="careTarget"
                >
                  关怀对象
                </span> */}
                </div>
              </Col>
              <Col span={4} className="text-right">
                <Button onClick={handleAddClick}>新增</Button>
              </Col>
            </Row>
            <div className={styles.content}>
              {list.slice((page - 1) * pageSize, page * pageSize).map((item) => (
                <Card
                  key={item.id}
                  closable
                  onClose={() => handleDelete(item.id)}
                  className="mr-16 mb-16"
                  avatar={item.imageUrl}
                  link={`/person-manage/${item.id}?serviceType=${linkType}`}
                  title={item.name}
                  describe={item.cardid}
                  tags={item.labels.slice(0, 1)}
                />
              ))}
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="mr-16"
                  style={{
                    flex: 1,
                    minWidth: 280,
                    height: 0,
                    padding: '0 10px',
                    visibility: 'hidden',
                  }}
                />
              ))}
            </div>
            <div className={styles.footer}>
              <Pagination
                current={page}
                pageSize={pageSize}
                total={total}
                onChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </div>
    </Spin>
  );
}
