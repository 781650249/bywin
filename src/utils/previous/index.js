import { session } from '@/utils/storage';

export const getLogin = () => {
  const userInfo = session.get('userInfo');
  if (userInfo) {
    return userInfo.username;
  }
  return ''
};

export const getUsername = () => {
  const userInfo = session.get('userInfo');
  if (userInfo) {
    return userInfo.name;
  }
  return '';
};

/**
 * 通用方法，用在UI组件中，对于一个组件的class，将传入的class和自身的class合并。
 * @param {String} className 传入的外部的className的列表
 * @param {String} defaultClass 默认的内部的className列表
 */
export const joinClass = (className, defaultClass) => {
  if (className && className.length > 0) {
    return `${className} ${defaultClass}`;
  }
  return defaultClass;
};
