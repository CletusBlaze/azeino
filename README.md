# AZEINO

One AI for almost everything.

AZEINO is a multimodal AI platform that automatically routes any user request — text, image, document, voice, or mixed — to the right AI capability. No mode switching. No configuration. Just ask.

**Live:** [https://azeino.vercel.app](https://azeino.vercel.app)

---

## What AZEINO Can Do

| Capability | Description |
|---|---|
| **AI Chat** | General conversation, reasoning, and Q&A |
| **Web Research** | Real-time web search with source citations |
| **Vision** | Analyze and describe images and screenshots |
| **Documents** | Summarize, extract, and Q&A on PDFs and Word files |
| **Image Generation** | Create images from text descriptions via OpenAI |
| **Image Editing** | Edit uploaded images through conversation |
| **Coding** | Debug, generate, explain, refactor, and optimize code |
| **Study** | Quizzes, flashcards, study plans, past questions, and tutoring |
| **Brainstorming** | SWOT analysis, startup validation, business plans, go-to-market |
| **Memory** | Remembers facts about you across all conversations |
| **AI Agents** | Autonomous multi-step task runner with live step viewer |

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 15, TypeScript, Tailwind CSS, Zustand |
| **Backend** | Node.js, Fastify |
| **Database** | PostgreSQL via Supabase |
| **Auth** | Supabase Auth (email + Google OAuth) |
| **AI — Text/Vision/Search** | Google Gemini (`gemini-2.0-flash`) |
| **AI — Image Generation** | OpenAI (`gpt-image-1`) |
| **File Storage** | Supabase Storage |
| **Payments** | Paystack (NGN + international cards) |
| **Push Notifications** | Web Push API with VAPID keys |
| **PWA** | next-pwa with service worker + installable manifest |
| **Frontend Hosting** | Vercel |
| **Backend Hosting** | Render (free tier) |

---

## Live URLs

| Service | URL |
|---|---|
| **Frontend** | https://azeino.vercel.app |
| **Backend** | https://azeino.onrender.com |
| **GitHub** | https://github.com/CletusBlaze/azeino |
| **Supabase** | https://bonwxzilfflnbbcpppnc.supabase.co |

> **Note:** Render free tier cold-starts after 15 minutes of inactivity. First request after idle takes ~30 seconds.

---

## Project Structure

```
azeino/
├── frontend/                  # Next.js 15 web app
│   ├── app/
│   │   ├── page.tsx           # Landing page with splash screen
│   │   ├── layout.tsx         # Root layout with background animation + error boundary
│   │   ├── globals.css        # Design system, animations, responsive styles
│   │   ├── auth/
│   │   │   ├── login/         # Login page
│   │   │   └── signup/        # Signup page
│   │   └── app/
│   │       ├── layout.tsx     # App layout — wraps all /app/* with AuthGuard
│   │       ├── chat/[id]/     # Main chat interface
│   │       ├── explore/       # Dashboard / home
│   │       ├── study/         # Study tools page
│   │       ├── code/          # Code assistant page
│   │       ├── brainstorm/    # Brainstorm tools page
│   │       ├── documents/     # Document analysis page
│   │       ├── research/      # Web research page
│   │       ├── images/        # Image generation page
│   │       ├── memory/        # Memory management page
│   │       ├── files/         # Uploaded files history page
│   │       ├── billing/       # Billing page — plans, usage meter, Paystack checkout
│   │       ├── agents/        # AI Agents page — task runner with live step viewer
│   │       └── settings/      # Settings (6 tabs)
│   ├── public/
│   │   ├── manifest.json      # PWA manifest (start_url: /, theme: #6366F1)
│   │   ├── sw.js              # Auto-generated service worker (next-pwa)
│   │   └── icons/             # PWA icons (192x192, 512x512)
│   └── src/
│       ├── components/
│       │   ├── chat/
│       │   │   ├── MessageBubble.tsx   # Markdown + syntax highlighting + copy
│       │   │   └── InputBox.tsx        # Slash commands + voice input + file upload
│       │   ├── sidebar/
│       │   │   └── Sidebar.tsx         # Nav, conversations, search, rename/delete, mobile
│       │   └── shared/
│       │       ├── Logo.tsx            # PNG logo with gradient AZEINO text
│       │       ├── Toast.tsx           # Global toast notification system
│       │       ├── Modal.tsx           # Reusable modal with backdrop blur
│       │       ├── Skeleton.tsx        # Skeleton loader components
│       │       ├── ErrorBoundary.tsx   # Global React error boundary
│       │       ├── AuthGuard.tsx       # Protects /app/* — redirects to login if no session
│       │       ├── LandingRedirect.tsx # Redirects logged-in users from / to /app/explore
│       │       └── SplashScreen.tsx    # Full-screen intro shown once per session on /
│       ├── store/
│       │   ├── chatStore.ts    # Conversations, messages, sending state, personalization
│       │   └── authStore.ts    # User session, sign in/out, window.location redirect
│       ├── hooks/
│       │   └── usePush.ts      # Push notification subscribe/unsubscribe hook
│       └── services/
│           └── api.ts          # All backend API calls
│
├── backend/                   # Fastify API server
│   └── src/
│       ├── app.js             # Server setup, CORS, rate limiting, routes
│       ├── config/
│       │   └── ai.js          # AI provider config per capability
│       ├── routes/
│       │   ├── auth.js        # Auth routes
│       │   ├── conversations.js
│       │   ├── messages.js    # Main message handler — orchestrates AI + usage limit
│       │   ├── files.js       # File upload + list
│       │   ├── memory.js      # Memory CRUD
│       │   ├── usage.js       # Usage stats
│       │   ├── images.js      # Image records
│       │   ├── billing.js     # Paystack checkout, webhook, plan management
│       │   ├── push.js        # Web push VAPID setup, subscribe/unsubscribe
│       │   └── agents.js      # Agent run CRUD, triggers runner in background
│       ├── middleware/
│       │   ├── auth.js        # Supabase JWT validation
│       │   └── usageLimit.js  # Checks monthly message count against plan limit
│       └── services/
│           ├── orchestrator/
│           │   ├── index.js          # Routes to correct pipeline
│           │   └── intentDetector.js # Keyword + slash command intent detection
│           ├── pipelines/
│           │   ├── textPipeline.js
│           │   ├── searchPipeline.js
│           │   ├── visionPipeline.js
│           │   ├── documentPipeline.js
│           │   ├── codePipeline.js
│           │   ├── studyPipeline.js
│           │   ├── brainstormPipeline.js
│           │   ├── imageGenPipeline.js
│           │   └── imageEditPipeline.js
│           ├── agents/
│           │   └── runner.js         # Multi-step agent loop (max 6 steps), push on complete
│           └── ai/
│               ├── index.js          # Unified AI interface
│               └── adapters/
│                   ├── gemini.js     # Gemini adapter (text, vision, search, document)
│                   └── openai.js     # OpenAI adapter (image generation)
│
├── database/
│   └── schema.sql             # Full PostgreSQL schema
│
└── docs/                      # Architecture and API documentation
```

---

## Environment Variables

### Backend (`backend/.env`)
```env
PORT=4000
NODE_ENV=development
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_jwt_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_jwt_key
DATABASE_URL=postgresql://postgres.xxx:[password]@aws-x-region.pooler.supabase.com:6543/postgres
GEMINI_API_KEY=your_gemini_api_key
OPENAI_API_KEY=your_openai_api_key
STORAGE_BUCKET=ai-platform-files
FRONTEND_URL=http://localhost:3000
PAYSTACK_SECRET_KEY=sk_test_your_paystack_secret_key
VAPID_EMAIL=mailto:your@email.com
VAPID_PUBLIC_KEY=your_vapid_public_key
VAPID_PRIVATE_KEY=your_vapid_private_key
```

### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_jwt_key
NEXT_PUBLIC_API_URL=http://localhost:4000
```

---

## Database Setup

Run `database/schema.sql` in your Supabase SQL editor, then add this trigger to auto-sync auth users:

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, display_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'display_name')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

Also add `http://localhost:3000/**` to your Supabase Auth redirect URLs.

---

## Running Locally

### Backend
```bash
cd backend
npm run dev
# Runs on http://localhost:4000
```

### Frontend
```bash
cd frontend
npm run dev
# Runs on http://localhost:3000
```

---

## What's Built

### Auth
- Email/password signup and login via Supabase Auth
- Google OAuth support
- Email confirmation required (enabled in Supabase Auth settings)
- Password show/hide toggle on auth forms
- JWT stored in localStorage, sent as Bearer token on every request
- Auth state managed with Zustand (`authStore`)
- Auto-sync of Supabase auth users to public `users` table via DB trigger
- `AuthGuard` component protects all `/app/*` routes — redirects to login if no session
- `LandingRedirect` redirects already-logged-in users from `/` to `/app/explore`
- Login page calls `init()` on mount and redirects if already authenticated

### Splash Screen
- Full-screen intro shown once per session when the app first opens
- Displays AZEINO logo, tagline, "Get Started Free" and "Sign In" buttons
- Auto-dismisses after 2.5 seconds or on tap
- Uses `sessionStorage` to only show once per session
- Fades out smoothly before revealing the landing page

### PWA
- Installable on Android and iOS via browser "Add to Home Screen"
- Service worker auto-generated by `next-pwa`
- `manifest.json` with `start_url: /` so auth flow runs correctly on launch
- Icons at 192x192 and 512x512
- Theme color: `#6366F1`

### AI Orchestration
- Central orchestrator detects intent and routes to the correct pipeline
- Intent detection via keyword matching and slash command prefixes
- Slash commands: `/search`, `/image`, `/code`, `/study`, `/brainstorm`, `/document`
- All pipelines receive `memoryContext` and `personalization` injected into system prompts
- Supported intents: `text`, `search`, `vision`, `document`, `imageGen`, `imageEdit`, `code`, `study`, `brainstorm`

### AI Pipelines
- **Text** — Gemini chat with full conversation history, memory, and personalization
- **Search** — Gemini with Google Search grounding, returns sources with citations
- **Vision** — Gemini analyzes uploaded images with user prompt
- **Document** — Gemini analyzes PDFs and Word files with user prompt
- **Code** — Expert software engineer system prompt with Gemini
- **Study** — Academic tutor system prompt with file support
- **Brainstorm** — Business/creative thinking partner system prompt
- **Image Generation** — OpenAI `gpt-image-1`, returns base64 image
- **Image Editing** — Gemini describes uploaded image, OpenAI regenerates with edits applied

### AI Agents (Stage 9)
- Autonomous multi-step task runner using Gemini
- Max 6 steps per run — tools: search, analyze, write, summarize
- Steps saved to DB in real time, frontend polls every 3 seconds
- Expandable step viewer with status icons and spin animation on running steps
- Push notification sent to user on task completion
- Agent runs stored in `agent_runs` table with status, steps (JSONB), and result
- Completed agent result saved as a message in the conversation

### Backend
- Fastify server on port 4000
- CORS configured for frontend origin (no trailing slash)
- Rate limiting (100 req/min)
- Multipart file upload support (20MB limit)
- Auth middleware validates Supabase JWT on every protected route
- Usage logging — every message logs capability + content length to `usage_logs`
- Usage limit middleware — blocks requests when monthly plan limit is reached (returns 429)
- Memory extraction runs in background after each AI response
- Auto-rename conversations to first 50 chars of first message
- Push notification sent after every AI response

### Billing (Stage 8)
- Powered by **Paystack** — supports NGN natively + international cards (USD, GBP, EUR, etc.)
- Plans: Free (20 msg) · Plus ₦4,000/~$3 (500 msg) · Pro ₦8,000/~$5 (2,000 msg) · Business ₦20,000/~$13 (10,000 msg)
- Paystack transaction initialized on backend, user redirected to Paystack hosted checkout
- Webhook at `/api/billing/webhook` receives `charge.success` and updates user plan in DB
- Usage meter on billing page with color-coded progress bar (green → yellow → red)
- Plan stored in `users.plan` column, enforced by `usageLimit` middleware on every message
- To go live: swap `PAYSTACK_SECRET_KEY` from `sk_test_` to `sk_live_` in Render env vars

### Push Notifications
- VAPID keys generated and stored in Render env vars
- `usePush` hook handles subscribe/unsubscribe with browser permission prompt
- Toggle in Settings → AI & Memory tab
- Subscriptions stored in `push_subscriptions` table (one per user)
- Push sent after every AI response and on agent task completion
- `sendPushToUser()` helper exported from `push.js` and used across routes

### Frontend — Pages
- **Landing** (`/`) — Sticky nav, splash screen, gradient hero, stats, demo chat preview, capabilities grid, CTA
- **Login** (`/auth/login`) — Email/password + Google OAuth, redirects if already logged in
- **Signup** (`/auth/signup`) — Name, email, password + Google OAuth
- **Explore** (`/app/explore`) — Dashboard with greeting and quick action buttons
- **Chat** (`/app/chat/[id]`) — Full chat interface with file upload, voice input, export
- **Study** (`/app/study`) — 8 action cards: quiz, flashcards, explain, past questions, study plan, test me, summarize, connect concepts
- **Code** (`/app/code`) — 6 action cards: debug, generate, explain, refactor, convert, optimize
- **Brainstorm** (`/app/brainstorm`) — 6 action cards: brainstorm, SWOT, validate startup, business plan, go-to-market, revenue model
- **Documents** (`/app/documents`) — 6 action cards: summarize, extract key points, Q&A, analyze data, rewrite, translate
- **Research** (`/app/research`) — 6 action cards: research topic, latest news, compare options, market research, fact check, deep dive
- **Images** (`/app/images`) — Prompt input, style presets (photorealistic, digital art, anime, etc.), example prompts
- **Memory** (`/app/memory`) — View and delete AI memory facts
- **Files** (`/app/files`) — Uploaded file history with type, size, date, delete
- **Billing** (`/app/billing`) — Plan cards with NGN + USD pricing, usage meter, Paystack checkout
- **Agents** (`/app/agents`) — Task textarea, example tasks, run list with live polling, expandable step viewer
- **Settings** (`/app/settings`) — 6 tabs: General, Personalization, Profile, AI & Memory, Usage, Data & Privacy

### Frontend — Components
- **Sidebar** — Logo, nav links (including Billing + Agents), new chat, conversation search, rename/delete context menu, theme toggle, mobile hamburger menu
- **MessageBubble** — ReactMarkdown with react-syntax-highlighter (oneDark), copy button per code block, copy full message, source citations
- **InputBox** — Slash command menu with arrow key nav, voice input (Web Speech API with real-time interim results), file upload with image preview
- **Logo** — PNG logo with CSS filter colorization, gradient AZEINO text, configurable size
- **Toast** — Global toast system (success/error/info) with Zustand store
- **Modal** — Reusable modal with backdrop blur, Escape key close, slide-up animation
- **Skeleton** — Shimmer skeleton loaders for messages and content
- **ErrorBoundary** — Global React error boundary with friendly UI and back-to-home button
- **AuthGuard** — Calls `init()`, shows loading dots, redirects to `/auth/login` if no user
- **LandingRedirect** — Client component on landing page, redirects logged-in users to `/app/explore`
- **SplashScreen** — Full-screen intro with logo + auth buttons, shown once per session

### Personalization
- Stored in localStorage: nickname, occupation, about you, custom instructions, enabled toggle
- Sent with every message to backend
- Injected into system prompts of all AI pipelines
- Managed in Settings → Personalization tab

### Memory System
- AI extracts facts from conversations in the background after each response
- Facts stored in `user_memory` table per user
- Injected as context into every AI pipeline system prompt
- Viewable and deletable from `/app/memory` and Settings → AI & Memory tab

### Mobile & Responsive
- All 21 pages fully responsive with mobile breakpoints in `globals.css`
- `app-main` class: padding 48px 40px → 24px 16px on mobile
- `chat-header` class: padding-left 52px on mobile for hamburger clearance
- `settings-panel` / `settings-nav`: stack vertically on mobile
- `landing-*` classes: hero, nav, CTA all responsive
- Sidebar closes automatically on nav link click on mobile

### UI & Animations
- Animated background — gradient mesh (indigo/violet/cyan) + grid overlay + pulsing glow
- Message bubbles slide in from left (AI) and right (user)
- Staggered fade-up on action card grids
- Wave animation on typing indicator dots
- Card hover lift with indigo glow
- Button lift on hover, scale on click
- Skeleton shimmer with moving gradient
- Page fade-in on load
- Mic button pulses red when listening
- Splash screen fades out smoothly on dismiss

### Database Tables
- `users` — mirrors Supabase auth users, stores `plan` and `paystack_customer_code`
- `conversations` — per-user chat sessions with title and timestamps
- `messages` — full message history with role, content, content_type, metadata (sources, imageData)
- `files` — uploaded file references with type, size, storage path
- `images` — generated/edited image records
- `user_memory` — persistent memory facts per user
- `usage_logs` — per-request AI usage tracking by capability
- `agent_runs` — autonomous agent task runs with status, steps (JSONB), result
- `push_subscriptions` — one Web Push subscription per user

---

## API Routes

| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/sync` | Sync Supabase auth user to public users table |
| GET | `/api/conversations` | List user conversations |
| POST | `/api/conversations` | Create new conversation |
| PATCH | `/api/conversations/:id` | Rename conversation |
| DELETE | `/api/conversations/:id` | Delete conversation |
| POST | `/api/messages/:conversationId/messages` | Send message, get AI response |
| GET | `/api/messages/:conversationId/messages` | Get conversation messages |
| POST | `/api/files/upload` | Upload file to Supabase Storage |
| GET | `/api/files` | List user uploaded files |
| DELETE | `/api/files/:id` | Delete a file |
| GET | `/api/memory` | Get user memory facts |
| DELETE | `/api/memory/:id` | Delete a memory fact |
| GET | `/api/usage` | Get usage stats (by capability, this month, all time) |
| GET | `/api/billing/plan` | Get current plan + monthly usage |
| POST | `/api/billing/checkout` | Initialize Paystack transaction, returns checkout URL |
| POST | `/api/billing/webhook` | Paystack webhook — updates user plan on charge.success |
| GET | `/api/push/vapid-key` | Get VAPID public key for push subscription |
| POST | `/api/push/subscribe` | Save push subscription for user |
| DELETE | `/api/push/subscribe` | Remove push subscription |
| GET | `/api/agents` | List user agent runs |
| POST | `/api/agents` | Create agent run, starts runner in background |
| DELETE | `/api/agents/:id` | Delete an agent run |

---

## Slash Commands

| Command | Behavior |
|---|---|
| `/search` | Forces web search pipeline with citations |
| `/image` | Forces image generation pipeline (OpenAI) |
| `/code` | Forces code assistant pipeline |
| `/study` | Forces study/tutor pipeline |
| `/brainstorm` | Forces brainstorm pipeline |
| `/document` | Forces document analysis pipeline |

---

## Billing Plans

| Plan | Price (NGN) | Price (USD approx.) | Messages/month |
|---|---|---|---|
| Free | ₦0 | $0 | 20 |
| Plus | ₦4,000 | ~$3 | 500 |
| Pro | ₦8,000 | ~$5 | 2,000 |
| Business | ₦20,000 | ~$13 | 10,000 |

- Payments via Paystack — supports NGN bank transfer, USSD, cards + international Visa/Mastercard
- To activate live payments: replace `PAYSTACK_SECRET_KEY` with `sk_live_` key in Render after Paystack account approval
- Webhook URL: `https://azeino.onrender.com/api/billing/webhook`

---

## Build Roadmap

| Stage | Description | Status |
|---|---|---|
| 1 | Foundation — project setup, auth, design system | ✅ Done |
| 2 | Basic AI chat + conversation history | ✅ Done |
| 3 | Multimodal — images, PDFs, documents | ✅ Done |
| 4 | Web search + citations | ✅ Done |
| 5 | Memory | ✅ Done |
| 6 | Image generation + editing | ✅ Done |
| 7 | Study + coding + business tools | ✅ Done |
| 8 | Usage tracking + billing (Paystack) | ✅ Done |
| 9 | AI agents | ✅ Done |
| 10 | PWA + push notifications + mobile responsive | ✅ Done |
| 11 | Splash screen + auth flow fixes | ✅ Done |
| 12 | Team seats + multi-user workspaces | ⏳ Planned |
| 13 | API access for developers | ⏳ Planned |

---

## Known Notes

- **Gemini model** — `gemini-2.0-flash` used. Free tier = 20 requests/day. Resets at midnight Pacific time.
- **Image generation** — Requires a valid `OPENAI_API_KEY` with access to `gpt-image-1`. Currently not set.
- **Voice input** — Uses Web Speech API. Supported in Chrome and Edge only. Requires microphone permission.
- **File uploads** — Images, PDFs, `.doc`, `.docx`, `.txt` supported. Max 20MB.
- **DB content_type** — Only accepts `text`, `image`, `document`, `mixed`. Search pipeline returns `type: 'text'`.
- **Render cold start** — Free tier backend sleeps after 15 min idle. First request takes ~30s to wake up.
- **Paystack test mode** — Currently using test keys. Switch to live keys after Paystack account verification (1-3 business days).
- **Email confirmation** — Enabled in Supabase Auth settings. New users must verify email before logging in.
