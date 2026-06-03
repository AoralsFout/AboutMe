import axios from 'axios'
import { useToast } from '@/composables/useToast'

// 开发环境通过 Vite proxy 转发到 localhost:3030
// 生产环境需配置 Nginx 反向代理或直接指向 API 服务器
const baseURL = import.meta.env.DEV ? '' : 'http://localhost:3030'

export const api = axios.create({ baseURL })

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
