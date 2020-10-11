import React, { useState, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import { CloseOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Modal } from '@/components';
import styles from './index.less';

export default function({
  image = '',
  switching = false,
  relativePositions = [],
  onClose = () => {},
  onPrev = () => {},
  onNext = () => {},
  defaultBorder = '',
}) {
  const [position, setPosition] = useState({ x: 0, y: 0, scale: 1 });
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [offset, setOffset] = useState({ offsetX: 0, offsetY: 0 });
  const [isDrag, setIsDrag] = useState(false);
  const [success, setSuccess] = useState(false);
  const containerRef = useRef();
  const imgRef = useRef();

  /**
   * 图片加载成功
   */
  const handleLoad = (e) => {
    setSuccess(true);
    const { naturalWidth, naturalHeight } = e.target;
    const parentWidth = e.target.parentNode.parentNode.clientWidth;
    const parentHeight = e.target.parentNode.parentNode.clientHeight;
    let width = naturalWidth;
    let height = naturalHeight;
    const ratioWidth = width / parentWidth;
    const ratioHeight = height / parentHeight;

    if (ratioWidth > 1 && ratioHeight > 1) {
      const ratio = ratioWidth > ratioHeight ? ratioWidth : ratioHeight;
      width = naturalWidth / ratio;
      height = naturalHeight / ratio;
    } else if (ratioWidth > 1) {
      width = naturalWidth / ratioWidth;
      height = naturalHeight / ratioWidth;
    } else if (ratioHeight > 1) {
      width = naturalWidth / ratioHeight;
      height = naturalHeight / ratioHeight;
    }
    setSize({
      width,
      height,
    });
    setPosition({
      ...position,
      x: parentWidth / 2 - width / 2,
      y: parentHeight / 2 - height / 2,
    });
  };

  /**
   * 鼠标滚轮缩放
   */
  const handleWheel = (e) => {
    const { width, height } = size;
    const { x: prevX, y: prevY, scale: prevScale } = position;
    const { current } = containerRef;
    const {
      left,
      top,
      width: currentWidth,
      height: currentHeight,
    } = current.getBoundingClientRect();
    const offsetX = e.clientX - left;
    const offsetY = e.clientY - top;
    let scale = prevScale;
    let x = prevX;
    let y = prevY;
    if (e.deltaY > 0 && prevScale > 0.5) {
      scale -= 0.1;
      x += (width * 0.1 * offsetX) / currentWidth;
      y += (height * 0.1 * offsetY) / currentHeight;
    } else if (e.deltaY < 0) {
      scale += 0.1;
      x -= (width * 0.1 * offsetX) / currentWidth;
      y -= (height * 0.1 * offsetY) / currentHeight;
    }

    scale = Number(scale.toFixed(1));
    setPosition({ x, y, scale });
  };

  /**
   * 开始拖动
   */
  const handleDragStart = (e) => {
    const { current } = containerRef;
    const { left, top } = current.getBoundingClientRect();
    const offsetX = e.clientX - left;
    const offsetY = e.clientY - top;
    setOffset({
      offsetX: parseInt(offsetX, 10),
      offsetY: parseInt(offsetY, 10),
    });
    setIsDrag(true);
  };

  /**
   * 拖动结束
   */
  const handleDragEnd = () => {
    setIsDrag(false);
  };

  /**
   * 拖动中
   */
  const handleMouseMove = (e) => {
    e.preventDefault();
    const { offsetX, offsetY } = offset;
    const { current } = containerRef;
    if (!isDrag) return;
    const { left, top } = current.parentNode.getBoundingClientRect();
    const x = e.clientX - left - offsetX;
    const y = e.clientY - top - offsetY;
    setPosition({
      x,
      y,
      scale: position.scale,
    });
  };

  /**
   * 窗口关闭
   */
  const handleClose = () => {
    onClose();
    setPosition({ x: 0, y: 0, scale: 1 });
    setSize({ width: 0, height: 0 });
    setOffset({ offsetX: 0, offsetY: 0 });
    setIsDrag(false);
  };

  /**
   * 小图所在大图的相对区域
   */
  const renderPosition = () => {
    if (relativePositions.length === 0 && !success) return null;
    return relativePositions.map((relativePosition, i) => {
      const { startX = 0, startY = 0, endX = 0, endY = 0 } = relativePosition;
      if (endX === 0 || endY === 0 || !imgRef.current) return null;
      const { naturalWidth, naturalHeight } = imgRef.current;
      const width = (((endX - startX) / naturalWidth) * 100).toFixed(2);
      const height = (((endY - startY) / naturalHeight) * 100).toFixed(2);
      const left = ((startX / naturalWidth) * 100).toFixed(2);
      const top = ((startY / naturalHeight) * 100).toFixed(2);
      const colors = ['#ee3f4d', '#0779e4', '#4cbbb9', '#f2a51a', '#d89cf6']
      return (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: `${top}%`,
            left: `${left}%`,
            width: `${width}%`,
            height: `${height}%`,
            border: `2px solid ${!defaultBorder ? colors[i % colors.length] : defaultBorder}`,
          }}
        />
      );
    });
  };
  const { x, y, scale } = position;
  const { width, height } = size;
  return (
    <Modal mount={document.body}>
      <CSSTransition unmountOnExit in={!!image} timeout={300} classNames="modal">
        <div className={styles.wrapper}>
          <div className={styles.close} onClick={handleClose}>
            <CloseOutlined />
          </div>
          <div
            className={styles.container}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleDragEnd}
            onMouseDown={handleDragStart}
            onMouseUp={handleDragEnd}
            onWheel={handleWheel}
            ref={containerRef}
            style={{
              width: width ? width * scale : 'auto',
              height: height ? height * scale : 'auto',
              transform: `translate(${x}px, ${y}px)`,
            }}
          >
            <img ref={imgRef} src={image} alt="" onLoad={handleLoad} draggable="false" />
            {renderPosition()}
          </div>
          {switching && (
            <div className={styles.arrow}>
              <div className={styles.prev} onClick={onPrev}>
                <LeftOutlined />
              </div>
              <div className={styles.next} onClick={onNext}>
                <RightOutlined />
              </div>
            </div>
          )}
        </div>
      </CSSTransition>
    </Modal>
  );
}
