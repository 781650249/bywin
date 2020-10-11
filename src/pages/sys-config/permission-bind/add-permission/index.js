import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'dva';
import { Tree, Table, Input, Button } from 'antd';
import router from 'umi/router';
import styles from './index.less';

const { Search } = Input;

const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '账号',
    dataIndex: 'username',
    key: 'username',
  },
  {
    title: '所属机构名称',
    dataIndex: 'orgseqName',
    key: 'orgseqName',
  },
  {
    title: '管辖的园区',
    dataIndex: 'communityNames',
    key: 'communityNames',
    render: (text) => <div>{text.join(',')}</div>,
  },
];

export default function() {
  const dispatch = useDispatch();
  const { treeData } = useSelector(({ permissionBind }) => permissionBind);
  const { childObj } = useSelector(({ permissionBind }) => permissionBind);
  const { userList, total, keyword, page } = childObj;
  const [communityKeys, setCommunityKeys] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const getAllUserList = (params) => {
    dispatch({
      type: 'permissionBind/getAllListV2',
      payload: {
        key: keyword,
        page,
        size: 10,
        flag: true,
        role: 'police',
        ...params,
      },
    });
  };

  /**
   * 递归树返回赋值key
   */
  const getJsonTree = (data) => {
    const itemArr = [];
    data.forEach((item) => {
      if (item.children) {
        itemArr.push({
          key: item.orgCode,
          title: item.orgName,
          children: getJsonTree(item.children),
        });
      }
    });
    return itemArr;
  };

  /**
   * 递归返回最深节点的key
   */
  const getChildNode = (data) => {
    const child = [];
    data.forEach((el) => {
      if (el.children.length > 0) {
        getChildNode(el.children);
      } else {
        child.push(el.key);
      }
    });
    return child;
  };

  const setPageState = (params) => {
    dispatch({
      type: 'permissionBind/setState',
      payload: {
        childObj: {
          ...childObj,
          ...params,
        },
      },
    });
  };

  useEffect(() => {
    dispatch({ type: 'permissionBind/getCommunityOrg' });
    getAllUserList();
    return () => {
      setPageState({ userList: [], total: 0, keyword: '', page: 1 });
    };
  }, [dispatch]);

  const add = () => {
    dispatch({
      type: 'permissionBind/authUserCommunity',
      payload: {
        communitys: communityKeys,
        users: selectedRowKeys,
        flag: 2,
        role: 'police',
      },
      callback: () => {
        router.push('/sys-config/permission-bind')
      }
    });
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.leftBar}>
          <Tree
            checkable
            defaultExpandAll
            selectable={false}
            // checkedKeys={checkedKeys}
            onCheck={(_, info) => {
              const { checkedNodes } = info;
              setCommunityKeys(getChildNode(checkedNodes));
            }}
            treeData={getJsonTree(treeData)}
          />
        </div>
        <div className={styles.rightBar}>
          <Search
            placeholder="输入关键字搜索"
            value={keyword}
            onChange={(e) => {
              setPageState({ keyword: e.target.value });
            }}
            onSearch={(value) => {
              setPageState({ page: 1 });
              getAllUserList({ key: value, page: 1 });
            }}
            enterButton
          />
          <Table
            style={{ marginTop: 24, width: '100%' }}
            rowSelection={{
              selectedRowKeys,
              onChange: (_, keys) => setSelectedRowKeys(keys.map((el) => el.id)),
            }}
            pagination={{
              current: page,
              pageSize: 10,
              total,
              onChange: (curr) => {
                setPageState({ page: curr });
                getAllUserList({ page: curr });
              },
            }}
            columns={columns}
            dataSource={userList}
          />
        </div>
      </div>
      <div className={styles.footer}>
        <Button
          style={{ width: 120, marginRight: 24 }}
          type="primary"
          onClick={() => router.goBack()}
        >
          返回
        </Button>
        <Button
          style={{ width: 120 }}
          disabled={selectedRowKeys.length === 0 || communityKeys.length === 0}
          type="primary"
          onClick={add}
        >
          确认
        </Button>
      </div>
    </>
  );
}
