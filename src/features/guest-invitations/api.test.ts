import { afterEach, describe, expect, it, vi } from 'vitest'
import { getInvitation, optOutOfInvitation, respondToInvitation } from './api'

afterEach(() => vi.unstubAllGlobals())

describe('public guest invitation API contract', () => {
  it('loads invitation details from the public token endpoint', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      eventTitle: 'Summer Gathering', startsAt: 1794000000, status: 'invited',
      partySize: 2, closed: false, maxPartySize: 5,
    }), { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)
    await getInvitation('guest token')
    expect(fetchMock.mock.calls[0][0]).toBe('http://localhost:8080/api/v1/guest-invitations/guest%20token')
    expect(fetchMock.mock.calls[0][1].method).toBe('GET')
  })

  it('sends the exact response body and opt-out path', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({
        eventTitle: 'Summer Gathering', startsAt: 1794000000, status: 'going',
        partySize: 3, closed: false, maxPartySize: 5,
      }), { status: 200 }))
      .mockResolvedValueOnce(new Response('{"ok":true}', { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)
    await respondToInvitation('abc', 'going', 3)
    await optOutOfInvitation('abc')
    expect(fetchMock.mock.calls[0][0]).toBe('http://localhost:8080/api/v1/guest-invitations/abc/respond')
    expect(fetchMock.mock.calls[0][1].body).toBe('{"response":"going","partySize":3}')
    expect(fetchMock.mock.calls[1][0]).toBe('http://localhost:8080/api/v1/guest-invitations/abc/opt-out')
    expect(fetchMock.mock.calls[1][1].body).toBeUndefined()
  })
})
