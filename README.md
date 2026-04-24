# CivicNode – Election Education Assistant

CivicNode is a modern, personalized web application designed to demystify the U.S. election process. It breaks down complex timelines, deadlines, and registration logistics into clear, actionable steps customized to voters' exact locations. It features a scalable Next.js architecture, interactive components, and an integrated AI Election Assistant.

## Features

- **Personalized Election Timeline:** Users can input their state or Zip Code to receive an interactive, chronological list of up-to-date critical voting deadlines, tailored for the 2026 election cycle.
- **AI-Powered "Smart Layer":** A seamless floating chat assistant built using the Vercel AI SDK and OpenAI (`gpt-4o`), capable of safely routing specific, context-aware queries neutrally and citing official sources when required.
- **Accessible & SEO Optimized:** Implements standard ARIA labeling, completely keyboard-navigable components, and rich OpenGraph/Twitter Card tags for optimal external platform embeds and search visibility.
- **Production-Ready Security:** Implements rate-limiting to gracefully limit concurrent queries against both the internal APIs and the integrated LLM models, preventing excessive spam requests. 

## Technical Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS & full responsiveness, plus framer-motion for micro-animations
- **UI Components:** Shadcn/UI (Radix primitives with customizable Tailwind classes)
- **AI Provider:** Vercel AI SDK mapping locally out to OpenAI GPT-4o.

## Getting Started Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Add your environment variables:
   Create a `.env.local` file in the root directory and securely paste your API keys:
   ```env
   OPENAI_API_KEY="sk-..."
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```
   *Your app will be automatically active on [http://localhost:3000](http://localhost:3000)*.

## How to Deploy to Vercel

Vercel is the optimal native hosting platform for Next.js applications, fully supporting Serverless API Routes and the Vercel AI SDK out of the box.

1. **Push your code to GitHub:**
   Ensure your code is pushed into a GitHub repository.

2. **Connect it to Vercel:**
   - Log into [Vercel](https://vercel.com/) and click **"Add New..."** then **"Project"**.
   - Select your GitHub repository containing CivicNode.

3. **Configure Environment Variables:**
   - In the Configure Project section, click **Environment Variables**.
   - Add the key: `OPENAI_API_KEY`
   - Add the associated secret string as the value. 
   *(Vercel injects these secrets natively without exposing them to the frontend context)*.

4. **Deploy:**
   - Click **Deploy**. Vercel will install the packages, build the production bundle, and securely launch your AI instance behind the scenes. 
   - Future commits to `main` will transparently, safely auto-deploy.
   
## Security Notes
- Rate-limiting is currently powered strictly by an efficient in-memory map which suffices nicely for single-region, standalone deployments. If upgrading architecture horizontally across distributed edge networks in a huge load scenario, consider migrating the generic API rate limit wrapper `src/lib/rate-limit.ts` to utilize `@upstash/ratelimit` paired with Redis to share rate maps across instances smoothly.
