# Gyara
**Gyara** is an AI operations agent for supply chain that watches for disruption notices, figures out how they matter to your business and either recommends a fix or allows a human to approve a fix.

Built for two specific situations:
- Shipment delays: this could be a carrier delay, custom hold or a warehouse backup.
- External events: a flood, road or a port closure disrupts a route. 

## How it works
You type a notice and Gyara:

- Looks up real data like the shipment, route, supplier from its own record(database).
- Reasons about the impact of such disruption
- Proposes a specific fix or explains why no action is needed
- Waits for your approval before doing anything that may cost money or change deliver
- Executes the approved action and logs what happened

## Tech stack
- Next.js
- LLM(Groq(OpenAI-compatible API))
- Supabase
- Server-Sent Events via `ReadbleStream`
- CI
- pnpm
- Vitest

## Getting started

### prerequisites
- Node.js 20+
- pnpm
- [Groq](https://console.groq.com) account and API key
- [Supabase](https://supabase.com) project

### Clone the repository
```sh
git clone <your-repo-url>
cd gyara
pnpm install
```

### Configure environment variables
- Create a `.env` file at the project root:
```sh
GROQ_API_KEY=your_groq_api_key
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```
### Set up your database
- Run the SQL in [`supabase/schema.sql`](supabase/schema.sql) in your Supabase project SQL Editor to create the tables, enable Row Level Security, and grant the necessary permissions.
- Then run [`supabase/seed.sql`](supabase/seed.sql) to populate it with sample shipment, route, and supplier data.

### Run it
```bash
pnpm dev
```
- Open [localhost:3000](http://localhost:3000) and Type a notice.

### Testing
```bash
pnpm test
```