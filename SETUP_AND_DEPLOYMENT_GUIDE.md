# 📸 Aura Photography Atelier & Booking Platform
## Complete Third-Year Computer Science Project Guide & Deployment Manual

Welcome to **Aura Photography**, a modern, full-stack photography portfolio and automated booking web application engineered with **React, TypeScript, Tailwind CSS, and Supabase (PostgreSQL with Row Level Security)**.

---

## 📑 Table of Contents
1. [Project Overview & Architecture](#project-overview--architecture)
2. [Technology Stack & Decisions](#technology-stack--decisions)
3. [Database Architecture & PostgreSQL Schema](#database-architecture--postgresql-schema)
4. [Security & Row Level Security (RLS)](#security--row-level-security-rls)
5. [Local Development Setup (Beginner-Friendly)](#local-development-setup-beginner-friendly)
6. [Supabase Setup (Step-by-Step)](#supabase-setup-step-by-step)
7. [Vercel Deployment Guide](#vercel-deployment-guide)
8. [Demo Credentials & Testing Scenarios](#demo-credentials--testing-scenarios)
9. [Academic Evaluation Checklist](#academic-evaluation-checklist)

---

## 1. Project Overview & Architecture

### Objectives
1. **Photographer Showcase**: High-impact, responsive visual portfolio with category filtering (Weddings, Pre-Wedding, Events, Portraits, Fashion, Landscapes), orientation sorting, and an interactive full-screen Lightbox with camera EXIF metadata.
2. **Automated Booking Engine**: Dynamic session selection, live slot availability and double-booking conflict prevention, personalized notes, and instant client feedback.
3. **Dual-Role Portals**:
   - **Customer Portal**: Track pending/confirmed/completed shoots, review total investment, and cancel reservations.
   - **Admin Management Console**: Review and filter all bookings, confirm/decline requests, add photographer studio notes, publish new portfolio images, and adjust service package rates.
4. **Resilient Dual-Mode Data Access Layer**: The application includes a smart data abstraction engine (`src/lib/databaseService.ts`). If Supabase credentials are not yet configured, it operates seamlessly using an offline-capable, high-fidelity local storage engine. When Supabase keys are provided, it operates against live PostgreSQL cloud tables.

---

## 2. Technology Stack & Decisions

| Layer | Technology | Justification |
| :--- | :--- | :--- |
| **Frontend Framework** | React 18 + TypeScript | High type-safety, component modularity, and reactive state management. |
| **Styling & Aesthetics** | Tailwind CSS v4 + Google Fonts | Bespoke luxury atelier aesthetic (`Cormorant Garamond` serif + `Plus Jakarta Sans`). |
| **Database & Auth** | Supabase (PostgreSQL 15) | Relational integrity, foreign keys, triggers, and granular Row Level Security (RLS). |
| **Icons & Media** | Lucide React + Unsplash CDN | Lightweight vector iconography and curated fine-art imagery. |
| **Production Bundler** | Vite | Lightning-fast HMR and optimized production treeshaking. |
| **Hosting Platform** | Vercel / Cloud Run | Zero-configuration Git deployments and edge asset caching. |

---

## 3. Database Architecture & PostgreSQL Schema

The database is defined in `/supabase/schema.sql`. It includes five core relational tables:

```
+----------------+        +----------------------+        +-----------------------+
|  auth.users    | 1---1  |  public.profiles     | 1---N  |  public.bookings      |
|  (Supabase)    |        |  (id, role, email)   |        |  (customer_id, date)  |
+----------------+        +----------------------+        +-----------------------+
                                                             |
                                      +----------------------+
                                      |
+----------------------+        +----------------------+
|  public.categories   | 1---N  |  public.services     |
|  (id, slug, name)    |        |  (id, price, mins)   |
+----------------------+        +----------------------+
          |
          +--- 1---N  public.gallery_images (id, title, url, exif)
```

### Table Definitions
1. `profiles`: Extends Supabase auth; stores `full_name`, `phone`, and `role` (`customer` or `admin`).
2. `categories`: Taxonomy for photography disciplines (`wedding`, `portrait`, `fashion`, etc.).
3. `services`: Packages offered with durations, rates, and feature inclusions.
4. `gallery_images`: Portfolio works with dimensions, locations, and camera specs.
5. `bookings`: Client reservations with status transitions (`pending` → `confirmed` → `completed` / `cancelled`).

---

## 4. Security & Row Level Security (RLS)

Every table has Row Level Security enabled (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY;`).

1. **Admins (`is_admin()`)**:
   - An admin helper function queries the `profiles` table to verify if the executing user has `role = 'admin'`.
   - Admins possess complete CRUD access across all tables, bookings, and images.
2. **Customers**:
   - Customers can **only** read and manage their own bookings (`auth.uid() = customer_id`).
   - Customers can never view another client's private bookings, phone numbers, or notes.
3. **Public Guests**:
   - Unauthenticated visitors can view public gallery images, active categories, and published services.

---

## 5. Local Development Setup (Beginner-Friendly)

### Prerequisites
- Node.js (version 18 or higher)
- npm or yarn

### Step 1: Clone or Extract Repository
```bash
cd aura-photography-studio
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Run Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:3000`. The application will immediately run in **Demo Mode** with full mock seed data and persistence.

---

## 6. Supabase Setup (Step-by-Step)

To connect your project to a real, live PostgreSQL cloud database:

### Step 1: Create a Free Supabase Project
1. Visit [supabase.com](https://supabase.com) and log in.
2. Click **New Project**, name it `aura-photography`, set a secure database password, and select your preferred region.

### Step 2: Execute Schema & Seed Data
1. In the Supabase dashboard sidebar, click **SQL Editor**.
2. Click **New Query**.
3. Open the file `/supabase/schema.sql` from this repository.
4. Copy the entire contents, paste into the Supabase SQL editor, and click **Run**.
5. All 5 tables, RLS policies, triggers, and sample data will be created in seconds.

### Step 3: Configure Environment Variables
1. In the Supabase dashboard, click **Project Settings** (gear icon) → **API**.
2. Copy your **Project URL** and **anon / public key**.
3. In your project root, create a file named `.env`:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
4. Restart your Vite dev server (`npm run dev`). The top banner will now display **"Connected to Supabase"**!

---

## 7. Vercel Deployment Guide

Deploying Aura Photography to Vercel takes under 3 minutes:

### Option A: Via GitHub (Recommended)
1. Push your project code to a GitHub repository.
2. Go to [vercel.com](https://vercel.com) and log in.
3. Click **Add New...** → **Project**.
4. Import your GitHub repository.
5. In the **Environment Variables** section, add:
   - `VITE_SUPABASE_URL` = `https://your-project.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `your-anon-key`
6. Click **Deploy**. Vercel will automatically build and assign a production HTTPS URL (e.g. `https://aura-photography.vercel.app`).

### Option B: Via Vercel CLI
```bash
npm install -g vercel
vercel login
vercel
```

---

## 8. Demo Credentials & Testing Scenarios

Use these test accounts to demonstrate both roles in your academic presentation:

### 👤 Customer Persona
- **Email**: `customer@example.com`
- **Password**: `customer123`
- **Actions to Test**:
  1. Click **Book Your Session** on the homepage.
  2. Pick the *Signature Wedding Collection* and select tomorrow's date.
  3. Submit the request and observe the celebratory confetti animation.
  4. Navigate to **My Bookings** to review your pending reservation.
  5. Test cancelling the request.

### 🛡️ Studio Administrator Persona
- **Email**: `admin@studio.com`
- **Password**: `admin123`
- **Actions to Test**:
  1. Click **Staff Login** or click the **Demo Admin** 1-click button.
  2. In the **Admin Dashboard**, review the pending bookings table.
  3. Click **Confirm** on a customer booking request.
  4. Click the **Edit Notes** icon to add a studio note (e.g., *"Deposit received, 2 extra hours added"*).
  5. Switch to the **Portfolio Gallery** tab and click **Add Photograph** to upload a new work.
  6. Switch to the **Services Packages** tab to adjust pricing or create a new package.

---

## 9. Academic Evaluation Checklist

| Criteria | Status | Implementation Details |
| :--- | :---: | :--- |
| **Responsive UI/UX** | Passed | Mobile drawer, adaptive grid (1/2/3 cols), touch-friendly buttons. |
| **Database Normalization** | Passed | Normalized 3NF tables with foreign keys and cascade delete rules. |
| **Authentication & RBAC** | Passed | Role-based authorization separating customers from admin staff. |
| **Conflict Handling** | Passed | Time-slot double-booking validation on the booking wizard. |
| **Code Modularity** | Passed | Clean separation into `components/`, `views/`, `lib/`, and `types/`. |
| **Documentation Quality** | Passed | Complete academic setup instructions and ER diagram references. |

---

*Authored for Third-Year Computer Science Project Demonstration. Aura Photography Atelier © 2026.*
