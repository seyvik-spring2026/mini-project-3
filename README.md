# Mudita Studios CRM

A full-stack Next.js CRM for discovering and scoring Twitter/X talent. Built with React 19, SQLite, Drizzle ORM, and Tailwind CSS 4.

## Features

- Twitter/X candidate search via [twitterapi.io](https://twitterapi.io) proxy
- Automated candidate scoring (builder, authenticity, growth, red-flag signals)
- Kanban pipeline for managing candidates across stages
- Persistent SQLite database with search history

## Local Development

1. Copy the env template and add your API key:
   ```bash
   cp .env.example .env.local
   # Edit .env.local and set TWITTER_API_KEY
   ```

2. Install dependencies and start the dev server:
   ```bash
   npm install
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000)

## Deploy to Vercel

Vercel is the recommended host — it has native Next.js support and a free tier.

### One-time setup

1. Push this repo to GitHub (if not already done)
2. Go to [vercel.com/new](https://vercel.com/new) and import your GitHub repo
3. In the Vercel dashboard, go to **Settings → Environment Variables** and add:
   - `TWITTER_API_KEY` = your twitterapi.io key
4. Click **Deploy**

### CLI alternative

```bash
npm i -g vercel
vercel
# Follow the prompts, then set the env var:
vercel env add TWITTER_API_KEY
```

### Caveats

- **SQLite is ephemeral on Vercel** — the database resets on each redeploy (data stored in `/tmp`). This is fine for demos and class assignments. For persistent data, use Railway or Render instead.
- All Twitter API calls are server-side; your `TWITTER_API_KEY` is never exposed to the browser.

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `TWITTER_API_KEY` | Yes | API key from [twitterapi.io](https://twitterapi.io) |

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Frontend:** React 19, Tailwind CSS 4
- **Database:** SQLite via `better-sqlite3` + Drizzle ORM
- **Language:** TypeScript (strict)
