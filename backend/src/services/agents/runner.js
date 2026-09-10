import { generateText } from '../ai/adapters/gemini.js';
import { sendPushToUser } from '../../routes/push.js';
import { query } from '../../config/database.js';

const AGENT_SYSTEM_PROMPT = `You are an autonomous AI agent. You break down complex tasks into steps and execute them one by one.

For each step, respond with JSON in this exact format:
{
  "thought": "what you're thinking",
  "action": "search|analyze|write|summarize|done",
  "input": "input for this action",
  "result": "result of this action (fill after executing)",
  "final": false
}

When the task is complete, set "final": true and include a "summary" field with the complete result.
Always respond with valid JSON only.`;

const TOOLS = {
  search: async (input) => {
    const { text } = await generateText({ messages: [{ role: 'user', content: input }], useSearch: true });
    return text.slice(0, 500);
  },
  analyze: async (input) => {
    const { text } = await generateText({ messages: [{ role: 'user', content: `Analyze this concisely: ${input}` }] });
    return text.slice(0, 500);
  },
  write: async (input) => {
    const { text } = await generateText({ messages: [{ role: 'user', content: `Write this: ${input}` }] });
    return text.slice(0, 800);
  },
  summarize: async (input) => {
    const { text } = await generateText({ messages: [{ role: 'user', content: `Summarize concisely: ${input}` }] });
    return text.slice(0, 400);
  },
};

export async function runAgent(agentRunId, userId, task, conversationId) {
  const steps = [];
  let context = `Task: ${task}\n\n`;
  const MAX_STEPS = 6;

  await query('UPDATE agent_runs SET status = $1 WHERE id = $2', ['running', agentRunId]);

  try {
    for (let i = 0; i < MAX_STEPS; i++) {
      const prompt = `${context}Steps so far: ${steps.length}\nWhat is your next step? Respond with JSON only.`;
      const { text: raw } = await generateText({ messages: [{ role: 'system', content: AGENT_SYSTEM_PROMPT }, { role: 'user', content: prompt }] });

      let step;
      try {
        const jsonMatch = raw.match(/\{[\s\S]*\}/);
        step = JSON.parse(jsonMatch?.[0] || raw);
      } catch {
        step = { thought: 'Parsing error', action: 'done', input: '', final: true, summary: raw };
      }

      // Execute the action
      if (step.action && TOOLS[step.action] && !step.final) {
        try {
          step.result = await TOOLS[step.action](step.input);
        } catch (e) {
          step.result = `Error: ${e.message}`;
        }
      }

      steps.push(step);
      context += `Step ${i + 1}: ${step.thought}\nAction: ${step.action}\nResult: ${step.result || ''}\n\n`;

      // Save step progress
      await query('UPDATE agent_runs SET steps = $1 WHERE id = $2', [JSON.stringify(steps), agentRunId]);

      if (step.final) break;
    }

    const finalStep = steps[steps.length - 1];
    const summary = finalStep?.summary || context;

    // Save final result
    await query(
      'UPDATE agent_runs SET status = $1, result = $2, completed_at = NOW() WHERE id = $3',
      ['completed', summary, agentRunId]
    );

    // Save as message in conversation
    if (conversationId) {
      await query(
        'INSERT INTO messages (conversation_id, role, content, content_type) VALUES ($1, $2, $3, $4)',
        [conversationId, 'assistant', `**Agent completed task:**\n\n${summary}`, 'text']
      );
    }

    // Push notification
    await sendPushToUser(userId, 'AZEINO Agent', 'Your task is complete! Tap to view results.', `/app/agents`).catch(() => {});

  } catch (err) {
    await query('UPDATE agent_runs SET status = $1, result = $2 WHERE id = $3', ['failed', err.message, agentRunId]);
  }
}
