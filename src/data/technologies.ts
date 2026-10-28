import { TechnologyItem } from '../types';

export const TECHNOLOGIES: TechnologyItem[] = [
  // --- FRONTEND ---
  {
    name: 'TypeScript',
    category: 'Frontend',
    status: 'Used in Projects',
    evidence: 'Core language in Enigmy Neutral core, Sabore Web, and portfolio architecture.',
  },
  {
    name: 'React',
    category: 'Frontend',
    status: 'Used in Projects',
    evidence: 'Implemented across client applications including Sabore-Web, Client-Hub, and NIMCode portal.',
  },
  {
    name: 'Next.js',
    category: 'Frontend',
    status: 'Used in Projects',
    evidence: 'Employed for server-rendered web applications and test-next-vercel deployments.',
  },
  {
    name: 'JavaScript (ES2022+)',
    category: 'Frontend',
    status: 'Used in Projects',
    evidence: 'Pervasive in browser interfaces, script tooling, and full-stack modules.',
  },
  {
    name: 'Tailwind CSS',
    category: 'Frontend',
    status: 'Used in Projects',
    evidence: 'Primary design engine for component styling, layouts, and responsive interfaces.',
  },
  {
    name: 'HTML5 & Semantic Web',
    category: 'Frontend',
    status: 'Used in Projects',
    evidence: 'Standard semantic layouts across egui404 and institutional portals.',
  },

  // --- BACKEND ---
  {
    name: 'Node.js',
    category: 'Backend',
    status: 'Used in Projects',
    evidence: 'Runtime engine for beckend-sabore, Enigmy Neutral agent, and developer CLIs.',
  },
  {
    name: 'Python',
    category: 'Backend',
    status: 'Used in Projects',
    evidence: 'Employed in CallShield-ML, bpip-core, and Ava AI core services.',
  },
  {
    name: 'Go (Golang)',
    category: 'Backend',
    status: 'Used in Projects',
    evidence: 'Used in ThreatDesk-Backend, NINCODE-Telemetry, and high-throughput network daemons.',
  },
  {
    name: 'PHP & Laravel',
    category: 'Backend',
    status: 'Used in Projects',
    evidence: 'Implemented in core-framework and enterprise client business backends.',
  },
  {
    name: 'Express',
    category: 'Backend',
    status: 'Used in Projects',
    evidence: 'API router powering backend services and web endpoint handlers.',
  },
  {
    name: 'FastAPI',
    category: 'Backend',
    status: 'Familiar Technologies',
    evidence: 'Used for lightweight Python microservices and model inference wrappers.',
  },

  // --- DATABASES ---
  {
    name: 'PostgreSQL',
    category: 'Databases',
    status: 'Used in Projects',
    evidence: 'Primary relational storage for beckend-sabore and ThreatDesk multi-tenant data.',
  },
  {
    name: 'SQLite',
    category: 'Databases',
    status: 'Used in Projects',
    evidence: 'Embedded database engine utilized in PDV-SUPER-MARKET and local developer tools.',
  },
  {
    name: 'Supabase',
    category: 'Databases',
    status: 'Used in Projects',
    evidence: 'Utilized for cloud PostgreSQL hosting, auth integrations, and row-level security.',
  },
  {
    name: 'Neon Serverless Postgres',
    category: 'Databases',
    status: 'Familiar Technologies',
    evidence: 'Evaluated and configured for serverless scaling and instant database branching.',
  },
  {
    name: 'Redis',
    category: 'Databases',
    status: 'Researching',
    evidence: 'Benchmarked for distributed in-memory cache layers and worker job queues.',
  },

  // --- INFRASTRUCTURE & DEVOPS ---
  {
    name: 'Linux / Ubuntu Server',
    category: 'Infrastructure & DevOps',
    status: 'Used in Projects',
    evidence: 'Underlying operating environment across techops scripts, devnet nodes, and servers.',
  },
  {
    name: 'Docker & Compose',
    category: 'Infrastructure & DevOps',
    status: 'Used in Projects',
    evidence: 'Containerized staging environments for devnet, ThreatDesk-Deploy, and multi-tier stacks.',
  },
  {
    name: 'Git & Version Control',
    category: 'Infrastructure & DevOps',
    status: 'Used in Projects',
    evidence: 'Audited across 112 repositories with multi-branch workflows and semantic tags.',
  },
  {
    name: 'GitHub Actions',
    category: 'Infrastructure & DevOps',
    status: 'Used in Projects',
    evidence: 'Automated CI linting and verification across public and private codebases.',
  },
  {
    name: 'Vercel',
    category: 'Infrastructure & DevOps',
    status: 'Used in Projects',
    evidence: 'Edge hosting environment used for frontend application builds and serverless routes.',
  },
  {
    name: 'Cloudflare',
    category: 'Infrastructure & DevOps',
    status: 'Familiar Technologies',
    evidence: 'DNS routing, edge caching, and SSL termination for production domains.',
  },

  // --- AI & INTEGRATIONS ---
  {
    name: 'LLM Model APIs (Gemini, Claude, GPT)',
    category: 'AI & Integrations',
    status: 'Used in Projects',
    evidence: 'Integrated into enigmy-neutral-agente, ava-ai-core, and contextual developer assistants.',
  },
  {
    name: 'Model Context Protocol (MCP)',
    category: 'AI & Integrations',
    status: 'Used in Projects',
    evidence: 'Verified implementation in Cyrus-mcp repository for tool discovery and agent orchestration.',
  },
  {
    name: 'NVIDIA AI APIs & Runtimes',
    category: 'AI & Integrations',
    status: 'Researching',
    evidence: 'Under active architectural research in sovereign-ai-infrastructure for local compute nodes.',
  },
  {
    name: 'Agent Frameworks & Tooling',
    category: 'AI & Integrations',
    status: 'Used in Projects',
    evidence: 'Architecture foundation in enigmy-neutral-agente and Cyrus agent runtimes.',
  },
];
