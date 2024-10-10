import { getEnvs } from '@/utils/envs'
const { hostname } = window.location

class LocalStorageProxy {
  constructor() {
    this.prefix = this.getPrefix();
  }

  getPrefix() {
    const { envStr } = getEnvs();
    let localStoragePreFix;
    if (envStr === 'dev') {
      localStoragePreFix = 'fat_';
    } else if (envStr === 'fat') {
      localStoragePreFix = 'fat_';
    } else if (envStr === 'uat') {
      localStoragePreFix = 'uat_';
    } else {
      localStoragePreFix = '';
    }
    return localStoragePreFix;
  }

  getAll() {
    const allItems = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith(this.prefix)) {
        allItems[key] = localStorage.getItem(key);
      }
    }
    return allItems;
  }

  clearAll() {
    const keys = Object.keys(this.getAll());
    keys.forEach(key => {
      this.remove(key, false);
    });
  }

  get(key, hasPrefix = true) {
    const keyStr = hasPrefix ? this.prefix + key : key;
    return localStorage.getItem(keyStr);
  }

  set(key, value) {
    const keyStr = this.prefix + key;
    return localStorage.setItem(keyStr, value);
  }

  remove(key, hasPrefix = true) {
    const keyStr = !hasPrefix ? key : this.prefix + key;
    return localStorage.removeItem(keyStr);
  }
}

const localStorageProxy = new LocalStorageProxy();

export default localStorageProxy;