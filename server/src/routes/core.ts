import { Router, Request, Response } from 'express'
import fs from 'fs'
import { config } from '../config'

const router = Router()

router.get('/fastfetch', (_req: Request, res: Response) => {
  try {
    if (!fs.existsSync(config.fastfetchPath)) {
      console.log('[fastfetch] file not found')
      return res.status(404).json({ error: 'File not found', message: 'fastfetch.txt file does not exist' })
    }
    const content = fs.readFileSync(config.fastfetchPath, 'utf-8')
    console.log(`[fastfetch] served ${content.length} bytes`)
    res.json({ success: true, content })
  } catch (error: any) {
    console.error('[fastfetch] error:', error.message)
    res.status(500).json({ success: false, error: 'Internal server error', message: error.message })
  }
})

router.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

export default router
