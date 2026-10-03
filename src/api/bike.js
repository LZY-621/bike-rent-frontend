import request from './request'

// 分页查询自行车
export function pageBike(params) {
  return request({
    url: '/bike/page',
    method: 'get',
    params
  })
}

// 自行车列表
export function listBike() {
  return request({
    url: '/bike/list',
    method: 'get'
  })
}

// 新增自行车
export function addBike(data) {
  return request({
    url: '/bike',
    method: 'post',
    data
  })
}

// 更新自行车
export function updateBike(id, data) {
  return request({
    url: `/bike/${id}`,
    method: 'put',
    data
  })
}

// 删除自行车
export function deleteBike(id) {
  return request({
    url: `/bike/${id}`,
    method: 'delete'
  })
}
