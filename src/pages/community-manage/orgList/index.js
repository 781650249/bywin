import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'dva';
import { Collapse, Tree, Button, Modal, Select, Upload, message } from 'antd';
import { CaretRightOutlined, UploadOutlined, FileExcelOutlined } from '@ant-design/icons';
import styles from './index.less';

const { Panel } = Collapse;
const { Option } = Select;

export default function() {
  const dispatch = useDispatch();
  const { communityList } = useSelector(({ global }) => global);
  const { orgTreeList, activeTabKey, checkedKeys } = useSelector(
    ({ communityManage }) => communityManage,
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSource, setSelectedSource] = useState('');
  const [fileList, setFileList] = useState([]);

  const getRecursiveKeys = (node) => {
    const array = [];
    const foo = (data) => {
      data.forEach((item) => {
        if (Array.isArray(item.children) && item.children.length > 0) {
          foo(item.children);
        }
        array.push(item.orgCode);
      });
    };
    foo(node);
    return array;
  };

  useEffect(() => {
    dispatch({
      type: 'communityManage/getOrgTree',
      callback: (data) => {
        if (
          Array.isArray(data) &&
          data.length > 0 &&
          Array.isArray(data[0].children) &&
          data[0].children.length > 0
        ) {
          dispatch({
            type: 'communityManage/setState',
            payload: {
              checkedKeys: getRecursiveKeys(data[0].children),
            },
          });
        }
      },
    });
  }, [dispatch]);

  useEffect(() => {
    dispatch({
      type: 'communityManage/getInfoByTree',
      payload: {
        id: checkedKeys,
      },
    });
  }, [dispatch, checkedKeys]);

  useEffect(() => {
    if (Array.isArray(communityList) && communityList.length > 0) {
      setSelectedSource(communityList[0].communityId);
    }
  }, [communityList]);

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
   * 选择文件
   */
  const props = {
    onRemove: () => {
      setFileList([]);
    },
    beforeUpload: (file) => {
      setFileList([file]);
      return false;
    },
    fileList,
  };

  /**
   * 上传文件
   */
  const onOkUpload = () => {
    const formData = new FormData();
    formData.append('xqbh', selectedSource);
    fileList.forEach((file) => {
      formData.append('multipartFile', file);
    });
    dispatch({
      type: 'communityManage/importCommunityExcel',
      payload: formData,
      callback: (code) => {
        if (code === 'SUCCESS') {
          message.success('上传成功');
          setModalVisible(false);
        } else {
          message.error('上传失败');
        }
      },
    });
  };

  return (
    <div className={styles.leftBar}>
      <Collapse
        bordered={false}
        accordion={false}
        onChange={(keys) =>
          dispatch({
            type: 'communityManage/setState',
            payload: {
              activeTabKey: keys,
            },
          })
        }
        activeKey={activeTabKey}
        expandIconPosition="right"
        expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
      >
        {orgTreeList.map((item) => (
          <Panel header={item.orgName} key={item.orgCode} className={styles.customPanel}>
            <Tree
              className={styles.tree}
              checkable
              selectable={false}
              checkedKeys={checkedKeys}
              onCheck={(keys) =>
                dispatch({
                  type: 'communityManage/setState',
                  payload: {
                    checkedKeys: keys,
                  },
                })
              }
              treeData={getJsonTree(item.children)}
            />
          </Panel>
        ))}
      </Collapse>

      <div className={styles.btnWrap}>
        <Button icon={<UploadOutlined />} type="primary" onClick={() => setModalVisible(true)}>
          导入数据
        </Button>
        <Button
          icon={<FileExcelOutlined />}
          href="http://183.252.15.157:8225/api/excel/CommunityInfo.xlsx"
          type="primary"
          style={{ margin: '8px 0 2px 0' }}
        >
          下载模板
        </Button>
      </div>
      <Modal
        title="导入数据"
        width={436}
        visible={modalVisible}
        onOk={onOkUpload}
        onCancel={() => setModalVisible(false)}
        okText="导入"
      >
        <div className={styles.modalBox}>
          选择小区：
          <Select
            value={selectedSource}
            style={{ width: 302, height: 32 }}
            onSelect={(value) => setSelectedSource(value)}
          >
            {communityList.map((item) => (
              <Option value={item.communityId} key={item.communityId}>
                {item.communityName}
              </Option>
            ))}
          </Select>
        </div>
        <div className={styles.modalBox}>
          上传文件：
          <Upload {...props}>
            <Button type="primary">
              <UploadOutlined /> 选择文件
            </Button>
          </Upload>
        </div>
      </Modal>
    </div>
  );
}
