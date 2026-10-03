import request from './request'

// 分页查询用户
export function pageUser(params) {
  return request({
    url: '/user/page',
    method: 'get',
    params
  })
}

// 用户列表
export function listUser() {
  return request({
    url: '/user/list',
    method: 'get'
  })
}

// 新增用户
export function addUser(data) {
  return request({
    url: '/user',
    method: 'post',
    data
  })
}

// 更新用户
export function updateUser(id, data) {
  return request({
    url: `/user/${id}`,
    method: 'put',
    data
  })
}

// 删除用户
export function deleteUser(id) {
  return request({
    url: `/user/${id}`,
    method: 'delete'
  })
}

// 充值
export function recharge(data) {
  return request({
    url: '/user/recharge',
    method: 'post',
    data
  })
}
