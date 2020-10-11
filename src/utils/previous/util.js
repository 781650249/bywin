import { saveAs } from 'file-saver';

const Util = () => ({
  // Chrome浏览器
  isChrome() {
    const { userAgent } = window.navigator;
    let isChrome = false;
    let broName = '';
    if (userAgent.indexOf('WOW') < 0 && userAgent.indexOf('Edge') < 0) {
      isChrome = true;
      const strStart = userAgent.indexOf('Chrome');
      const strStop = userAgent.indexOf(' Safari');
      const temp = userAgent.substring(strStart, strStop);
      broName = temp.replace('/', '版本号');
      return { isChrome, broName };
    }
    return { isChrome, broName };
  },
  // downloadRecord
  downloadRecord() {
    const url = ``;
    saveAs(url, '下载图片.png');
  },
  // 下载图片
  downloadImg(url) {
    let imgUrl = url;
    if (url) {
      if (
        url.indexOf('http') === -1 &&
        url.indexOf(';base64,') === -1 &&
        url.indexOf('idstImage') === -1
      ) {
        imgUrl = `data:image/jpeg;base64,${url}`;
      }
    }
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    function download() {
      let canvas = document.createElement('CANVAS');
      const ctx = canvas.getContext('2d');
      canvas.height = this.height;
      canvas.width = this.width;
      ctx.drawImage(this, 0, 0);
      canvas.toBlob((blob) => {
        saveAs(blob, '下载图片.jpg');
      }, 'image/jpeg');
      canvas = null;
    }
    img.onload = download;
    img.src = imgUrl;
  },
  // url转base64
  urlToBase64(url, callback) {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      let canvas = document.createElement('CANVAS');
      const ctx = canvas.getContext('2d');
      canvas.height = img.height;
      canvas.width = img.width;
      ctx.drawImage(img, 0, 0);
      const base64 = canvas.toDataURL('image/jpeg');
      callback(base64);
      canvas = null;
    };
    img.src = url;
  },
  // base64去除前缀
  deleteBase64(base64) {
    if (base64.includes(';base64,')) {
      return base64.split(';base64,')[1];
    }
    return base64;
  },
  addBase64(url) {
    let img = url;
    if (url && url.indexOf(';base64,') === -1) {
      img = `data:image/jpeg;base64,${url}`;
    }
    return img;
  },
  /**
   * 轨迹按时间排序
   */
  sortByTime(cardList) {
    const arr = [...cardList];
    arr.sort((a, b) => {
      let time1 = 1;
      let time2 = 1;
      if (a.wzbjsj && b.wzbjsj) {
        time1 = a.wzbjsj;
        time2 = b.wzbjsj;
      }

      return time1 - time2;
    });
    return arr;
  },
});

export const isJson = (string) => {
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

export default Util();
