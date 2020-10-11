import React, { useState, useEffect, useRef } from 'react';
import ReactCrop from 'react-image-crop';
import Aliplayer from '@/components/Aliplayer';
import styles from './index.less';

export default function({ value: editVedioArea = [], selectedPointInfo = {}, onChange: handleMarqueeOk = () => {} }) {
  const videoHeight = useRef(253);
  const videoWidth = useRef(449);
  const [crop, setCrop] = useState({});
  const [pixelCrop, setPixelCrop] = useState({});
  const editVedioAreaJson = JSON.stringify(editVedioArea);

  const onDragEnd = () => {
    const leftAbscissa = parseInt((pixelCrop.x * 1920) / videoWidth.current, 10);
    const leftCoordinate = parseInt((pixelCrop.y * 1920) / videoWidth.current, 10);
    const rigthAbscissa = parseInt(
      ((pixelCrop.x + pixelCrop.width) * 1920) / videoWidth.current,
      10,
    );
    const rigthCoordinate = parseInt(
      ((pixelCrop.y + pixelCrop.height) * 1920) / videoWidth.current,
      10,
    );
    if (leftAbscissa === rigthAbscissa && leftCoordinate === rigthCoordinate) {
      handleMarqueeOk([]);
    } else {
      handleMarqueeOk([[
        [leftAbscissa, leftCoordinate],
        [rigthAbscissa, leftCoordinate],
        [rigthAbscissa, rigthCoordinate],
        [leftAbscissa, rigthCoordinate],
      ]]);
    }
    // console.log(leftAbscissa, leftCoordinate, rigthAbscissa, rigthCoordinate);
  };

  useEffect(() => {
    const editVedioAreaArray = JSON.parse(editVedioAreaJson);
    if(Array.isArray(editVedioAreaArray) && editVedioAreaArray.length !== 0) {
      const box = editVedioAreaArray[0];
      setCrop({
        aspect: undefined,
        unit: 'px',
        x: parseInt((box[0][0] * videoWidth.current) / 1920, 10),
        y: parseInt((box[0][1] * videoWidth.current) / 1920, 10),
        width: parseInt(((box[1][0] - box[0][0]) * videoWidth.current) / 1920, 10),
        height: parseInt(((box[3][1] - box[0][1]) * videoWidth.current) / 1920, 10),
      })
      setPixelCrop({
        x: parseInt((box[0][0] * videoWidth.current) / 1920, 10),
        y: parseInt((box[0][1] * videoWidth.current) / 1920, 10),
        width: parseInt(((box[1][0] - box[0][0]) * videoWidth.current) / 1920, 10),
        height: parseInt(((box[3][1] - box[0][1]) * videoWidth.current) / 1920, 10),
      })
    }else {
      setCrop({});
      setPixelCrop({});
    }
  }, [editVedioAreaJson])

  const getNewPixelCrop = (pix) => {
    const width = parseInt((videoWidth.current * pix.width) / 100, 10);
    const height = parseInt((videoHeight.current * pix.height) / 100, 10);
    const x = parseInt((videoWidth.current * pix.x) / 100, 10);
    const y = parseInt((videoHeight.current * pix.y) / 100, 10);
    return {
      width,
      height,
      x,
      y,
    };
  };

  const onCropChange = (cop, pix) => {
    const newPixelCrop = getNewPixelCrop(pix);
    setCrop(cop);
    setPixelCrop(newPixelCrop);
  };

  const onDragStart = () => {
    if (document.querySelector('.ReactCrop__crop-selection')) {
      document.querySelector('.ReactCrop__crop-selection').style.zIndex = 1006;
    }
  };

  return (
    <div className={styles.videoWrapper} style={{ height: videoHeight.current }}>
      <ReactCrop
        style={{
          zIndex: 1006,
          position: 'absolute',
          display: 'block',
          cursor: 'crosshair',
        }}
        crop={crop}
        onChange={onCropChange}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        renderComponent={<div style={{ width: videoWidth.current, height: videoHeight.current }} />}
      />
      <div
        style={{
          position: 'absolute',
          width: videoWidth.current,
          height: videoHeight.current,
        }}
      >
        <Aliplayer id={selectedPointInfo.id} cameraId={selectedPointInfo.id} selectTime={[]} />
      </div>
    </div>
  );
}
