# NIRA MVP

**AI-Powered Healthcare Platform** — Intelligent pre-charting, symptom interviews, and clinical workflow automation for Indian clinics.

NIRA combines AI-driven patient symptom interviews with clinical decision support to reduce documentation burden and improve consultation quality. Patients complete a bilingual (English/Hindi) symptom interview before their appointment; the system generates SOAP-format pre-charts with confidence scores that doctors can review, edit, and approve in a single click.

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [API Reference (tRPC)](#api-reference-trpc)
- [Client Pages & Routing](#client-pages--routing)
- [Key Features](#key-features)
- [Development](#development)
- [Testing](#testing)
- [License](#license)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                   Client (React)                    │
│  Vite + React 19 + TailwindCSS v4 + shadcn/ui       │
│  wouter routing · TanStack Query · tRPC client      │
├─────────────────────────────────────────────────────┤
│                    tRPC (v11)                       │
│         Type-safe API layer (superjson)             │
├─────────────────────────────────────────────────────┤
│                Server (Express)                     │
│  OAuth authentication · Session cookies (JWT)       │
│  Protected/Admin procedures · File storage proxy    │
├─────────────────────────────────────────────────────┤
│              Database (MySQL)                       │
│        Drizzle ORM · 13 tables · Migrations         │
└─────────────────────────────────────────────────────┘
```

The app follows a **monorepo-style** layout with three main layers:

| Layer | Directory | Purpose |
|-------|-----------|---------|
| **Client** | `client/` | React SPA — pages, components, hooks, styles |
| **Server** | `server/` | Express server — tRPC routers, DB queries, auth, storage |
| **Shared** | `shared/` | Constants and types shared between client and server |
| **Schema** | `drizzle/` | Database schema definitions and migrations |

---

## Tech Stack

| Category | Technology |
|----------|-----------|
| **Frontend** | React 19, Vite 7, TypeScript 5.9 |
| **Styling** | TailwindCSS v4, shadcn/ui (Radix primitives), Framer Motion |
| **Routing** | wouter (lightweight client-side router) |
| **State / Data** | TanStack Query, tRPC React Query |
| **Backend** | Express 4, tRPC v11 (superjson transformer) |
| **Database** | MySQL (mysql2 driver), Drizzle ORM |
| **Auth** | OAuth 2.0 (external provider), JWT session cookies (jose) |
| **Storage** | S3-compatible via Forge storage proxy |
| **AI/LLM** | Server-side LLM integration (`server/_core/llm.ts`) |
| **Package Manager** | npm 10 |
| **Testing** | Vitest |

---

## Project Structure

```
nira-mvp/
├── client/                     # Frontend application
│   ├── index.html              # HTML entry point
│   ├── public/                 # Static assets
│   └── src/
│       ├── App.tsx             # Root component + routing
│       ├── main.tsx            # React entry point + tRPC/QueryClient setup
│       ├── index.css           # Global styles + TailwindCSS v4
│       ├── const.ts            # Client constants (login URL builder)
│       ├── _core/              # Auto-generated core (auth hooks, etc.)
│       ├── components/
│       │   ├── ui/             # shadcn/ui component library
│       │   ├── AIChatBox.tsx   # Reusable LLM chat component (Streamdown)
│       │   ├── DashboardLayout.tsx  # Sidebar-based dashboard shell
│       │   ├── ErrorBoundary.tsx
│       │   └── Map.tsx         # Google Maps integration
│       ├── contexts/
│       │   └── ThemeContext.tsx # Light/dark theme provider
│       ├── hooks/
│       │   ├── useComposition.ts
│       │   ├── useMobile.tsx
│       │   └── usePersistFn.ts
│       ├── lib/
│       │   ├── trpc.ts         # tRPC client instance
│       │   └── utils.ts        # cn() utility (clsx + tailwind-merge)
│       └── pages/
│           ├── Home.tsx              # Landing page (role-based redirect)
│           ├── PatientPortal.tsx      # Patient dashboard (appointments, Rx, records)
│           ├── DoctorDashboard.tsx    # Doctor dashboard (queue, EMR, prescriptions)
│           ├── SymptomInterview.tsx   # Bilingual symptom interview wizard
│           ├── PrescriptionApproval.tsx # DDI check + one-click approval
│           ├── ComponentShowcase.tsx  # UI component gallery
│           └── NotFound.tsx
│
├── server/                     # Backend application
│   ├── _core/                  # Framework & infrastructure
│   │   ├── index.ts            # Express server entry point
│   │   ├── trpc.ts             # tRPC init, middleware (public/protected/admin)
│   │   ├── context.ts          # Request context (user authentication)
│   │   ├── env.ts              # Environment variable config
│   │   ├── oauth.ts            # OAuth callback route
│   │   ├── cookies.ts          # Session cookie helpers
│   │   ├── sdk.ts              # Auth SDK (token exchange, session mgmt)
│   │   ├── llm.ts              # LLM provider integration
│   │   ├── voiceTranscription.ts # Voice-to-text service
│   │   ├── notification.ts     # Push notification service
│   │   ├── imageGeneration.ts  # AI image generation
│   │   ├── map.ts              # Geocoding & places API
│   │   ├── dataApi.ts          # External data API client
│   │   ├── systemRouter.ts     # System health/info router
│   │   └── vite.ts             # Vite dev server middleware
│   ├── routers.ts              # Main tRPC app router (all procedures)
│   ├── db.ts                   # Database query layer (all CRUD operations)
│   └── storage.ts              # File upload/download (S3 proxy)
│
├── shared/                     # Shared code (client + server)
│   ├── const.ts                # Cookie name, timeouts, error messages
│   └── types.ts                # Shared TypeScript types
│
├── drizzle/                    # Database layer
│   ├── schema.ts               # All table definitions (13 tables)
│   ├── relations.ts            # Table relations
│   ├── 0000_*.sql              # Initial migration
│   ├── 0001_*.sql              # Healthcare schema migration
│   └── meta/                   # Drizzle migration metadata
│
├── package.json                # Dependencies & scripts
├── vite.config.ts              # Vite configuration (+ debug collector plugin)
├── vitest.config.ts            # Test configuration
├── drizzle.config.ts           # Drizzle Kit configuration
├── tsconfig.json               # TypeScript configuration
├── todo.md                     # Project roadmap & task tracker
└── components.json             # shadcn/ui configuration
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 20
- **npm** ≥ 10 (bundled with Node.js)
- **MySQL** 8.x instance (local or remote)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd nira-mvp

# Install dependencies
npm install

# Configure environment
cp .env.example .env  # then edit with your values (see below)

# Run database migrations
npm run db:push

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000` (or the next available port).

---

## Environment Variables

Create a `.env` file in the project root:

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | MySQL connection string (`mysql://user:pass@host:port/db`) | ✅ |
| `VITE_APP_ID` | Application ID for OAuth | ✅ |
| `JWT_SECRET` | Secret key for session JWT signing | ✅ |
| `OAUTH_SERVER_URL` | OAuth provider server URL | ✅ |
| `VITE_OAUTH_PORTAL_URL` | OAuth portal URL (used client-side for login redirect) | ✅ |
| `OWNER_OPEN_ID` | OpenID of the app owner (auto-assigned admin role) | ⬜ |
| `BUILT_IN_FORGE_API_URL` | Forge storage proxy base URL | ⬜ |
| `BUILT_IN_FORGE_API_KEY` | Forge storage proxy API key | ⬜ |
| `PORT` | Server port (default: `3000`) | ⬜ |

---

## Database Schema

NIRA uses **13 MySQL tables** managed by Drizzle ORM. Tables fall into four domains:

### Identity & Access

| Table | Purpose |
|-------|---------|
| `users` | Core user accounts with role-based access (`patient`, `doctor`, `nurse`, `admin`) |
| `patients` | Extended patient profiles (demographics, ABHA ID, language preference, medical history) |
| `doctors` | Doctor profiles (license, specialization, clinic info, consultation fee) |

### Clinical Workflow

| Table | Purpose |
|-------|---------|
| `appointments` | Booking & queue management (status: scheduled → checked_in → in_progress → completed) |
| `consultations` | Encounter records linking patient, doctor, and appointment |
| `symptomInterviews` | AI-driven interview sessions (transcript, language, duration) |
| `preCharts` | AI-generated SOAP notes with per-section confidence scores (0.00–1.00) |
| `vitals` | Patient vital signs (BP, HR, temp, RR, SpO2, weight, height, BMI) |
| `examinationNotes` | Doctor's physical examination findings |
| `diagnoses` | ICD-10 coded diagnoses (AI-suggested vs. doctor-approved) |

### Prescriptions & Drug Safety

| Table | Purpose |
|-------|---------|
| `prescriptions` | Prescription records with DDI check status and approval workflow |
| `prescriptionItems` | Individual medications (drug, strength, form, frequency, duration, DDI risk) |
| `drugInteractions` | Drug-drug interaction rules (severity: none → low → moderate → high → critical) |

### Audit & Compliance

| Table | Purpose |
|-------|---------|
| `editLogs` | Doctor edits to AI-generated content (field, original value, edited value, reason) |
| `abhaConsent` | ABHA (Ayushman Bharat) health account linkage and consent tracking |

---

## API Reference (tRPC)

All API calls go through tRPC at `/api/trpc`. Procedures use `superjson` for serialization.

### Auth Middleware

| Procedure Type | Description |
|----------------|-------------|
| `publicProcedure` | No authentication required |
| `protectedProcedure` | Requires authenticated user session |
| `adminProcedure` | Requires authenticated user with `admin` role |

### Router Endpoints

#### `auth`
| Procedure | Type | Description |
|-----------|------|-------------|
| `auth.me` | Query | Get current user (or `null` if unauthenticated) |
| `auth.logout` | Mutation | Clear session cookie |

#### `patients`
| Procedure | Type | Description |
|-----------|------|-------------|
| `patients.register` | Mutation | Register current user as a patient |
| `patients.getProfile` | Query | Get patient profile for current user |

#### `appointments`
| Procedure | Type | Description |
|-----------|------|-------------|
| `appointments.book` | Mutation | Book an appointment with a doctor |
| `appointments.getMyAppointments` | Query | Get patient's appointments |
| `appointments.getQueue` | Query | Get doctor's patient queue |
| `appointments.updateStatus` | Mutation | Update appointment status |

#### `interviews`
| Procedure | Type | Description |
|-----------|------|-------------|
| `interviews.start` | Mutation | Start a symptom interview for an appointment |
| `interviews.submitResponse` | Mutation | Submit interview transcript and mark complete |

#### `preCharts`
| Procedure | Type | Description |
|-----------|------|-------------|
| `preCharts.generate` | Mutation | Generate AI SOAP note from interview |
| `preCharts.getByAppointment` | Query | Get pre-chart for an appointment |
| `preCharts.update` | Mutation | Doctor edits pre-chart fields |

#### `vitals`
| Procedure | Type | Description |
|-----------|------|-------------|
| `vitals.record` | Mutation | Record patient vital signs |
| `vitals.getByAppointment` | Query | Get vitals for an appointment |

#### `diagnoses`
| Procedure | Type | Description |
|-----------|------|-------------|
| `diagnoses.suggest` | Mutation | AI suggests an ICD-10 diagnosis |
| `diagnoses.approve` | Mutation | Doctor approves a diagnosis |
| `diagnoses.getByAppointment` | Query | Get diagnoses for an appointment |

#### `prescriptions`
| Procedure | Type | Description |
|-----------|------|-------------|
| `prescriptions.create` | Mutation | Create prescription with medications |
| `prescriptions.checkDDI` | Query | Check drug-drug interactions |
| `prescriptions.approve` | Mutation | Approve and generate e-Rx |
| `prescriptions.getByPatient` | Query | Get patient's prescriptions |
| `prescriptions.getByAppointment` | Query | Get prescription for an appointment |

#### `editLogs`
| Procedure | Type | Description |
|-----------|------|-------------|
| `editLogs.record` | Mutation | Log a doctor's edit to AI content |
| `editLogs.getByAppointment` | Query | Get edit history for an appointment |

#### `abha`
| Procedure | Type | Description |
|-----------|------|-------------|
| `abha.linkConsent` | Mutation | Initiate ABHA account linkage |
| `abha.getStatus` | Query | Check ABHA linkage status |

---

## Client Pages & Routing

| Route | Page | Description |
|-------|------|-------------|
| `/` | `Home` | Landing page — auto-redirects to portal based on user role |
| `/patient/*` | `PatientPortal` | Appointments, prescriptions, health records, ABHA linkage |
| `/doctor/*` | `DoctorDashboard` | Patient queue, EMR with SOAP notes, prescription management |
| `/interview/:appointmentId` | `SymptomInterview` | Step-by-step bilingual symptom questionnaire |
| `/prescription/:prescriptionId` | `PrescriptionApproval` | DDI check results + one-click approval + e-Rx generation |

---

## Key Features

### 🏥 Patient Portal
- **Appointment booking** with doctors
- **AI Symptom Interview** — 8-question adaptive interview in English or Hindi
- **Prescription viewer** with PDF download
- **Health records** — latest vitals, diagnoses, ABHA linkage

### 🩺 Doctor Dashboard
- **Real-time patient queue** with AI pre-chart readiness indicators
- **Unified EMR** — scrollable view with all SOAP sections, each with AI confidence scores
- **Editable AI pre-charts** — review, modify, and approve AI-generated notes
- **Prescription management** — create, check DDIs, approve with one click

### 🤖 AI-Powered Clinical Support
- **SOAP note generation** from patient interview transcripts
- **Confidence scores** (0–100%) on every AI-generated section
- **ICD-10 diagnosis suggestions** with approval workflow
- **Edit tracking** — all doctor modifications logged for model improvement

### 💊 Drug Safety
- **Drug-Drug Interaction (DDI) engine** — pairwise checks across all prescribed medications
- **Severity tiers** — none, low, moderate, high, critical
- **Blocking on critical DDIs** before prescription approval

### 🔐 Security & Auth
- **Role-based access control** — patient, doctor, nurse, admin
- **OAuth 2.0** authentication with JWT session cookies
- **Protected procedures** — sensitive endpoints require authentication
- **Admin procedures** — system-level operations restricted to admin users

---

## Development

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (Express + Vite HMR) |
| `npm run build` | Build for production (Vite client + esbuild server) |
| `npm start` | Run production build |
| `npm run check` | TypeScript type checking |
| `npm run format` | Prettier formatting |
| `npm test` | Run Vitest test suite |
| `npm run db:push` | Generate and run Drizzle migrations |

### Path Aliases

| Alias | Resolves To |
|-------|-------------|
| `@/` | `client/src/` |
| `@shared/` | `shared/` |
| `@assets/` | `attached_assets/` |

### Development Server

In development mode (`pnpm dev`), the Express server integrates Vite as middleware for:
- Hot Module Replacement (HMR)
- Automatic port finding (scans 3000–3019)
- Browser debug log collection (`.manus-logs/`)

---

## Testing

```bash
# Run all tests
npm test

# Run in watch mode
npx vitest
```

Tests are co-located in `server/` (e.g., `auth.logout.test.ts`, `nira.features.test.ts`).

---

## License

MIT
