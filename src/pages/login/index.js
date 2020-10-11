import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Row, Col } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import logo from '@/assets/login/logo.jpg';
import styles from './index.less';

const layout = {
  wrapperCol: { offset: 4, span: 16 },
};

function Login(props) {
  const { dispatch } = props;
  useEffect(() => {});
  const handleFinish = (values) => {
    dispatch({
      type: 'auth/getToken',
      payload: {
        role: 'police',
        ...values,
      },
    });
  };
  return (
    <div className={styles.wrapper}>
      <div
        className={styles.content}
      />
      <div style={{ float: 'right', width: 380, height: '100vh', backgroundColor: '#fff' }}>
        <div style={{ marginBottom: 40 }}>
          <img src={logo} alt="" style={{ width: '100%' }} />
        </div>
        <Form {...layout} name="basic" initialValues={{ remember: true }} onFinish={handleFinish}>
          <Form.Item {...layout}>
            <h1 className={styles.title}>登录</h1>
          </Form.Item>
          <Form.Item name="username" rules={[{ required: true, message: '请输入账号！' }]}>
            <Input placeholder="请输入账号" prefix={<UserOutlined />} size="large" />
          </Form.Item>

          <Form.Item name="password" rules={[{ required: true, message: '请输入密码！' }]}>
            <Input.Password placeholder="请输入密码" prefix={<LockOutlined />} size="large" />
          </Form.Item>

          <Form.Item {...layout}>
            <Row gutter={24}>
              <Col span={12}>
                <Button type="primary" htmlType="submit" block size="large">
                  登录
                </Button>
              </Col>
              <Col span={12}>
                <Button type="primary" ghost block size="large">
                  PKI登录
                </Button>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default connect()(Login);
