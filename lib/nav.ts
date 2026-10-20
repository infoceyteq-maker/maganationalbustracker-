import {
  BarChart3,
  Building2,
  Bus,
  CalendarClock,
  ClipboardCheck,
  LayoutDashboard,
  Map as MapIcon,
  Route,
  Settings,
  Smartphone,
  Users,
  type LucideIcon,
} from 'lucide-react';

export type ViewKey =
  | 'overview'
  | 'live'
  | 'trips'
  | 'fleet'
  | 'routes'
  | 'drivers'
  | 'depots'
  | 'approvals'
  | 'reports'
  | 'mobile'
  | 'settings';

export interface NavItem {
  key: ViewKey;
  label: string;
  icon: LucideIcon;
  breadcrumb: string;
}

export const NAV_SECTIONS: { heading: string; items: NavItem[] }[] = [
  {
    heading: 'Operations',
    items: [
      { key: 'overview', label: 'Overview', icon: LayoutDashboard, breadcrumb: 'Operations Overview' },
      { key: 'live', label: 'Live Operations', icon: MapIcon, breadcrumb: 'Live Network Map' },
      { key: 'trips', label: 'Trips & Schedules', icon: CalendarClock, breadcrumb: 'Trips & Schedules' },
      { key: 'fleet', label: 'Fleet Management', icon: Bus, breadcrumb: 'Fleet Management' },
      { key: 'routes', label: 'Routes & Fares', icon: Route, breadcrumb: 'Routes & Fares' },
    ],
  },
  {
    heading: 'Management',
    items: [
      { key: 'drivers', label: 'Drivers & Crew', icon: Users, breadcrumb: 'Drivers & Crew' },
      { key: 'depots', label: 'Depots', icon: Building2, breadcrumb: 'Depot Network' },
      { key: 'approvals', label: 'Approvals', icon: ClipboardCheck, breadcrumb: 'Permit Approvals' },
    ],
  },
  {
    heading: 'Platform',
    items: [
      { key: 'reports', label: 'Reports & Analytics', icon: BarChart3, breadcrumb: 'Reports & Analytics' },
      { key: 'mobile', label: 'Mobile Apps', icon: Smartphone, breadcrumb: 'Mobile App Preview' },
      { key: 'settings', label: 'Settings', icon: Settings, breadcrumb: 'Console Settings' },
    ],
  },
];

export const NAV_BY_KEY: Record<ViewKey, NavItem> = Object.fromEntries(
  NAV_SECTIONS.flatMap((s) => s.items.map((i) => [i.key, i])),
) as Record<ViewKey, NavItem>;
