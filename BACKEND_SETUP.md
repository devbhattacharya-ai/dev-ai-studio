# Backend Setup (Supabase)

This branch adds a lightweight backend using Supabase (Postgres + Auth) + Next.js Route Handlers.

## What was added
- Contact form on the homepage that saves leads to a `leads` table
- `/api/leads` route handler
- WhatsApp webhook stub at `/api/whatsapp/webhook`
- Supabase client helpers (`src/lib/supabase/`)
- SQL migration for the leads table

## Setup steps (you do these once)

1. Create a free project at https://supabase.com
2. In the Supabase SQL Editor, run the contents of `supabase/migrations/001_leads.sql`
3. In Vercel project settings → Environment Variables, add:
   - `NEXT_PUBLIC_SUPABASE_URL` = your project URL
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` = your publishable (anon) key
4. Merge this PR (or push the branch) — Vercel will redeploy automatically
5. Test the form on the live site

## Optional next steps
- Enable Supabase Auth and protect an `/admin` page so only you can view leads
- Connect WhatsApp Business Cloud API and point the webhook to `https://www.devaistudio.in/api/whatsapp/webhook`
- Add email notifications (Resend, etc.) when a new lead arrives

Environment variables are required for the form to work in production.
