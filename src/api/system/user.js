import http from '@/utils/request'

/**
 * @description: 获取用户信息
 */
export function getUserInfo(){
  return http.request({
    url : '/system/user/getInfo',
    method : 'get'
  })
}

/**
 * @description: 用户登录
 */
export function login(data){
  return http.request({
    url : '/auth/login',
    method : 'post',
    data
  })
}

/**
 * @description: 用户修改密码
 */
export function changePassword(data, uid){
  return http.request(
    {
      url : `/user/u${uid}/changepw`,
      method : 'post',
      data
    },
    {
      isTransformResponse : false
    }
  )
}

/**
 * @description: 用户登出
 */
export function userLogout(data){
  return http.request({
    url : '/auth/logout',
    method : 'post',
    data
  })
}

//获取验证码
export async function getCode(){
  return http.request({
    url : '/auth/code'
  })
}
//获取站点列表
export async function getSiteList(){
  return http.request({
    url : '/auth/site/list'
  })
}
/**
 * @description: 用户列表
 */
export function getUserList(params){
  return http.request({
    url : '/system/user/list',
    method : 'GET',
    params
  })
}

/**
 * @description: 更改用户状态
 */
export function userStatusChanged(data){
  return http.request({
    url : '/system/user/changeStatus',
    method : 'put',
    data
  })
}
//新增用户
export function addUser(data){
  return http.request({
    url : '/system/user',
    method : 'post',
    data
  })
}

//重置密码
export function resetPassword(data){
  return http.request({
    url : '/system/user/resetPwd',
    method : 'put',
    data
  })
}
//编辑用户
export function editUser(data){
  return http.request({
    url : '/system/user',
    method : 'put',
    data
  })
}
//删除用户
export function deletedUser(ids){
  return http.request({
    url : `/system/user/${ids}`,
    method : 'delete'
  })
}
//// 导出用户
//export function exportUser(params) {
//return http.request(
//{
//url: `/system/user/export?${qs.stringify(params)}`,
//method: 'post',
//responseType: 'blob',
//},
//{
//isTransformResponse: false,
//},
//)
//}
//获取用户详情
export function getUserDetail(id){
  console.log(id)
  return http.request({
    url : `/system/user/${id}`,
    method : 'get'
  })
}
//获取用户详情
export function getUserDetailInfo(id){
  console.log(id)
  return http.request({
    url : `/system/user/getUserInfo/${id}`,
    method : 'get'
  })
}
//获取新增用户数据
export function getUserData(){
  return http.request({
    url : `/system/user/`,
    method : 'get'
  })
}
//修改用户角色
export function authUserRole(data){
  const { userId, roleIds } = data
  return http.request({
    url : `/system/user/authRole?userId=${userId}&roleIds=${roleIds}`,
    method : 'put'
  })
}
/**
 * 修改用户个人信息
 * @param data 用户信息
 */
export const updateUserProfile = data => {
  return http.request({
    url : '/system/user/profile',
    method : 'put',
    data
  })
}
/**
 * 用户密码重置
 * @param oldPassword 旧密码
 * @param newPassword 新密码
 */
export const updateUserPwd = (oldPassword, newPassword) => {
  const data = {
    oldPassword,
    newPassword
  }
  return http.request({
    url : '/system/user/profile/updatePwd',
    method : 'put',
    headers : {
      isEncrypt : true
    },
    data
  })
}
