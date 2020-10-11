import Exif from 'exif-js';
import { saveAs } from 'file-saver';

/**
 * 图片矫正
 */
export const imageCorrect = (src, callback = () => {}, options = { format: 'image/jpeg' }) => {
  const { format } = options;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    const { naturalWidth: width, naturalHeight: height } = img;
    Exif.getData(img, () => {
      const orientation = Exif.getTag(img, 'Orientation');
      if (orientation === 6) {
        canvas.width = height;
        canvas.height = width;
        ctx.translate(height / 2, width / 2);
        ctx.rotate(Math.PI / 2);
        ctx.drawImage(img, -width / 2, -height / 2, width, height);
      } else {
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
      }
      callback(canvas.toDataURL(format, 0.8));
    });
  };
  img.src = src;
};

/**
 * 验证是否json字符串
 */
export const isJSONString = (string) => {
  if (typeof string === 'string' && /^(\{|\[)[\s\S]*(\}|\])$/.test(string)) {
    try {
      JSON.parse(string);
      return true;
    } catch (error) {
      return false;
    }
  } else {
    return false;
  }
};

const setWatermark = (text) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const leng = Math.sqrt((32 * text.length) ** 2, 32 ** 2) + 32 * 4;
  canvas.width = leng;
  canvas.height = leng / 2 + 32 * 2;
  ctx.translate(leng / 2, leng / 4);
  ctx.rotate((-30 * Math.PI) / 180);
  ctx.font = '32px Arial';
  ctx.fillStyle = 'rgba(127, 127, 127, .3)';
  ctx.fillText(text, -leng / 2 + 32 * 2, 0);
  const image = canvas.toDataURL('image/png', 1);
  return image;
};

/**
 * 图片加水印
 * src 图片地址
 * text 水印文字
 * callback 回调
 * options 设置
 */
export const imageWatermark = (
  src,
  text,
  callback = () => {},
  options = { format: 'image/png' },
) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.src = src;
  img.onload = () => {
    const { naturalWidth: width, naturalHeight: height } = img;
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(img, 0, 0, width, height);
    if (text) {
      const img2 = new Image();
      img2.src = setWatermark(text);
      img2.onload = () => {
        const pat = ctx.createPattern(img2, 'repeat');
        ctx.rect(0, 0, width, height);
        ctx.fillStyle = pat;
        ctx.fill();
        const base64 = canvas.toDataURL(options.format);
        callback(base64);
      };
    } else {
      const base64 = canvas.toDataURL(options.format);
      callback(base64);
    }
  };
};

/**
 * 判断浏览器是否需要升级 返回true 需要， false 不需要
 */
export const isUpgrade = () => {
  const { userAgent } = navigator;
  const isMSIE = /MSIE\s\d+/.test(userAgent);
  const isIE11 = /rv:11\.0/.test(userAgent);
  const isEage = /Edge\/\d+/.test(userAgent);
  const isChrome = /Chrome\/\d+/.test(userAgent);

  if (isMSIE) {
    return true;
  }
  if (isIE11) {
    return false;
  }
  if (isEage) {
    return false;
  }
  if (isChrome) {
    const chrome = /Chrome\/(\d+)/.exec(userAgent);
    if (chrome[1] < 50) {
      return true;
    }
    return false;
  }
  return false;
};

export const dataURLtoBlob = (dataURL) => {
  let base64 = dataURL;
  if (!/^data/.test(dataURL)) {
    base64 = `data:image/jpeg;base64,${dataURL}`;
  }
  const mimeString = base64
    .split(',')[0]
    .split(':')[1]
    .split(';')[0]; // mime类型
  const byteString = atob(base64.split(',')[1]); // base64 解码
  const arrayBuffer = new ArrayBuffer(byteString.length); // 创建缓冲数组
  const intArray = new Uint8Array(arrayBuffer); // 创建视图

  for (let i = 0; i < byteString.length; i += 1) {
    intArray[i] = byteString.charCodeAt(i);
  }
  return new Blob([intArray], { type: mimeString });
};

export const getE0 = (arrayBuffer) => {
  const uint8 = new Uint8Array(arrayBuffer);
  let start = 0;
  let end = 0;
  uint8.forEach((el, i) => {
    const nextEl = uint8[i + 1];
    if (el === 255 && ((nextEl >= 225 && nextEl <= 239) || nextEl === 217) && end === 0) {
      end = i;
    }
    if (el === 224 && uint8[i - 1] === 255) {
      start = i + 1;
    }
  });
  return uint8.slice(start, end);
};

export const setE0 = (arrayBuffer, e0) => {
  const uint8 = new Uint8Array(arrayBuffer);
  let start = 0;
  let end = 0;
  uint8.forEach((el, i) => {
    const nextEl = uint8[i + 1];
    if (el === 255 && ((nextEl >= 225 && nextEl <= 239) || nextEl === 217) && end === 0) {
      end = i;
    }
    if (el === 224 && uint8[i - 1] === 255) {
      start = i + 1;
    }
  });
  const jpegInfo = Array.from(uint8);
  jpegInfo.splice(start, end - start, ...e0);
  return jpegInfo;
};

export const saveImage = (image) => {
  if (image) {
    if (/^http/.test(image)) {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      fetch(image)
        .then((response) => response.blob())
        .then((blob) => {
          saveAs(blob, '下载图片.jpg');
        });
    }
    if (/^data|\/9j|iV/.test(image)) {
      saveAs(dataURLtoBlob(image), '下载图片.jpg');
    }
  }
};
