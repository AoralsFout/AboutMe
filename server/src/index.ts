import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import { config } from './config'
import coreRoutes from './routes/core'
import steamRoutes from './routes/steam'

const app = express()

app.use(cors())

app.use((req: Request, _res: Response, next: NextFunction) => {
  const ts = new Date().toISOString().slice(11, 19)
  console.log(`[${ts}] --> ${req.method} ${req.originalUrl}`)
  next()
})

app.use('/api', coreRoutes)
app.use('/api/steam', steamRoutes)

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[unhandled error]', err.message, err.stack)
  res.status(500).json({ error: 'Internal server error' })
})

app.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.port}`)
  console.log(`Steam API endpoints at http://localhost:${config.port}/api/steam/*`)
})
