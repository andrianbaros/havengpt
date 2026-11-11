import { NextRequest, NextResponse } from 'next/server';
import { getDynamicSystemPrompt } from '../../../lib/knowledgeLoader';

export const runtime    = 'nodejs';
export const maxDuration = 60; // seconds (Vercel Hobby limit)

const BYNARA_MODELS = ['stepfun-3.7-flash'];

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
      temperature = 0.7,
      maxTokens = 4000,
    } = await req.json();

    // Selalu gunakan Stepfun 3.7 Flash melalui Bynara
    const activeModel = 'stepfun-3.7-flash';

    const bynaraKey = process.env.BYNARA_API_KEY;

    if (!bynaraKey) {
      return NextResponse.json(
        { error: 'BYNARA_API_KEY is not configured. Please add it to your environment variables.' },
        { status: 500 },
      );
    }

    // Get last user message to load dynamic context
    const lastUserMsg = messages[messages.length - 1]?.content || '';
    const dynamicSystemPrompt = getDynamicSystemPrompt(lastUserMsg);

    // Build message array with system prompt
    const formattedMessages: ChatMessage[] = [...messages];
    const sysIdx = formattedMessages.findIndex((m) => m.role === 'system');
    if (sysIdx === -1) {
      formattedMessages.unshift({ role: 'system', content: dynamicSystemPrompt });
    } else {
      formattedMessages[sysIdx].content = `${dynamicSystemPrompt}\n\n${formattedMessages[sysIdx].content}`;
    }

    const primary = {
      name:  'Bynara',
      url:   'https://router.bynara.id/v1/chat/completions',
      key:   bynaraKey,
      model: activeModel,
    };

    let response: Response | null = null;

    try {
      console.log(`[Haven] Calling Bynara / ${activeModel}`);
      const res = await callProvider(primary.url, primary.key, primary.model, formattedMessages, temperature, maxTokens);
      if (res.ok) {
        response = res;
      } else {
        const txt = await res.text().catch(() => '');
        console.warn(`[Haven] Bynara failed — ${res.status}: ${txt}`);
        return NextResponse.json(
          { error: `Provider error (${res.status}): ${txt}` },
          { status: res.status },
        );
      }
    } catch (err) {
      console.warn(`[Haven] Bynara threw:`, err);
      const msg = err instanceof Error ? err.message : 'Connection to provider failed.';
      return NextResponse.json({ error: msg }, { status: 502 });
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
    console.error('[Haven] Unhandled error in chat route:', error);
    const msg = error instanceof Error ? error.message : 'Internal server error.';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
