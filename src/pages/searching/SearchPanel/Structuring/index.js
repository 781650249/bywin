import React, { Component } from 'react';
import { connect } from 'dva';
import cx from 'classnames';
import { Form, Radio, Select, Input, Button } from 'antd';
import style from './index.less';

const { Item: FormItem } = Form;
const { Option } = Select;
const { Group: RadioGroup, Button: RadioButton } = Radio;
// @Form.create({
//   onValuesChange(props, values) {
//     const { dispatch } = props;
//     const obj = { ...values };
//     /** 把带-title的字段的值 给真实的字段 */
//     Object.keys(values).forEach((p) => {
//       if (p.indexOf('-title') > -1) {
//         obj[p.split('-title')[0]] = obj[p];
//       }
//     });
//     dispatch({
//       type: 'structuring/changeValues',
//       payload: obj,
//     });
//   },
//   mapPropsToFields(props) {
//     const obj = props.temInputObject;
//     const { optionsList } = props;
//     let clues = {};
//     if (obj) {
//       Object.keys(obj).forEach((p) => {
//         let value = obj[p];
//         /** 如果真实的字段的值是前两个或者前三个的 那么带-title的字段的值去掉 */
//         if (p.indexOf('-title') > -1) {
//           const arr = optionsList[p.split('-title')[0]];
//           if (arr && arr.length >= 2 && (value === arr[0] || value === arr[1])) {
//             value = undefined;
//           }
//           const num = p.split('-title-')[1];
//           if (arr && arr.length >= 3 && (num === 3 && value === arr[2])) {
//             value = undefined;
//           }
//         }
//         clues = {
//           ...clues,
//           [p]: value ? Form.createFormField({ value }) : undefined,
//         };
//       });
//     }
//     return clues;
//   },
// })
class Structuring extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: [],
    };
    this.formMap = new Map();
    this.formRef = React.createRef();
  }

  componentDidMount() {
    const { dispatch, searchType } = this.props;
    dispatch({
      type: 'structuring/getParameterList',
      payload: { searchType },
    });
    document.addEventListener('click', this.clickFunction);
  }

  componentDidUpdate(prevProps) {
    const { dispatch, searchType } = this.props;
    if (searchType !== prevProps.searchType) {
      dispatch({
        type: 'structuring/getParameterList',
        payload: { searchType },
      });
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'structuring/clear',
    });

    document.removeEventListener('click', this.clickFunction);
  }

  onFieldsChange = (changeFields, allFields) => {
    if (changeFields.length > 0) {
      this.setState({
        fields: allFields,
      });
    }
  };

  onValuesChange = (values) => {
    const { dispatch } = this.props;
    const obj = { ...values };
    /** 把带-title的字段的值 给真实的字段 */
    Object.keys(values).forEach((p) => {
      if (p.indexOf('-title') > -1) {
        obj[p.split('-title')[0]] = obj[p];
      }
    });
    dispatch({
      type: 'structuring/changeValues',
      payload: obj,
    });
  };

  clickFunction = (e) => {
    if (e.target.nodeName === 'BUTTON') {
      return false;
    }
    const { showFeature, dispatch } = this.props;
    if (showFeature) {
      dispatch({
        type: 'structuring/changeState',
        payload: { showFeature: false },
      });
    }
  };

  changeFormState = (params) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'structuring/changeShowFeature',
      payload: params,
    });
  };

  radioChange = (e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'structuring/changeState',
      payload: { radioValue: e.target.value },
    });
  };

  selectChange = (name, val) => {
    const value = {};
    value[name] = val;
    this.formRef.current.setFieldsValue(value);
    this.changeBorderColor(name, '#1890ff');
  };

  removeSelectCss = (name, value) => {
    const { dispatch, temInputObject } = this.props;
    const { fields } = this.state;
    const current = fields.find((field) => field.name[0] === name);
    if (current && current.value === value) {
      this.setState({
        fields: fields.map((field) => ({
          ...field,
          value: field.name[0] === name ? undefined : field.value,
        })),
      });
    }
    if (temInputObject[name] === value) {
      dispatch({
        type: 'structuring/changeValues',
        payload: {
          [name]: undefined,
        },
      });
    }

    dispatch({
      type: 'structuring/changeValues',
      payload: {
        [`${name}-title-3`]: undefined,
        [`${name}-title-2`]: undefined,
      },
    });

    this.changeBorderColor(name, 'transparent');
  };

  changeBorderColor = (name, color) => {
    if (document.querySelector(`.select-f-b.${name} .ant-select-selection`)) {
      setTimeout(() => {
        document.querySelector(
          `.select-f-b.${name} .ant-select-selection`,
        ).style.borderColor = color;
      });
    }
  };

  RadioGroupSelect = () => {};

  returnInputItem = (data) => {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    const { label, colum } = data;
    return (
      <FormItem {...formItemLayout} name={colum} label={label} key={label}>
        <Input size="small" style={{ width: 200 }} autoComplete="off" />
      </FormItem>
    );
  };

  returnRadioItem = (data) => {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    const { label, colum, options } = data;
    const columMap = new Map();
    const html = (
      <FormItem {...formItemLayout} label={label} key={label}>
        <FormItem name={colum} style={{ display: 'inline-block' }}>
          <RadioGroup size="small">
            {options.map((v, i) => {
              const { key, value } = v;
              columMap.set(value, key);
              if (i >= 3) {
                return null;
              }
              return (
                <RadioButton
                  key={value}
                  value={value}
                  onClick={() => this.removeSelectCss(colum, value)}
                  title={key}
                >
                  {key.length > 4 ? `${key.substring(0, 3)}...` : key}
                </RadioButton>
              );
            })}
          </RadioGroup>
        </FormItem>
        {this.returnElse(data, 3)}
      </FormItem>
    );
    this.formMap.set(colum, columMap);
    return html;
  };

  returnElse = (data, num) => {
    const { colum, options } = data;
    if (options.length > num) {
      return (
        <FormItem name={`${colum}-title-${num}`} style={{ display: 'inline-block' }}>
          <Select
            size="small"
            id={colum}
            className={`select-f-b ${colum}`}
            style={{ width: 100 }}
            placeholder="选择其它"
            onChange={(option) => this.selectChange(colum, option)}
            key={colum + Math.random()}
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
            // onDropdownVisibleChange={}
            showArrow={false}
          >
            {options.map((v, k) => {
              if (k < num) {
                return null;
              }
              return <Option key={v.value}>{v.key}</Option>;
            })}
          </Select>
        </FormItem>
      );
    }

    return null;
  };

  returnRadioButton = () => {};

  returnFatherItem = (data) => {
    const { radioValue } = this.props;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    const formItemLayout1 = {
      labelCol: { span: 3, offset: 6 },
      wrapperCol: { span: 14 },
    };
    const { label, children } = data;
    const html = (
      <span key={label}>
        <FormItem {...formItemLayout} label={label} key={label}>
          <RadioGroup size="small" onChange={this.radioChange}>
            {children.map((v) => {
              const { label: l } = v;
              return (
                <RadioButton key={l} value={l} title={l}>
                  {l.length > 4 ? `${l.substring(0, 3)}...` : l}
                </RadioButton>
              );
            })}
          </RadioGroup>
        </FormItem>

        {children.map((v) => {
          const { type, children: c, label: l } = v;
          if (type === 'tabs') {
            return c.map((val) => {
              const { type: ty, label: la, colum: co, options: op } = val;
              const columMap = new Map();
              let childhtml = null;
              const display = l === radioValue ? 'block' : 'none';
              if (ty === 'radio') {
                childhtml = (
                  <FormItem {...formItemLayout1} label={la} key={la} style={{ display }}>
                    <FormItem name={co}>
                      <RadioGroup size="small" onChange={this.RadioGroupSelect}>
                        {op.map((v1, i) => {
                          const { key, value } = v1;
                          columMap.set(value, key);
                          if (i >= 2) {
                            return null;
                          }
                          return (
                            <RadioButton
                              key={value}
                              value={value}
                              onClick={() => this.removeSelectCss(co, value)}
                              title={key}
                            >
                              {key.length > 4 ? `${key.substring(0, 3)}...` : key}
                            </RadioButton>
                          );
                        })}
                      </RadioGroup>
                    </FormItem>
                    {this.returnElse(val, 2)}
                  </FormItem>
                );
              }
              this.formMap.set(co, columMap);
              return childhtml;
            });
          }
          return null;
        })}
      </span>
    );
    return html;
  };

  cancel = () => {
    this.changeFormState({ edit: false });
  };

  check = () => {
    this.changeFormState({ edit: true });
  };

  render() {
    const { parameterList, showFeature } = this.props;
    let html = null;
    if (parameterList && parameterList.length > 0) {
      html = parameterList.map((data) => {
        const { type } = data;
        let ht = null;
        if (type === 'tabs') {
          ht = this.returnFatherItem(data);
        } else if (type === 'radio') {
          ht = this.returnRadioItem(data);
        } else if (type === 'input') {
          ht = this.returnInputItem(data);
        }
        return ht;
      });
    }
    const { fields } = this.state;
    return (
      <div
        className={cx(style.editFormBbody, 'shadow')}
        style={{ display: showFeature ? 'block' : 'none' }}
      >
        <Form
          onFieldsChange={this.onFieldsChange}
          onValuesChange={this.onValuesChange}
          fields={fields}
          ref={this.formRef}
          onClick={(e) => e.nativeEvent.stopImmediatePropagation()}
        >
          {html}
          <div style={{ marginTop: 30, textAlign: 'center' }}>
            <Button style={{ marginRight: 100 }} onClick={this.cancel}>
              取消
            </Button>
            <Button ghost type="primary" onClick={this.check}>
              确定
            </Button>
          </div>
        </Form>
      </div>
    );
  }
}

function mapStateToProps({ structuring, searchPanel }) {
  const { searchType } = searchPanel;
  return {
    ...structuring,
    searchType,
  };
}

export default connect(mapStateToProps)(Structuring);
