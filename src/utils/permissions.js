import { PermissionFlagsBits } from 'discord.js';
export function requirePermission(interaction, permission = PermissionFlagsBits.ManageGuild) {
  return interaction.memberPermissions?.has(permission) ?? false;
}
export function canModerate(actor, target, guild) {
  return actor.id === guild.ownerId || (actor.roles.highest.comparePositionTo(target.roles.highest) > 0 && target.id !== guild.ownerId);
}
export function isStaff(member) { return member.permissions.has(PermissionFlagsBits.ManageMessages) || member.permissions.has(PermissionFlagsBits.ManageGuild); }
