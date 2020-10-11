import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'dva';
import { Drawer, Radio, Form, Input, Button, Select, message, Cascader } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import cx from 'classnames';
import UploadPicture from '../../components/upload-picture';
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
const { Option } = Select;
const { TextArea, Search } = Input;

export default function(props) {
  const formRef = React.createRef();
  const dispatch = useDispatch();
  const { disposeVisible, eventValue, communityList, openId, personInfo } = useSelector(
    ({ eventList }) => eventList,
  );
  const [cascaderOptions, setCascaderOptions] = useState([]);
  // const [peopleType, setPeopleType] = useState('常住');
  const [peopleTags, setPeopleTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [addTags, setAddTags] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [allPhone, setAllPhone] = useState(['']);

  useEffect(() => {
    const {
      name,
      phone,
      cardId,
      communityId,
      floorAddressId,
      customizeLabelList,
      personUrl,
    } = personInfo;
    if (name && formRef.current) {
      formRef.current.setFieldsValue({
        name,
        phone,
        cardId,
        communityId,
        fwxxbz: floorAddressId,
      });
      setSelectedTags(customizeLabelList);
      setPeopleTags(customizeLabelList ? [...customizeLabelList] : []);
      setFileList([{ url: personUrl, uid: new Date().getTime() }]);
      dispatch({
        type: 'eventList/getBuildingCascade',
        payload: {
          id: communityId,
        },
        callback: (roomList) => {
          setCascaderOptions(roomList);
        },
      })
    }
  }, [dispatch, personInfo]);

  const onClose = () => {
    formRef.current.setFieldsValue({
      name: '',
      phone: '',
      cardId: '',
      communityId: '',
      fwxxbz: [],
    });
    formRef.current.setFieldsValue({
      content: '',
    });
    setAllPhone(['']);
    setSelectedTags([]);
    setPeopleTags([]);
    setFileList([]);
    setCascaderOptions([]);

    dispatch({
      type: 'eventList/setState',
      payload: {
        disposeVisible: false,
        openId: '',
        personInfo: {},
      },
    });
  };

  /**
   * 表单一提交事件
   * @param {Object} values 表单参数
   */
  const onFinish = (values) => {
    dispatch({
      type: personInfo.name ? 'eventList/updatePersonInfo' : 'eventList/addPersonInfo',
      payload: {
        xm: values.name,
        lxdh: values.phone,
        zjhm: values.cardId,
        communityId: values.communityId,
        fwxxbz: values.fwxxbz[2] || '',
        pid: openId,
        customizeLabelList: selectedTags,
        xp: fileList.map((i) => i.url).join(','),
      },
      callback: () => {
        const { getEventList } = props;
        message.success(personInfo.name ? '修改成功' : '处置成功');
        onClose();
        getEventList();
        dispatch({ type: 'eventCount/disposeEventCount' });
      },
    });
  };

  const onNotice = (values) => {
    let type = '';
    switch (eventValue) {
      case '布控人员':
        type = '1';
        break;
      case '人员聚集':
        type = '2';
        break;
      case '打架斗殴':
        type = '3';
        break;
      case '未带口罩':
        type = '4';
        break;
      case '高空抛物':
        type = '5';
        break;
      case '人员摔倒':
        type = '6';
        break;
      default:
        type = '';
        break;
    }
    dispatch({
      type: 'eventList/disposeEvent',
      payload: {
        recognitionId: openId,
        informPhone: allPhone.join(','),
        type,
        ...values,
      },
      callback: () => {
        const { getEventList } = props;
        message.success('处置成功');
        onClose();
        getEventList();
        dispatch({ type: 'eventCount/disposeEventCount' });
      },
    });
  };

  const selecteImage = (file) => {
    dispatch({
      type: 'global/putImageByBase64',
      payload: { base64: file },
      callback: (url) => {
        setFileList([...fileList, { url, uid: new Date().getTime() }]);
      },
    });
  };
  const removeImage = (file) => {
    setFileList(fileList.filter((item) => item.uid !== file.uid));
  };

  /**
   * 电话号码输入框内容变化回调
   */
  const changePhone = (i, e) => {
    const allPhoneNum = [...allPhone];
    allPhoneNum[i] = e.target.value;
    setAllPhone(allPhoneNum);
  };

  return (
    <Drawer
      width={500}
      onClose={onClose}
      visible={disposeVisible}
      headerStyle={{ height: 0 }}
      bodyStyle={{ padding: '24px 32px' }}
    >
      <div className={styles.drawerHead}>
        <h3>事件处置</h3>
        <div>
          <span style={{ marginRight: 14 }}>事件类型</span> <span>{eventValue}</span>
        </div>
        <div>
          <span style={{ marginRight: 14 }}>处置方式</span>{' '}
          <span>
            <Radio checked />
            {eventValue === '来登去销' ? '登记' : '通知'}
          </span>
        </div>
      </div>
      <div className={styles.drawerBody}>
        {eventValue === '来登去销' && (
          <Form ref={formRef} {...formItemLayout} onFinish={onFinish} labelAlign="left">
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
              name="cardId"
              rules={[
                { required: true, message: '请输入身份证号!' },
                {
                  pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
                  message: '请输入正确的身份证号!',
                },
              ]}
            >
              <Input autoComplete="off" />
            </Form.Item>
            <Form.Item
              label="居住小区"
              name="communityId"
              rules={[{ required: true, message: '请选择居住小区!' }]}
            >
              <Select
                onSelect={(value) =>
                  dispatch({
                    type: 'eventList/getBuildingCascade',
                    payload: {
                      id: value,
                    },
                    callback: (roomList) => {
                      setCascaderOptions(roomList);
                    },
                  })
                }
              >
                {communityList &&
                  communityList.map((item) => (
                    <Option value={item.communityId} key={item.communityId}>
                      {item.communityName}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
            <Form.Item label="楼层信息" name="fwxxbz">
              <Cascader placeholder="" options={cascaderOptions} />
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

            <Form.Item label="人脸图片">
              <UploadPicture
                max={1}
                fileList={fileList}
                selecteImage={selecteImage}
                isIcon
                onRemove={removeImage}
              />
            </Form.Item>
            <Form.Item>
              <Button className={styles.submitBtn} type="primary" htmlType="submit">
                提交
              </Button>
            </Form.Item>
          </Form>
        )}

        {eventValue !== '来登去销' && (
          <Form ref={formRef} {...formItemLayout} onFinish={onNotice} labelAlign="left">
            <Form.Item label="通知人员">
              {allPhone.map((item, index) => (
                <Input
                  placeholder="请输入联系方式"
                  key={index}
                  style={{ width: '88%', marginBottom: 12 }}
                  rows={10}
                  value={item}
                  onChange={(e) => changePhone(index, e)}
                />
              ))}
              <Button
                style={{ marginLeft: 12, color: '#4751F1' }}
                type="dashed"
                size="small"
                shape="circle"
                icon={<PlusOutlined />}
                onClick={() => setAllPhone([...allPhone, ''])}
              />
            </Form.Item>
            <Form.Item label="通知内容" name="content">
              <TextArea style={{ width: '88%' }} placeholder="请输入通知内容" rows={10} />
            </Form.Item>
            <Form.Item>
              <Button className={styles.submitBtn} type="primary" htmlType="submit">
                提交
              </Button>
            </Form.Item>
          </Form>
        )}
      </div>
    </Drawer>
  );
}
