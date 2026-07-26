import { NextRequest, NextResponse } from 'next/server';
import { SYSTEM_PROMPT } from '../../../lib/systemPrompt';

export const runtime    = 'nodejs';
export const maxDuration = 60; // seconds (Vercel Hobby limit)

const BYNARA_MODELS = ['agnes-2.0-flash', 'mistral-large', 'mistral-medium-3-5'];

type ChatMessage = { role: string; content: string };

async function callProvider(
  url: string,
  key: string,
  model: string,
  messages: ChatMessage[],
  temperature: number,
  maxTokens: number,
): Promise<Response> {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model,
      messages,
      stream: true,
      temperature,
      max_tokens: maxTokens,
    }),
  });
}

export async function POST(req: NextRequest) {
  try {
    const {
      messages,
      model = 'agnes-2.0-flash',
      temperature = 0.7,
      maxTokens = 4000,
    } = await req.json();

    const bynaraKey   = process.env.BYNARA_API_KEY;
    const cerebrasKey = process.env.CEREBRAS_API_KEY;

    if (!bynaraKey) {
      return NextResponse.json(
        { error: 'BYNARA_API_KEY is not configured. Please add it to your environment variables.' },
        { status: 500 },
      );
    }

    // Build message array with system prompt
    const formattedMessages: ChatMessage[] = [...messages];
    const sysIdx = formattedMessages.findIndex((m) => m.role === 'system');
    if (sysIdx === -1) {
      formattedMessages.unshift({ role: 'system', content: SYSTEM_PROMPT });
    } else {
      formattedMessages[sysIdx].content = `${SYSTEM_PROMPT}\n\n${formattedMessages[sysIdx].content}`;
    }

    const isBynara = BYNARA_MODELS.includes(model);

    const primary = {
      name:  isBynara ? 'Bynara' : 'Cerebras',
      url:   isBynara ? 'https://router.bynara.id/v1/chat/completions' : 'https://api.cerebras.ai/v1/chat/completions',
      key:   isBynara ? bynaraKey : cerebrasKey,
      model,
    };
    const fallback = {
      name:  isBynara ? 'Cerebras' : 'Bynara',
      url:   isBynara ? 'https://api.cerebras.ai/v1/chat/completions' : 'https://router.bynara.id/v1/chat/completions',
      key:   isBynara ? cerebrasKey : bynaraKey,
      model: isBynara ? 'gpt-oss-120b' : 'agnes-2.0-flash',
    };

    let response: Response | null = null;

    // ── 1. Try primary ─────────────────────────────
    if (primary.key) {
      try {
        console.log(`[KasepGPT] Primary → ${primary.name} / ${primary.model}`);
        const res = await callProvider(primary.url, primary.key, primary.model, formattedMessages, temperature, maxTokens);
        if (res.ok) {
          response = res;
        } else {
          const txt = await res.text().catch(() => '');
          console.warn(`[KasepGPT] Primary (${primary.name}) failed — ${res.status}: ${txt}`);
        }
      } catch (err) {
        console.warn(`[KasepGPT] Primary (${primary.name}) threw:`, err);
      }
    } else {
      console.warn(`[KasepGPT] Primary key for ${primary.name} is missing. Skipping to fallback.`);
    }

    // ── 2. Try fallback ────────────────────────────
    if (!response) {
      if (!fallback.key) {
        return NextResponse.json(
          { error: `Primary provider (${primary.name}) failed and fallback key (${fallback.name}) is not configured.` },
          { status: 503 },
        );
      }

      console.log(`[KasepGPT] Fallback → ${fallback.name} / ${fallback.model}`);
      const res = await callProvider(fallback.url, fallback.key, fallback.model, formattedMessages, temperature, maxTokens);
      if (!res.ok) {
        const txt = await res.text().catch(() => '');
        return NextResponse.json(
          { error: `Both providers failed. Fallback (${fallback.name}) error: ${res.status}. ${txt}` },
          { status: res.status },
        );
      }
      response = res;
    }

    // ── 3. Forward streaming response ─────────────
    return new Response(response.body, {
      status: 200,
      headers: {
        'Content-Type':      'text/event-stream',
        'Cache-Control':     'no-cache, no-store, no-transform',
        'Connection':        'keep-alive',
        'X-Accel-Buffering': 'no',
        'Transfer-Encoding': 'chunked',
      },
    });

  } catch (error: unknown) {
    console.error('[KasepGPT] Unhandled error in chat route:', error);
    const msg = error instanceof Error ? error.message : 'Internal server error.';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
