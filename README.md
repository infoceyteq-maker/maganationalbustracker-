# Maga · National Bus Digitization System

**Base44 Challenge MVP** — a strict **role-based (RBAC)** operations console for digitizing the national bus
network, built with **Next.js 15 (App Router)**, **Tailwind CSS** and shadcn-style components.

## The One Rule: Admins Never Enter Bus Data

> **No admin — Master, Provincial or Depot — can add or edit Bus or Driver details.**
> Records are born *only* through **Crew Self-Registration**. The state verifies, recommends and permits.

```
Crew / Owner (Crew App)          Depot Admin (Timekeeper)      Provincial Admin           Automation
Self-registers bus + crew   →    Physical 7-point checklist →  Grant Final Permit    →    Permit issued ·
Uploads documents                "Recommend to Province"                                GPS unlocked ·
                                                                                          crew notified
```

### Roles (switch live in the top bar — the whole console rebuilds per role)

| Role | Scope | Can | Locked |
| --- | --- | --- | --- |
| **Master Admin** (Ministry) | Island-wide | Create Provincial/Depot admin accounts · national analytics | 🔒 Add Bus · 🔒 Add Driver · 🔒 Verify/Permit |
| **Provincial Admin** | One province | Review recommended records · **Grant Final Permit** | 🔒 Data entry · 🔒 Create admins · 🔒 Verify |
| **Depot Admin** (Timekeeper) | One depot | View new self-registrations · physical checklist · **Recommend to Province** | 🔒 Data entry · 🔒 Grant permits |
| **Bus Crew / Owner** | Own vehicles | Self-register · upload documents · track status | 🔒 Everything administrative |

The **Master Admin dashboard deliberately displays disabled, padlocked “Add Bus / Add Driver” pills** next to the
working **“Create Admin”** function — compliance you can see and click (they explain themselves via toast).
The full permission matrix lives in **Access & RBAC Policy**.

## Design System — “Neo-Apple 3D Tactile”

| Token | Value | Usage |
| --- | --- | --- |
| Cream canvas | `#F4F2EE` | Warm off-white background |
| Matte white | `#FFFFFF` · `rounded-3xl` · `10px 20px 30px rgba(0,0,0,.05)` | Cards as physical 3D objects |
| Deep emerald | `#0E6A47` | Solid pill buttons with top-bevel light (3D extruded, sinks on press) |
| Amber glass | `#FFB347 → #FF7B00` | Highlight cards · Grant Final Permit · peak moments |
| Ink | `#17211C` | Headings & primary text |

Soft neumorphism (pressed input wells, neu icon tiles) + glassy gradients (frosted navbar, amber orbs).
Typography: **Plus Jakarta Sans** (800/700/500/400).

## Try the end-to-end workflow (90 seconds)

1. **Crew App** (top-right role switch) → *Register My Bus* → enter a plate (e.g. `NC-7777`), attach 4 documents → **Submit**.
2. **Depot** role → your bus is in the *Verification Queue* → tick all 7 physical checks → **Recommend to Province** unlocks.
3. **Provincial** role → *Final Approvals* → review depot evidence → **Grant Final Permit** → automation log fires (permit no., GPS unlock, SMS).
4. **Master** role → *National Register* — your bus now appears, read-only, origin-stamped “Crew Self-Registration”.
   And in *Admin Accounts*, create a Provincial/Depot officer — the Master’s only creation power.

Scope is enforced everywhere: search, queues, badges and nav are filtered to the signed-in role’s province/depot/own vehicles.

## Views

- **Master:** Island Overview (amber digitization highlight, pipeline counters, province progress) · Approval Pipeline board ·
  National Register (read-only, locked Add buttons) · Admin Accounts (working Create Admin + suspend) · Reports · Settings (+ token showcase)
- **Provincial:** Final Approvals (evidence, audit trail, Grant Final Permit, live **Automation Log**) · Granted Permits register
- **Depot:** Verification Queue + physical checklist workspace (Recommend unlocks at 7/7) · Sent to Province history
- **Crew:** Self-Registration form (vehicle · people · route/depot · document uploads) · My Submissions with a 4-step live tracker
- **All roles:** Access & RBAC Policy (flow + permission matrix, your role highlighted)

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck  # strict TypeScript
npm run build      # production build (149 kB first load, static)
```

## Project structure

```
app/            layout · globals (3D tactile tokens) · RBAC shell + workflow state
lib/
  roles.ts      role definitions, per-role navigation, permission copy
  pipeline.ts   registration lifecycle, verification checklist, admin accounts, automation
  data.ts       national reference data (routes, fleet, depots)
components/
  ui/           3D pill Button (+ LockedButton) · Card · Badge · Input · primitives
  layout/       floating Sidebar (role-scoped) · glass Navbar (role switcher)
  dashboard/    MetricCard (+ amber highlight) · DataTable · Charts
  views/        MasterOverview · AdminAccounts · Registry · Pipeline · DepotVerification ·
                ProvincialApprovals · CrewRegistration · AccessPolicy · Reports/Settings
```

State (`registrations`, `admins`, `automation`) lives in the shell and is shaped exactly like the production
API contract, so swapping the in-memory store for Base44/backend endpoints requires no UI changes. Server-side,
admin tokens must reject bus/driver writes (`403 RBAC_DENY`) — the UI locks are honest mirrors of that wall.
