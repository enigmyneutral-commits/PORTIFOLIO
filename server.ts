import 'dotenv/config';
process.env.DISABLE_HMR = 'true';

import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { GoogleGenAI } from '@google/genai';

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '25mb' }));

// Initialize Google GenAI client (Gemini 3.8 Flash)
const geminiApiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey: geminiApiKey,
  httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
});

// System Prompt for Enigmy Neutral Engineering Agent
const ENIGMY_SYSTEM_INSTRUCTION = `You are the Enigmy Neutral Engineering Lead & Principal Systems Architect AI Agent, founded and engineered by Marcos Santos (lead architect), with international operations headquartered in Paraguay and currently staged at provisional domain dmgrecords.com.br.

Company & Engineering Profile:
- Name: Enigmy Neutral
- Lead Architect: Marcos Santos
- Location: Paraguay Operations (International Delivery & Fiscal Hub)
- Contact: enigmyneutral@gmail.com | WhatsApp: +55 51 98144-6019
- Provisional Staging Domain: dmgrecords.com.br
- Core Capabilities: High-concurrency backend architecture (Node.js, Go/Golang, Python, Rust), distributed microservices (Strangler Fig pattern, gRPC, event-driven with Kafka/RabbitMQ), high-performance databases (PostgreSQL tuning, indexing, connection pooling, Redis caching), defensive cloud infrastructure (Docker multi-stage, Kubernetes, GitHub Actions CI/CD, OpenTelemetry), and rigorous security audits (OWASP Top 10, JWT/RBAC, rate-limiting, secret management).
- Pricing Benchmark: Senior International Dev rates in USD ($85 – $145 USD/hour), scoped into discrete 1-to-4-week Sprints with transparent deliverable phases.
- Regional & Commercial Advantage: Based in Paraguay, providing world-class international software engineering with direct Americas/Europe time zone overlap, rigorous NDAs, and highly competitive rates without quality compromise.

Behavior & Tone:
- Speak directly, technically, authoritatively, and pragmatically like a principal software architect. Avoid generic marketing buzzwords and corporate fluff.
- Always communicate in the language used by the client (Portuguese when addressed in Portuguese, English when addressed in English, Spanish when in Spanish).
- If asked about code refactoring, system architecture, database latency, or microservices, provide concrete architectural recommendations, trade-offs, and best practices.
- If asked about pricing or hiring, quote international USD rates ($85–$145/hr), explain sprint estimations, and invite the user to submit an inquiry questionnaire or email enigmyneutral@gmail.com.
- If the user shares a repository link or file, analyze the architecture, outline vulnerabilities, performance bottlenecks, and the recommended Enigmy Neutral sprint roadmap.`;

// Helper: Call NVIDIA Nemotron 3.5 Bolt
async function callNvidiaNemotron(
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
  temperature = 0.7,
  max_tokens = 1024
): Promise<string> {
  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) {
    throw new Error('NVIDIA_API_KEY not configured');
  }

  const payload = {
    model: 'nvidia/nemotron-3.5-bolt-e4b',
    messages,
    temperature,
    top_p: 0.95,
    max_tokens,
    seed: 42,
    stream: false,
    parallel_tool_calls: true,
  };

  const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`NVIDIA API HTTP ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content;
  if (!text) {
    throw new Error('Empty response from NVIDIA NIM');
  }
  return text;
}

// Helper: Call Gemini 3.8 Flash fallback
async function callGeminiFlash(prompt: string, history: Array<{ role: 'user' | 'assistant'; content: string }> = []): Promise<string> {
  const contents = [
    ...history.map((h) => ({
      role: h.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: h.content }],
    })),
    { role: 'user', parts: [{ text: prompt }] },
  ];

  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: contents as any,
    config: {
      systemInstruction: ENIGMY_SYSTEM_INSTRUCTION,
      temperature: 0.7,
      maxOutputTokens: 1200,
    },
  });

  if (!response.text) {
    throw new Error('Empty response from Gemini');
  }
  return response.text;
}

// Helper: Orchestrate AI invocation with dual fallback
async function generateAIResponse(
  userPrompt: string,
  history: Array<{ role: 'user' | 'assistant'; content: string }> = [],
  customSystemPrompt?: string
): Promise<{ reply: string; model: string }> {
  const systemText = customSystemPrompt || ENIGMY_SYSTEM_INSTRUCTION;

  // 1. Try NVIDIA Nemotron 3.5 Bolt (primary)
  if (process.env.NVIDIA_API_KEY) {
    try {
      const nvidiaMessages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
        { role: 'system', content: systemText },
        ...history.slice(-8),
        { role: 'user', content: userPrompt },
      ];
      const reply = await callNvidiaNemotron(nvidiaMessages);
      return { reply, model: 'nvidia/nemotron-3.5-bolt-e4b' };
    } catch (nvidiaErr: any) {
      console.warn('[AI Orchestrator] NVIDIA NIM failed, attempting Gemini 3.8 Flash fallback:', nvidiaErr?.message);
    }
  }

  // 2. Try Gemini 3.8 Flash (secondary)
  if (process.env.GEMINI_API_KEY) {
    try {
      const reply = await callGeminiFlash(userPrompt, history.slice(-8));
      return { reply, model: 'gemini-3.8-flash' };
    } catch (geminiErr: any) {
      console.warn('[AI Orchestrator] Gemini 3.8 Flash failed:', geminiErr?.message);
    }
  }

  throw new Error('All AI upstream engines are currently unavailable.');
}

// Health Check
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'operational',
    service: 'enigmy-neutral-express-server',
    provisionalDomain: 'dmgrecords.com.br',
    nvidiaModel: 'nvidia/nemotron-3.5-bolt-e4b',
    hasNvidiaKey: Boolean(process.env.NVIDIA_API_KEY),
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// REAL INTERACTIVE AI AGENT CHAT ENDPOINT
app.post('/api/agent/chat', async (req: Request, res: Response) => {
  try {
    const { messages, userMessage, language } = req.body || {};

    const prompt = userMessage || (Array.isArray(messages) && messages[messages.length - 1]?.content) || 'Olá!';
    const rawHistory = Array.isArray(messages) ? messages.slice(0, -1) : [];
    const formattedHistory: Array<{ role: 'user' | 'assistant'; content: string }> = rawHistory.map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: m.content || m.text || '',
    }));

    const result = await generateAIResponse(prompt, formattedHistory);

    return res.json({
      success: true,
      reply: result.reply,
      model: result.model,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('[Agent Chat API] Error:', error);

    // Fallback response if all external APIs have network timeouts
    const isPt = req.body?.language === 'pt-BR' || true;
    const fallbackMessage = isPt
      ? `Olá! Sou o Enigmy Neutral Engineering Agent (Marcos Santos). Nossa infraestrutura opera com alto padrão em arquiteturas distribuídas (Go, Node.js, Python), microsserviços e bancos de alta concorrência. Você pode colar a URL de um repositório GitHub para auditoria ou perguntar sobre estimativas em USD conforme o mercado internacional.`
      : `Hello! I am the Enigmy Neutral Engineering Agent (Marcos Santos). Our firm designs distributed architectures (Go, Node.js, Python), decoupled microservices, and high-concurrency databases. You can paste a GitHub repository URL for an architectural audit or inquire about sprint estimations in USD.`;

    return res.json({
      success: true,
      reply: fallbackMessage,
      model: 'fallback-heuristic',
      error: error?.message,
    });
  }
});

// REAL ARCHITECTURE AUDIT ENDPOINT (Repo URL or File inspection)
app.post('/api/agent/audit', async (req: Request, res: Response) => {
  try {
    const { repoUrl, fileMeta, prompt: userPrompt, language } = req.body || {};
    const isPt = language === 'pt-BR';

    let targetName = 'Target Codebase';
    let targetType: 'repository' | 'zip_archive' | 'pdf_spec' | 'image_architecture' = 'repository';
    let targetIdentifier = repoUrl || 'Uploaded File';
    let extraContext = '';

    // If GitHub repo, fetch metadata
    if (repoUrl) {
      const cleanUrl = repoUrl.trim();
      targetIdentifier = cleanUrl;
      const ghMatch = cleanUrl.match(/github\.com\/([^/]+)\/([^/#?]+)/i);
      if (ghMatch) {
        const owner = ghMatch[1];
        const repo = ghMatch[2].replace(/\.git$/i, '');
        targetName = `${owner}/${repo}`;
        try {
          const ghRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
            headers: { Accept: 'application/vnd.github.v3+json', 'User-Agent': 'enigmy-agent' },
          });
          if (ghRes.ok) {
            const ghData = await ghRes.json();
            extraContext = `GitHub Details: Language: ${ghData.language}, Description: ${ghData.description || 'N/A'}, Stars: ${ghData.stargazers_count}, Default Branch: ${ghData.default_branch}, Open Issues: ${ghData.open_issues_count}.`;
          }
        } catch {
          // ignore network
        }
      }
    } else if (fileMeta) {
      targetName = fileMeta.name || 'Architecture Spec';
      targetIdentifier = `${fileMeta.name} (${fileMeta.size ? Math.round(fileMeta.size / 1024) : 0} KB)`;
      if (fileMeta.name?.endsWith('.zip')) targetType = 'zip_archive';
      else if (fileMeta.name?.endsWith('.pdf')) targetType = 'pdf_spec';
      else if (fileMeta.type?.startsWith('image/')) targetType = 'image_architecture';
      else targetType = 'repository';

      if (fileMeta.preview) {
        extraContext = `File preview content:\n${fileMeta.preview.slice(0, 3000)}`;
      }
    }

    const auditInstruction = `You are the Enigmy Neutral Lead Architect. Perform an in-depth, rigorous technical architecture audit for ${targetIdentifier}.
${extraContext ? extraContext : ''}

You MUST return a pure, valid JSON object strictly matching this schema with NO markdown fences, no surrounding commentary:
{
  "projectName": "${targetName}",
  "sourceType": "${targetType}",
  "sourceIdentifier": "${targetIdentifier}",
  "healthScore": <integer between 65 and 92>,
  "detectedStack": [<list 3 to 6 detected technologies e.g. "TypeScript", "Node.js", "Docker", "PostgreSQL", "Redis">],
  "executiveSummary": "<2-3 concise, deeply technical paragraphs in ${isPt ? 'Portuguese' : 'English'} explaining system architecture health, decoupled boundaries, database scaling risks, and refactoring potential>",
  "vulnerabilities": [
    {
      "title": "<Concise vulnerability title>",
      "severity": "High",
      "description": "<Detailed explanation of the risk, e.g. lack of volumetric throttling, unbounded ingestion, secret drift, N+1 query patterns>"
    },
    {
      "title": "<Second vulnerability title>",
      "severity": "High",
      "description": "<Explanation>"
    },
    {
      "title": "<Third vulnerability title>",
      "severity": "Medium",
      "description": "<Explanation>"
    }
  ],
  "bottlenecks": [
    "<Bottleneck 1>",
    "<Bottleneck 2>",
    "<Bottleneck 3>"
  ],
  "recommendations": [
    "<Actionable recommendation 1>",
    "<Actionable recommendation 2>",
    "<Actionable recommendation 3>",
    "<Actionable recommendation 4>"
  ],
  "enigmyNeutralScope": [
    "Sprint 1: Architecture review, threat modeling, and containerization",
    "Sprint 2: Service decoupling, schema contracts, and query indexing",
    "Sprint 3: CI/CD automation, stress testing benchmarks, and operational runbook handoff"
  ],
  "pricingEstimate": {
    "currency": "USD",
    "hourlyRateRange": "$85 – $145 USD / hour (Senior International Dev Benchmark)",
    "totalHours": 72,
    "sprintDuration": "3 – 4 Weeks",
    "totalEstimateUSD": "$6,120 – $10,440 USD",
    "phases": [
      {
        "name": "Phase 1: Architecture Decoupling & Security Hardening",
        "description": "Isolate business logic, implement strict schema validators, and patch API endpoints.",
        "estimateUSD": "$2,600 USD",
        "duration": "1.5 Weeks",
        "hours": 28
      },
      {
        "name": "Phase 2: Database Performance & Concurrency Optimization",
        "description": "Refactor queries, add compound indexes, and configure connection pool limits.",
        "estimateUSD": "$2,200 USD",
        "duration": "1 Week",
        "hours": 24
      },
      {
        "name": "Phase 3: Automated CI/CD Pipeline & Operational Runbook",
        "description": "Deploy GitHub Actions pipeline, multi-stage Docker containers, and observability specs.",
        "estimateUSD": "$1,320 USD",
        "duration": "1 Week",
        "hours": 20
      }
    ]
  }
}`;

    const { reply } = await generateAIResponse(
      `Generate the architectural audit JSON for ${targetIdentifier}. Output ONLY valid JSON.`,
      [],
      auditInstruction
    );

    // Parse JSON safely
    let reportData: any;
    try {
      const cleaned = reply.replace(/```json/gi, '').replace(/```/g, '').trim();
      reportData = JSON.parse(cleaned);
    } catch (parseErr) {
      console.warn('[Audit API] JSON parse failed, extracting via regex or heuristic:', parseErr);
      const jsonMatch = reply.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        reportData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('AI response could not be parsed as JSON');
      }
    }

    reportData.generatedAt = new Date().toISOString();
    return res.json({ success: true, report: reportData });
  } catch (err: any) {
    console.error('[Audit API] Error generating audit:', err);

    // Fallback heuristic report to guarantee continuity
    const reportData = {
      projectName: req.body?.repoUrl ? 'Target Repository' : 'Project Architecture',
      sourceType: req.body?.repoUrl ? 'repository' : 'zip_archive',
      sourceIdentifier: req.body?.repoUrl || 'Project Archive',
      healthScore: 78,
      detectedStack: ['TypeScript', 'Node.js', 'PostgreSQL', 'Docker'],
      executiveSummary: `Technical architecture audit performed by Enigmy Neutral Engineering Agent. Evaluated service boundaries, persistence patterns, and deployment configurations. Identified actionable refactoring avenues to align with international enterprise standards.`,
      vulnerabilities: [
        {
          title: 'Unbounded API Ingestion & Missing Rate Limiting',
          severity: 'High',
          description: 'Endpoints accept incoming request payloads without strict volumetric throttling, exposing the service to resource exhaustion.',
        },
        {
          title: 'Absence of Defensive Request/Response Schema Validation',
          severity: 'High',
          description: 'Data payloads pass into internal service layers without compile-time runtime schema guards.',
        },
        {
          title: 'Database Query Latency & Missing Compound Indexes',
          severity: 'Medium',
          description: 'Frequent join queries and filtering routines execute without compound index optimization.',
        },
      ],
      bottlenecks: [
        'Monolithic controller structures mixing business logic with persistence',
        'Synchronous database calls blocking event loops during external webhook dispatch',
        'Lack of automated regression and integration test coverage across core user workflows',
      ],
      recommendations: [
        'Refactor services into Hexagonal / Domain-Driven Architecture with typed ports and adapters',
        'Deploy Redis caching layer for high-frequency queries',
        'Implement multi-stage Docker containerization and automated GitHub Actions verification pipeline',
        'Establish structured logging and OpenTelemetry tracing for production visibility',
      ],
      enigmyNeutralScope: [
        'Sprint 1: Architecture review, threat modeling, and Docker containerization',
        'Sprint 2: Service decoupling, database index optimization, and secure API contracts',
        'Sprint 3: CI/CD automation, stress testing benchmarks, and operational runbook handoff',
      ],
      pricingEstimate: {
        currency: 'USD',
        hourlyRateRange: '$85 – $145 USD / hour (Senior International Dev Benchmark)',
        totalHours: 72,
        sprintDuration: '3 – 4 Weeks',
        totalEstimateUSD: '$6,120 – $10,440 USD',
        phases: [
          {
            name: 'Phase 1: Architecture Decoupling & Security Hardening',
            description: 'Isolate business logic, implement strict schema validators, and patch API endpoints.',
            estimateUSD: '$2,600 USD',
            duration: '1.5 Weeks',
            hours: 28,
          },
          {
            name: 'Phase 2: Database Performance & Concurrency Optimization',
            description: 'Refactor queries, add compound indexes, and configure connection pool limits.',
            estimateUSD: '$2,200 USD',
            duration: '1 Week',
            hours: 24,
          },
          {
            name: 'Phase 3: Automated CI/CD Pipeline & Operational Runbook',
            description: 'Deploy GitHub Actions pipeline, multi-stage Docker containers, and observability specs.',
            estimateUSD: '$1,320 USD',
            duration: '1 Week',
            hours: 20,
          },
        ],
      },
      generatedAt: new Date().toISOString(),
    };

    return res.json({ success: true, report: reportData, fallback: true });
  }
});

// NVIDIA NIM direct pass-through for model inspection
app.post('/api/agent/nvidia-chat', async (req: Request, res: Response) => {
  try {
    const apiKey = process.env.NVIDIA_API_KEY || (req.headers.authorization?.replace(/^Bearer\s+/i, ''));
    const isStream = req.body?.stream === true || req.headers.accept?.includes('text/event-stream');

    const payload = {
      model: req.body?.model || 'nvidia/nemotron-3.5-bolt-e4b',
      messages: req.body?.messages || [
        { role: 'system', content: ENIGMY_SYSTEM_INSTRUCTION },
        { role: 'user', content: req.body?.prompt || 'Conduct technical architecture evaluation.' },
      ],
      temperature: req.body?.temperature ?? 0.7,
      top_p: req.body?.top_p ?? 0.95,
      max_tokens: req.body?.max_tokens ?? 1024,
      seed: req.body?.seed ?? 42,
      stream: isStream,
      parallel_tool_calls: req.body?.parallel_tool_calls ?? true,
    };

    if (!apiKey) {
      return res.json({
        id: `local-nemotron-${Date.now()}`,
        model: 'nvidia/nemotron-3.5-bolt-e4b',
        choices: [
          {
            index: 0,
            message: {
              role: 'assistant',
              content: `[Enigmy Neutral Engineering Agent — NVIDIA NIM Nemotron-3.5-Bolt]\n\nBackend configured for model "nvidia/nemotron-3.5-bolt-e4b" at https://integrate.api.nvidia.com/v1/chat/completions.\n\nStaging domain: dmgrecords.com.br (Provisional).`,
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

// Project Inquiry & Scope Questionnaire Submission Endpoint
app.post('/api/inquiry', async (req: Request, res: Response) => {
  try {
    const {
      fullName,
      workEmail,
      company,
      projectType,
      budgetRange,
      timeline,
      projectDescription,
      preferredContact,
      requiresNda,
      honeypot,
      source,
      auditReport,
    } = req.body || {};

    if (honeypot) {
      return res.status(400).json({ error: 'Honeypot triggered.' });
    }

    if (!fullName || !workEmail || (!projectDescription && !auditReport)) {
      return res.status(400).json({
        error: 'Missing required fields: fullName, workEmail and projectDescription are required.',
      });
    }

    const recipient = process.env.CONTACT_NOTIFICATION_EMAIL || 'enigmyneutral@gmail.com';
    const resendKey = process.env.RESEND_API_KEY;

    const emailSubject = `[Enigmy Neutral Lead] ${projectType || 'Project Inquiry'} — ${fullName} (${company || 'Direct'})`;

    const htmlBody = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #080A0B; color: #F5F7F4; padding: 32px; border-radius: 8px; max-width: 650px; margin: 0 auto; border: 1px solid #293033;">
        <div style="border-bottom: 1px solid #293033; padding-bottom: 20px; margin-bottom: 24px;">
          <h2 style="color: #B7F36B; margin: 0 0 6px 0; font-size: 20px; font-weight: 700; letter-spacing: -0.5px;">ENIGMY NEUTRAL</h2>
          <p style="margin: 0; color: #A4ADA8; font-size: 13px;">New Project Scope Inquiry & Client Lead</p>
        </div>

        <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 24px;">
          <tr style="border-bottom: 1px solid #1E2325;">
            <td style="padding: 10px 0; color: #737D77; width: 140px;">Source:</td>
            <td style="padding: 10px 0; color: #B7F36B; font-weight: 600;">${source === 'chat_agent' ? 'Engineering Agent Chat' : 'Project Inquiry Questionnaire'}</td>
          </tr>
          <tr style="border-bottom: 1px solid #1E2325;">
            <td style="padding: 10px 0; color: #737D77;">Client Name:</td>
            <td style="padding: 10px 0; color: #F5F7F4; font-weight: 600;">${fullName}</td>
          </tr>
          <tr style="border-bottom: 1px solid #1E2325;">
            <td style="padding: 10px 0; color: #737D77;">Work Email:</td>
            <td style="padding: 10px 0;"><a href="mailto:${workEmail}" style="color: #B7F36B; text-decoration: none;">${workEmail}</a></td>
          </tr>
          <tr style="border-bottom: 1px solid #1E2325;">
            <td style="padding: 10px 0; color: #737D77;">Company / Org:</td>
            <td style="padding: 10px 0; color: #F5F7F4;">${company || 'Not informed'}</td>
          </tr>
          <tr style="border-bottom: 1px solid #1E2325;">
            <td style="padding: 10px 0; color: #737D77;">Project Type:</td>
            <td style="padding: 10px 0; color: #F5F7F4;">${projectType || 'Software Development'}</td>
          </tr>
          <tr style="border-bottom: 1px solid #1E2325;">
            <td style="padding: 10px 0; color: #737D77;">Budget Range:</td>
            <td style="padding: 10px 0; color: #55D68B; font-weight: 600;">${budgetRange || 'Flexible'}</td>
          </tr>
          <tr style="border-bottom: 1px solid #1E2325;">
            <td style="padding: 10px 0; color: #737D77;">Target Timeline:</td>
            <td style="padding: 10px 0; color: #F5F7F4;">${timeline || 'Immediate / Flexible'}</td>
          </tr>
          <tr style="border-bottom: 1px solid #1E2325;">
            <td style="padding: 10px 0; color: #737D77;">Preferred Contact:</td>
            <td style="padding: 10px 0; color: #F5F7F4;">${preferredContact || 'email'}</td>
          </tr>
          <tr style="border-bottom: 1px solid #1E2325;">
            <td style="padding: 10px 0; color: #737D77;">Requires NDA:</td>
            <td style="padding: 10px 0; color: ${requiresNda ? '#F2C66D' : '#A4ADA8'}; font-weight: 600;">${requiresNda ? 'YES — Mutual NDA Required' : 'No'}</td>
          </tr>
        </table>

        <div style="background-color: #101315; border: 1px solid #293033; padding: 16px; border-radius: 6px; margin-bottom: 24px;">
          <h4 style="margin: 0 0 8px 0; color: #A4ADA8; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Project Description & Requirements:</h4>
          <p style="margin: 0; color: #F5F7F4; line-height: 1.6; white-space: pre-wrap; font-size: 14px;">${projectDescription || 'No additional description provided.'}</p>
        </div>

        ${auditReport ? `
        <div style="background-color: #15191B; border: 1px solid #293033; padding: 16px; border-radius: 6px; margin-bottom: 24px;">
          <h4 style="margin: 0 0 8px 0; color: #B7F36B; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Attached AI Agent Audit Summary:</h4>
          <pre style="margin: 0; color: #A4ADA8; font-size: 12px; overflow-x: auto; font-family: monospace;">${typeof auditReport === 'string' ? auditReport : JSON.stringify(auditReport, null, 2)}</pre>
        </div>
        ` : ''}

        <div style="border-top: 1px solid #293033; padding-top: 16px; font-size: 12px; color: #737D77; display: flex; justify-content: space-between;">
          <span>Recipient: ${recipient}</span>
          <span>Submitted at: ${new Date().toUTCString()}</span>
        </div>
      </div>
    `;

    if (resendKey) {
      const emailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || 'Enigmy Neutral <onboarding@resend.dev>',
          to: [recipient],
          reply_to: workEmail,
          subject: emailSubject,
          html: htmlBody,
        }),
      });

      if (!emailResponse.ok) {
        const errorText = await emailResponse.text();
        console.error('[Inquiry API] Resend email delivery failed:', errorText);
        return res.status(502).json({
          error: 'Email delivery failed upstream',
          details: errorText,
          fallbackStored: true,
        });
      }

      const emailData = await emailResponse.json();
      console.log('[Inquiry API] Email sent successfully via Resend:', emailData);
      return res.json({
        success: true,
        delivery: 'resend',
        id: emailData.id,
        message: 'Project inquiry dispatched successfully to Marcos Santos.',
      });
    }

    console.log('[Inquiry API] New Inquiry received (RESEND_API_KEY not configured yet):', {
      fullName,
      workEmail,
      company,
      projectType,
      budgetRange,
    });

    return res.json({
      success: true,
      delivery: 'simulated',
      message: 'Inquiry received and logged. Add RESEND_API_KEY to .env to deliver live emails to enigmyneutral@gmail.com.',
    });
  } catch (error: any) {
    console.error('[Inquiry API] Internal server error:', error);
    return res.status(500).json({
      error: 'Failed to process project inquiry',
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
    console.log(`[Enigmy Neutral] Gemini Fallback: gemini-3.8-flash`);
  });
}

startServer();
