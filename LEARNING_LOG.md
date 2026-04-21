# Learning Log -- Mudita Talent Scout

OIM3690 Mini Project 3 | Seyvik Magon | Babson College, May 2026

---

## Iteration 1: Fetch and Display

The first thing I had to figure out was what twitterapi.io actually returns. I called the search endpoint with a basic query and logged the response, and the structure was more nested than I expected -- tweets come back in an array, but each tweet also contains a full author object, so you have user data without needing a second call in some cases. The trickiest part of the initial fetch wasn't the request itself but figuring out how to write it as a server-side Next.js API route instead of calling the API directly from a React component. I didn't realize at first that browser-side fetch to external APIs gets blocked by CORS when the API doesn't allow arbitrary origins. Once I moved everything into an `app/api` route and called that from the frontend, it worked. That was my first real lesson in why backend-for-frontend patterns exist.

---

## Iteration 2: Interactivity and Design

The second phase was connecting user input to the API in a way that felt like a real product. I built the Settings page so you can save named search queries to the database, then later added the Run button that actually fires them. The harder design problem was what to show while a search is in progress -- the search can take several seconds because it fetches tweet data and then makes a separate user info call per unique author. I went with inline loading state on the Run button (spinner, disabled state, result message after) rather than a separate loading page, which felt cleaner. For the overall UI I used Tailwind CSS 4 with a dark slate palette, mostly because I wanted something that looked intentional without spending a week on design. The component structure is flat -- most pages are one file with a few local components -- which made iteration fast even if it's not the most scalable architecture.

---

## Iteration 3: Polish and Extend

The extensions I added in the final phase were: SQLite persistence via Drizzle ORM so candidates survive between sessions, a scoring engine that grades each candidate across four dimensions, a Kanban board for moving candidates through pipeline stages, and individual candidate detail pages. The scoring logic was the most interesting part to build -- I wrote separate modules for builder signals, authenticity signals, growth signals, and red-flag detection, each of which scans tweet text and engagement numbers for specific patterns. What surprised me most about working with a real API was how inconsistent the data can be. Some fields I expected to always exist (like a user's bio or follower count) came back null or missing for certain accounts, so I had to add fallbacks throughout. I also didn't anticipate that the SQLite database file path would matter for Vercel deployment -- the project directory is read-only in serverless functions, so I had to redirect the database to `/tmp`. That was a last-minute fix that I wouldn't have known to think about without actually deploying and seeing it fail.
