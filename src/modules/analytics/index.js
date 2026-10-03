import { all, one, run } from '../../database/index.js';
export function track(guildId, kind, { channelId = null, userId = null } = {}) { run('INSERT INTO metrics (guild_id, kind, channel_id, user_id) VALUES (?, ?, ?, ?)', [guildId, kind, channelId, userId]); }
export function dashboardStats(guildId) {
  const tickets = one("SELECT count(*) AS count FROM tickets WHERE guild_id = ? AND status = 'open'", [guildId])?.count ?? 0;
  const event = one("SELECT title, starts_at FROM events WHERE guild_id = ? AND status = 'scheduled' AND starts_at > datetime('now') ORDER BY starts_at LIMIT 1", [guildId]);
  const messages = one("SELECT count(*) AS count FROM metrics WHERE guild_id = ? AND kind = 'message' AND created_at > datetime('now', '-7 days')", [guildId])?.count ?? 0;
  return { tickets, event, messages };
}
export function analytics(guildId) { return all("SELECT kind, count(*) AS count FROM metrics WHERE guild_id = ? AND created_at > datetime('now', '-30 days') GROUP BY kind ORDER BY count DESC", [guildId]); }
