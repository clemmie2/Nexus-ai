import { AuditLogEvent, PermissionFlagsBits } from 'discord.js';
import { one, run } from '../../database/index.js';
import { audit } from '../../services/audit.js';
import { logger } from '../../utils/logger.js';
const joins = new Map(); const messages = new Map();
async function incident(guild, type, details) {
  run('INSERT INTO security_incidents (guild_id, type, details) VALUES (?, ?, ?)', [guild.id, type, details]); audit(guild.id, `security:${type}`, { metadata: { details } });
  const cfg = one('SELECT log_channel_id FROM guilds WHERE guild_id = ?', [guild.id]); const channel = cfg?.log_channel_id ? guild.channels.cache.get(cfg.log_channel_id) : null;
  if (channel?.isTextBased()) await channel.send(`🚨 **NEXUS SECURITY ALERT**\n**${type}** — ${details}`).catch(() => {});
}
export async function handleJoin(member) {
  const key = member.guild.id; const now = Date.now(); const list = (joins.get(key) ?? []).filter((at) => now - at < 45_000); list.push(now); joins.set(key, list);
  const young = now - member.user.createdTimestamp < 7 * 86_400_000;
  if (young) await incident(member.guild, 'suspicious-account', `New account joined: ${member.user.tag}`).catch(() => {});
  if (list.length >= 10) await incident(member.guild, 'raid-detected', `${list.length} accounts joined within 45 seconds`).catch(() => {});
}
export async function handleMessage(message) {
  if (!message.guild || message.author.bot) return;
  const key = `${message.guild.id}:${message.author.id}`; const now = Date.now(); const list = (messages.get(key) ?? []).filter((at) => now - at < 8_000); list.push(now); messages.set(key, list);
  if (message.mentions.users.size >= 5 || list.length >= 7) {
    await incident(message.guild, 'spam-detected', `${message.author.tag} triggered ${message.mentions.users.size >= 5 ? 'mass mention' : 'flood'} protection`).catch(() => {});
    if (message.member?.moderatable) await message.member.timeout(60_000, 'NEXUS automatic anti-spam').catch(() => {});
  }
}
export async function handleAuditEntry(entry, guild) {
  if (![AuditLogEvent.ChannelDelete, AuditLogEvent.RoleDelete, AuditLogEvent.WebhookCreate, AuditLogEvent.BotAdd].includes(entry.action)) return;
  await incident(guild, 'protected-action', `Audit event ${entry.action} by ${entry.executor?.tag ?? 'unknown'}`).catch((error) => logger.error('Security audit processing failed', error));
}
export function dangerousPermissions(permissions) { return permissions.has(PermissionFlagsBits.Administrator) || permissions.has(PermissionFlagsBits.ManageGuild) || permissions.has(PermissionFlagsBits.ManageRoles); }
