import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'dva';
import { Drawer, Form, Input, Button, message, Radio, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import cx from 'classnames';
import { ImageUpload } from '@/components/ImageUpload';
import styles from './index.less';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};

const { Search } = Input;
const { Option } = Select;
const educationLevelList = [
  '博士',
  '硕士',
  '本科',
  '大专',
  '中专',
  '高中',
  '初中',
  '小学',
  '文盲',
  '半文盲',
];

export default function(props) {
  const {
    editPersonBz = '',
    drawerVisible = false,
    onClose = () => {},
    getPersonnelInfo = () => {},
  } = props;
  const { fwxxbz, xqxxbz, currentPersonInfo } = useSelector(
    ({ communityDetail }) => communityDetail,
  );

  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [actionType, setActionType] = useState('0');
  const [peopleTags, setPeopleTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [addTags, setAddTags] = useState(false);
  // const [fileList, setFileList] = useState([]);

  useEffect(() => {
    const { name, customizeLabel, txurl } = currentPersonInfo;
    if (name) {
      form.setFieldsValue({
        ...currentPersonInfo,
        txurl: txurl ? [txurl] : [],
      });
      setPeopleTags(customizeLabel ? customizeLabel.split(',') : []);
      setSelectedTags(customizeLabel ? customizeLabel.split(',') : []);
    }
  }, [form, currentPersonInfo]);

  /**
   * 关闭弹窗时设置表单空置
   */
  const clearForm = () => {
    form.resetFields();
    setActionType('0');
    setPeopleTags([]);
    setSelectedTags([]);
    dispatch({
      type: 'communityDetail/setState',
      payload: {
        currentPersonInfo: {},
      },
    });
  };

  /**
   * 表单一提交事件
   * @param {Object} values 表单参数
   */
  const onFinish = (values) => {
    let rybzNum = {};
    if (editPersonBz) {
      rybzNum = { ryxxbz: editPersonBz };
    }
    const { txurl } = values;
    dispatch({
      type: 'communityDetail/eidtPersonnelInfo',
      payload: {
        ...values,
        txurl: Array.isArray(txurl) ? txurl.join('') : '',
        customizeLabelList: selectedTags,
        xqxxbz,
        fwxxbz,
        isQuit: actionType,
        ...rybzNum,
      },
      callback: () => {
        onClose();
        clearForm();
        getPersonnelInfo();
      },
    });
  };

  return (
    <Drawer
      width={500}
      visible={drawerVisible}
      headerStyle={{ height: 0 }}
      onClose={() => {
        onClose();
        clearForm();
      }}
      bodyStyle={{ padding: '24px 32px' }}
    >
      <>
        <div className={styles.drawerHead}>
          <h3>人员信息</h3>
          <div>
            <span style={{ marginRight: 16 }}>状态选择</span>
            <Radio.Group
              value={actionType}
              onChange={(e) => setActionType(e.target.value)}
              buttonStyle="solid"
            >
              <Radio.Button value="0">迁入</Radio.Button>
              <Radio.Button value="1">迁出</Radio.Button>
              <Radio.Button value="2">未知</Radio.Button>
            </Radio.Group>
          </div>
        </div>
        <div className={styles.drawerBody}>
          <Form form={form} {...formItemLayout} onFinish={onFinish} labelAlign="left">
            <Form.Item
              label="姓名"
              name="name"
              rules={[{ required: true, message: '请输入姓名!' }]}
            >
              <Input autoComplete="off" />
            </Form.Item>
            <Form.Item
              label="手机号"
              name="phone"
              rules={[
                { required: true, message: '请输入手机号!' },
                {
                  pattern: /^1([38]\d|5[0-35-9]|7[3678])\d{8}$/,
                  message: '请输入正确的手机号!',
                },
              ]}
            >
              <Input autoComplete="off" />
            </Form.Item>
            <Form.Item
              label="身份证"
              name="idCar"
              rules={[
                { required: true, message: '请输入身份证号!' },
                {
                  pattern: /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/,
                  message: '请输入正确的身份证号!',
                },
              ]}
            >
              <Input autoComplete="off" />
            </Form.Item>
            <Form.Item
              label="居住地址"
              name="address"
              rules={[{ required: true, message: '请输入居住地址!' }]}
            >
              <Input autoComplete="off" />
            </Form.Item>
            <Form.Item
              label="籍贯"
              name="nativePlace"
              rules={[{ required: true, message: '请输入籍贯!' }]}
            >
              <Input autoComplete="off" />
            </Form.Item>
            <Form.Item label="性别" name="sex" rules={[{ required: true, message: '请选择性别!' }]}>
              <Radio.Group>
                <Radio value="1">男</Radio>
                <Radio value="2">女</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              label="文化程度"
              name="education"
              rules={[{ required: true, message: '请选择文化程度!' }]}
            >
              <Select>
                {educationLevelList.map((item) => (
                  <Option key={item} value={item}>
                    {item}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="关系"
              name="relation"
              rules={[{ required: true, message: '请选择关系!' }]}
            >
              <Select>
                <Option value="房主">房主</Option>
                <Option value="租客">租客</Option>
                <Option value="亲属">亲属</Option>
                <Option value="访客">访客</Option>
              </Select>
            </Form.Item>
            <Form.Item label="人员标签">
              <div className={styles.tags}>
                {peopleTags.map((el) => (
                  <div
                    key={el}
                    className={cx(
                      'f-tag',
                      'mr-8',
                      selectedTags.includes(el) ? 'f-tag-primary' : 'f-tag-default',
                    )}
                    onClick={() =>
                      setSelectedTags(
                        selectedTags.includes(el)
                          ? selectedTags.filter((type) => type !== el)
                          : [...selectedTags, el],
                      )
                    }
                  >
                    {el}
                  </div>
                ))}
                {addTags ? (
                  <Search
                    placeholder="新增标签"
                    enterButton="添加"
                    size="small"
                    onSearch={(value) => {
                      if (peopleTags.includes(value)) {
                        message.warning('该标签已存在');
                        return;
                      }
                      if (value === '') {
                        message.warning('标签不能为空');
                        return;
                      }
                      setPeopleTags([...peopleTags, value]);
                      setSelectedTags([...selectedTags, value]);
                      setAddTags(false);
                    }}
                    onBlur={() => setAddTags(false)}
                    style={{ display: 'inline-block', width: 160, marginTop: 4 }}
                  />
                ) : (
                  <div className="f-tag f-tag-plus text-center" onClick={() => setAddTags(true)}>
                    <PlusOutlined />
                  </div>
                )}
              </div>
            </Form.Item>

            <Form.Item label="人脸图片" name="txurl">
              <ImageUpload max={1} />
            </Form.Item>
            <Form.Item>
              <Button className={styles.submitBtn} type="primary" htmlType="submit">
                提交
              </Button>
            </Form.Item>
          </Form>
        </div>
      </>
    </Drawer>
  );
}
