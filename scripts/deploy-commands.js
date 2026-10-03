import { REST, Routes } from 'discord.js';
import { env } from '../src/config/env.js';
import { commands } from '../src/commands/index.js';
const rest = new REST({ version: '10' }).setToken(env.DISCORD_TOKEN);
const route = env.DISCORD_GUILD_ID ? Routes.applicationGuildCommands(env.DISCORD_CLIENT_ID, env.DISCORD_GUILD_ID) : Routes.applicationCommands(env.DISCORD_CLIENT_ID);
await rest.put(route, { body: commands });
console.log(`Registered ${commands.length} NEXUS commands ${env.DISCORD_GUILD_ID ? 'for the development guild' : 'globally'}.`);
