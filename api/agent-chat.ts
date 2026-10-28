import type { IncomingMessage, ServerResponse } from 'node:http';

interface VercelRequest extends IncomingMessage {
  body: any;
  query: Record<string, string>;
}

interface VercelResponse extends ServerResponse {
  status: (statusCode: number) => VercelResponse;
  json: (data: any) => void;
  send: (data: any) => void;
}

const ENIGMY_SYSTEM_INSTRUCTION = `You are the Enigmy Neutral Engineering Lead & Principal Systems Architect AI Agent, founded and engineered by Marcos Santos, with international operations based in Paraguay and currently staged at provisional domain dmgrecords.com.br.
Specialties: Distributed systems, Go/Node.js/Python microservices, PostgreSQL performance, Docker/K8s, and international senior developer rates in USD ($85–$145/hr). Reply directly and technically in the client's language.`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        // use raw
      }
    }

    const { messages, userMessage } = body || {};
    const prompt = userMessage || (Array.isArray(messages) && messages[messages.length - 1]?.content) || 'Olá!';
    const rawHistory = Array.isArray(messages) ? messages.slice(0, -1) : [];
    const formattedHistory = rawHistory.map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: m.content || m.text || '',
    }));

    const apiKey = process.env.NVIDIA_API_KEY;
    if (apiKey) {
      const nvidiaMessages = [
        { role: 'system', content: ENIGMY_SYSTEM_INSTRUCTION },
        ...formattedHistory.slice(-8),
        { role: 'user', content: prompt },
      ];

      const upstream = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'nvidia/nemotron-3.5-bolt-e4b',
          messages: nvidiaMessages,
          temperature: 0.7,
          max_tokens: 1024,
        }),
      });

      if (upstream.ok) {
        const data = await upstream.json();
        const content = data?.choices?.[0]?.message?.content;
        if (content) {
          return res.status(200).json({
            success: true,
            reply: content,
            model: 'nvidia/nemotron-3.5-bolt-e4b',
          });
        }
      }
    }

    return res.status(200).json({
      success: true,
      reply: 'Olá! Sou o Enigmy Neutral Engineering Agent. Como posso auxiliar na arquitetura, auditoria ou orçamentação técnica do seu sistema?',
      model: 'fallback',
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || 'Internal error' });
  }
}
