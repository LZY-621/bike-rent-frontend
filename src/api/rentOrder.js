import request from './request'

// 分页查询订单
export function pageOrder(params) {
  return request({
    url: '/rentOrder/page',
    method: 'get',
    params
  })
}

// 订单列表
export function listOrder() {
  return request({
    url: '/rentOrder/list',
    method: 'get'
  })
}

// 租车
export function rentBike(data) {
  return request({
    url: '/rentOrder/rent',
    method: 'post',
    data
  })
}

// 还车
export function returnBike(orderId) {
  return request({
    url: `/rentOrder/return/${orderId}`,
    method: 'post'
  })
}

// 删除订单
export function deleteOrder(id) {
  return request({
    url: `/rentOrder/${id}`,
    method: 'delete'
  })
}
