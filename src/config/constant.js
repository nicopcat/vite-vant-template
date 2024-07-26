export const WX_APPID = 'appid'
export const COOKIE_PREFIX = 'vite_'
export const TOKEN = `${COOKIE_PREFIX}_token`
export const AVATAR = 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
export const ACCESS_TOKEN = 'ACCESS-TOKEN' //用户token
export const CURRENT_USER = 'CURRENT-USER' //当前用户信息
export const IS_LOCKSCREEN = 'IS-LOCKSCREEN' //是否锁屏
export const TABS_ROUTES = 'TABS-ROUTES' //标签页

export const GLOBAL_DATA = {
  env : 'fat',
  //dev : {
  //baseUrl : '/api'
  //},
  fat : {
    baseUrl : '/api'
  },
  uat : {
    baseUrl : '/api'
  },
  pro : {
    baseUrl : '/pro-api'
  }
}

export const WHITE_CODE_LIST = [
  {
    code : 200,
    msg : ''
  },
  {
    code : 5006,
    msg : '验证码错误或已过期'
  }
]

export const LOGIN_ERROR_CODE = [
  {
    code : 5004,
    msg : '无效token'
  }
]

/**
 * @description: Request result set
 */
export const ResultEnum = {
  SUCCESS : 200,
  ERROR : 500,
  TIMEOUT : 401,
  TYPE : 'success'
}

/**
 * @description: Request methods
 */
export const RequestEnum = {
  GET : 'GET',
  POST : 'POST',
  PATCH : 'PATCH',
  PUT : 'PUT',
  DELETE : 'DELETE'
}

/**
 * @description: Common content type
 */
export const ContentTypeEnum = {
  //json
  JSON : 'application/json;charset=UTF-8',
  //json
  TEXT : 'text/plain;charset=UTF-8',
  //form-data usually used with qs
  FORM_URLENCODED : 'application/x-www-form-urlencoded;charset=UTF-8',
  //form-data upload
  FORM_DATA : 'multipart/form-data;charset=UTF-8'
}
