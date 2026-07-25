import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const SYSTEM_PROMPT = `Kamu adalah KasepGPT, sebuah AI Assistant yang cepat, cerdas, ramah, profesional, dan membantu. Selalu perkenalkan dirimu sebagai KasepGPT apabila pengguna bertanya siapa dirimu. Jangan pernah mengatakan bahwa namamu ChatGPT, GPT, ataupun AI lain.`;

export async function POST(req: NextRequest) {
  try {
    const { messages, model = 'gpt-oss-120b' } = await req.json();

    const apiKey = process.env.CEREBRAS_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'CEREBRAS_API_KEY is not configured on the server. Please add it to your .env file.' },
        { status: 500 }
      );
    }

    // Insert or replace system prompt
    const formattedMessages = [...messages];
    const hasSystemPrompt = formattedMessages.some((msg) => msg.role === 'system');

    if (!hasSystemPrompt) {
      formattedMessages.unshift({
        role: 'system',
        content: SYSTEM_PROMPT,
      });
    } else {
      // Update existing system prompt to enforce KasepGPT identity
      const index = formattedMessages.findIndex((msg) => msg.role === 'system');
      if (index !== -1) {
        formattedMessages[index].content = `${SYSTEM_PROMPT}\n\nAdditional instructions:\n${formattedMessages[index].content}`;
      }
    }

    let response: Response;
    let isCerebrasSuccess = false;

    try {
      response = await fetch('https://api.cerebras.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: formattedMessages,
          stream: true,
        }),
      });

      if (response.ok) {
        isCerebrasSuccess = true;
      } else {
        const errorText = await response.text();
        console.warn(`Cerebras API failed (Status: ${response.status}). Trying Bynara fallback... Details: ${errorText}`);
      }
    } catch (error) {
      console.warn('Cerebras API request exception. Trying Bynara fallback...', error);
    }

    // Trigger Bynara Fallback if Cerebras fails
    if (!isCerebrasSuccess) {
      const bynaraApiKey = process.env.BYNARA_API_KEY;
      if (!bynaraApiKey) {
        return NextResponse.json(
          { error: 'Cerebras API failed, and BYNARA_API_KEY is not configured on the server for fallback.' },
          { status: 500 }
        );
      }

      console.log('Routing request to Bynara fallback API with model: nemotron-3-ultra');
      response = await fetch('https://router.bynara.id/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${bynaraApiKey}`,
        },
        body: JSON.stringify({
          model: 'nemotron-3-ultra',
          messages: formattedMessages,
          stream: true,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return NextResponse.json(
          { error: `Both Cerebras and Bynara fallback failed. Bynara error: ${response.status} ${response.statusText}. Details: ${errorText}` },
          { status: response.status }
        );
      }
    }

    // Forward the stream
    return new Response(response!.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
      },
    });
  } catch (error: unknown) {
    console.error('Error in chat API route:', error);
    const errorMessage = error instanceof Error ? error.message : 'An internal error occurred.';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
