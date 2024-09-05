import { getDictionaryDataListByType } from '@/api/system/dictionary'
import { defineStore } from 'pinia'

export const useDictStore = defineStore({
  id: 'use-dict',
  state: () => ({
    dict: {},
  }),
  getters: {
    getDict() {
      return async function (type) {
        if (this.dict[type]) return this.dict[type]
        await this.getDictDataByType(type)
        return this.dict[type]
      }
    },
    getDictValue() {
      return async function (type, key) {
        if (this.dict[type]) {
          return this.dict[type].find(item => item.dictValue == key)?.dictLabel ?? key
        }
        await this.getDictDataByType(type)
        return this.dict[type].find(item => item.dictValue == key)?.dictLabel ?? key
      }
    },
    getStoredDictValue() {
      return function (type, key) {
        if (this.dict[type]) {
          return this.dict[type].find(item => item.dictValue == key)?.dictLabel ?? key
        }
      }
    },
  },
  actions: {
    setDict(dict) {
      this.dict = dict
    },

    async getDictDataByType(type) {
      const dictData = await getDictionaryDataListByType(type)
      this.dict[type] = dictData.data
      return dictData.data
    },
  },
})
