import React, { PureComponent } from 'react';
import Link from 'umi/link';
import { Breadcrumb } from 'antd';

class BreadcrumbItems extends PureComponent {
  render() {
    const linkTexts = {
      'sys-config': '系统管理',
      'timed-task': '定时任务配置',
      'backstage': '后端配置',
      'permission-bind': '公安园区权限绑定',
      'estate-bind': '物业园区权限绑定',
    };
    const pathSnippets = window.location.pathname.split('/').filter((i) => i);
    const breadcrumbItems = pathSnippets.map((key, index) => {
      if (key === 'view') {
        return null;
      }
      const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
      return (
        <Breadcrumb.Item key={url}>
          <Link to={url}>{linkTexts[key]}</Link>
        </Breadcrumb.Item>
      );
    });
    return (
      <Breadcrumb style={{ marginBottom: 20 }}>{breadcrumbItems}</Breadcrumb>
    );
  }
}

export default BreadcrumbItems;
