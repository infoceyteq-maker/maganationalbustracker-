/* Lightweight cross-import types shared by the Navbar search & shell.
   Notification copy is RBAC-aware (pipeline language, not generic). */

export interface RegistrationSearchHit {
  id: string;
  regNo: string;
  ownerName: string;
  routeApplied: string;
  depot: string;
  province: string;
  status: string;
}

export interface AppNotification {
  id: string;
  title: string;
  detail: string;
  time: string;
  unread: boolean;
}

export const NOTIFICATIONS: AppNotification[] = [
  { id: 'n1', title: '3 buses awaiting depot verification', detail: 'Negombo depot queue is the longest in the Western Province today.', time: '10 min ago', unread: true },
  { id: 'n2', title: '2 records ready for final permit', detail: 'NA-7305 and NC-6110 were recommended by their depots and await the Provincial Admin.', time: '1 hr ago', unread: true },
  { id: 'n3', title: 'Automation healthy', detail: 'Permit → GPS unlock pipeline processed 41 permits this week with zero failures.', time: '3 hrs ago', unread: false },
];
