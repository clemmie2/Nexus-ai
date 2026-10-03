// Set NEXUS_EMOJI_* to custom Discord markup such as <:nexus_success:123456789012345678>.
// Unicode fallbacks keep NEXUS usable before a server owner configures its own emoji assets.
const configured = (key, fallback) => process.env[`NEXUS_EMOJI_${key}`] || fallback;
const emojis = {
  success: configured('SUCCESS', '✅'), error: configured('ERROR', '❌'), warning: configured('WARNING', '⚠️'), info: configured('INFO', 'ℹ️'),
  security: configured('SECURITY', '🛡️'), moderation: configured('MODERATION', '🛠️'), tickets: configured('TICKETS', '🎫'), analytics: configured('ANALYTICS', '📊'),
  events: configured('EVENTS', '📅'), ai: configured('AI', '🧠'), settings: configured('SETTINGS', '⚙️'), online: configured('ONLINE', '🟢'), offline: configured('OFFLINE', '⚫')
};
export default emojis;
