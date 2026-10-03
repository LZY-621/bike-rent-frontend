import { defineStore } from 'pinia'
import { login as loginApi } from '@/api/auth'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    userId: localStorage.getItem('userId') || null,
    username: localStorage.getItem('username') || '',
    nickname: localStorage.getItem('nickname') || ''
  }),
  actions: {
    // 登录
    async login(loginForm) {
      const res = await loginApi(loginForm)
      this.token = res.data.token
      this.userId = res.data.userId
      this.username = res.data.username
      this.nickname = res.data.nickname
      localStorage.setItem('token', this.token)
      localStorage.setItem('userId', this.userId)
      localStorage.setItem('username', this.username)
      localStorage.setItem('nickname', this.nickname)
      return res
    },
    // 登出
    logout() {
      this.token = ''
      this.userId = null
      this.username = ''
      this.nickname = ''
      localStorage.removeItem('token')
      localStorage.removeItem('userId')
      localStorage.removeItem('username')
      localStorage.removeItem('nickname')
    }
  }
})
