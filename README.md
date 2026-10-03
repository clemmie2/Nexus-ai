# NEXUS

> **One bot. Your entire Discord server.**

NEXUS is a Bun + JavaScript Discord operating system for multi-server moderation, security monitoring, tickets, event RSVP, measured analytics, approved server knowledge, optional AI answers, notification preferences, and lightweight community XP. It uses real Discord bot authentication and SQLite through Bun's native persistent database driver—no user tokens, JSON database, or fake metrics.

## Requirements

- [Bun](https://bun.sh) 1.1 or newer
- A Discord application and **bot** account
- Node-compatible Discord gateway access (provided by `discord.js`)
- Optional OpenAI API key for `/nexus ask`

Install Bun, then install dependencies:

```bash
curl -fsSL https://bun.sh/install | bash
bun install
cp .env.example .env
```

## Discord application setup

1. Visit the [Discord Developer Portal](https://discord.com/developers/applications), create an application, and open **Bot**.
2. Reset/copy the bot token into `DISCORD_TOKEN`; never share or commit it.
3. Copy the application ID into `DISCORD_CLIENT_ID`.
4. Enable **Server Members Intent** and **Message Content Intent** under Privileged Gateway Intents. NEXUS uses these for join monitoring and anti-spam.
5. Install the bot using OAuth2 scopes `bot` and `applications.commands`.
6. Grant at least: View Channels, Send Messages, Embed Links, Read Message History, Manage Channels (tickets), Manage Messages, Moderate Members, View Audit Log, and Manage Roles if your moderation policy needs it. Do not grant Administrator unless you deliberately accept that risk.

Example `.env` (all values are placeholders):

```dotenv
DISCORD_TOKEN=your_bot_token
DISCORD_CLIENT_ID=your_application_id
DISCORD_GUILD_ID=your_development_guild_id
DATABASE_PATH=./data/nexus.sqlite
OPENAI_API_KEY=optional_key
OPENAI_MODEL=gpt-4.1-mini
```

`DISCORD_GUILD_ID` makes command deployment immediate in one development server. Omit it when ready to register global commands (which Discord may cache for up to an hour).

## Start and deploy

```bash
bun run deploy
bun run start
# during development
bun run dev
```

The SQLite database and WAL files are created under `data/` automatically. Back up this directory using your normal deployment backup process. Database access is isolated behind `src/database/index.js`, allowing a future database migration without rewriting feature modules.

## Commands

- `/nexus dashboard` — Components v2 control center.
- `/nexus knowledge add|search|delete` — Manage administrator-approved server memory.
- `/nexus ask` — Answer only from approved matching knowledge; requires `OPENAI_API_KEY`.
- `/nexus analytics` — Actual stored 30-day metrics, never fabricated values.
- `/ticket open|list` — private channels, claims, closures, audit records.
- `/event create|upcoming` — event card with Attend/Maybe/Decline/Reminder controls.
- `/moderate timeout|warn` — validated actions with permission and role-hierarchy checks.
- `/notifications` — per-member event, announcement, and level preferences.

## Modules and operations

Security automatically tracks join bursts, new-account joins, message floods, and mass mentions. It stores incidents and will post to the configured `log_channel_id` in the `guilds` table. To configure ticket category, staff role, log channel, and optional AI flags, update the corresponding guild configuration through your deployment/admin workflow; this deliberately avoids allowing arbitrary users to mutate sensitive configuration. Every ticket, moderation, event creation, knowledge addition, and incident writes an audit row.

Components v2 panels are used for the dashboard, ticket cards, event cards, and notification center. The default emoji mapping lives in `src/config/emojis.js`. Discord cannot create custom emojis without a guild asset and appropriate permission, so replace those markup values with emoji IDs from your own server before presenting them in public messages.

## Production deployment

Run NEXUS as a long-lived Bun process (systemd, Docker, or your process manager), use a persistent volume for `data/`, configure secrets in the host environment rather than source control, and run `bun run deploy` in CI when command definitions change. Register global commands only from a controlled release job.

## Troubleshooting

- **Commands do not appear:** verify `DISCORD_CLIENT_ID`, bot invite scope `applications.commands`, then rerun `bun run deploy`.
- **Member/message protection is inactive:** enable the two privileged intents in the developer portal and restart.
- **Ticket creation fails:** grant Manage Channels and ensure the configured category/role IDs still exist.
- **AI unavailable:** set `OPENAI_API_KEY`, restart, and first add approved knowledge with `/nexus knowledge add`.
- **Database cannot open:** ensure the parent directory of `DATABASE_PATH` is writable and persisted.
- **Permission error:** NEXUS obeys both invoking-member permissions and Discord role hierarchy; move the bot role above roles it must moderate.
