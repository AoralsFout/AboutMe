import http from 'node:http'
import https from 'node:https'
import { HttpsProxyAgent } from 'https-proxy-agent'
import { config } from '../config'

const proxyUrl = process.env.https_proxy || process.env.HTTPS_PROXY || process.env.http_proxy || process.env.HTTP_PROXY
const agent: https.Agent | undefined = proxyUrl
  ? (new HttpsProxyAgent(proxyUrl) as unknown as https.Agent)
  : undefined
const REQUEST_TIMEOUT_MS = 15_000

export interface AnimeCollection {
  rate: number
  subject: {
    id: number
    name: string
    name_cn: string
    images: { small: string }
    score: number
  }
}

interface CollectionsResponse {
  total: number
  data: AnimeCollection[]
}

export class BangumiApiError extends Error {
  constructor(message: string, public readonly statusCode = 502) {
    super(message)
  }
}

function getCollections(type: number, limit: number, offset = 0): Promise<CollectionsResponse> {
  const url = new URL(config.bangumiApiBaseUrl)
  url.pathname = `/v0/users/${encodeURIComponent(config.bangumiUsername)}/collections`
  url.search = new URLSearchParams({
    subject_type: '2',
    type: String(type),
    limit: String(limit),
    offset: String(offset),
  }).toString()

  return new Promise((resolve, reject) => {
    const transport = url.protocol === 'http:' ? http : https
    const request = transport.get(url, {
      agent: url.protocol === 'https:' ? agent : undefined,
      headers: { Accept: 'application/json', 'User-Agent': 'AboutMe/1.0' },
    }, response => {
      if (response.statusCode !== 200) {
        response.resume()
        reject(new BangumiApiError(`Bangumi API returned HTTP ${response.statusCode}`))
        return
      }

      let body = ''
      response.setEncoding('utf8')
      response.on('data', (chunk: string) => { body += chunk })
      response.on('error', reject)
      response.on('end', () => {
        try {
          const data = JSON.parse(body) as CollectionsResponse
          if (!Number.isInteger(data.total) || data.total < 0 || !Array.isArray(data.data)) {
            throw new Error('Invalid collections response')
          }
          resolve(data)
        } catch {
          reject(new BangumiApiError('Bangumi API returned invalid collections data'))
        }
      })
    })

    const timeout = setTimeout(() => {
      request.destroy(new BangumiApiError('Bangumi API request timed out', 504))
    }, REQUEST_TIMEOUT_MS)
    request.on('close', () => clearTimeout(timeout))
    request.on('error', reject)
  })
}

export async function getFavoriteAnime(): Promise<CollectionsResponse> {
  const limit = 100
  const firstPage = await getCollections(2, limit)
  const allData = [...firstPage.data]

  for (let offset = limit; offset < firstPage.total; offset += limit) {
    const page = await getCollections(2, limit, offset)
    allData.push(...page.data)
  }

  allData.sort((a, b) => b.rate - a.rate)
  return { total: firstPage.total, data: allData.slice(0, 20) }
}

export const getWatchingAnime = () => getCollections(3, 10)
export const getWantAnime = () => getCollections(1, 10)
export const getPostponeAnime = () => getCollections(4, 1)
export const getAbandonedAnime = () => getCollections(5, 1)
