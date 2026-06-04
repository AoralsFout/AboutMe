import https from 'node:https'
import { HttpsProxyAgent } from 'https-proxy-agent'
import { config } from '../config'

const STEAM_API_HOST = 'api.steampowered.com'
const STORE_API_HOST = 'store.steampowered.com'

// 如果设置 http_proxy/https_proxy 环境变量，则走代理（用于 Mihomo 等）
const proxyUrl = process.env.http_proxy || process.env.https_proxy || process.env.HTTP_PROXY || process.env.HTTPS_PROXY || ''
const agent: https.Agent = proxyUrl
  ? (new HttpsProxyAgent(proxyUrl) as unknown as https.Agent)
  : new https.Agent({ rejectUnauthorized: false })

function httpsGet<T>(hostname: string, path: string, headers?: Record<string, string>): Promise<T> {
  return new Promise((resolve, reject) => {
    https.get({ hostname, path, agent, headers }, (res) => {
      let body = ''
      res.on('data', (chunk: string) => { body += chunk })
      res.on('end', () => {
        try {
          if (res.statusCode !== 200) {
            const msg = `HTTP ${res.statusCode}: ${res.statusMessage} (${hostname}${path})`
            console.error(`[steamApi] ${msg}`)
            if (body) console.error(`[steamApi] response body:`, body.slice(0, 500))
            reject(new Error(msg))
            return
          }
          resolve(JSON.parse(body) as T)
        } catch (e) {
          console.error(`[steamApi] parse error for ${hostname}${path}:`, e)
          reject(e)
        }
      })
    }).on('error', (err) => {
      console.error(`[steamApi] request failed for ${hostname}${path}:`, err.message)
      reject(err)
    })
  })
}

function steamGet<T>(path: string, params: Record<string, string | number | boolean> = {}): Promise<T> {
  const searchParams = new URLSearchParams()
  searchParams.set('key', config.steamApiKey)
  for (const [k, v] of Object.entries(params)) {
    searchParams.set(k, String(v))
  }
  const endpoint = path.split('/').filter(Boolean).slice(-1)[0] ?? path
  console.log(`[steamApi] --> ${endpoint}`)
  return httpsGet<T>(STEAM_API_HOST, `${path}?${searchParams.toString()}`)
    .then(data => {
      console.log(`[steamApi] <-- ${endpoint} OK`)
      return data
    })
}

function storeGet<T>(path: string, headers?: Record<string, string>): Promise<T> {
  return httpsGet<T>(STORE_API_HOST, path, headers)
}

// ---- interfaces ----

export interface RecentlyPlayedGame {
  appid: number
  name: string
  playtime_2weeks: number
  playtime_forever: number
  img_icon_url: string
  playtime_windows_forever: number
  playtime_mac_forever: number
  playtime_linux_forever: number
}

export interface OwnedGame {
  appid: number
  name: string
  playtime_forever: number
  img_icon_url: string
  playtime_windows_forever: number
  playtime_mac_forever: number
  playtime_linux_forever: number
  rtime_last_played: number
}

export interface PlayerSummary {
  steamid: string
  communityvisibilitystate: number
  profilestate: number
  personaname: string
  profileurl: string
  avatar: string
  avatarmedium: string
  avatarfull: string
  avatarhash: string
  lastlogoff: number
  personastate: number
  primaryclanid?: string
  timecreated: number
  personastateflags: number
  gameextrainfo?: string
  gameid?: string
  loccountrycode?: string
}

export interface Badge {
  badgeid: number
  level: number
  completion_time: number
  xp: number
  scarcity: number
}

export interface CommunityBadgeProgress {
  quests: Array<{
    questid: number
    completed: boolean
  }>
}

// ---- IPlayerService ----

export function getRecentlyPlayedGames(count?: number, steamid?: string) {
  return steamGet<{ response: { total_count: number; games: RecentlyPlayedGame[] } }>(
    '/IPlayerService/GetRecentlyPlayedGames/v1/',
    { steamid: steamid ?? config.steamId, count: count ?? 0 }
  )
}

export function getSingleGamePlaytime(appid: number, steamid?: string) {
  return steamGet<{ response: { game: { appid: number; playtime_forever: number; playtime_2weeks: number } } }>(
    '/IPlayerService/GetSingleGamePlaytime/v1/',
    { steamid: steamid ?? config.steamId, appid }
  )
}

export function getOwnedGames(includeAppinfo = true, includePlayedFreeGames = true, appidsFilter?: number[], steamid?: string) {
  const params: Record<string, string | number | boolean> = {
    steamid: steamid ?? config.steamId,
    include_appinfo: includeAppinfo,
    include_played_free_games: includePlayedFreeGames,
    language: 'schinese'
  }
  if (appidsFilter?.length) {
    params.appids_filter = appidsFilter.join(',')
  }
  return steamGet<{ response: { game_count: number; games: OwnedGame[] } }>(
    '/IPlayerService/GetOwnedGames/v1/',
    params
  )
}

export function getSteamLevel(steamid?: string) {
  return steamGet<{ response: { player_level: number } }>(
    '/IPlayerService/GetSteamLevel/v1/',
    { steamid: steamid ?? config.steamId }
  )
}

export function getBadges(steamid?: string) {
  return steamGet<{ response: { badges: Badge[]; player_xp: number; player_level: number; player_xp_needed_to_level_up: number; player_xp_needed_current_level: number } }>(
    '/IPlayerService/GetBadges/v1/',
    { steamid: steamid ?? config.steamId }
  )
}

export function getCommunityBadgeProgress(badgeid: number, steamid?: string) {
  return steamGet<{ response: { quests: CommunityBadgeProgress['quests'] } }>(
    '/IPlayerService/GetCommunityBadgeProgress/v1/',
    { steamid: steamid ?? config.steamId, badgeid }
  )
}

export function getProfileBackground(steamid?: string) {
  return steamGet<{ response: { profile_background: Record<string, any> } }>(
    '/IPlayerService/GetProfileBackground/v1/',
    { steamid: steamid ?? config.steamId }
  )
}

export function getAvatarFrame(steamid?: string) {
  return steamGet<{ response: { avatar_frame: Record<string, any> } }>(
    '/IPlayerService/GetAvatarFrame/v1/',
    { steamid: steamid ?? config.steamId }
  )
}

export function getLastPlayedTimes(steamid?: string) {
  return steamGet<{ response: { games: Array<{ appid: number; last_playtime: number; playtime_2weeks: number; playtime_forever: number; playtime_windows_forever: number; playtime_mac_forever: number; playtime_linux_forever: number }> } }>(
    '/IPlayerService/ClientGetLastPlayedTimes/v1/',
    { steamid: steamid ?? config.steamId }
  )
}

// ---- ISteamUser ----

export function getPlayerSummaries(steamids?: string) {
  return steamGet<{ response: { players: PlayerSummary[] } }>(
    '/ISteamUser/GetPlayerSummaries/v2/',
    { steamids: steamids ?? config.steamId }
  )
}

// ---- IFamilyGroupsService ----

export function getSharedLibraryApps(options?: {
  includeOwn?: boolean
  includeExcluded?: boolean
  includeFree?: boolean
  includeNonGames?: boolean
  maxApps?: number
  steamid?: string
  familyGroupid?: string
}) {
  return steamGet<{ response: { apps: Array<Record<string, any>> } }>(
    '/IFamilyGroupsService/GetSharedLibraryApps/v1/',
    {
      steamid: options?.steamid ?? config.steamId,
      family_groupid: options?.familyGroupid ?? config.familyGroupId,
      include_own: options?.includeOwn ?? true,
      include_excluded: options?.includeExcluded ?? true,
      include_free: options?.includeFree ?? true,
      include_non_games: options?.includeNonGames ?? false,
      language: 'schinese',
      ...(options?.maxApps != null ? { max_apps: options.maxApps } : {}),
    }
  )
}

// ---- Store API ----

const appDetailsCache = new Map<string, any>()
const pendingRequests = new Map<string, Promise<any>>()

export function getAppDetails(appids: string) {
  if (appDetailsCache.has(appids)) {
    console.log(`[cache] HIT  appids=${appids} (cache size: ${appDetailsCache.size})`)
    return Promise.resolve(appDetailsCache.get(appids))
  }
  if (pendingRequests.has(appids)) {
    console.log(`[cache] DEDUP appids=${appids} (sharing in-flight request)`)
    return pendingRequests.get(appids)!
  }
  console.log(`[cache] MISS appids=${appids} -> fetching from store`)
  const promise = storeGet<any>(`/api/appdetails?appids=${appids}`, { 'Accept-Language': 'zh-CN' })
    .then(data => {
      appDetailsCache.set(appids, data)
      pendingRequests.delete(appids)
      console.log(`[cache] STORE appids=${appids} (cache size: ${appDetailsCache.size})`)
      return data
    })
    .catch(err => {
      pendingRequests.delete(appids)
      throw err
    })
  pendingRequests.set(appids, promise)
  return promise
}
