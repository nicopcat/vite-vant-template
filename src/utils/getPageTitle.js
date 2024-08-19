import defaultSettings from '@/settings'
const title = defaultSettings.title || '智慧工厂'

export default function getPageTitle(pageTitle){
  if (pageTitle){
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
