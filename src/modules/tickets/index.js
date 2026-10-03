import { ChannelType, PermissionFlagsBits } from 'discord.js';
import { all, one, run } from '../../database/index.js';
import { audit } from '../../services/audit.js';
import { isStaff } from '../../utils/permissions.js';
export async function createTicket(interaction, { category, subject, priority }) {
  const existing = one("SELECT id, channel_id FROM tickets WHERE guild_id = ? AND opener_id = ? AND status = 'open'", [interaction.guildId, interaction.user.id]);
  if (existing) throw new Error(`You already have an open ticket: <#${existing.channel_id}>.`);
  const cfg = one('SELECT ticket_category_id, ticket_staff_role_id FROM guilds WHERE guild_id = ?', [interaction.guildId]);
  const overwrites = [{ id: interaction.guild.roles.everyone.id, deny: [PermissionFlagsBits.ViewChannel] }, { id: interaction.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory] }];
  if (cfg?.ticket_staff_role_id) overwrites.push({ id: cfg.ticket_staff_role_id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory] });
  const channel = await interaction.guild.channels.create({ name: `ticket-${interaction.user.username}`.slice(0, 90), type: ChannelType.GuildText, parent: cfg?.ticket_category_id ?? undefined, permissionOverwrites: overwrites, reason: 'NEXUS ticket created' });
  const id = run('INSERT INTO tickets (guild_id, channel_id, opener_id, category, priority, subject) VALUES (?, ?, ?, ?, ?, ?)', [interaction.guildId, channel.id, interaction.user.id, category, priority, subject]).lastInsertRowid;
  audit(interaction.guildId, 'ticket:create', { actorId: interaction.user.id, targetId: String(id), metadata: { category, priority } });
  return { id, channel };
}
export function ticketByChannel(channelId) { return one('SELECT * FROM tickets WHERE channel_id = ?', [channelId]); }
export function listTickets(guildId) { return all("SELECT * FROM tickets WHERE guild_id = ? AND status = 'open' ORDER BY created_at DESC LIMIT 25", [guildId]); }
export function claimTicket(interaction, ticket) { if (!isStaff(interaction.member)) throw new Error('Only staff can claim tickets.'); run('UPDATE tickets SET assignee_id = ? WHERE id = ?', [interaction.user.id, ticket.id]); audit(interaction.guildId, 'ticket:claim', { actorId: interaction.user.id, targetId: String(ticket.id) }); }
export function closeTicket(interaction, ticket) { if (ticket.opener_id !== interaction.user.id && !isStaff(interaction.member)) throw new Error('Only the ticket opener or staff can close this ticket.'); run("UPDATE tickets SET status = 'closed', closed_at = CURRENT_TIMESTAMP WHERE id = ?", [ticket.id]); audit(interaction.guildId, 'ticket:close', { actorId: interaction.user.id, targetId: String(ticket.id) }); }
