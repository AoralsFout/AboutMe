import { Router, Request, Response } from 'express'
import * as steamApi from '../services/steamApi'

const router = Router()

function getSteamId(req: Request): string | undefined {
  return req.query.steamid ? String(req.query.steamid) : undefined
}

router.get('/recently-played-games', async (req: Request, res: Response) => {
  try {
    const count = req.query.count ? Number(req.query.count) : undefined
    const data = await steamApi.getRecentlyPlayedGames(count, getSteamId(req))
    console.log(`[steam] recently-played-games: ${data.response?.games?.length ?? 0} games`)
    res.json(data)
  } catch (error: any) {
    console.error('[steam] recently-played-games error:', error.message)
    res.status(500).json({ error: error.message })
  }
})

router.get('/single-game-playtime/:appid', async (req: Request, res: Response) => {
  try {
    const appid = Number(req.params.appid)
    if (isNaN(appid)) return res.status(400).json({ error: 'Invalid appid' })
    const data = await steamApi.getSingleGamePlaytime(appid, getSteamId(req))
    console.log(`[steam] single-game-playtime appid=${appid}: ${data.response?.game?.playtime_forever ?? 0}m`)
    res.json(data)
  } catch (error: any) {
    console.error(`[steam] single-game-playtime appid=${req.params.appid} error:`, error.message)
    res.status(500).json({ error: error.message })
  }
})

router.get('/owned-games', async (req: Request, res: Response) => {
  try {
    const includeAppinfo = req.query.includeAppinfo !== 'false'
    const includePlayedFreeGames = req.query.includePlayedFreeGames !== 'false'
    const filter = req.query.appidsFilter ? String(req.query.appidsFilter).split(',').map(Number) : undefined
    const data = await steamApi.getOwnedGames(includeAppinfo, includePlayedFreeGames, filter, getSteamId(req))
    console.log(`[steam] owned-games: ${data.response?.game_count ?? 0} games`)
    res.json(data)
  } catch (error: any) {
    console.error('[steam] owned-games error:', error.message)
    res.status(500).json({ error: error.message })
  }
})

router.get('/steam-level', async (req: Request, res: Response) => {
  try {
    const data = await steamApi.getSteamLevel(getSteamId(req))
    console.log(`[steam] steam-level: ${data.response?.player_level}`)
    res.json(data)
  } catch (error: any) {
    console.error('[steam] steam-level error:', error.message)
    res.status(500).json({ error: error.message })
  }
})

router.get('/badges', async (req: Request, res: Response) => {
  try {
    const data = await steamApi.getBadges(getSteamId(req))
    console.log(`[steam] badges: ${data.response?.badges?.length ?? 0} badges, xp=${data.response?.player_xp}`)
    res.json(data)
  } catch (error: any) {
    console.error('[steam] badges error:', error.message)
    res.status(500).json({ error: error.message })
  }
})

router.get('/community-badge-progress/:badgeid', async (req: Request, res: Response) => {
  try {
    const badgeid = Number(req.params.badgeid)
    if (isNaN(badgeid)) return res.status(400).json({ error: 'Invalid badgeid' })
    const data = await steamApi.getCommunityBadgeProgress(badgeid, getSteamId(req))
    console.log(`[steam] community-badge-progress badgeid=${badgeid}: ${data.response?.quests?.length ?? 0} quests`)
    res.json(data)
  } catch (error: any) {
    console.error(`[steam] community-badge-progress badgeid=${req.params.badgeid} error:`, error.message)
    res.status(500).json({ error: error.message })
  }
})

router.get('/player-summaries', async (req: Request, res: Response) => {
  try {
    const steamids = req.query.steamids ? String(req.query.steamids) : undefined
    const data = await steamApi.getPlayerSummaries(steamids)
    const p = data.response?.players?.[0]
    console.log(`[steam] player-summaries: ${p?.personaname ?? '?'} (${p?.steamid?.slice(-6) ?? 'default'})`)
    res.json(data)
  } catch (error: any) {
    console.error('[steam] player-summaries error:', error.message)
    res.status(500).json({ error: error.message })
  }
})

router.get('/profile-background', async (req: Request, res: Response) => {
  try {
    const data = await steamApi.getProfileBackground(getSteamId(req))
    console.log(`[steam] profile-background: ${data.response?.profile_background ? 'ok' : 'empty'}`)
    res.json(data)
  } catch (error: any) {
    console.error('[steam] profile-background error:', error.message)
    res.status(500).json({ error: error.message })
  }
})

router.get('/avatar-frame', async (req: Request, res: Response) => {
  try {
    const data = await steamApi.getAvatarFrame(getSteamId(req))
    console.log(`[steam] avatar-frame: ${data.response?.avatar_frame ? 'ok' : 'empty'}`)
    res.json(data)
  } catch (error: any) {
    console.error('[steam] avatar-frame error:', error.message)
    res.status(500).json({ error: error.message })
  }
})

router.get('/last-played-times', async (req: Request, res: Response) => {
  try {
    const data = await steamApi.getLastPlayedTimes(getSteamId(req))
    console.log(`[steam] last-played-times: ${data.response?.games?.length ?? 0} games`)
    res.json(data)
  } catch (error: any) {
    console.error('[steam] last-played-times error:', error.message)
    res.status(500).json({ error: error.message })
  }
})

router.get('/shared-library-apps', async (req: Request, res: Response) => {
  try {
    const data = await steamApi.getSharedLibraryApps({
      includeOwn: req.query.includeOwn !== 'false',
      includeExcluded: req.query.includeExcluded !== 'false',
      includeFree: req.query.includeFree !== 'false',
      includeNonGames: req.query.includeNonGames === 'true',
      maxApps: req.query.maxApps ? Number(req.query.maxApps) : undefined,
      steamid: getSteamId(req),
      familyGroupid: req.query.familyGroupid ? String(req.query.familyGroupid) : undefined,
    })
    console.log(`[steam] shared-library-apps: ${data.response?.apps?.length ?? 0} apps`)
    res.json(data)
  } catch (error: any) {
    console.error('[steam] shared-library-apps error:', error.message)
    res.status(500).json({ error: error.message })
  }
})

router.get('/app-details', async (req: Request, res: Response) => {
  try {
    const appids = req.query.appids ? String(req.query.appids) : undefined
    if (!appids) return res.status(400).json({ error: 'Missing appids parameter' })
    const data = await steamApi.getAppDetails(appids)
    const names = Object.values(data ?? {}).map((v: any) => v?.data?.name).filter(Boolean).join(', ')
    console.log(`[steam] app-details appids=${appids}: ${names || 'not found'}`)
    res.json(data)
  } catch (error: any) {
    console.error('[steam] app-details error:', error.message)
    res.status(500).json({ error: error.message })
  }
})

export default router
