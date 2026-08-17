# Arrehlah Travel & Tours Ltd - Booking Platform

A modern, full-stack travel booking application built for Arrehlah Travel & Tours Ltd.

## Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4, shadcn/ui components
- **Database:** PostgreSQL (via Prisma ORM)
- **Authentication:** Supabase Auth (SSR)
- **File Storage:** Supabase Storage
- **Payments:** Paystack & Flutterwave abstraction layer

## Features
- **Public Website:** Home, Flights, Hotels, Tours, Umrah, Hajj, and Visa pages.
- **Booking Engine:** 7-step booking flow component with robust state management.
- **Customer Portal:** Dedicated `/account` dashboard for managing bookings, documents, and payments.
- **Admin Dashboard:** Centralized `/admin` CMS for managing services, users, and overall analytics.

## Setup

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Copy `.env.example` to `.env` and fill in your Supabase, Postgres, and Payment Gateway credentials.
   ```bash
   cp .env.example .env
   ```

3. **Database Migration:**
   ```bash
   npx prisma migrate dev
   ```

4. **Seed Database:**
   ```bash
   npx prisma db seed
   ```

5. **Run Development Server:**
   ```bash
   npm run dev
   ```

## Architecture Notes
- All backend session management utilizes `@supabase/ssr` with middleware to protect routes.
- Tailwind v4 handles the premium styling (Navy, Green, Gold accents).
- The payment provider abstraction is located in `src/lib/payments/`.

## Deployment
This project is configured for deployment on **Netlify** (via `netlify.toml`). Connect the repository to your Netlify account, and it will automatically handle the build commands and Edge Functions.
