import React, { useState, useEffect, useCallback } from 'react';
import {
  Form,
  Button,
  Input,
  Avatar,
  Drawer,
  Pagination,
  Select,
  Modal,
  Col,
  message,
  Upload,
  Space,
  Tooltip,
  Spin,
} from 'antd';
import cx from 'classnames';
import { useSelector, useDispatch } from 'dva';
import { router } from 'umi';
import {
  MobileOutlined,
  BankOutlined,
  EnvironmentOutlined,
  CloseOutlined,
  UploadOutlined,
  DownloadOutlined,
  SolutionOutlined,
} from '@ant-design/icons';
import UploadPicture from '../components/uploadPicture';
import { MyIcon } from '../icons/utils';
import styles from './index.less';

export default function CarInfo() {
  const { queryParams, carList, carTotal, companyList } = useSelector(({ carInfo }) => carInfo);
  const loading = useSelector((state) => state.loading.effects['carInfo/getCarList']);
  const { communityList } = useSelector(({ global }) => global);
  const { pageNum, pageSize } = queryParams;
  const [form] = Form.useForm();
  const { Option } = Select;
  const { confirm } = Modal;
  const dispatch = useDispatch();
  const [selectAreaId, setSelectArea] = useState(''); // 园区信息标志
  const [imageUrl, setImageUrl] = useState([]); //  图片URL
  const [isType, setIsType] = useState(''); // 判断是编辑还是添加
  const [updateId, setUpdateId] = useState(''); // 编辑的ID
  const [modalVisible, setModalVisible] = useState(false); // 导入车辆信息模态框
  const [addCarvisible, setAddCarVisible] = useState(false); // 添加车辆信息模态框
  const [fileList, setFileList] = useState([]); // 图片的Url

  const layout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 16,
    },
  };

  const setQueryParams = useCallback(
    (params = {}, type = 'carInfo/getCarList') => {
      dispatch({
        type,
        payload: {
          pageNum: queryParams.pageNum,
          pageSize: queryParams.pageSize,
          ...queryParams,
          ...params,
        },
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, queryParams.pageNum, queryParams.pageSize, queryParams],
  );

  const searchCompany = useCallback(
    (params = {}, type = 'carInfo/getCompanyList') => {
      dispatch({
        type,
        payload: {
          ...params,
        },
      });
    },
    [dispatch],
  );

  const handleSelectArea = (value) => {
    searchCompany({ xqxxbz: value });
    setSelectArea(value);
  };

  useEffect(() => {
    setQueryParams();
    return () => {
      dispatch({
        type: 'carInfo/clear',
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const handleQueryCar = ({ carWord }) => {
    dispatch({
      type: 'carInfo/setState',
      payload: {
        queryParams: {
          ...queryParams,
          pageNum: 1,
        },
      },
    });
    setQueryParams({ keyWord: carWord, pageNum: 1 });
  };

  const selecteImage = (file) => {
    dispatch({
      type: 'global/putImageByBase64',
      payload: { base64: file },
      callback: (url) => {
        setImageUrl([...imageUrl, { url, uid: new Date().getTime() }]);
      },
    });
  };

  const removeImage = (file) => {
    setImageUrl(imageUrl.filter((item) => item.uid !== file.uid));
  };

  const handleAddCar = (value) => {
    console.log(value);
    if (isType === 'add') {
      dispatch({
        type: 'carInfo/addCarInfo',
        payload: {
          ...value,
          imageUrl: imageUrl.map((i) => i.url).join(','),
        },
      }).then((code) => {
        if (code && code === 'SUCCESS') {
          message.success('添加成功');
          setQueryParams();
          setAddCarVisible(false);
          setImageUrl([]);
          form.resetFields();
        }
      });
    } else {
      dispatch({
        type: 'carInfo/updateCarInfo',
        payload: {
          ...value,
          imageUrl: imageUrl.map((i) => i.url).join(','),
          id: updateId,
        },
      }).then((code) => {
        if (code && code === 'SUCCESS') {
          message.success('编辑成功');
          setQueryParams();
          setAddCarVisible(false);
          setImageUrl([]);
          form.resetFields();
        }
      });
    }
  };

  const handleCardDel = (e, { id }) => {
    e.stopPropagation();
    confirm({
      title: '提示',
      content: '是否确认删除该车辆',
      closable: true,
      centered: true,
      closeIcon: <CloseOutlined />,
      onOk() {
        dispatch({
          type: 'carInfo/deleteCarInfo',
          payload: {
            id,
          },
        }).then((code) => {
          if (code && code === 'SUCCESS') {
            message.success('删除成功');
            setQueryParams();
          }
        });
      },
    });
  };

  const handleUpdAddCar = ({ type }, e, item) => {
    if (type === 'add') {
      setIsType('add');
      setAddCarVisible(true);
      setImageUrl([]);
    } else if (type === 'update') {
      setIsType('update');
      setAddCarVisible(true);
      setUpdateId(item.id);
      const imgSrc = item.imageUrl;
      setImageUrl([{ url: imgSrc, uid: new Date().getTime() }]);
      form.setFieldsValue({
        address: item.address,
        carNumber: item.carNumber,
        carOwner: item.carOwner,
        company: item.company,
        phoneNumber: item.phoneNumber,
        xqxxbz: item.xqxxbz,
        remark: item.remark,
      });
      searchCompany({ company: item.xqxxbz });
    }
  };

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

  const handleCloseDrawer = () => {
    setAddCarVisible(false);
    form.resetFields();
  };

  const renderList = () => (
    // <Spin spinning={loading}>
    <>
      {carList.length > 0 &&
        Array.isArray(carList) &&
        carList.map((item, i) => (
          <div
            key={i}
            className={styles.cardWrap}
            onClick={(e) => {
              handleUpdAddCar({ type: 'update' }, e, item);
            }}
          >
            <div className={styles.left}>
              <Avatar src={item.imageUrl} shape="square" size={92} />
            </div>
            <div className={styles.right}>
              <div
                className={styles.rightCarNum}
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/vehicle-file/${item.carNumber}`);
                }}
              >
                {item.carNumber}
              </div>

              <div className={styles.rightItem}>
                <div className={styles.rightItemIcon}>
                  <MyIcon type="icon-renyuan" />
                </div>
                <div className={styles.rightItemTxt}>{item.carOwner}</div>
              </div>
              <div className={styles.rightItem}>
                <div className={styles.rightItemIcon}>
                  <MobileOutlined />
                </div>
                <div className={styles.rightItemTxt}>{item.phoneNumber}</div>
              </div>
              <div className={styles.rightItem}>
                <div className={styles.rightItemIcon}>
                  <BankOutlined />
                </div>
                <div className={cx(styles.rightItemTxt)}>{item.companyName}</div>
              </div>
              <div className={styles.rightItem}>
                <div className={styles.rightItemIcon}>
                  <EnvironmentOutlined />
                </div>
                <div className={styles.rightItemTxt}>{item.address}</div>
              </div>
            </div>
            <div className={styles.del} onClick={(e) => handleCardDel(e, item)} />
          </div>
        ))}
      {[...Array(3).keys()].map((_, index) => (
        <div key={index} className={cx(styles.hiddenCard, 'mr-16 mb-16')} />
      ))}
    </>
    // </Spin>
  );

  const onOkUpload = () => {
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append('multipartFile', file);
    });
    formData.append('xqxxbz', selectAreaId);
    dispatch({
      type: 'carInfo/importCarExcel',
      payload: formData,
    }).then((code) => {
      if (code && code === 'SUCCESS') {
        message.success('上传成功');
        setModalVisible(false);
        setQueryParams();
        setFileList([]);
      } else {
        message.error('上传失败');
      }
    });
  };

  const handleQueryPerson = (e) => {
    dispatch({
      type: 'carInfo/getPersonnelByPhone',
      payload: {
        phone: e.target.value,
        yqxxbz: form.getFieldValue('xqxxbz'),
      },
    }).then((res) => {
      const { code, data } = res;
      if (code && code === 'SUCCESS' && data) {
        const imgSrc = data.xp;
        setImageUrl([{ url: imgSrc, uid: new Date().getTime() }]);
        form.setFieldsValue({
          address: data.dz,
          carOwner: data.xm,
          companyName: data.qyxxbz,
        });
      }
    });
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.title}>车辆信息</div>
      <div className={styles.top}>
        <Col flex="auto">
          <Form layout="inline" className={styles.form} onFinish={handleQueryCar}>
            <Space>
              <Form.Item name="carWord">
                <Input style={{ width: 224 }} placeholder="请输入车牌号码/车主" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
              </Form.Item>
            </Space>
          </Form>
        </Col>
        <div className={styles.actions}>
          <Space>
            <Tooltip title="导入车辆信息">
              {' '}
              <a type="primary" className={styles.action} onClick={() => setModalVisible(true)}>
                <SolutionOutlined />
              </a>
            </Tooltip>
            <Tooltip title="下载车辆报告">
              {' '}
              <a className={styles.action} href="http://183.252.15.157:8225/api/excel/CarInfo.xlsx">
                <DownloadOutlined />
              </a>
            </Tooltip>
            <Tooltip title="新增车辆信息">
              {' '}
              <div onClick={() => handleUpdAddCar({ type: 'add' })} className={styles.add} />{' '}
            </Tooltip>
          </Space>
        </div>
      </div>

      <Spin spinning={loading} wrapperClassName={styles.spin}>
        <div className={styles.list}>{renderList()}</div>
      </Spin>

      <div className={styles.pagination}>
        <Pagination
          current={pageNum}
          pageSize={pageSize}
          onChange={(value) => {
            dispatch({
              type: 'carInfo/setState',
              payload: {
                queryParams: {
                  ...queryParams,
                  pageNum: value,
                },
              },
            });
            setQueryParams({ pageNum: value });
          }}
          total={carTotal}
        />
      </div>

      <Drawer
        className={styles.drawWrap}
        closable
        title={isType === 'add' ? '新增车辆' : '编辑车辆'}
        bodyStyle={{ padding: 20 }}
        placement="right"
        visible={addCarvisible}
        onClose={() => handleCloseDrawer()}
      >
        <Form
          form={form}
          {...layout}
          name="basic"
          labelAlign="right"
          onFinish={(value) => handleAddCar(value)}
        >
          <Form.Item
            label="园区"
            name="xqxxbz"
            rules={[
              {
                required: true,
                message: '请选择园区',
              },
            ]}
          >
            <Select placeholder="请选择园区" allowClear onChange={handleSelectArea}>
              {communityList.length > 0 &&
                communityList.map((item, i) => (
                  <Option key={i} value={item.xqxxbz}>
                    {item.communityName}
                  </Option>
                ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="车牌"
            name="carNumber"
            rules={[
              {
                required: true,
                message: '请输入车牌号',
              },
            ]}
          >
            <Input placeholder="请输入车牌号" />
          </Form.Item>

          <Form.Item
            label="手机号码"
            name="phoneNumber"
            rules={[
              {
                required: true,
                message: '请输入手机号',
              },
              {
                pattern: /^1[3|4|5|7|8][0-9]\d{8}$/,
                message: '请输入正确的手机号',
              },
            ]}
          >
            <Input placeholder="请输入手机号码" onChange={(e) => handleQueryPerson(e)} />
          </Form.Item>

          <Form.Item
            label="车主"
            name="carOwner"
            rules={[
              {
                required: true,
                message: '请输入车主',
              },
            ]}
          >
            <Input placeholder="请输入人员姓名" />
          </Form.Item>

          <Form.Item
            label="归属企业"
            name="company"
            rules={[
              {
                required: true,
                message: '请选择企业',
              },
            ]}
          >
            <Select placeholder="请选择企业" allowClear>
              {companyList.length > 0 &&
                companyList.map((item, i) => (
                  <Option key={i} value={item.dwxxbz}>
                    {item.dwmc}
                  </Option>
                ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="地址"
            name="address"
            rules={[
              {
                required: true,
                message: '请输入地址',
              },
            ]}
          >
            <Input placeholder="请输入地址" />
          </Form.Item>

          <Form.Item label="备注" name="remark">
            <Input.TextArea maxLength="200" rows={4} placeholder="请输入备注内容" />
          </Form.Item>

          <Form.Item
            label="照片"
            validateStatus={imageUrl.length === 0 ? 'error' : 'success'}
            help={imageUrl.length === 0 ? '请上传照片' : ''}
            name="pictureUrl"
            // rules={[
            //   {
            //     required: true,
            //     message: '请上传照片！',
            //   },
            // ]}
          >
            <UploadPicture
              max={1}
              fileList={imageUrl}
              selecteImage={selecteImage}
              isIcon
              onRemove={removeImage}
            />
          </Form.Item>

          <div className={cx(styles.footer, 'text-right')}>
            <Button type="primary" htmlType="submit" className="mr-8">
              确定{' '}
            </Button>
            <Button onClick={() => handleCloseDrawer()}>取消</Button>
          </div>
        </Form>
      </Drawer>

      <Modal
        title="导入数据"
        width={436}
        visible={modalVisible}
        onOk={onOkUpload}
        onCancel={() => setModalVisible(false)}
        okText="导入"
      >
        <div className={styles.modalBox}>
          <Form>
            <Form.Item label="园区" name="xqxxbz">
              <Select placeholder="请选择园区" allowClear onChange={handleSelectArea}>
                {communityList.length > 0 &&
                  communityList.map((item, i) => (
                    <Option key={i} value={item.xqxxbz}>
                      {item.communityName}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          </Form>
          文件：
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
