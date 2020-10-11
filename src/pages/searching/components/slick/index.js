import React, { PureComponent } from 'react';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import cx from 'classnames';
import styles from './index.less';

class Slick extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      x: 0,
      sliderWidth: 0,
      totalWidth: 0,
    };
    this.slider = React.createRef();
    this.trackRef = React.createRef();
    this.stopEvent = false;
  }

  componentDidMount() {
    this.setWidth();
  }

  componentDidUpdate(prevProps) {
    const { visible, children } = this.props;
    const { children: prevChildren } = prevProps;
    if (visible && visible !== prevProps.visible) {
      this.setWidth();
    }
    if (children.constructor !== prevChildren.constructor) {
      this.setWidth();
    } else if (Array.isArray(children) && children.length !== prevChildren.length) {
      this.setWidth();
    }
  }

  setWidth = () => {
    let totalWidth = 0;
    for (const node of this.trackRef.current.childNodes) {
      const { marginLeft, marginRight } = getComputedStyle(node);
      const l = Number(marginLeft.replace(/[^0-9]/g, ''));
      const r = Number(marginRight.replace(/[^0-9]/g, ''));
      totalWidth += node.offsetWidth + l + r;
    }
    this.setState({
      totalWidth,
      sliderWidth: this.slider.current.offsetWidth,
    });
  };

  prev = (e) => {
    e.preventDefault();
    const { x } = this.state;
    const { length } = this.props;
    let width = x;
    if (x <= -length) {
      width += length;
    } else if (x < 0) {
      width = 0;
    } else {
      return;
    }
    this.setX(width);
  };

  next = (e) => {
    e.preventDefault();
    const { x, sliderWidth, totalWidth } = this.state;
    const { length, toTheEnd } = this.props;
    let width = x;
    if (x >= -totalWidth + sliderWidth + length) {
      width = x - length;
    } else if (x >= -totalWidth + sliderWidth) {
      width = -totalWidth + sliderWidth;
      toTheEnd();
    } else {
      return;
    }
    this.setX(width);
  };

  setX = (x) => {
    if (!this.stopEvent) {
      const { speed } = this.props;
      this.setState({ x });
      this.stopEvent = true;
      setTimeout(() => {
        this.stopEvent = false;
      }, speed);
    }
  };

  render() {
    const {
      children,
      speed,
      className,
      wrapClassName,
      style,
      wrapStyle,
      prevStyle,
      nextStyle,
      visible,
    } = this.props;
    const { x, totalWidth } = this.state;
    return (
      <div
        className={cx(styles.wrap, wrapClassName)}
        style={{ display: visible ? 'block' : 'none', ...wrapStyle }}
      >
        <div className={cx(styles.slider, className)} ref={this.slider} style={{ ...style }}>
          <div
            className={styles.track}
            ref={this.trackRef}
            style={{
              width: totalWidth,
              minWidth: '100%',
              transform: `translate3d(${x}px, 0, 0)`,
              transitionDuration: `${speed / 1000}s`,
            }}
          >
            {children}
          </div>
        </div>
        <a className={styles.prev} onClick={this.prev} style={prevStyle} href="">
          <LeftOutlined />
        </a>
        <a className={styles.next} onClick={this.next} style={nextStyle} href="">
          <RightOutlined />
        </a>
      </div>
    );
  }
}

Slick.defaultProps = {
  length: 600,
  speed: 500,
  className: '',
  style: {},
  wrapStyle: {},
  prevStyle: {},
  nextStyle: {},
  visible: true,
  toTheEnd: () => {},
};

export default Slick;
