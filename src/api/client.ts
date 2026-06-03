import axios from 'axios'
import { useToast } from '@/composables/useToast'

const API = 'http://localhost:3030'

export const api = axios.create({ baseURL: API })

// 全局错误拦截
api.interceptors.response.use(
  r => r,
  error => {
    const { error: showError } = useToast()
    const msg = error?.response?.data?.message
      || error?.message
      || '网络请求失败'
    showError(msg)
    return Promise.reject(error)
  },
)

// 便捷方法
export function steamApi(path: string) {
  return api.get(`/api/steam/${path}`)
}
