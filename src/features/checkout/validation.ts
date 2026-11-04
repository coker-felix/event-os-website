import { parseContact } from '#/features/alerts/subscribe'
import type { Question } from '#/features/tickets/types'

/** Answer to one question; set the field that matches the question type. */
export interface QuestionAnswer {
  questionId: string
  text?: string
  options?: Array<string>
  boolValue?: boolean | null
  date?: string
  waiverAccepted?: boolean
}

export type ContactResult =
  | { ok: true; phone?: string; email?: string }
  | { ok: false; errors: { contact?: string; phone?: string; email?: string } }

/** At least one of phone or email is required, and each must be valid. */
export function validateContact(input: {
  phone?: string
  email?: string
}): ContactResult {
  const phoneRaw = input.phone?.trim() ?? ''
  const emailRaw = input.email?.trim() ?? ''
  if (!phoneRaw && !emailRaw) {
    return {
      ok: false,
      errors: { contact: 'Enter a phone number or an email address.' },
    }
  }
  const errors: { phone?: string; email?: string } = {}
  let phone: string | undefined
  let email: string | undefined
  if (phoneRaw) {
    const parsed = parseContact(phoneRaw)
    if (parsed && !parsed.includes('@')) phone = parsed
    else errors.phone = 'Enter a valid phone number, like +234 801 234 5678.'
  }
  if (emailRaw) {
    const parsed = parseContact(emailRaw)
    if (parsed?.includes('@')) email = parsed
    else errors.email = 'Enter a valid email address, like name@example.com.'
  }
  if (errors.phone || errors.email) return { ok: false, errors }
  return { ok: true, ...(phone ? { phone } : {}), ...(email ? { email } : {}) }
}

/** Error message per question id for every missing required answer. */
export function validateAnswers(
  questions: Array<Question>,
  answers: Record<string, Omit<QuestionAnswer, 'questionId'>>,
): Record<string, string> {
  const errors: Record<string, string> = {}
  for (const q of questions) {
    const a = answers[q.id] ?? {}
    switch (q.type) {
      case 'waiver':
        // A waiver is always an explicit yes.
        if (a.waiverAccepted !== true) errors[q.id] = 'Accept the waiver to continue.'
        break
      case 'short_text':
      case 'long_text':
        if (q.required && !a.text?.trim()) errors[q.id] = 'Answer this question.'
        break
      case 'single_select':
      case 'multi_select':
        if (q.required && !a.options?.length) errors[q.id] = 'Choose an option.'
        break
      case 'boolean':
        if (q.required && (a.boolValue === undefined || a.boolValue === null))
          errors[q.id] = 'Choose yes or no.'
        break
      case 'date':
        if (q.required && !a.date) errors[q.id] = 'Pick a date.'
        break
    }
  }
  return errors
}
