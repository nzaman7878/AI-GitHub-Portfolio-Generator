# AI GitHub Portfolio Generator

> Turn raw GitHub repositories into recruiter-ready engineering case studies with structured AI generation, bespoke editorial design, and zero generic templates.

![Status: In Progress](https://img.shields.io/badge/Status-🚧%20In%20Progress-yellow?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js%2015-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google%20Gemini-8E75C2?style=for-the-badge&logo=googlegemini&logoColor=white)

---

## Overview

AI GitHub Portfolio Generator transforms developer GitHub profiles into high-signal engineering portfolios. Unlike generic portfolio templates, it inspects your real codebase (commit history, README context, language breakdowns), crafts structured engineering case studies (Problem → Approach → Architecture → Impact), and renders them in a human-crafted editorial layout.

---

## Progress Checklist

### 🏗️ Foundation (Phases 0–5)

- [x] **Phase 0** — Project scaffolding (`create-next-app` with TypeScript, Tailwind, App Router, ESLint, Prettier, `.env.example`, clean folder architecture)
- [x] **Phase 1** — README foundation (Project title, one-line description, tech stack badges, "🚧 In Progress" status badge, empty progress checklist listing all 55 phases)
- [x] **Phase 2** — TypeScript strict mode + path aliases (`strict: true`, `@/` import alias, base types in `types/`)
- [x] **Phase 3** — Environment configuration (`.env.example`, runtime Zod validation in `lib/env.ts`, `.gitignore` verification)
- [x] **Phase 4** — Git hooks + code quality (Husky, lint-staged, and Commitlint for conventional commits)
- [x] **Phase 5** — CI pipeline via GitHub Actions (Automated lint, type-check, and build on push/PR)

### 🗄️ Database Layer (Phases 6–12)

- [ ] **Phase 6** — Prisma setup + Postgres connection (Prisma ORM with PostgreSQL provider)
- [ ] **Phase 7** — User schema (`User` model with portfolio slug, username, bio, and theme)
- [ ] **Phase 8** — Repository schema (`Repo` model with stars, language breakdowns, and commit activity)
- [ ] **Phase 9** — Case study schema (`CaseStudy` model for problem statement, architecture, key decisions, and impact metrics)
- [ ] **Phase 10** — Generation log schema (`GenerationLog` model to track token consumption and preserve free-tier quota)
- [ ] **Phase 11** — First migration + Prisma client (Generated PostgreSQL DDL migration and singleton in `lib/db.ts`)
- [ ] **Phase 12** — Seed script (`prisma/seed.ts` with realistic developer personas and case studies)

### 🔐 Authentication (Phases 13–17)

- [ ] **Phase 13** — NextAuth core setup (NextAuth / Auth.js with Prisma adapter)
- [ ] **Phase 14** — GitHub OAuth provider (OAuth app configuration, scopes, and token exchange)
- [ ] **Phase 15** — Auth session handling (Server and client session helper utilities)
- [ ] **Phase 16** — Protected routes middleware (Edge middleware redirecting unauthenticated traffic on `/dashboard/*`)
- [ ] **Phase 17** — Sign-in / sign-out UI (Clean, accessible authentication flows)

### 📡 GitHub Data Pipeline (Phases 18–23)

- [ ] **Phase 18** — Octokit client setup (Rate-limit aware GitHub REST client)
- [ ] **Phase 19** — Fetch user repositories (Server Action retrieving public repositories)
- [ ] **Phase 20** — Fetch repo README content (README fetch and markdown text extraction for LLM context)
- [ ] **Phase 21** — Fetch commit statistics (Commit counts, frequency, and recency analysis)
- [ ] **Phase 22** — Fetch language breakdown (Byte-level language distributions and percentages)
- [ ] **Phase 23** — Persist repo data to Postgres (Upsert logic with `lastSyncedAt` tracking)

### 🤖 AI Generation Pipeline (Phases 24–30)

- [ ] **Phase 24** — Gemini API client setup (Google Generative AI SDK with structured JSON mode)
- [ ] **Phase 25** — Case study prompt engineering (Deep engineering prompt: Problem → Approach → Architecture → Impact)
- [ ] **Phase 26** — Zod output schema (Strict runtime validation schema for AI output)
- [ ] **Phase 27** — Generation Server Action (End-to-end repository-to-case-study pipeline)
- [ ] **Phase 28** — Cache + skip logic (Content hash/timestamp check to bypass redundant regeneration)
- [ ] **Phase 29** — Rate-limit handling (Graceful backoff, queueing, and quota meters for free tier)
- [ ] **Phase 30** — Batch generation (Sequential multi-repo generation with live progress)

### 🎨 Design System (Phases 31–36)

- [ ] **Phase 31** — Design exploration via Stitch (Generating 2–3 bespoke aesthetic directions)
- [ ] **Phase 32** — Design decision + tokens (Design token extraction documented in `DESIGN.md`)
- [ ] **Phase 33** — Typography + base styles (Curated editorial font pairing and typography scale)
- [ ] **Phase 34** — Core UI components (Buttons, inputs, tech stack badges, and alerts)
- [ ] **Phase 35** — Layout components (Asymmetric editorial grid, page containers, and card primitives)
- [ ] **Phase 36** — Motion + interaction design (Directional reveals, staggered entrances, and micro-interactions)

### 📊 Dashboard (Phases 37–42)

- [ ] **Phase 37** — Dashboard layout shell (Responsive sidebar, navigation, and user header)
- [ ] **Phase 38** — Repository list view (Synced repositories with status indicators and selection toggles)
- [ ] **Phase 39** — Repo sync action (One-click GitHub data synchronization with real-time feedback)
- [ ] **Phase 40** — Case study preview + edit (Interactive preview modal with inline overrides)
- [ ] **Phase 41** — Generation controls (Individual and bulk generate triggers with quota meter)
- [ ] **Phase 42** — Dashboard settings (Custom portfolio slug, theme selection, and display toggles)

### 🌐 Public Portfolio (Phases 43–48)

- [ ] **Phase 43** — Portfolio page route + data loading (Dynamic `/[username]` route with server-side caching)
- [ ] **Phase 44** — Portfolio hero section (Editorial header with developer biography and high-signal stats)
- [ ] **Phase 45** — Case study cards (Deep architectural preview cards with technology badges)
- [ ] **Phase 46** — Case study detail view (Full engineering deep-dive with problem, architecture, decisions, and metrics)
- [ ] **Phase 47** — Loading, empty, and error states (Geometric skeleton loaders, polished empty state, and error boundary)
- [ ] **Phase 48** — OG image generation (Dynamic OpenGraph social preview images via `@vercel/og`)

### 🔧 Polish + Production (Phases 49–55)

- [ ] **Phase 49** — Input validation + error boundaries (Zod validation on all Server Actions and route error boundaries)
- [ ] **Phase 50** — Accessibility audit (Keyboard navigation, ARIA landmarks, and WCAG AA contrast)
- [ ] **Phase 51** — Performance optimization (Image optimization, code splitting, and database indexing)
- [ ] **Phase 52** — SEO + metadata (Dynamic meta tags, sitemap.xml, robots.txt, and JSON-LD schema)
- [ ] **Phase 53** — Documentation pass (Interactive architecture diagram and engineering pipeline writeup)
- [ ] **Phase 54** — Deploy to Vercel (Production database link, environment configuration, and smoke testing)
- [ ] **Phase 55** — Final README pass (Live demo link, showcase media, future roadmap, and checklist completion)
