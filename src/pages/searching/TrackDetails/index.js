import React, { Component } from 'react';
import { connect } from 'dva';
// import { isEqual, orderBy } from 'lodash';
import moment from 'moment';
import cx from 'classnames';
import { Timeline, Typography } from 'antd';
import Icon, { CloseOutlined } from '@ant-design/icons';
import { Trajectory } from '../components/icon';
import styles from './index.less';

const { Paragraph } = Typography;

@connect(({ searchPanel }) => {
  const { selectedResult } = searchPanel;
  return { selectedResult };
})
class TrackDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
    };
  }

  componentDidMount() {}

  componentWillUnmount() {}

  handleVisibleChange = (e) => {
    e.preventDefault();
    const { visible } = this.state;
    this.setState({
      visible: !visible,
    });
  };

  render() {
    const { selectedResult } = this.props;
    const { visible } = this.state;
    if (selectedResult.length > 0) {
      return (
        <div className={styles.container}>
          <a
            href=""
            onClick={this.handleVisibleChange}
            className={cx(styles.btn, 'shadow')}
            title="轨迹详情"
          >
            <Icon component={Trajectory} />
          </a>
          <div className={cx(styles.details, 'shadow', { [styles.show]: visible })}>
            <div className={styles.header}>
              <Icon component={Trajectory} className="mr-8" />
              轨迹详情
              <div className={styles.close} onClick={this.handleVisibleChange}>
                <CloseOutlined />
              </div>
            </div>
            <div className={styles.content}>
              <Timeline>
                {selectedResult.map((element, index) => {
                  const { id, wzbjsj, azdd } = element;
                  const format = 'YYYY-MM-DD HH:mm:ss';
                  const time = moment(wzbjsj, 'YYYYMMDDHHmmss').format(format);
                  return (
                    <Timeline.Item key={id} dot={<span className={styles.dot}>{index + 1}</span>}>
                      <Paragraph ellipsis>
                        <span>{time}</span>
                        <span title={azdd}>{azdd}</span>
                      </Paragraph>
                    </Timeline.Item>
                  );
                })}
              </Timeline>
            </div>
          </div>
        </div>
      );
    }
    return null;
  }
}
export default TrackDetails;
