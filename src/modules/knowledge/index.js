import { all, one, run } from '../../database/index.js';
export function addKnowledge(guildId, authorId, { title, content, category }) { return run('INSERT INTO knowledge (guild_id, author_id, title, content, category) VALUES (?, ?, ?, ?, ?)', [guildId, authorId, title, content, category]).lastInsertRowid; }
export function searchKnowledge(guildId, query) { return all('SELECT * FROM knowledge WHERE guild_id = ? AND (title LIKE ? OR content LIKE ?) ORDER BY updated_at DESC LIMIT 10', [guildId, `%${query}%`, `%${query}%`]); }
export function removeKnowledge(guildId, id) { return run('DELETE FROM knowledge WHERE guild_id = ? AND id = ?', [guildId, id]).changes; }
export function knowledgeById(id) { return one('SELECT * FROM knowledge WHERE id = ?', [id]); }
