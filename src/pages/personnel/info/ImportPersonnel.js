import React, { useState } from 'react';
import { Modal, Form, Select, Upload, Button, message } from 'antd';
import { SolutionOutlined, UploadOutlined } from '@ant-design/icons';
import { useSelector } from 'dva';
import { importExcel } from '@/services/personnel/info';
import styles from './index.less';

export default function({ onRefresh = () => {} }) {
  const [visible, setVisible] = useState(false);
  const [areaKey, setAreaKey] = useState('');
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const { communityList } = useSelector((state) => state.global);

  // setVisible(false);
  const handleCancel = () => {
    setVisible(false);
    setFileList([]);
  };

  return (
    <>
      <span className={styles.action} onClick={() => setVisible(true)}>
        <SolutionOutlined />
      </span>
      <Modal
        title="导入人员"
        visible={visible}
        onOk={async () => {
          if (!areaKey) {
            message.warning('请选择园区！')
            return;
          }
          if (fileList.length === 0) {
            message.warning('请选择文件！');
            return;
          }
          setLoading(true);
          const success = await importExcel({ fileList, yqxxbz: areaKey });
          setLoading(false);
          if (success) {
            message.success('导入成功！');
            onRefresh();
            handleCancel();
          }
        }}
        onCancel={handleCancel}
        confirmLoading={loading}
      >
        <Form>
          <Form.Item label="园区" required>
            <Select
              getPopupContainer={(triggerNode) => triggerNode.parentElement}
              onChange={setAreaKey}
            >
              {communityList.map((item) => (
                <Select.Option key={item.xqxxbz}>{item.communityName}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="文件" required>
            <Upload
              fileList={fileList}
              beforeUpload={(file) => {
                setFileList([file]);
                return false;
              }}
              onRemove={() => setFileList([])}
            >
              <Button icon={<UploadOutlined />}>请选择文件</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
