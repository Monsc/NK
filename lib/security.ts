import { z } from 'zod'
import { Redis } from '@upstash/redis'

const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN 
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null

// Input validation schemas
export const donationSchema = z.object({
  amount: z.number().positive().max(1000000),
  currency: z.enum(['USDT', 'USD', 'EUR']),
  donor: z.string().min(1).max(100),
  message: z.string().max(500).optional(),
  anonymous: z.boolean().default(false)
})

export const expenseSchema = z.object({
  description: z.string().min(1).max(200),
  amount: z.number().positive().max(1000000),
  currency: z.enum(['USDT', 'USD', 'EUR']),
  category: z.string().min(1).max(50),
  receipt: z.string().url().optional()
})

export const subscriberSchema = z.object({
  email: z.string().email(),
  preferences: z.object({
    newsletter: z.boolean(),
    updates: z.boolean(),
    events: z.boolean()
  })
})

// Rate limiting
export async function checkRateLimit(
  identifier: string,
  limit: number = 100,
  windowMs: number = 15 * 60 * 1000 // 15 minutes
): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
  if (!redis) {
    return {
      allowed: true,
      remaining: limit,
      resetTime: Date.now() + windowMs
    }
  }

  const key = `rate_limit:${identifier}`
  const now = Date.now()
  const windowStart = now - windowMs

  try {
    // Get current window requests
    const requests = await redis.zrange(key, 0, -1, { withScores: true }) as Array<{ member: string; score: number }>
    const currentCount = requests.filter(req => req.score >= windowStart).length

    if (currentCount >= limit) {
      const oldestRequest = requests[0]
      const resetTime = oldestRequest ? oldestRequest.score + windowMs : now + windowMs
      
      return {
        allowed: false,
        remaining: 0,
        resetTime
      }
    }

    // Add new request
    await redis.zadd(key, { score: now, member: now.toString() })
    await redis.expire(key, Math.ceil(windowMs / 1000))

    return {
      allowed: true,
      remaining: limit - currentCount - 1,
      resetTime: now + windowMs
    }
  } catch (error) {
    console.error('Rate limit check failed:', error)
    // Allow request if rate limiting fails
    return {
      allowed: true,
      remaining: limit,
      resetTime: now + windowMs
    }
  }
}

// Input sanitization
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim()
}

// XSS protection
export function escapeHtml(text: string): string {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

// CSRF token validation
export function validateCsrfToken(token: string, sessionToken: string): boolean {
  return token === sessionToken
}

// Security headers
export function getSecurityHeaders(): Record<string, string> {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
  }
}

// Client IP extraction
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  if (realIP) {
    return realIP
  }
  
  return 'unknown' // Fallback if x-forwarded-for and x-real-ip are not present
}

// Content Security Policy
export const cspDirectives = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-eval'", "'unsafe-inline'", "https://www.googletagmanager.com"],
  'style-src': ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
  'font-src': ["'self'", "https://fonts.gstatic.com"],
  'img-src': ["'self'", "data:", "https:"],
  'connect-src': ["'self'", "https://api.openai.com", "https://api.notion.com"],
  'frame-ancestors': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"]
}

export function generateCspHeader(): string {
  return Object.entries(cspDirectives)
    .map(([key, values]) => `${key} ${values.join(' ')}`)
    .join('; ')
}
