import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'dva';
import cx from 'classnames';
import { Avatar, message } from 'antd';
import styles from './index.less';
import { colors } from '../config';

@connect(({ searchPanel }) => {
  const { currentKey, multRelation, multSearchResult } = searchPanel;
  return { currentKey, multRelation, multSearchResult };
})
class MultipleSearch extends React.PureComponent {
  constructor(props) {
    super(props);
    this.el = document.createElement('div');
  }

  componentDidMount() {
    document.body.appendChild(this.el);
  }

  componentWillUnmount() {
    document.body.removeChild(this.el);
  }

  /**
   * 同行当前项改变事件
   */
  handleChange = (currentKey) => {
    const { dispatch, multSearchResult } = this.props;
    if (multSearchResult[currentKey].length === 0) {
      message.warning('当前项没有搜索结果');
    }
    dispatch({
      type: 'searchPanel/multSearchChange',
      currentKey,
    });
  };

  render() {
    const { currentKey, multRelation } = this.props;
    if (currentKey) {
      return ReactDOM.createPortal(
        <div className={cx(styles.items, 'shadow')}>
          {Object.keys(multRelation).map((key, i) => {
            const color = colors[i] || `hsl(${100 * i}, 80%, 60%)`;
            return (
              <div
                key={key}
                className={cx(styles.item, {
                  [styles.active]: key === currentKey,
                })}
                onClick={() => this.handleChange(key)}
              >
                <Avatar
                  src={`data:image/jpeg;base64,${multRelation[key]}`}
                  shape="square"
                  icon="user"
                  size="large"
                  style={{
                    border: `2px solid ${color}`,
                  }}
                />
              </div>
            );
          })}
        </div>,
        this.el,
      );
    }
    return null;
  }
}
export default MultipleSearch;
