# Mini Project 3 Proposal -- Mudita Talent Scout

> Written retroactively after building the app, but this honestly reflects what I set out to do before I started coding.

---

## What I'm building

A CRM that searches Twitter/X for people actively building AI products, scores them based on signal strength in their public activity, and lets you manage them through a hiring or outreach pipeline.

---

## Which API I'm using

[twitterapi.io](https://twitterapi.io) -- a third-party proxy for Twitter/X data.

I chose it over the official X API because the official API's free tier is extremely limited for search (25 requests per month as of early 2025), and the paid tiers are priced for enterprise use. twitterapi.io gives you much more generous rate limits at a fraction of the cost, which makes it practical for a student project that actually needs to run searches.

---

## Why I chose this

Two reasons, both real.

First, I'm actively talking to Mudita Studios, a venture studio, about a role. Part of what a venture studio does is find and evaluate early-stage founders. A tool that surfaces founders by their Twitter signal and scores them on authenticity, consistency, and builder activity is genuinely useful for that workflow. I wanted to build something I could demo in that conversation, not just turn in for a grade.

Second, I run a content production company called Pursuit of Happiness Productions, which means I spend a lot of time thinking about how people build and maintain a public presence. Scoring founders on Twitter signals is a natural extension of that interest. The scoring logic I built (builder signals, authenticity, growth, red-flag detection) is a direct reflection of what I actually look for when evaluating whether someone's output is real versus performative.

---

## Core features

- **Query-based search:** Configure custom Twitter search queries in the Settings page and run them on demand. The app calls the twitterapi.io search endpoint, extracts unique authors from the results, and stores them as candidates.
- **Automated scoring:** Each candidate gets scored across four dimensions: builder signals (shipping evidence, GitHub mentions, demo language), authenticity (original content vs. retweets, engagement rate), growth trajectory, and red-flag penalties (spam patterns, follower-to-engagement mismatch). Scores are computed server-side and stored in SQLite.
- **Kanban pipeline and candidate detail view:** Candidates move through five stages (Discovered, Researching, Outreach Ready, Contacted, In Conversation) via a drag-and-drop board. Each candidate has a detail page showing their bio, scores, and the tweets that drove them.

---

## What I didn't know yet when I started

- How Next.js App Router organizes server-side API routes vs. client components -- I'd used older Next.js patterns before
- How to write async/await code that chains multiple external API calls (search, then user info per result) without things blowing up mid-loop
- How to handle API errors gracefully -- what to do when one user lookup fails mid-batch so the whole search run doesn't crash
- How to set up SQLite with Drizzle ORM, including the schema, migrations, and query syntax
