# Maga · National Bus Tracker

**National Bus Digitization Project** — a premium, modern operations console (admin dashboard) and mobile-app
UI for the national bus network, built with **Next.js 15 (App Router)**, **Tailwind CSS** and a
**shadcn-style** component system.

## Design System — “Premium Light”

| Token | Value | Usage |
| --- | --- | --- |
| Canvas | `#FFFFFF` | Primary background |
| Surface | `#F9FAFB` / `#F3F4F6` | Cards, sidebar, input fills |
| Ink | `#111827` | Headings & primary text |
| Dark Ash | `#4B5563` / `#374151` | Secondary text & icons |
| Brand Emerald | `#059669` → `#10B981` | Primary CTAs, active states, live/success signals |

- **Typography:** Plus Jakarta Sans (800 headings · 500 labels · 400 body), Inter fallback.
- **Components:** emerald primary buttons with a soft lift, outlined secondaries, flat cards with a 1px
  light-ash border and a whisper shadow, inputs with an emerald focus ring, generous whitespace throughout.
- **No dark mode** — the interface is unapologetically light, corporate and calm.

## What's Inside

### Base layout (this milestone)
- **`components/layout/Sidebar.tsx`** — light-ash rail, emerald active states, approvals badge, GPS-feed status card, collapse-to-icons.
- **`components/layout/Navbar.tsx`** — breadcrumb + page title, global search (buses & routes), live clock, notifications, profile menu, **Start Trip** CTA.
- **`components/dashboard/MetricCard.tsx`** — KPI tile: extra-bold value, trend chip, sparkline, icon tile.
- **`components/dashboard/DataTable.tsx`** — the standard grid: search, status filter chips, sortable headers, pagination, CSV export.
- **`components/ui/*`** — shadcn-style `Button`, `Card`, `Badge`, `Input`, plus `Avatar`, `ProgressBar`, `RouteChip` primitives.

### Views (11, all interactive)
**Overview** (KPIs, ridership chart, fleet donut, live departures, ops feed) · **Live Operations** (schematic
network map with selectable live buses) · **Trips & Schedules** (working *Start Trip / Complete* dispatch) ·
**Fleet Management** · **Routes & Fares** · **Drivers & Crew** · **Depots** · **Approvals** (approve/reject
updates the queue + sidebar badge) · **Reports & Analytics** · **Mobile Apps** (passenger search, passenger
live-tracking, and a driver console with a working *START TRIP* duty flow) · **Settings** (profile form,
toggles, and the design-token showcase).

## Run Locally

```bash
npm install
npm run dev        # http://localhost:3000
```

```bash
npm run typecheck  # strict TypeScript
npm run build      # production build
```

## Project Structure

```
app/            layout, globals (design tokens), dashboard shell
components/
  ui/           button · card · badge · input · primitives
  layout/       Sidebar · Navbar
  dashboard/    MetricCard · DataTable · Charts
  views/        one component per console view
lib/            nav model · reference dataset · utils (cn)
```

Data in `lib/data.ts` is representative of the Sri Lankan national network (SLTB + private operators,
NTC route permits) and is shaped to drop in behind real APIs without UI changes.
