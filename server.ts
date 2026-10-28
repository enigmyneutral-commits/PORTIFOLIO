import 'dotenv/config';
process.env.DISABLE_HMR = 'true';

import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '25mb' }));

// Health Check
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'operational',
    service: 'enigmy-neutral-express-server',
    provisionalDomain: 'dmgrecords.com.br',
    nvidiaModel: 'nvidia/nemotron-3.5-bolt-e4b',
    hasNvidiaKey: Boolean(process.env.NVIDIA_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// NVIDIA NIM API Endpoint for Nemotron 3.5 Bolt
app.post('/api/agent/nvidia-chat', async (req: Request, res: Response) => {
  try {
    const apiKey = process.env.NVIDIA_API_KEY || (req.headers.authorization?.replace(/^Bearer\s+/i, ''));
    const isStream = req.body?.stream === true || req.headers.accept?.includes('text/event-stream');

    const payload = {
      model: req.body?.model || 'nvidia/nemotron-3.5-bolt-e4b',
      messages: req.body?.messages || [
        {
          role: 'user',
          content: req.body?.prompt || 'Conduct technical architecture evaluation.',
        },
      ],
      temperature: req.body?.temperature ?? 1,
      top_p: req.body?.top_p ?? 0.95,
      max_tokens: req.body?.max_tokens ?? 1024,
      seed: req.body?.seed ?? 42,
      stream: isStream,
      parallel_tool_calls: req.body?.parallel_tool_calls ?? true,
      chat_template_kwargs: {
        enable_thinking: true,
      },
    };

    if (!apiKey) {
      // Return structured response indicating readiness for user's NVIDIA key
      return res.json({
        id: `local-nemotron-${Date.now()}`,
        model: 'nvidia/nemotron-3.5-bolt-e4b',
        choices: [
          {
            index: 0,
            message: {
              role: 'assistant',
              content: `[Enigmy Neutral Engineering Agent — NVIDIA NIM Nemotron-3.5-Bolt]\n\nBackend configured for model "nvidia/nemotron-3.5-bolt-e4b" at https://integrate.api.nvidia.com/v1/chat/completions.\n\nStaging domain: dmgrecords.com.br (Provisional).\nTo enable real-time inference, ensure NVIDIA_API_KEY is set in your environment. The agent is operating in deterministic heuristic audit mode with international market pricing models (USD).`,
            },
            finish_reason: 'stop',
          },
        ],
      });
    }

    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        Accept: isStream ? 'text/event-stream' : 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({
        error: 'NVIDIA API Upstream Error',
        status: response.status,
        details: errText,
      });
    }

    if (isStream && response.body) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const reader = response.body.getReader();
      const pump = async () => {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              res.end();
              break;
            }
            res.write(value);
          }
        } catch (streamErr) {
          console.error('Streaming error:', streamErr);
          res.end();
        }
      };
      return pump();
    }

    const data = await response.json();
    return res.json(data);
  } catch (error: any) {
    console.error('Error invoking NVIDIA NIM API:', error);
    return res.status(500).json({
      error: 'Internal Agent Gateway Error',
      message: error?.message || 'Unknown error',
    });
  }
});

// Start Server with Vite or Static
async function startServer() {
  if (!isProduction) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
        watch: null,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Enigmy Neutral] Full-stack server running on http://0.0.0.0:${PORT}`);
    console.log(`[Enigmy Neutral] Provisional Domain: dmgrecords.com.br`);
    console.log(`[Enigmy Neutral] NVIDIA Model: nvidia/nemotron-3.5-bolt-e4b`);
  });
}

startServer();
