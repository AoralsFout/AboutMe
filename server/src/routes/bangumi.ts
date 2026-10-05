import { Router, Request, Response } from 'express'
import * as bangumiApi from '../services/bangumiApi'

const router = Router()

const endpoints = [
  ['favorites', bangumiApi.getFavoriteAnime],
  ['watching', bangumiApi.getWatchingAnime],
  ['want', bangumiApi.getWantAnime],
  ['postpone', bangumiApi.getPostponeAnime],
  ['abandoned', bangumiApi.getAbandonedAnime],
] as const

for (const [category, load] of endpoints) {
  router.get(`/anime/${category}`, async (_req: Request, res: Response) => {
    try {
      const data = await load()
      res.json(data)
    } catch (error: unknown) {
      console.error(`[bangumi] ${category} error:`, error instanceof Error ? error.message : error)
      const status = error instanceof bangumiApi.BangumiApiError ? error.statusCode : 502
      res.status(status).json({
        error: 'Bangumi API request failed',
        message: status === 504 ? 'Bangumi 请求超时，请稍后重试' : 'Bangumi 数据加载失败，请稍后重试',
      })
    }
  })
}

export default router
