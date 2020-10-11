
const prefix = '-_-'

export const local = {
  get(key) {
    const strValue = localStorage.getItem(prefix + key);
    return JSON.parse(strValue);
  },
  set(key, jsonValue) {
    const strValue = JSON.stringify(jsonValue);
    localStorage.setItem(prefix + key, strValue);
  },
  remove(key) {
    localStorage.removeItem(prefix + key);
  },
  clear() {
    localStorage.clear();
  },
};

export const session = {
  get(key) {
    const strValue = sessionStorage.getItem(prefix + key);
    let value = null
    try {
      value = JSON.parse(strValue);
    } catch (error) {
      value = strValue
    }
    return value;
  },
  set(key, jsonValue) {
    const strValue = JSON.stringify(jsonValue);
    sessionStorage.setItem(prefix + key, strValue);
  },
  remove(key) {
    sessionStorage.removeItem(prefix + key);
  },
  clear() {
    sessionStorage.clear();
  },
};
