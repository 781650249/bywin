import React, { Component } from 'react';
import { connect } from 'dva';
import cx from 'classnames';
// import moment from 'moment';
import { Radio, Form, Input, Button, message } from 'antd';
import styles from './index.less';
import PictureUpload from './PictureUpload';
import Structured from './Structured';
import TimeSelect from './TimeSelect';
import CheckboxList from './CheckboxList';
import IncrementalSearch from './IncrementalSearch';

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

@connect(({ searchPanel, searchingMap, incrementalSearch, structured }) => {
  const {
    searchType,
    content,
    faceContent,
    startTime,
    endTime,
    plateNumber,
    selectedResult,
    prevParams,
    currentKey,
    multRelation,
    multSelectedResult,
  } = searchPanel;
  const {
    cameraIdList,
    cameraTypeList,
    selectedCameraType,
    policeStationList,
    selectedPoliceStation,
  } = searchingMap;
  const { formItems, formData } = structured;
  const { visible, selectedKeys } = incrementalSearch;
  return {
    searchType,
    content,
    faceContent,
    startTime,
    endTime,
    plateNumber,
    selectedResult,
    prevParams,
    currentKey,
    multRelation,
    multSelectedResult,
    cameraIdList,
    cameraTypeList,
    selectedCameraType,
    policeStationList,
    selectedPoliceStation,
    selectedKeys,
    incrementalSearchVisible: visible,
    formItems,
    formData,
  };
})
class SearchPanel extends Component {
  componentDidMount() {
    this.initData();
    this.setStore({
      searchType: window.location.pathname === '/searching-person' ? 'person' : 'veh',
    });
  }

  /**
   * 初始数据获取
   */
  initData = () => {
    const { dispatch, cameraTypeList, policeStationList } = this.props;

    dispatch({
      type: 'searchPanel/getCameraTypeList',
    });
    if (cameraTypeList.length === 0) {
      dispatch({
        type: 'searchingMap/getCameraTypeList',
      });
    }
    if (policeStationList.length === 0) {
      dispatch({
        type: 'searchingMap/getPoliceStationList',
      });
    }
  };

  setStore = (state = {}, type = 'searchPanel') => {
    const { dispatch } = this.props;
    dispatch({
      type: `${type}/setState`,
      payload: {
        ...state,
      },
    });
  };

  /**
   * 去除base64的前缀格式，数组和单个字符串都可以
   */
  clearBase64Format = (data) => {
    function clearType(string) {
      if (/^data:image\/(jpeg|png|gif);base64,/.test(string)) {
        return string.replace(/^data:image\/(jpeg|png|gif);base64,/, '');
      }
      return string;
    }
    if (Array.isArray(data)) {
      return data.map((img) => clearType(img));
    }
    if (typeof data === 'string') {
      return clearType(data);
    }
    return data;
  };

  /**
   * 类型切换
   */
  handleRadioChange = (e) => {
    this.setStore({
      searchType: e.target.value,
    });
  };

  /**
   * 隐藏显示特征表单
   */
  showFeature = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'structured/setState',
      payload: {
        show: true,
      },
    });
  };

  /**
   * 添加完毕的属性，需要在特征框里展示
   */
  getCluesValues = () => {
    const { formItems, formData } = this.props;
    const values = Object.keys(formData)
      .map((key) => {
        const currentItem = formItems.find((item) => item.colum === key);
        if (!currentItem) return undefined;
        if (currentItem.type === 'input') return formData[key];
        const option = currentItem.options.find((item) => item.value === formData[key]);
        if (!option) return undefined;
        return option.key;
      })
      .filter((value) => value !== undefined);
    return values.length > 0 ? values.join('、') : '添加属性';
  };

  /**
   * 车牌号变更
   */
  handleInputChange = (e) => {
    this.setStore({
      plateNumber: e.target.value,
    });
  };

  /**
   * 派出所变更
   */
  handlePoliceStationChange = (selectedList) => {
    this.setStore({ selectedPoliceStation: selectedList }, 'searchingMap');
  };

  /**
   * 摄像头类型变更
   */
  handleCameraTypeChange = (selectedList) => {
    this.setStore({ selectedCameraType: selectedList }, 'searchingMap');
  };

  // 搜索
  handleSearch = () => {
    const {
      dispatch,
      searchType,
      content,
      faceContent,
      startTime,
      endTime,
      plateNumber,
      cameraIdList,
      selectedResult,
      currentKey,
      multRelation,
      selectedKeys,
      incrementalSearchVisible,
      formData,
    } = this.props;

    if (cameraIdList.length === 0) {
      message.warning('请选择摄像头');
      return;
    }

    if (!startTime.isBefore(endTime)) {
      message.warning('开始时间应小于结束时间，请重新选择');
      return;
    }

    // 二次检索有选中目标时弹窗二次确认
    if (!incrementalSearchVisible && selectedKeys.length === 0 && selectedResult.length > 0) {
      dispatch({
        type: 'incrementalSearch/setState',
        payload: {
          visible: true,
          selectedKeys: selectedResult.map((el) => el.id),
        },
      });
      return;
    }

    const params = {
      ...formData,
      searchType,
      content: this.clearBase64Format(content).join(',') || undefined,
      startTime: startTime.format('YYYY/MM/DD HH:mm'),
      endTime: endTime.format('YYYY/MM/DD HH:mm'),
      // startTime: '2019/12/03 00:00',
      // endTime: moment().format('YYYY/MM/DD HH:mm'),
      cameraIds: cameraIdList.join(','),
      pageNum: 1,
    };

    // 二次检索,把所选图片的id加入搜索条件，用分号隔开

    if (selectedKeys.length > 0) {
      params.ids = selectedKeys.join(';');
      params.idsType = selectedKeys
        .map((id) => {
          const currentObj = selectedResult.find((el) => el.id === id);
          if (currentObj) {
            return currentObj.searchType;
          }
          return null;
        })
        .join(';');
    }

    // 搜人时才有人脸
    if (searchType === 'person') {
      params.faceContent = this.clearBase64Format(faceContent).join(',') || undefined;
    }

    // 同行时 二次搜索的人体人脸参数为当前项对应的图片
    if (currentKey && content.length + faceContent.length === Object.keys(multRelation).length) {
      params.content =
        params.content && params.content.includes(multRelation[currentKey])
          ? multRelation[currentKey]
          : null;
      params.faceContent =
        params.faceContent && params.faceContent.includes(multRelation[currentKey])
          ? multRelation[currentKey]
          : null;
    }

    // 搜索类型为机动车时，把车牌号加入搜索条件
    if (searchType === 'veh') {
      params.vehicleId = plateNumber.toUpperCase();
    }

    dispatch({
      type: 'searchPanel/search',
      payload: {
        ...params,
      },
    });
  };

  /**
   * 一键重置
   */
  handleReset = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'searching/clear' });
    // dispatch({ type: 'searchingMap/reset' });
    dispatch({ type: 'searchPanel/clear' });
    dispatch({ type: 'pictureUpload/clear' });
    dispatch({ type: 'incrementalSearch/clear' });
    dispatch({ type: 'structured/reset' });
  };

  /**
   * 查看归档列表
   */
  handleSeeRecord = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'record/getTableData',
      payload: { pageNum: 1, pageSize: 10 },
    }).then(() => {
      dispatch({
        type: 'record/changeState',
        payload: { recordVisible: true },
      });
    });
  };

  /**
   * 添加归档
   */
  handleAddRecord = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'addRecord/changeState',
      payload: { visible: true },
    });
    dispatch({
      type: 'addRecord/changeCurrent',
      payload: { pageNum: 1, pageSize: 10 },
    });
  };

  render() {
    const {
      searchType,
      plateNumber,
      cameraTypeList,
      policeStationList,
      selectedPoliceStation,
      selectedCameraType,
    } = this.props;
    // const featureText = this.getCluesValues();
    return (
      <div className={cx(styles.wrap, 'shadow')}>
        <Form className={styles.form} layout="vertical">
          <FormItem className="hide">
            <RadioGroup
              className={styles.radioGroup}
              buttonStyle="solid"
              value={searchType}
              onChange={this.handleRadioChange}
              defaultValue="person"
            >
              <RadioButton value="person">人</RadioButton>
              <RadioButton value="veh">车</RadioButton>
            </RadioGroup>
          </FormItem>
          {searchType === 'person' && (
            <FormItem label="图片" colon={false}>
              <PictureUpload className={styles.itemContent} />
            </FormItem>
          )}

          {/* <FormItem label="特征" colon={false}>
            <Button
              block
              onClick={this.showFeature}
              className={styles.itemContent}
              title={featureText}
            >
              {featureText.length > 10 ? `${featureText.substr(0, 10)}...` : featureText}
            </Button>
          </FormItem> */}
          {searchType === 'veh' && (
            <FormItem label="车牌号" colon={false}>
              <Input
                size="small"
                className={styles.itemContent}
                value={plateNumber}
                onChange={this.handleInputChange}
                placeholder="请输入车牌号"
              />
            </FormItem>
          )}

          <FormItem label="时间" colon={false}>
            <TimeSelect className={styles.itemContent} />
          </FormItem>
          <FormItem label="派出所范围" colon={false}>
            <CheckboxList
              className={styles.itemContent}
              list={policeStationList}
              selectedList={selectedPoliceStation}
              onChange={this.handlePoliceStationChange}
            />
          </FormItem>
          <FormItem label="摄像头类别" colon={false}>
            <CheckboxList
              className={styles.itemContent}
              list={cameraTypeList}
              selectedList={selectedCameraType}
              onChange={this.handleCameraTypeChange}
            />
          </FormItem>
          {/* {searchType !== 'veh' && (
            <FormItem label="车牌号" colon={false} style={{ opacity: 0, pointerEvents: 'node' }}>
              <Input
                size="small"
                className={styles.itemContent}
                value={plateNumber}
                onChange={this.handleInputChange}
                placeholder="请输入车牌号"
              />
            </FormItem>
          )} */}
          <FormItem style={{ marginTop: 24 }}>
            <Button block type="primary" onClick={this.handleSearch}>
              搜索
            </Button>
            <Button ghost block type="primary" style={{ marginTop: 4 }} onClick={this.handleReset}>
              一键重置
            </Button>
          </FormItem>
        </Form>
        <div className={styles.footer}>
          <div className={styles.half}>
            <Button type="link" block onClick={this.handleSeeRecord}>
              历史档案
            </Button>
          </div>
          <div className={styles.half}>
            <Button type="link" block onClick={this.handleAddRecord}>
              添加归档
            </Button>
          </div>
        </div>
        <Structured />
        <IncrementalSearch onSearch={this.handleSearch} />
      </div>
    );
  }
}

export default SearchPanel;
