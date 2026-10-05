# Casino Outreach Agent

Compliant community-marketing automation for USDT Poker.

Pipeline: DISCOVER -> CRAWL -> CLASSIFY -> POLICY CHECK -> SCORE -> OPPORTUNITY -> CONTENT -> APPROVAL -> PUBLISH -> TRACK

Publishing stays behind human approval. Never bypass CAPTCHA, rate limits, bans, robots.txt, authentication controls, or platform rules.

## Setup
cp .env.example .env
docker compose up -d
npm install
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run dev
