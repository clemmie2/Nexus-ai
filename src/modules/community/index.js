import { all, run } from '../../database/index.js';
export function recordMessage(guildId, userId) { run("INSERT INTO member_activity (guild_id,user_id,messages,xp,last_active_at) VALUES (?, ?, 1, 5, CURRENT_TIMESTAMP) ON CONFLICT(guild_id,user_id) DO UPDATE SET messages = messages + 1, xp = xp + 5, last_active_at = CURRENT_TIMESTAMP", [guildId, userId]); }
export function leaderboard(guildId) { return all('SELECT user_id, xp, reputation, messages FROM member_activity WHERE guild_id = ? ORDER BY xp DESC LIMIT 10', [guildId]); }
