import React, { Fragment } from 'react';
import cx from 'classnames';
import { ReloadOutlined } from '@ant-design/icons';
import styles from './Picture.less';

class Picture extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      reload: true,
      visible: false,
    };

    this.wrapRef = React.createRef();
    this.imgRef = React.createRef();
    this.reloadCount = 0;
    this.observer = null;
  }

  componentDidMount() {
    const { current } = this.wrapRef;

    this.observer = new IntersectionObserver(
      ([entries]) => {
        const { visible } = this.state;
        if (entries.intersectionRatio > 0) {
          if (!visible) {
            this.setState({ visible: true, reload: false });
          }
        } else if (visible) {
          this.setState({ visible: false, reload: true });
        }
      },
      {
        root: current.parentNode.parentNode,
        rootMargin: '144px',
        threshold: [0, 0.5, 1],
      },
    );
    this.observer.observe(current);
  }

  componentWillUnmount() {
    this.observer.disconnect();
  }

  /**
   *  重新加载图片
   */
  reload = (url = '') => {
    const { visible } = this.props;
    if (visible) {
      if (this.imgRef.current) {
        const src = `${url}${url.includes('?') ? '&' : '?'}${Math.random()}`;
        this.imgRef.current.src = src;
      }
    } else {
      this.setState({
        visible: true,
      });
    }
  };

  /**
   *  加载图片失败
   */
  handleImgError = () => {
    const { imgUrl } = this.props;
    const count = this.reloadCount;
    setTimeout(() => {
      if (count > 2) {
        this.reloadCount = 0;
        this.setState({
          reload: false,
        });
      } else {
        this.reloadCount = count + 1;
        this.reload(imgUrl);
      }
    }, 3000);
  };

  /**
   *  加载图片成功
   */
  handleImgLoad = () => {
    const { reload } = this.state;
    if (reload) {
      this.setState({
        reload: false,
      });
    }
  };

  /**
   * 重新加载
   */
  reloadRender = () => {
    const { reload } = this.state;
    const { imgUrl } = this.props;
    if (reload) {
      return (
        <div
          className={styles.reload}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            this.reload(imgUrl);
          }}
        >
          <ReloadOutlined />
          <span>点击加载图片</span>
        </div>
      );
    }
    return null;
  };

  render() {
    const { className, style, imgUrl, info, number, actions, onClick: handleImgClick } = this.props;
    const { visible } = this.state;
    return (
      <div className={cx(styles.wrap, className)} style={{ ...style }} ref={this.wrapRef}>
        {this.reloadRender()}
        <div className={styles.info} onClick={(e) => e.stopPropagation()}>
          {info.cph && <div>车牌：{info.cph}</div>}
          <div>时间：{info.time}</div>
          <div>地址：{info.address}</div>
        </div>
        {number > 0 && <div className={styles.number}>{number}</div>}
        {visible && (
          <Fragment key="img">
            <img
              src={imgUrl}
              alt=""
              ref={this.imgRef}
              onLoad={this.handleImgLoad}
              onError={this.handleImgError}
              onClick={handleImgClick}
            />
            <div className={styles.actions}>{actions()}</div>
          </Fragment>
        )}
      </div>
    );
  }
}

Picture.defaultProps = {
  className: '',
  style: {},
  imgUrl: '',
  info: {},
  number: 0, // 选中编号
  actions: () => null, // 操作按钮
  onClick: () => {}, // 图片点击事件
};

export default Picture;
