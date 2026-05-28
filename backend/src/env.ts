import dotenv from 'dotenv'

dotenv.config()

const requireEnv = (name: string): string => {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required env var: ${name}`)
  }
  return value
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number.parseInt(process.env.PORT ?? '4000', 10),
  postgresUrl: requireEnv('POSTGRES_URL'),
  clientOrigin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173',
  mailTo: process.env.MAIL_TO ?? '',
  mailFrom: process.env.MAIL_FROM ?? ''
}
