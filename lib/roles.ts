import {
  BarChart3,
  ClipboardCheck,
  FileCheck2,
  History,
  Landmark,
  LayoutDashboard,
  ListChecks,
  ScrollText,
  Send,
  Settings,
  ShieldCheck,
  Smartphone,
  Stamp,
  UserPlus,
  Workflow,
  type LucideIcon,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  STRICT RBAC MODEL — National Bus Digitization ("Maga")             */
/*                                                                     */
/*  Business rule #1: NO admin (Master / Provincial / Depot) may add   */
/*  or edit Bus or Driver records. Data entry exists ONLY in the      */
/*  Crew Self-Registration flow. Admins verify, recommend and permit.  */
/* ------------------------------------------------------------------ */

export type RoleKey = 'master' | 'provincial' | 'depot' | 'crew';

export type ViewKey =
  | 'overview'
  | 'accounts'
  | 'registry'
  | 'pipeline'
  | 'reports'
  | 'finalApprovals'
  | 'permits'
  | 'verification'
  | 'recommended'
  | 'register'
  | 'submissions'
  | 'policy'
  | 'settings';

export interface RoleDef {
  key: RoleKey;
  title: string;
  short: string;
  icon: LucideIcon;
  person: string;
  organisation: string;
  scopeLabel: string;
  /** The ONLY write-permissions this role holds. */
  can: string[];
  /** Explicitly locked capabilities, shown in the UI for compliance. */
  locked: string[];
}

export const ROLES: Record<RoleKey, RoleDef> = {
  master: {
    key: 'master',
    title: 'Master Admin',
    short: 'Master',
    icon: Landmark,
    person: 'Dr. Sarath Weerasinghe',
    organisation: 'Ministry of Transport',
    scopeLabel: 'Island-wide · all 9 provinces',
    can: ['Create Provincial Admin accounts', 'Create Depot Admin accounts', 'View island-wide analytics & reports'],
    locked: ['Add / edit bus details', 'Add / edit driver details', 'Verify or permit buses'],
  },
  provincial: {
    key: 'provincial',
    title: 'Provincial Admin',
    short: 'Provincial',
    icon: Stamp,
    person: 'Kumari Jayasuriya',
    organisation: 'Western Province Transport Authority',
    scopeLabel: 'Western Province only',
    can: ['View depot-recommended records', 'Grant Final Permit (unlocks live tracking)', 'Return records to depot'],
    locked: ['Add / edit bus details', 'Add / edit driver details', 'Create admin accounts', 'Physical verification'],
  },
  depot: {
    key: 'depot',
    title: 'Depot Admin · Timekeeper',
    short: 'Depot',
    icon: ClipboardCheck,
    person: 'Ruwan Fernando',
    organisation: 'Negombo Depot',
    scopeLabel: 'Negombo depot only',
    can: ['View newly self-registered buses', 'Complete physical verification checklist', 'Recommend to Province'],
    locked: ['Add / edit bus details', 'Add / edit driver details', 'Grant final permits', 'Create admin accounts'],
  },
  crew: {
    key: 'crew',
    title: 'Bus Crew / Owner',
    short: 'Crew App',
    icon: Smartphone,
    person: 'Nimal Fernando',
    organisation: 'Private owner · Route 240',
    scopeLabel: 'Own vehicles only',
    can: ['Self-register bus & crew details', 'Upload supporting documents', 'Track approval status'],
    locked: ['Verify or permit own bus', 'View other operators’ records', 'Any admin function'],
  },
};

export const ROLE_ORDER: RoleKey[] = ['master', 'provincial', 'depot', 'crew'];

export interface NavItem {
  key: ViewKey;
  label: string;
  icon: LucideIcon;
  breadcrumb: string;
}

export const ROLE_NAV: Record<RoleKey, { heading: string; items: NavItem[] }[]> = {
  master: [
    {
      heading: 'Ministry Command',
      items: [
        { key: 'overview', label: 'Island Overview', icon: LayoutDashboard, breadcrumb: 'Island-wide Command' },
        { key: 'pipeline', label: 'Approval Pipeline', icon: Workflow, breadcrumb: 'Registration Pipeline' },
        { key: 'registry', label: 'National Register', icon: ScrollText, breadcrumb: 'National Register (Read-only)' },
      ],
    },
    {
      heading: 'Administration',
      items: [
        { key: 'accounts', label: 'Admin Accounts', icon: UserPlus, breadcrumb: 'Admin Account Management' },
        { key: 'reports', label: 'Reports & Analytics', icon: BarChart3, breadcrumb: 'Reports & Analytics' },
        { key: 'policy', label: 'Access & RBAC Policy', icon: ShieldCheck, breadcrumb: 'Security & Access Policy' },
        { key: 'settings', label: 'Settings', icon: Settings, breadcrumb: 'Console Settings' },
      ],
    },
  ],
  provincial: [
    {
      heading: 'Provincial Authority',
      items: [
        { key: 'finalApprovals', label: 'Final Approvals', icon: Stamp, breadcrumb: 'Final Permit Decisions' },
        { key: 'permits', label: 'Granted Permits', icon: FileCheck2, breadcrumb: 'Provincial Permit Register' },
        { key: 'policy', label: 'Access & RBAC Policy', icon: ShieldCheck, breadcrumb: 'Security & Access Policy' },
      ],
    },
  ],
  depot: [
    {
      heading: 'Depot Timekeeper',
      items: [
        { key: 'verification', label: 'Verification Queue', icon: ListChecks, breadcrumb: 'Physical Verification' },
        { key: 'recommended', label: 'Sent to Province', icon: Send, breadcrumb: 'Recommendation History' },
        { key: 'policy', label: 'Access & RBAC Policy', icon: ShieldCheck, breadcrumb: 'Security & Access Policy' },
      ],
    },
  ],
  crew: [
    {
      heading: 'Crew Self-Service',
      items: [
        { key: 'register', label: 'Register My Bus', icon: Smartphone, breadcrumb: 'Crew Self-Registration' },
        { key: 'submissions', label: 'My Submissions', icon: History, breadcrumb: 'Submission Tracker' },
        { key: 'policy', label: 'How Approval Works', icon: ShieldCheck, breadcrumb: 'Approval Journey' },
      ],
    },
  ],
};

export const DEFAULT_VIEW: Record<RoleKey, ViewKey> = {
  master: 'overview',
  provincial: 'finalApprovals',
  depot: 'verification',
  crew: 'register',
};

export function navItemFor(role: RoleKey, view: ViewKey): NavItem | undefined {
  return ROLE_NAV[role].flatMap((s) => s.items).find((i) => i.key === view);
}
