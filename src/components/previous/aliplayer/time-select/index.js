import React, { Component } from 'react';
import { DatePicker, Button, Row, Col } from 'antd';
import moment from 'moment';
import cx from 'classnames';
import styles from './index.less';

export default class TimeSelect extends Component {

  getHourList = () => {
    const list = [[], [], [], []];
    for (let i = 0; i < 24; i += 1) {
      list[Math.floor(i / 6)].push(i);
    }
    return list;
  };

  getMinuteList = (n) => {
    const cnt = 60 / n;
    const list = [];
    for (let i = 0; i < cnt / 6; i += 1) {
      list.push([]);
    }
    for (let i = 0; i < 60; i += n) {
      list[Math.floor(i / (6 * n))].push(i);
    }
    return list;
  };

  getHourHtml = () => {
    const list = this.getHourList();
    const { value: time } = this.props;
    const hour = moment(time).hour();
    const isToday = moment().date() === moment(time).date();
    return list.map((arr, i) => (
        <Row key={i} style={{ marginTop: i === 0 ? i : 5 }}>
          {arr.map((v) => {
            let isSelected = false;
            // let boo = true;
            // 判断是否当天
            if (isToday) {
              // 判断是否选中
              if (hour === v) {
                isSelected = true;
              }
              // else if (moment().hour() < v) {
              //   // 大于当前时间
              //   boo = false;
              // }
            } else if (hour === v) {
              isSelected = true;
            }
            return (
              <Col key={v} span={4}>
                <div
                  className={cx(styles.hourMinute, {
                    [styles.active]: isSelected,
                  })}
                  onClick={() => {
                    // if (boo)
                    this.onHourChange(v);
                  }}
                >
                  {v}
                </div>
              </Col>
            );
          })}
        </Row>
      ));
  };

  getMinuteHtml = () => {
    const { value: time } = this.props;
    const list = this.getMinuteList(5);
    const minute = moment(time).minute();
    const isToday = moment().date() === moment(time).date();
    const isTohour = moment().hour() === moment(time).hour();
    return list.map((arr, i) => (
        <Row key={i} style={{ marginTop: i === 0 ? i : 5 }}>
          {arr.map((v) => {
            let isSelected = false;
            // let boo = true;
            if (isToday && isTohour) {
              if (minute === v) {
                isSelected = true;
              }
              // else if (moment().minute() < v) {
              //   // 大于当前时间
              //   boo = false;
              // }
            } else if (minute === v) {
              isSelected = true;
            }
            return (
              <Col key={v} span={4}>
                <div
                  className={cx(styles.hourMinute, {
                    [styles.active]: isSelected,
                  })}
                  onClick={(e) => {
                    // if (boo)
                    this.onMinuteChange(v, e);
                  }}
                >
                  {v}
                </div>
              </Col>
            );
          })}
        </Row>
      ));
    // return [0, 10, 20, 30, 40, 50]
  };

  getHtml = () => {
    const { hasClose = false, renderExtraFooter } = this.props;
    return (
      <div>
        <div style={{ width: 'calc(100% / 6)', textAlign: 'center' }}>时</div>
        <div
          style={{
            height: 120,
            borderBottom: '1px solid rgba(0, 0, 0, .2)',
          }}
        >
          {this.getHourHtml()}
        </div>
        <div style={{ width: 'calc(100% / 6)', textAlign: 'center' }}>分</div>
        <div style={{ height: 60 }}>
          <Row>{this.getMinuteHtml()}</Row>
        </div>
        <div>
          <Row>
            <Col span={14}>
              <a onClick={this.nowTime}>此刻</a>
              {renderExtraFooter()}
            </Col>
            <Col span={10} className="text-right">
              {hasClose ? (
                <Button className="mr-8" size="small" onClick={this.onCancel}>
                  取消
                </Button>
              ) : null}
              <Button type="primary" onClick={this.onOk} size="small">
                确定
              </Button>
            </Col>
          </Row>
        </div>
      </div>
    );
  };

  nowTime = () => {
    const { onChange, onOpen } = this.props;
    onChange(moment());
    onOpen(false);
  };

  onOk = () => {
    const { value: time, onChange, onOpen, onOk } = this.props;
    // if (time.diff(moment()) > 0) {
    //   notification.warn({
    //     message: '时间过大',
    //     description: '选择时间超过当前时间，请重新选择！！！',
    //   });
    // } else {
    if (onOk) {
      onOk();
    }
    onChange(time);
    onOpen(false);
    // }
  };

  onCancel = () => {
    const { closeTimeSelect } = this.props;
    closeTimeSelect(false);
  };

  onOpenChange = (status) => {
    const { onOpen } = this.props;
    onOpen(status);
  };

  onMinuteChange = (minute) => {
    const { value: time, onChange } = this.props;
    onChange(moment(time).minute(minute));
  };

  onHourChange = (hour) => {
    const { value: time, onChange } = this.props;
    onChange(moment(time).hour(hour));
  };

  onChange = (e) => {
    const { onChange } = this.props;
    if (e) {
      onChange(e);
    }
  };

  disabledDate = (date) =>
      // const year = moment(date).year() - moment().year();
      // const day = date.dayOfYear() - moment().dayOfYear();
      // if (day <= 0 || year < 0) {
      //   return false;
      // }
      // return true;
      // console.log(date, moment().endOf('day'))
       date && date > moment().endOf('day')
  ;

  render() {
    const {
      value: time,
      open,
      width,
      popupStyle,
      dropdownClassName,
      disabled = false,
      format = "MM.DD HH:mm:ss",
    } = this.props;
    return (
      <DatePicker
        showTime
        style={{ width }}
        format={format}
        allowClear={false}
        renderExtraFooter={() => this.getHtml()}
        disabledDate={this.disabledDate}
        showToday={false}
        value={time}
        open={open}
        onChange={this.onChange}
        onOpenChange={this.onOpenChange}
        popupStyle={popupStyle}
        dropdownClassName={cx(dropdownClassName, styles.node)}
        disabled={disabled}
      />
    );
  }
}
TimeSelect.defaultProps = {
  dropdownClassName: '',
  popupStyle: {},
  value: moment().minute(Math.floor(moment().minute() / 10) * 10),
  open: false,
  onChange: () => {},
  onOpen: () => {},
  renderExtraFooter: () => null,
};
