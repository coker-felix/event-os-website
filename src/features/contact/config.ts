import { queryOptions } from '@tanstack/react-query'
import { apiGet } from '#/lib/api'
import { MOCKS_ENABLED } from '#/lib/mocks'

/** Support details from `GET /api/config`. Any of them can be missing. */
export interface SiteConfig {
  supportEmail?: string
  supportPhone?: string
  /** Falls back to `supportPhone` until the backend has its own field. */
  supportWhatsapp?: string
}

// Invented, dev only, and obviously fake.
const MOCK_CONFIG: SiteConfig = {
  supportEmail: 'support@example.com',
  supportPhone: '+234 800 000 0000',
}

function text(v: unknown): string | undefined {
  return typeof v === 'string' && v.trim() ? v.trim() : undefined
}

export const siteConfigQuery = queryOptions({
  queryKey: ['site-config'],
  queryFn: async (): Promise<SiteConfig> => {
    try {
      const raw = await apiGet<Record<string, unknown>>('/api/config', {
        timeoutMs: 4000,
      })
      return {
        supportEmail: text(raw.supportEmail),
        supportPhone: text(raw.supportPhone),
        supportWhatsapp: text(raw.supportWhatsapp),
      }
    } catch (err) {
      if (MOCKS_ENABLED) return MOCK_CONFIG
      throw err
    }
  },
  staleTime: 10 * 60 * 1000,
  retry: false,
})

function digitsOf(v: string | undefined): string {
  return v ? v.replace(/\D/g, '') : ''
}

/** `https://wa.me/<digits>`, or null when there is no number. */
export function whatsappLink(number: string | undefined): string | null {
  const digits = digitsOf(number)
  return digits ? `https://wa.me/${digits}` : null
}

/** `tel:` link that keeps a leading plus. Null when there is no number. */
export function telLink(number: string | undefined): string | null {
  const digits = digitsOf(number)
  if (!digits) return null
  return `tel:${number?.trim().startsWith('+') ? '+' : ''}${digits}`
}

export function mailtoLink(email: string | undefined): string | null {
  const clean = email?.trim()
  return clean ? `mailto:${clean}` : null
}
