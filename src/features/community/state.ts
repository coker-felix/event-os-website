export type CommunityPageState = 'off' | 'down' | 'ready'
export function resolvePageState(result: { data?: { blueprints?: boolean }; error?: unknown }): CommunityPageState {
  if (result.error) return 'down'
  if (!result.data) return 'down'
  return result.data.blueprints ? 'ready' : 'off'
}
