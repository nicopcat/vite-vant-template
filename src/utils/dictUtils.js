import { useDictStore } from '@/store/modules/dict'

export const getDictLabel = (type, key) => {
  const store = useDictStore()
  return store.getDictValue(type, key)
}
export const getDict = type => {
  const store = useDictStore()
  return store.getDict(type)
}

export const getLabel = (dict, key) => {
  if(!dict) return key
  const r = dict.find(x => x.dictValue === key)
  return r ? r?.dictLabel : key
}