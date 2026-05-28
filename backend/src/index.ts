import express from 'express'
import cors from 'cors'
import { env } from './env.js'
import { pool } from './db.js'

type ContactPayload = {
  name: string
  email: string
  message: string
  subject?: string
  source?: string
}

const app = express()

app.use(
  cors({
    origin: env.clientOrigin,
    credentials: true
  })
)
app.use(express.json({ limit: '1mb' }))

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0

const toOptionalString = (value: unknown): string | null => {
  if (typeof value !== 'string') {
    return null
  }
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

const sendServerError = (res: express.Response, error: unknown) => {
  console.error('[api] error', error)
  res.status(500).json({ ok: false, error: 'server_error' })
}

app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('select 1')
    res.json({ ok: true })
  } catch (error) {
    sendServerError(res, error)
  }
})

app.post('/api/contact', async (req, res) => {
  try {
    const payload = req.body as Partial<ContactPayload>
    if (!isNonEmptyString(payload.name)) {
      return res.status(400).json({ ok: false, error: 'name_required' })
    }
    if (!isNonEmptyString(payload.email)) {
      return res.status(400).json({ ok: false, error: 'email_required' })
    }
    if (!isNonEmptyString(payload.message)) {
      return res.status(400).json({ ok: false, error: 'message_required' })
    }

    const name = payload.name.trim()
    const email = payload.email.trim()
    const message = payload.message.trim()
    const subject = toOptionalString(payload.subject)
    const source = toOptionalString(payload.source)

    const result = await pool.query(
      `insert into contact_submissions
        (name, email, message, subject, source)
       values ($1, $2, $3, $4, $5)
       returning id`,
      [name, email, message, subject, source]
    )

    return res.status(201).json({ ok: true, id: result.rows[0]?.id })
  } catch (error) {
    return sendServerError(res, error)
  }
})

app.get('/api/views/:slug', async (req, res) => {
  try {
    const slug = req.params.slug?.trim()
    if (!slug) {
      return res.status(400).json({ ok: false, error: 'slug_required' })
    }

    const result = await pool.query(
      'select views from page_views where slug = $1',
      [slug]
    )

    const views = result.rows[0]?.views ?? 0
    return res.json({ ok: true, slug, views })
  } catch (error) {
    return sendServerError(res, error)
  }
})

app.post('/api/views/:slug', async (req, res) => {
  try {
    const slug = req.params.slug?.trim()
    if (!slug) {
      return res.status(400).json({ ok: false, error: 'slug_required' })
    }

    const result = await pool.query(
      `insert into page_views (slug, views)
       values ($1, 1)
       on conflict (slug)
       do update set views = page_views.views + 1, updated_at = now()
       returning views`,
      [slug]
    )

    return res.json({ ok: true, slug, views: result.rows[0]?.views ?? 1 })
  } catch (error) {
    return sendServerError(res, error)
  }
})

app.get('/api/stats', async (_req, res) => {
  try {
    const result = await pool.query(
      'select stats, updated_at from stats_cache where cache_key = $1',
      ['default']
    )

    const row = result.rows[0]
    return res.json({
      ok: true,
      stats: row?.stats ?? null,
      updatedAt: row?.updated_at ?? null
    })
  } catch (error) {
    return sendServerError(res, error)
  }
})

app.listen(env.port, () => {
  console.log(`[api] listening on ${env.port}`)
})
