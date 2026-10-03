import { all, one, run } from '../../database/index.js';
import { audit } from '../../services/audit.js';
export function createEvent(guildId, channelId, creatorId, event) { const id = run('INSERT INTO events (guild_id, channel_id, creator_id, title, description, starts_at) VALUES (?, ?, ?, ?, ?, ?)', [guildId, channelId, creatorId, event.title, event.description, event.startsAt]).lastInsertRowid; audit(guildId, 'event:create', { actorId: creatorId, targetId: String(id) }); return Number(id); }
export function eventById(id) { return one('SELECT * FROM events WHERE id = ?', [id]); }
export function setRsvp(eventId, userId, response) { run('INSERT INTO rsvps (event_id, user_id, response) VALUES (?, ?, ?) ON CONFLICT(event_id, user_id) DO UPDATE SET response = excluded.response', [eventId, userId, response]); }
export function rsvpStats(eventId) { return all('SELECT response, count(*) AS count FROM rsvps WHERE event_id = ? GROUP BY response', [eventId]); }
export function upcoming(guildId) { return all("SELECT * FROM events WHERE guild_id = ? AND status = 'scheduled' AND starts_at > datetime('now') ORDER BY starts_at LIMIT 10", [guildId]); }
