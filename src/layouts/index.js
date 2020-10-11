import React, { useState, useEffect } from 'react';
import router from 'umi/router';
import { useDispatch, useSelector } from 'dva';
import cx from 'classnames';
import { ConfigProvider, Avatar, Menu, Dropdown, Modal } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { CSSTransition } from 'react-transition-group';
import zhCN from 'antd/es/locale/zh_CN';
import {
  logo,
  situation,
  videoArchives,
  eventHubs,
  // personManage,
  discover,
  searching,
  patrol,
  communityManage,
  airConditioningControl,
  elevator,
  personnel,
  personnelInfo,
  personnelAccessControl,
  ssjk,
  aroundPrevention,
  // fireLinkage, // 消防联动
  carManager,
  carInfo,
  carWarn,
  carControl,
  heatMap,
  noticeManager,
  repairManager,
} from '@/assets/layouts';
import ErrorBoundary from '@/components/ErrorBoundary';
import { session } from '@/utils/storage';
import { SSO } from '@/config';
import styles from './index.less';

const { SubMenu } = Menu;

const menus = [
  {
    key: '/situation',
    text: '小区态势',
    icon: situation,
  },
  // {
  //   key: '/smart-search',
  //   text: '智能搜索',
  //   icon: smartSearch,
  // },

  // {
  //   key: '/video-archives',
  //   text: '档案信息',
  //   icon: videoArchives,
  // },

  // {
  //   key: '/person-manage',
  //   text: '动向管控',
  //   icon: personManage,
  // },

  // {
  //   key: '/community-manage',
  //   text: '社区画像',
  //   icon: communityManage,
  // },
  {
    key: '/security',
    text: '综合安防',
    icon: situation,
    children: [
      {
        key: '/relaTimeProtection',
        text: '实时监控',
        icon: ssjk,
      },
      {
        key: '/patrol',
        text: '视频巡逻',
        icon: patrol,
      },
      {
        key: '/around-prevention',
        text: '周边防范',
        icon: aroundPrevention,
      },
      {
        key: '/pop-surveillance',
        text: '人员布防',
        icon: elevator,
      },
      {
        key: '/car-surveillance',
        text: '车辆布防',
        icon: elevator,
      },
      {
        key: '/video-archives',
        text: '人口分析',
        icon: videoArchives,
      },
      {
        key: '/event-hubs',
        text: '事件中心',
        icon: eventHubs,
      },
    ],
  },
  {
    key: '/efficiency',
    text: '能效管理',
    icon: situation,
    children: [
      {
        key: '/energy-efficiency-monitor',
        text: '能效监控',
        icon: ssjk,
      },
      {
        key: '/lighting-control',
        text: '照明控制',
        icon: airConditioningControl,
      },
      {
        key: '/air-conditioning-control',
        text: '空调控制',
        icon: airConditioningControl,
      },
    ],
  },
  {
    key: '/firefighting',
    text: '智慧消防',
    icon: situation,
    children: [
      {
        key: '/elevator',
        text: '电梯呼叫',
        icon: elevator,
      },
    ],
  },
  {
    key: '/personnel',
    text: '人员管理',
    icon: personnel,
    children: [
      {
        key: '/personnel/info',
        text: '人员信息',
        icon: personnelInfo,
      },
      {
        key: '/personnel/access-control',
        text: '通行控制',
        icon: personnelAccessControl,
      },
      {
        key: '/personnel/heat-map',
        text: '人员热力',
        icon: heatMap,
      },
      {
        key: '/discover',
        text: '组织发现',
        icon: discover,
      },
      {
        key: '/searching-person',
        text: '轨迹追踪',
        icon: searching,
      },
    ],
  },
  {
    key: '/car-manager',
    text: '车辆管理',
    icon: carManager,
    children: [
      {
        key: '/car-manager/info',
        text: '车辆信息',
        icon: carInfo,
      },
      {
        key: '/car-manager/warn',
        text: '违停告警',
        icon: carWarn,
      },
      {
        key: '/car-manager/control',
        text: '通行控制',
        icon: carControl,
      },
      {
        key: '/searching-vehicle',
        text: '轨迹追踪',
        icon: searching,
      },
    ],
  },
  {
    key: '/realty-manager',
    text: '运营中心',
    icon: situation,
    children: [
      {
        key: '/realty-manager/notice',
        text: '物业公告',
        icon: noticeManager,
      },
      {
        key: '/realty-manager/repair',
        text: '报修管理',
        icon: repairManager,
        // icon: carControl,
      },
    ],
  },
  {
    key: '/community-manage',
    text: '社区画像',
    icon: communityManage,
  },
];

const { isSSO, passwordAddress } = SSO;
const { confirm } = Modal;

function BasicLayout(props) {
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useDispatch();
  const { loginStatus, username } = useSelector(({ auth }) => auth);
  const { location = {} } = props;
  const { pathname, query } = location;

  useEffect(() => {
    // console.log(loginStatus)
    if (loginStatus) {
      dispatch({ type: 'global/getCommunityInfo' });
      dispatch({ type: 'global/getCommunityList' });
      dispatch({ type: 'global/getCameraList' });
    }
  }, [dispatch, loginStatus]);

  useEffect(() => {
    if (isSSO) {
      let params = {};
      if (query.ticket) {
        params = {
          ticket: query.ticket,
        };
      }
      dispatch({
        type: 'auth/checkLogin',
        payload: {
          ...params,
        },
      });
    } else {
      dispatch({
        type: 'auth/setState',
        payload: {
          loginStatus: !!session.get('token'),
        },
      });
    }
  }, [dispatch, query.ticket, loginStatus]);

  if (isSSO && !loginStatus) {
    return null;
  }

  /**
   * 菜单点击事件
   * @param {String} path 要跳转的地址
   */
  const handleMenuClick = ({ key }) => {
    router.push(key);
  };
  if (['/login', '/home', '/situation'].includes(pathname)) return props.children;

  const [selectedKey] = pathname.split('/').filter((el) => el);
  return (
    <ConfigProvider locale={zhCN}>
      <div className={styles.normal}>
        <div
          className={cx(styles.sider, {
            [styles.siderCollapsed]: collapsed,
          })}
          id="sider"
        >
          <div className={styles.logo}>
            <img src={logo} alt="" />
            <CSSTransition in={!collapsed} timeout={300} classNames="fade">
              <span>智慧小区</span>
            </CSSTransition>
          </div>
          <div className={styles.trigger} onClick={() => setCollapsed(!collapsed)} />
          <div className={styles.menu}>
            <Menu
              mode="inline"
              inlineCollapsed={collapsed}
              defaultOpenKeys={[`/${selectedKey}`]}
              selectedKeys={[`/${selectedKey}`, pathname]}
              onSelect={handleMenuClick}
            >
              {menus.map((item) => {
                const { key, text, children } = item;
                if (Array.isArray(children)) {
                  return (
                    <SubMenu
                      key={key}
                      title={text}
                      icon={
                        <span className={cx('anticon', styles.icon)}>
                          <img src={item.icon} alt="" />
                        </span>
                      }
                    >
                      {children.map((el) => (
                        <Menu.Item
                          icon={
                            <span
                              className={cx('anticon', styles.icon)}
                              style={{ verticalAlign: 'middle' }}
                            >
                              {el.icon ? <img src={el.icon} alt="" /> : null}
                            </span>
                          }
                          key={el.key}
                        >
                          {el.text}
                        </Menu.Item>
                      ))}
                    </SubMenu>
                  );
                }
                return (
                  <Menu.Item
                    key={key}
                    icon={
                      <span className={cx('anticon', styles.icon)}>
                        <img src={item.icon} alt="" />
                      </span>
                    }
                  >
                    {text}
                  </Menu.Item>
                );
              })}
            </Menu>
            {/* {menus.map((item) => {
              const isActive = new RegExp(`^${item.key}`).test(pathname);
              return (
                <div
                  key={item.key}
                  className={cx(styles.menuItem, {
                    [styles.active]: isActive,
                  })}
                  onClick={() => handleMenuClick(item.key)}
                >
                  <Tooltip placement="right" title={item.text} trigger={collapsed ? 'hover' : ''}>
                    <div className={styles.icon}>
                      <img src={item.icon} alt="" />
                    </div>
                  </Tooltip>
                  <CSSTransition in={!collapsed} classNames="fade" timeout={300}>
                    <div className={styles.text}>{item.text}</div>
                  </CSSTransition>
                </div>
              );
            })} */}
          </div>
          <div className={styles.user}>
            <Dropdown
              overlay={
                <Menu
                  onClick={({ key }) => {
                    if (key === 'logout') {
                      confirm({
                        title: '退出',
                        content: '您确定要退出系统吗？',
                        okText: '确定',
                        cancelText: '取消',
                        onOk() {
                          dispatch({
                            type: 'auth/logout',
                          });
                        },
                      });
                    }
                    if (key === 'password') {
                      // localStorage.removeItem('token');
                      window.location.href = passwordAddress;
                    }
                  }}
                >
                  {isSSO && (
                    <Menu.Item key="password">
                      <a target="_blank" rel="noopener noreferrer">
                        修改密码
                      </a>
                    </Menu.Item>
                  )}
                  <Menu.Item key="logout">
                    <a target="_blank" rel="noopener noreferrer">
                      退出登录
                    </a>
                  </Menu.Item>
                </Menu>
              }
            >
              <div className={styles.username}>
                <div>
                  <Avatar size="large" icon={<UserOutlined />} />
                </div>
                {username}
              </div>
            </Dropdown>
          </div>
        </div>

        <div
          className={styles.container}
          style={{ padding: ['/situation', '/searching'].includes(pathname) ? 0 : 12 }}
          id="body"
        >
          <div className={styles.content}>
            <ErrorBoundary>{props.children}</ErrorBoundary>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
}

export default BasicLayout;
