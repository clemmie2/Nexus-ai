import OpenAI from 'openai';
import { env } from '../config/env.js';
import { all } from '../database/index.js';
const client = env.OPENAI_API_KEY ? new OpenAI({ apiKey: env.OPENAI_API_KEY }) : null;
export async function answerWithKnowledge(guildId, question) {
  if (!client) throw new Error('The AI assistant is not configured by this server administrator.');
  const entries = all('SELECT title, content, category FROM knowledge WHERE guild_id = ? AND (title LIKE ? OR content LIKE ?) ORDER BY updated_at DESC LIMIT 12', [guildId, `%${question.slice(0, 80)}%`, `%${question.slice(0, 80)}%`]);
  const context = entries.map((entry) => `[${entry.category}] ${entry.title}: ${entry.content}`).join('\n') || 'No approved server knowledge matched.';
  const result = await client.chat.completions.create({ model: env.OPENAI_MODEL, messages: [
    { role: 'system', content: 'You are NEXUS, a Discord server assistant. Answer only from approved context. If context is insufficient, say so. Do not reveal private data or invent rules.' },
    { role: 'user', content: `Approved context:\n${context}\n\nQuestion: ${question}` }
  ], max_tokens: 350 });
  return result.choices[0]?.message?.content ?? 'I could not generate an answer.';
}
