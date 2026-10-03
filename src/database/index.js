import { Database } from 'bun:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';
mkdirSync(dirname(env.DATABASE_PATH), { recursive: true });
export const db = new Database(env.DATABASE_PATH, { create: true });
db.exec('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;');
export function migrate() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS guilds (guild_id TEXT PRIMARY KEY, ticket_category_id TEXT, ticket_staff_role_id TEXT, log_channel_id TEXT, security_enabled INTEGER NOT NULL DEFAULT 1, ai_enabled INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
    CREATE TABLE IF NOT EXISTS audit_logs (id INTEGER PRIMARY KEY AUTOINCREMENT, guild_id TEXT NOT NULL, actor_id TEXT, action TEXT NOT NULL, target_id TEXT, metadata TEXT, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
    CREATE TABLE IF NOT EXISTS security_incidents (id INTEGER PRIMARY KEY AUTOINCREMENT, guild_id TEXT NOT NULL, type TEXT NOT NULL, details TEXT NOT NULL, resolved INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
    CREATE TABLE IF NOT EXISTS tickets (id INTEGER PRIMARY KEY AUTOINCREMENT, guild_id TEXT NOT NULL, channel_id TEXT UNIQUE, opener_id TEXT NOT NULL, category TEXT NOT NULL, priority TEXT NOT NULL DEFAULT 'normal', status TEXT NOT NULL DEFAULT 'open', assignee_id TEXT, subject TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, closed_at TEXT);
    CREATE TABLE IF NOT EXISTS ticket_notes (id INTEGER PRIMARY KEY AUTOINCREMENT, ticket_id INTEGER NOT NULL REFERENCES tickets(id), author_id TEXT NOT NULL, note TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
    CREATE TABLE IF NOT EXISTS events (id INTEGER PRIMARY KEY AUTOINCREMENT, guild_id TEXT NOT NULL, channel_id TEXT NOT NULL, message_id TEXT, creator_id TEXT NOT NULL, title TEXT NOT NULL, description TEXT NOT NULL, starts_at TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'scheduled', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
    CREATE TABLE IF NOT EXISTS rsvps (event_id INTEGER NOT NULL REFERENCES events(id), user_id TEXT NOT NULL, response TEXT NOT NULL, remind INTEGER NOT NULL DEFAULT 0, PRIMARY KEY(event_id, user_id));
    CREATE TABLE IF NOT EXISTS knowledge (id INTEGER PRIMARY KEY AUTOINCREMENT, guild_id TEXT NOT NULL, category TEXT NOT NULL DEFAULT 'general', title TEXT NOT NULL, content TEXT NOT NULL, author_id TEXT NOT NULL, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
    CREATE TABLE IF NOT EXISTS notification_preferences (guild_id TEXT NOT NULL, user_id TEXT NOT NULL, event_notifications INTEGER NOT NULL DEFAULT 1, announcement_notifications INTEGER NOT NULL DEFAULT 1, level_notifications INTEGER NOT NULL DEFAULT 0, PRIMARY KEY(guild_id,user_id));
    CREATE TABLE IF NOT EXISTS member_activity (guild_id TEXT NOT NULL, user_id TEXT NOT NULL, messages INTEGER NOT NULL DEFAULT 0, xp INTEGER NOT NULL DEFAULT 0, reputation INTEGER NOT NULL DEFAULT 0, joined_at TEXT, last_active_at TEXT, PRIMARY KEY(guild_id,user_id));
    CREATE TABLE IF NOT EXISTS metrics (id INTEGER PRIMARY KEY AUTOINCREMENT, guild_id TEXT NOT NULL, kind TEXT NOT NULL, channel_id TEXT, user_id TEXT, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
  `);
  logger.info('Database migrations complete');
}
export function one(sql, params = []) { return db.query(sql).get(...params); }
export function all(sql, params = []) { return db.query(sql).all(...params); }
export function run(sql, params = []) { return db.query(sql).run(...params); }
export function ensureGuild(guildId) { run('INSERT OR IGNORE INTO guilds (guild_id) VALUES (?)', [guildId]); }
