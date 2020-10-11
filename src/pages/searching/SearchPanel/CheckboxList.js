import React from 'react';
import { Checkbox, Tree } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import cx from 'classnames';
import { Modal } from '@/components';
import styles from './CheckboxList.less';

const { TreeNode } = Tree;

class CheckboxList extends React.Component {
  constructor(props) {
    super(props);
    this.wrapRef = React.createRef();
    this.listRef = React.createRef();
    this.state = {
      visible: false,
    };
  }

  componentDidMount() {
    document.addEventListener('mouseup', this.closePopup);
  }

  componentWillUnmount() {
    document.removeEventListener('mouseup', this.closePopup);
  }

  closePopup = (e) => {
    const { current } = this.wrapRef;
    if (current && !current.contains(e.target) && !this.listRef.current.contains(e.target)) {
      this.setState({ visible: false });
    }
  };

  setVisible = (visible) => {
    this.setState({
      visible,
    });
  };

  handleCheckAllChange = (e) => {
    const { onChange, list } = this.props;
    if (e.target.checked) {
      onChange([...list]);
    } else {
      onChange([]);
    }
  };

  render() {
    const { visible } = this.state;
    const { list, selectedList, className, onChange } = this.props;
    const listLength = list.length;
    const selectedLength = selectedList.length;
    const checkAll = listLength > 0 && listLength === selectedLength;
    const indeterminate = selectedLength > 0 && selectedLength > listLength;
    let text = selectedList.join(', ');
    if (selectedLength > 0 && selectedLength === listLength) {
      text = '所有';
    }
    return (
      <div className={cx(styles.wrap)} ref={this.wrapRef}>
        <div
          className={cx(className, 'ellipsis')}
          style={{ padding: '0 4px' }}
          onClick={() => this.setVisible(!visible)}
        >
          {text}
        </div>
        <Modal>
          <div
            className={cx(styles.list, 'shadow', { [styles.visible]: visible })}
            ref={this.listRef}
          >
            <div className={styles.close} onClick={() => this.setVisible(false)}>
              <CloseOutlined />
            </div>
            <Checkbox
              style={{ marginLeft: 24 }}
              checked={checkAll}
              indeterminate={indeterminate}
              onChange={this.handleCheckAllChange}
            >
              全选
            </Checkbox>
            <Tree checkable checkedKeys={selectedList} onCheck={onChange}>
              {list.map((el) => (
                <TreeNode value={el} title={el} key={el} />
              ))}
            </Tree>
          </div>
        </Modal>
      </div>
    );
  }
}

CheckboxList.defaultProps = {
  className: '',
  list: [],
  selectedList: [],
  onChange: () => {},
};

export default CheckboxList;
