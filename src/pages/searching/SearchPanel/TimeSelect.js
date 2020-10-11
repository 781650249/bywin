import React, { Component } from 'react';
import { connect } from 'dva';
import cx from 'classnames';
import { DatePicker } from 'antd';
import styles from './TimeSelect.less';

@connect(({ searchPanel }) => {
  const { startTime, endTime } = searchPanel;
  return { startTime, endTime };
})
class DateSelect extends Component {

  setStore = (payload = {}) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'searchPanel/setState',
      payload: {
        ...payload,
      },
    });
  };

  setStartTime = (startTime) => {
    this.setStore({ startTime });
  };

  setEndTime = (endTime) => {
    this.setStore({ endTime });
  };


  render() {
    const { className = '', startTime, endTime } = this.props;
    return (
      <div className={cx(styles.wrap, className)}>
        <DatePicker
          format="MM.DD HH:mm"
          showTime={{ format: 'HH:mm' }}
          onChange={this.setStartTime}
          value={startTime}
          width={188}
          size="small"
          allowClear={false}
          suffixIcon={<span />}
        />
        <span>~</span>
        <DatePicker
          format="MM.DD HH:mm"
          showTime={{ format: 'HH:mm' }}
          onChange={this.setEndTime}
          value={endTime}
          width={188}
          size="small"
          allowClear={false}
          suffixIcon={<span />}
        />
      </div>
    );
  }
}

export default DateSelect;
