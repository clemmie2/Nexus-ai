import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
export const commands = [
  new SlashCommandBuilder().setName('nexus').setDescription('NEXUS control center and server intelligence')
    .addSubcommand((s) => s.setName('dashboard').setDescription('Open the NEXUS control center'))
    .addSubcommand((s) => s.setName('ask').setDescription('Ask approved NEXUS server knowledge').addStringOption((o) => o.setName('question').setDescription('Your question').setRequired(true).setMaxLength(500)))
    .addSubcommandGroup((g) => g.setName('knowledge').setDescription('Manage approved server knowledge')
      .addSubcommand((s) => s.setName('add').setDescription('Add a knowledge entry').addStringOption((o) => o.setName('title').setDescription('Title').setRequired(true).setMaxLength(100)).addStringOption((o) => o.setName('content').setDescription('Trusted answer or document').setRequired(true).setMaxLength(4000)).addStringOption((o) => o.setName('category').setDescription('Category').setMaxLength(50)))
      .addSubcommand((s) => s.setName('search').setDescription('Search knowledge').addStringOption((o) => o.setName('query').setDescription('Search terms').setRequired(true).setMaxLength(100)))
      .addSubcommand((s) => s.setName('delete').setDescription('Delete a knowledge entry').addIntegerOption((o) => o.setName('id').setDescription('Entry ID').setRequired(true))))
    .addSubcommand((s) => s.setName('analytics').setDescription('View measured server analytics')),
  new SlashCommandBuilder().setName('ticket').setDescription('Create or manage support tickets')
    .addSubcommand((s) => s.setName('open').setDescription('Open a support ticket').addStringOption((o) => o.setName('category').setDescription('Ticket category').setRequired(true).addChoices({ name: 'General', value: 'general' }, { name: 'Billing', value: 'billing' }, { name: 'Report', value: 'report' })).addStringOption((o) => o.setName('subject').setDescription('What do you need help with?').setRequired(true).setMaxLength(200)).addStringOption((o) => o.setName('priority').setDescription('Priority').addChoices({ name: 'Low', value: 'low' }, { name: 'Normal', value: 'normal' }, { name: 'High', value: 'high' })))
    .addSubcommand((s) => s.setName('list').setDescription('List open tickets')),
  new SlashCommandBuilder().setName('event').setDescription('Create and manage community events')
    .addSubcommand((s) => s.setName('create').setDescription('Create an event').addStringOption((o) => o.setName('title').setDescription('Event title').setRequired(true).setMaxLength(100)).addStringOption((o) => o.setName('when').setDescription('ISO-8601 UTC date, e.g. 2026-12-31T20:00:00Z').setRequired(true)).addStringOption((o) => o.setName('description').setDescription('Event details').setRequired(true).setMaxLength(1500)))
    .addSubcommand((s) => s.setName('upcoming').setDescription('List scheduled events')),
  new SlashCommandBuilder().setName('moderate').setDescription('Perform a safe moderation action')
    .addSubcommand((s) => s.setName('timeout').setDescription('Temporarily timeout a member').addUserOption((o) => o.setName('member').setDescription('Member').setRequired(true)).addIntegerOption((o) => o.setName('minutes').setDescription('1–40320 minutes').setRequired(true).setMinValue(1).setMaxValue(40320)).addStringOption((o) => o.setName('reason').setDescription('Reason').setMaxLength(400)))
    .addSubcommand((s) => s.setName('warn').setDescription('Record a moderation warning').addUserOption((o) => o.setName('member').setDescription('Member').setRequired(true)).addStringOption((o) => o.setName('reason').setDescription('Reason').setRequired(true).setMaxLength(400))),
  new SlashCommandBuilder().setName('notifications').setDescription('Manage your NEXUS notifications')
].map((command) => command.toJSON());
export const adminPermission = PermissionFlagsBits.ManageGuild;
