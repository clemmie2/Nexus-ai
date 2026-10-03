import { run } from '../database/index.js';
export function audit(guildId, action, { actorId = null, targetId = null, metadata = {} } = {}) {
  run('INSERT INTO audit_logs (guild_id, actor_id, action, target_id, metadata) VALUES (?, ?, ?, ?, ?)', [guildId, actorId, action, targetId, JSON.stringify(metadata)]);
}
