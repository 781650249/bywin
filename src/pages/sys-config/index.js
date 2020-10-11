import React, { PureComponent } from 'react';
import Link from 'umi/link';
import { Row, Col, Card } from 'antd';
import Breadcrumb from './BreadcrumbItems';

class SysConfig extends PureComponent {
  render() {
    const { location } = this.props;
    const cards = [
      {
        title: '后端配置',
        key: 'backstage',
      },
      {
        title: '定时任务配置',
        key: 'timed-task',
      },
      {
        title: '公安园区权限绑定',
        key: 'permission-bind'
      },
      {
        title: '物业园区权限绑定',
        key: 'estate-bind',
      }
    ];
    return (
      <div
        style={{
          flex: 1,
          padding: 20,
          background: 'transparent',
        }}
      >
        <Breadcrumb location={location} />
        <Row gutter={20}>
          {cards.map(({ title, key }) => (
            <Col span={8} key={key} style={{ marginBottom: 20 }}>
              <Link to={`${location.pathname}/${key}`}>
                <Card>
                  <h2>{title}</h2>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      </div>
    );
  }
}

export default SysConfig;
