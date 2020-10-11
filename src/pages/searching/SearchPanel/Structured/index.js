import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'dva';
import { Form, Radio, Select, Input } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { Modal } from '@/components';
import styles from './index.less';

const formItemLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
};

export default function() {
  const dispatch = useDispatch();
  const { searchType } = useSelector((state) => state.searchPanel);
  const { show, formItems, formData, fields } = useSelector((state) => state.structured);

  useEffect(() => {
    dispatch({
      type: 'structured/getParameterList',
      payload: { searchType },
    });
  }, [dispatch, searchType]);

  /**
   * 表单双向绑定
   * @param {Array} changeFields
   * @param {Array} allFields
   */
  const handleFieldsChange = (changeFields, allFields) => {
    if (changeFields.length > 0) {
      dispatch({
        type: 'structured/setFields',
        fields: allFields,
      });
    }
  };

  /**
   * 表单数据同步
   * @param {Object} values
   */
  const handleValuesChange = (values) => {
    dispatch({
      type: 'structured/setFormData',
      formData: { ...formData, ...values },
    });
  };

  /**
   * 取消选中
   * @param {String} name
   * @param {String} value
   */
  const handleUncheckClick = (name, value) => {
    const current = fields.find((field) => field.name[0] === name);
    if (current && current.value === value) {
      const nextFormData = { ...formData };
      delete nextFormData[name];
      dispatch({
        type: 'structured/setState',
        payload: {
          fields: fields.map((field) => ({
            ...field,
            value: field.name[0] === name ? undefined : field.value,
          })),
          formData: nextFormData,
        },
      });
    }
  };

  const handleClose = () => {
    dispatch({
      type: 'structured/setState',
      payload: { show: false },
    });
  };

  const renderFormItem = () =>
    formItems.map((item) => {
      const { label, colum, options, type } = item;
      if (type === 'radio') {
        if (options.length < 5) {
          return (
            <Form.Item label={label} name={colum} key={colum} style={{ marginBottom: 8 }}>
              <Radio.Group size="small">
                {options.map((option, i) => (
                  <Radio.Button
                    value={option.value}
                    key={i}
                    onClick={() => handleUncheckClick(colum, option.value)}
                  >
                    {option.key}
                  </Radio.Button>
                ))}
              </Radio.Group>
            </Form.Item>
          );
        }
        const radioButtons = options.slice(0, 3);
        const selectOptions = options.slice(3);
        const selected =
          selectOptions.filter((option) => option.value === formData[colum]).length > 0;
        return (
          <Form.Item label={label} key={colum} style={{ marginBottom: 8 }}>
            <Input.Group compact>
              <Form.Item name={colum} style={{ marginBottom: 0 }}>
                <Radio.Group size="small">
                  {radioButtons.map((option, i) => (
                    <Radio.Button
                      value={option.value}
                      key={i}
                      onClick={() => handleUncheckClick(colum, option.value)}
                    >
                      {option.key}
                    </Radio.Button>
                  ))}
                </Radio.Group>
              </Form.Item>
              <Form.Item name={colum} style={{ marginBottom: 0 }}>
                <Select
                  size="small"
                  style={{
                    minWidth: 80,
                    color: selected ? '#4751f1' : 'transparent',
                  }}
                >
                  {selectOptions.map((option) => (
                    <Select.Option key={option.value}>{option.key}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Input.Group>
          </Form.Item>
        );
      }
      return (
        <Form.Item label={label} name={colum} key={colum} style={{ marginBottom: 8 }}>
          <Input size="small" style={{ width: 240 }}  />
        </Form.Item>
      );
    });
  return (
    <Modal>
      {show ? (
        <div className={styles.wrapper}>
          <div className={styles.close} onClick={handleClose}>
            <CloseOutlined />
          </div>

          <Form
            {...formItemLayout}
            fields={fields}
            onFieldsChange={handleFieldsChange}
            onValuesChange={handleValuesChange}
          >
            {renderFormItem()}
          </Form>
        </div>
      ) : null}
    </Modal>
  );
}
