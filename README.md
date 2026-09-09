# AZEINO

One AI for almost everything.

AZEINO is a multimodal AI platform that automatically routes any user request — text, image, document, voice, or mixed — to the right AI capability. No mode switching. No configuration. Just ask.

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

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 15, TypeScript, Tailwind CSS, Zustand |
| **Backend** | Node.js, Fastify |
| **Database** | PostgreSQL via Supabase |
| **Auth** | Supabase Auth (email + Google OAuth) |
| **AI — Text/Vision/Search** | Google Gemini (`gemini-3.6-flash`) |
| **AI — Image Generation** | OpenAI (`gpt-image-1`) |
| **File Storage** | Supabase Storage |

---

## Project Structure

```
azeino/
├── frontend/                  # Next.js 15 web app
│   ├── app/
│   │   ├── page.tsx           # Landing page
│   │   ├── layout.tsx         # Root layout with background animation + error boundary
│   │   ├── globals.css        # Design system, animations, responsive styles
│   │   ├── auth/
│   │   │   ├── login/         # Login page
│   │   │   └── signup/        # Signup page
│   │   └── app/
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
│   │       └── settings/      # Settings (6 tabs)
│   └── src/
│       ├── components/
│       │   ├── chat/
│       │   │   ├── MessageBubble.tsx   # Markdown + syntax highlighting + copy
│       │   │   └── InputBox.tsx        # Slash commands + voice input + file upload
│       │   ├── sidebar/
│       │   │   └── Sidebar.tsx         # Nav, conversations, search, rename/delete, mobile
│       │   └── shared/
│       │       ├── Logo.tsx            # SVG/PNG logo component
│       │       ├── Toast.tsx           # Global toast notification system
│       │       ├── Modal.tsx           # Reusable modal with backdrop blur
│       │       ├── Skeleton.tsx        # Skeleton loader components
│       │       └── ErrorBoundary.tsx   # Global React error boundary
│       ├── store/
│       │   ├── chatStore.ts    # Conversations, messages, sending state, personalization
│       │   └── authStore.ts    # User session, sign in/out
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
│       │   ├── messages.js    # Main message handler — orchestrates AI
│       │   ├── files.js       # File upload + list
│       │   ├── memory.js      # Memory CRUD
│       │   ├── usage.js       # Usage stats
│       │   └── images.js      # Image records
│       ├── middleware/
│       │   └── auth.js        # Supabase JWT validation
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
- Password show/hide toggle on auth forms
- JWT stored in localStorage, sent as Bearer token on every request
- Auth state managed with Zustand (`authStore`)
- Auto-sync of Supabase auth users to public `users` table via DB trigger

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

### Backend
- Fastify server on port 4000
- CORS configured for frontend origin
- Rate limiting (100 req/min)
- Multipart file upload support (20MB limit)
- Auth middleware validates Supabase JWT on every protected route
- Usage logging — every message logs capability + content length to `usage_logs`
- Memory extraction runs in background after each AI response
- Auto-rename conversations to first 50 chars of first message

### Frontend — Pages
- **Landing** (`/`) — Sticky nav, gradient hero, stats, demo chat preview, capabilities grid, CTA
- **Login** (`/auth/login`) — Email/password + Google OAuth
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
- **Settings** (`/app/settings`) — 6 tabs: General, Personalization, Profile, AI & Memory, Usage, Data & Privacy

### Frontend — Components
- **Sidebar** — Logo, nav links, new chat, conversation search, rename/delete context menu, theme toggle, mobile hamburger menu
- **MessageBubble** — ReactMarkdown with react-syntax-highlighter (oneDark), copy button per code block, copy full message, source citations
- **InputBox** — Slash command menu with arrow key nav, voice input (Web Speech API with real-time interim results), file upload with image preview
- **Logo** — PNG logo with CSS filter colorization, gradient AZEINO text, configurable size
- **Toast** — Global toast system (success/error/info) with Zustand store
- **Modal** — Reusable modal with backdrop blur, Escape key close, slide-up animation
- **Skeleton** — Shimmer skeleton loaders for messages and content
- **ErrorBoundary** — Global React error boundary with friendly UI and back-to-home button

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

### Database Tables
- `users` — mirrors Supabase auth users
- `conversations` — per-user chat sessions with title and timestamps
- `messages` — full message history with role, content, content_type, metadata (sources, imageData)
- `files` — uploaded file references with type, size, storage path
- `images` — generated/edited image records
- `user_memory` — persistent memory facts per user
- `usage_logs` — per-request AI usage tracking by capability

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
| 8 | Usage tracking + billing | ⏳ Planned |
| 9 | AI agents | ⏳ Planned |

---

## Known Notes

- **Gemini model** — Only `gemini-3.6-flash` works on this account. Free tier = 20 requests/day. Resets at midnight Pacific time.
- **Image generation** — Requires a valid `OPENAI_API_KEY` with access to `gpt-image-1`.
- **Voice input** — Uses Web Speech API. Supported in Chrome and Edge only. Requires microphone permission.
- **File uploads** — Images, PDFs, `.doc`, `.docx`, `.txt` supported. Max 20MB.
- **DB content_type** — Only accepts `text`, `image`, `document`, `mixed`. Search pipeline returns `type: 'text'`.
