import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'dva';
import Link from 'umi/link';
import { Tree, Table, Input, Button, Space, Modal, Popconfirm } from 'antd';
import Breadcrumb from '../BreadcrumbItems';
import styles from './index.less';

const { Search } = Input;

export default function({ location }) {
  const dispatch = useDispatch();
  const { treeData, parentObj } = useSelector(({ permissionBind }) => permissionBind);
  const { userList, total, keyword, page } = parentObj;
  const [visibleModal, setVisibleModal] = useState(false);
  const [communityKeys, setCommunityKeys] = useState([]);
  const [currentUser, setCurrentUser] = useState([]);
  const [currInfo, setCurrInfo] = useState({
    name: '',
    username: '',
  })

  const getAuthorizedUserList = (params) => {
    dispatch({
      type: 'permissionBind/getAuthorizedListV2',
      payload: {
        key: keyword,
        page,
        size: 10,
        flag: false,
        role: 'police',
        ...params,
      },
    });
  };

  useEffect(() => {
    dispatch({ type: 'permissionBind/getCommunityOrg' });
    getAuthorizedUserList();
  }, [dispatch]);

  useEffect(() => {
    if(!visibleModal) {
      setCurrInfo({
        name: '',
        username: ''
      })
    }
  }, [visibleModal])

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
        parentObj: {
          ...parentObj,
          ...params,
        },
      },
    });
  };

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
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (text) => (
        <Space size="middle">
          <Button
            type="link"
            onClick={() => {
              setVisibleModal(true);
              setCurrentUser([text.id]);
              setCurrInfo({
                name: text.name,
                username: text.username
              })
              setCommunityKeys(text.communityKeys);
            }}
          >
            编辑权限
          </Button>
          <Popconfirm
            title="确认清除用户的所有权限？"
            onConfirm={() => {
              dispatch({
                type: 'permissionBind/authUserCommunity',
                payload: {
                  communitys: [],
                  users: [text.id],
                  flag: 1,
                  role: 'police',
                },
                callback: () => {
                  setPageState({ page: 1 });
                  getAuthorizedUserList({ page: 1 });
                },
              });
            }}
          >
            <Button type="link">清除权限</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <Breadcrumb location={location} />
      <Search
        style={{ width: 'calc(100% - 800px)' }}
        placeholder="输入关键字搜索"
        value={keyword}
        onChange={(e) => {
          setPageState({ keyword: e.target.value });
        }}
        onSearch={(value) => {
          setPageState({ page: 1 });
          getAuthorizedUserList({ key: value, page: 1 });
        }}
        enterButton
      />
      <Link to="/sys-config/permission-bind/add-permission">
        <Button style={{ width: 120 }} type="primary">
          添加
        </Button>
      </Link>
      <Table
        style={{ marginTop: 24, width: '100%' }}
        pagination={{
          current: page,
          pageSize: 10,
          total,
          onChange: (curr) => {
            setPageState({ page: curr });
            getAuthorizedUserList({ page: curr });
          },
        }}
        columns={columns}
        dataSource={userList}
      />
      <Modal
        title="编辑权限"
        visible={visibleModal}
        onOk={() => {
          dispatch({
            type: 'permissionBind/authUserCommunity',
            payload: {
              communitys: communityKeys,
              users: currentUser,
              flag: 1,
              role: 'police',
            },
            callback: () => {
              setVisibleModal(false);
              setPageState({ page: 1 });
              getAuthorizedUserList({ page: 1 });
            },
          });
        }}
        onCancel={() => setVisibleModal(false)}
      >
        <>
          <p>姓名: {currInfo.name}</p>
          <p>账号: {currInfo.username}</p>
          <Tree
            checkable
            defaultExpandAll
            selectable={false}
            checkedKeys={communityKeys}
            onCheck={(_, info) => {
              const { checkedNodes } = info;
              setCommunityKeys(getChildNode(checkedNodes));
            }}
            treeData={getJsonTree(treeData)}
          />
        </>
      </Modal>
    </div>
  );
}
