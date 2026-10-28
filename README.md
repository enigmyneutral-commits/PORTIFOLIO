# ENIGMY NEUTRAL — Institutional Technology Portfolio

Independent Software Engineering · AI Systems · Digital Infrastructure

Lead: **Marcos Dresbach**  
Official Contact: **enigmyneutral@gmail.com**  
WhatsApp Business: **+55 51 98144-6019** (Brazilian international code +55)  
Primary Target Market: **United States** (with secondary support for Brazil & international engagements)

---

## 1. Overview

Enigmy Neutral is an independent technology portfolio and digital engineering presence representing the software architecture, artificial intelligence systems, developer tools, and infrastructure projects led by Marcos Dresbach.

This application is built with strict technical transparency:
- Capabilities are grounded exclusively in empirical repository codebases and documented architectures.
- No fabricated client testimonials, venture credentials, or unverified claims of physical corporate offices.
- Bilingual native experience (US English as default, Brazilian Portuguese seamlessly toggleable).
- Strict separation of public repositories from private proprietary codebases.

---

## 2. Architecture & Design Principles

The frontend adheres to the **Universal Frontend Design Constitution** and domain guidelines:
- **Zero-Pill Discipline**: Metadata is rendered with clean unboxed typography and typographic separators (`·`, `/`), avoiding static pill badge clutter.
- **Top Bar Contract**: A single-line header with three clear zones:
  1. Brand zone: Official Enigmy Neutral wordmark and verified logo mark.
  2. Navigation zone: Single-line semantic navigation links.
  3. Action zone: Language toggle (`EN` / `PT-BR`) and primary CTA button (`Discuss a Project`).
- **Color Discipline (60-30-10)**:
  - `#080A0B` (60% Primary dark obsidian canvas)
  - `#101315` & `#15191B` (30% Card surfaces and structural elements)
  - `#B7F36B` & `#8FCB4F` (10% High-intent lime green accents for primary CTAs and active states)
- **Typography**: Manrope for high-legibility UI prose paired with JetBrains Mono for technical identifiers, versions, and code metadata.
- **Defensive State Handling**: All buttons and filters have live handlers; no dead clicks, mock stubs, or broken links.

---

## 3. Technology Stack

- **Framework**: React 19 SPA with TypeScript
- **Bundler & Tooling**: Vite 8, `@tailwindcss/vite`
- **Styling**: Tailwind CSS v4 with custom design tokens in `@layer base`
- **Icons**: Lucide React (vectorized, domain-curated SVGs)
- **Animation**: Motion (micro-interactions with $\le 200\text{ms}$ settling curves)
- **Internationalization**: React Context with reactive language persistence in `localStorage`

---

## 4. Project Directory Structure

```text
/
├── index.html                     # HTML5 entry with SEO tags & JSON-LD schema
├── metadata.json                  # AI Studio application metadata
├── package.json                   # Dependencies and npm scripts
├── tsconfig.json                  # TypeScript compiler options
├── vite.config.ts                 # Vite bundler configuration
├── public/
│   └── assets/aistudio/           # Official Enigmy Neutral brand assets
└── src/
    ├── main.tsx                   # React root mount point
    ├── App.tsx                    # Main app coordinator, layout & routing
    ├── index.css                  # Tailwind CSS import & custom CSS design tokens
    ├── types/
    │   └── index.ts               # Domain TypeScript interfaces
    ├── context/
    │   └── LanguageContext.tsx    # i18n language provider and hook
    ├── i18n/
    │   └── translations.ts        # Comprehensive EN & PT-BR translation matrices
    ├── data/
    │   ├── repositories.ts        # 112 audited repositories catalog
    │   ├── products.ts            # 5 core product initiatives
    │   ├── engineering.ts         # 6 engineering service disciplines
    │   └── technologies.ts        # Categorized tech stack & verification evidence
    ├── components/
    │   ├── Header.tsx             # Top bar header adhering to 3-zone contract
    │   ├── Footer.tsx             # Institutional footer with verified links
    │   ├── ProjectCard.tsx        # Technical repository showcase card
    │   ├── ProductModal.tsx       # Product specifications and architecture modal
    │   ├── PrivateAccessModal.tsx # Private repository walkthrough request modal
    │   ├── InquiryModal.tsx       # Fast project consultation modal
    │   └── PolicyModal.tsx        # Privacy notice and governance principles modal
    └── pages/
        ├── HomePage.tsx           # Institutional hero, overview & highlights
        ├── EngineeringPage.tsx    # 6 engineering services, scope & deliverables
        ├── ProductsPage.tsx       # Modular software products and tools
        ├── ProjectsPage.tsx       # Full searchable and filterable repository catalog
        ├── TechnologyPage.tsx     # Empirical tech stack categorized by usage
        ├── AboutPage.tsx          # Leadership, MD monogram & transparency matrix
        └── ContactPage.tsx        # Project inquiry form & direct channels
```

---

## 5. Local Setup & Execution

### Prerequisites
- Node.js $\ge 20$
- npm $\ge 10$

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```
Runs the Vite dev server at `http://localhost:3000`.

### Type Checking & Linting
```bash
npm run lint
```

### Production Build
```bash
npm run build
```
Generates optimized static assets in `/dist`.

---

## 6. Audited Repositories Matrix (Enigmy Neutral Core)

| Name | Owner | Visibility | Category | Status | Verified Stack | Public Link Allowed | Last Review |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **enigmy-neutral** | enigmyneutral-commits | Private | Developer Tools | In Development | TypeScript, Node.js | Private (NDA) | 2026-10-28 |
| **enigmy-neutral-agente** | enigmyneutral-commits | Private | AI & ML | In Development | Python, TypeScript, LLM APIs | Private (NDA) | 2026-10-28 |
| **Modulo-nincode** | enigmyneutral-commits | Private | Developer Tools | In Development | TypeScript, Modular Plugins | Private (NDA) | 2026-10-28 |
| **pluguin-module-nincode** | enigmyneutral-commits | Private | Developer Tools | In Development | TypeScript, Plugin Core | Private (NDA) | 2026-10-28 |
| **NINCODE-Telemetry-Enigmy-Neutral** | enigmyneutral-commits | Private | Infrastructure | In Development | Go, Node.js, Telemetry | Private (NDA) | 2026-10-28 |
| **devnet** | enigmyneutral-commits | Public | Infrastructure | Prototype | Shell, Docker, Network Sockets | Yes | 2026-10-28 |
| **nimcode-website** | enigmyneutral-commits | Private | Web Apps | In Development | React, TypeScript, Tailwind | Private (NDA) | 2026-10-28 |
| **Nim-code-cli** | enigmyneutral-commits | Private | Developer Tools | Concept | Node.js, CLI Scaffolding | Private (NDA) | 2026-10-28 |
| **sovereign-ai-infrastructure** | enigmyneutral-commits | Private | Infrastructure | Research | Linux, Docker, GPU Orchestration | Private (NDA) | 2026-10-28 |
| **sabore** | enigmyneutral-commits | Private | Web Apps | In Development | TypeScript, Full-Stack | Private (NDA) | 2026-10-28 |
| **sabore-web** | enigmyneutral-commits | Private | Web Apps | In Development | React, TypeScript, Tailwind | Private (NDA) | 2026-10-28 |
| **beckend-sabore** | enigmyneutral-commits | Private | Backend & APIs | In Development | Node.js, Express, PostgreSQL | Private (NDA) | 2026-10-28 |

*Additional 100 repositories from the FLOW ecosystem (`flow-social-network`) are cataloged in the application repository explorer.*

---

## 7. Security, Confidentiality & Privacy

1. **Client-Side Sanitization**: No private code snippets, API keys, database credentials, or internal server paths are embedded in client JavaScript or static bundles.
2. **Private Codebase Access**: Access to private repositories is strictly managed via the `PrivateAccessModal` and subject to manual review and mutual Non-Disclosure Agreement (NDA).
3. **Anti-Spam Controls**: All client inquiry forms feature honeypot inputs and validation gates before submission.
4. **Direct Channel Integrity**: Official commercial emails are routed to `enigmyneutral@gmail.com` and WhatsApp Business to `+55 51 98144-6019` (verified Brazilian number).

---

## 8. Adding or Updating Projects

To add a new project to the catalog:
1. Open `src/data/repositories.ts`.
2. Append a new `RepositoryItem` object with validated `visibility`, `status`, and `confirmedTech`.
3. Provide descriptive summaries in both `descriptionEn` and `descriptionPt`.
4. Run `npm run lint` and `npm run build` to verify typings and builds.
