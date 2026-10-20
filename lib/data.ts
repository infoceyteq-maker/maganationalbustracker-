/* ------------------------------------------------------------------ */
/*  National Bus Digitization Project — reference dataset              */
/*  Representative operational data for the national network (SL)      */
/* ------------------------------------------------------------------ */

export type BusStatus = 'On Route' | 'Delayed' | 'At Depot' | 'Maintenance' | 'Boarding';
export type TripStatus = 'Boarding' | 'In Progress' | 'Delayed' | 'Scheduled' | 'Completed';

export interface Bus {
  id: string;
  reg: string;
  model: string;
  operator: 'SLTB' | 'Private';
  routeCode: string;
  routeName: string;
  driver: string;
  depot: string;
  status: BusStatus;
  occupancy: number;
  capacity: number;
  fuel: number; // %
  speed: number; // km/h
  lastPing: string;
  nextStop: string;
}

export interface Trip {
  id: string;
  code: string;
  routeCode: string;
  from: string;
  to: string;
  depart: string;
  arrive: string;
  bus: string;
  driver: string;
  status: TripStatus;
  passengers: number;
  capacity: number;
}

export interface RouteInfo {
  code: string;
  name: string;
  type: 'Interprovincial' | 'Provincial' | 'Expressway' | 'City';
  distanceKm: number;
  stops: number;
  busesAssigned: number;
  dailyTrips: number;
  fare: number;
  onTime: number; // %
}

export interface Driver {
  id: string;
  name: string;
  depot: string;
  licence: string;
  phone: string;
  rating: number;
  tripsCompleted: number;
  experience: string;
  status: 'On Duty' | 'Off Duty' | 'On Leave';
}

export interface Approval {
  id: string;
  type: 'New Vehicle Permit' | 'Route Permit' | 'Operator Registration' | 'Fare Revision';
  applicant: string;
  reference: string;
  region: string;
  submitted: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface Depot {
  name: string;
  region: string;
  buses: number;
  capacity: number;
  staff: number;
  utilisation: number; // %
  status: 'Operational' | 'Partial Service';
}

/* ------------------------------ Fleet ------------------------------ */

export const BUSES: Bus[] = [
  { id: 'B-001', reg: 'NA-3847', model: 'Ashok Leyland Viking', operator: 'SLTB', routeCode: '240', routeName: 'Colombo → Negombo', driver: 'Nimal Fernando', depot: 'Negombo', status: 'On Route', occupancy: 46, capacity: 54, fuel: 68, speed: 42, lastPing: '12s ago', nextStop: 'Katunayake' },
  { id: 'B-002', reg: 'NB-9204', model: 'Tata LPO 1512', operator: 'Private', routeCode: '01', routeName: 'Colombo → Kandy', driver: 'Kasun Perera', depot: 'Kandy South', status: 'On Route', occupancy: 49, capacity: 52, fuel: 54, speed: 38, lastPing: '8s ago', nextStop: 'Kegalle' },
  { id: 'B-003', reg: 'NC-1156', model: 'Yutong ZK6110', operator: 'Private', routeCode: 'EX-02', routeName: 'Colombo → Matara (Expressway)', driver: 'Mohamed Fairoz', depot: 'Galle', status: 'On Route', occupancy: 38, capacity: 45, fuel: 71, speed: 84, lastPing: '5s ago', nextStop: 'Galle' },
  { id: 'B-004', reg: 'NA-6721', model: 'Ashok Leyland Lynx', operator: 'SLTB', routeCode: '04', routeName: 'Colombo → Anuradhapura', driver: 'Sunil Bandara', depot: 'Anuradhapura', status: 'Delayed', occupancy: 51, capacity: 54, fuel: 43, speed: 22, lastPing: '31s ago', nextStop: 'Dambulla' },
  { id: 'B-005', reg: 'NB-4478', model: 'Tata Marcopolo', operator: 'Private', routeCode: '87', routeName: 'Colombo → Vavuniya', driver: 'S. Jeyakumar', depot: 'Vavuniya', status: 'On Route', occupancy: 40, capacity: 49, fuel: 62, speed: 57, lastPing: '14s ago', nextStop: 'Anuradhapura' },
  { id: 'B-006', reg: 'NC-8032', model: 'Golden Dragon XML6105', operator: 'Private', routeCode: '245', routeName: 'Negombo → Chilaw', driver: 'Pradeep Silva', depot: 'Negombo', status: 'Boarding', occupancy: 21, capacity: 44, fuel: 88, speed: 0, lastPing: '3s ago', nextStop: 'Negombo Stand' },
  { id: 'B-007', reg: 'NA-2095', model: 'Ashok Leyland Viking', operator: 'SLTB', routeCode: '138', routeName: 'Pettah → Homagama', driver: 'Ruwan Gamage', depot: 'Kottawa', status: 'On Route', occupancy: 53, capacity: 54, fuel: 57, speed: 26, lastPing: '9s ago', nextStop: 'Maharagama' },
  { id: 'B-008', reg: 'NB-7710', model: 'Tata LPO 1112', operator: 'SLTB', routeCode: '187', routeName: 'Fort → Katunayake (Airport)', driver: 'Chamara Dias', depot: 'Katubedda', status: 'On Route', occupancy: 29, capacity: 44, fuel: 76, speed: 63, lastPing: '6s ago', nextStop: 'Seeduwa' },
  { id: 'B-009', reg: 'NA-5543', model: 'Ashok Leyland Cheetah', operator: 'SLTB', routeCode: '06', routeName: 'Colombo → Kurunegala', driver: 'Ajith Kumara', depot: 'Kurunegala', status: 'Maintenance', occupancy: 0, capacity: 52, fuel: 34, speed: 0, lastPing: '—', nextStop: 'In workshop' },
  { id: 'B-010', reg: 'NC-3308', model: 'King Long XMQ6106', operator: 'Private', routeCode: '48', routeName: 'Colombo → Polonnaruwa', driver: 'Tharindu Rathnayake', depot: 'Polonnaruwa', status: 'On Route', occupancy: 44, capacity: 47, fuel: 49, speed: 61, lastPing: '11s ago', nextStop: 'Habarana' },
  { id: 'B-011', reg: 'NB-1189', model: 'Tata 909', operator: 'Private', routeCode: '15', routeName: 'Kandy → Anuradhapura', driver: 'Saman Ekanayake', depot: 'Kandy South', status: 'At Depot', occupancy: 0, capacity: 34, fuel: 92, speed: 0, lastPing: '—', nextStop: 'Depot bay 07' },
  { id: 'B-012', reg: 'NA-9902', model: 'Ashok Leyland Viking', operator: 'SLTB', routeCode: '99', routeName: 'Colombo → Badulla', driver: 'Upul Senanayake', depot: 'Badulla', status: 'Delayed', occupancy: 47, capacity: 52, fuel: 58, speed: 31, lastPing: '47s ago', nextStop: 'Balangoda' },
  { id: 'B-013', reg: 'NC-6264', model: 'Yutong ZK6120', operator: 'Private', routeCode: 'EX-01', routeName: 'Colombo → Kandy (Expressway)', driver: 'Dinesh Fernando', depot: 'Kadawatha', status: 'On Route', occupancy: 36, capacity: 45, fuel: 66, speed: 79, lastPing: '4s ago', nextStop: 'Kurunegala IC' },
  { id: 'B-014', reg: 'NB-2357', model: 'Tata LPO 1512', operator: 'SLTB', routeCode: '32', routeName: 'Colombo → Kataragama', driver: 'Gamini Jayasuriya', depot: 'Tissamaharama', status: 'On Route', occupancy: 41, capacity: 52, fuel: 52, speed: 48, lastPing: '18s ago', nextStop: 'Tangalle' },
  { id: 'B-015', reg: 'NA-7418', model: 'Ashok Leyland Lynx', operator: 'SLTB', routeCode: '100', routeName: 'Pettah → Panadura', driver: 'Roshan Perera', depot: 'Ratmalana', status: 'On Route', occupancy: 48, capacity: 54, fuel: 61, speed: 24, lastPing: '7s ago', nextStop: 'Dehiwala' },
  { id: 'B-016', reg: 'NC-0875', model: 'Golden Dragon XML6112', operator: 'Private', routeCode: '49', routeName: 'Colombo → Trincomalee', driver: 'A. Navaneethan', depot: 'Trincomalee', status: 'Boarding', occupancy: 17, capacity: 45, fuel: 95, speed: 0, lastPing: '2s ago', nextStop: 'Central Bus Stand' },
];

/* ------------------------------ Trips ------------------------------ */

export const TRIPS: Trip[] = [
  { id: 'T-01', code: 'TRP-240-0745', routeCode: '240', from: 'Colombo Fort', to: 'Negombo', depart: '07:45', arrive: '09:05', bus: 'NA-3847', driver: 'Nimal Fernando', status: 'In Progress', passengers: 46, capacity: 54 },
  { id: 'T-02', code: 'TRP-001-0615', routeCode: '01', from: 'Colombo Fort', to: 'Kandy', depart: '06:15', arrive: '09:40', bus: 'NB-9204', driver: 'Kasun Perera', status: 'In Progress', passengers: 49, capacity: 52 },
  { id: 'T-03', code: 'TRP-EX2-0730', routeCode: 'EX-02', from: 'Makumbura', to: 'Matara', depart: '07:30', arrive: '09:10', bus: 'NC-1156', driver: 'Mohamed Fairoz', status: 'In Progress', passengers: 38, capacity: 45 },
  { id: 'T-04', code: 'TRP-004-0545', routeCode: '04', from: 'Colombo Fort', to: 'Anuradhapura', depart: '05:45', arrive: '10:30', bus: 'NA-6721', driver: 'Sunil Bandara', status: 'Delayed', passengers: 51, capacity: 54 },
  { id: 'T-05', code: 'TRP-245-0810', routeCode: '245', from: 'Negombo', to: 'Chilaw', depart: '08:10', arrive: '09:25', bus: 'NC-8032', driver: 'Pradeep Silva', status: 'Boarding', passengers: 21, capacity: 44 },
  { id: 'T-06', code: 'TRP-138-0752', routeCode: '138', from: 'Pettah', to: 'Homagama', depart: '07:52', arrive: '08:50', bus: 'NA-2095', driver: 'Ruwan Gamage', status: 'In Progress', passengers: 53, capacity: 54 },
  { id: 'T-07', code: 'TRP-187-0800', routeCode: '187', from: 'Fort', to: 'Katunayake Airport', depart: '08:00', arrive: '08:55', bus: 'NB-7710', driver: 'Chamara Dias', status: 'In Progress', passengers: 29, capacity: 44 },
  { id: 'T-08', code: 'TRP-049-0830', routeCode: '49', from: 'Colombo Fort', to: 'Trincomalee', depart: '08:30', arrive: '14:45', bus: 'NC-0875', driver: 'A. Navaneethan', status: 'Boarding', passengers: 17, capacity: 45 },
  { id: 'T-09', code: 'TRP-099-0430', routeCode: '99', from: 'Colombo Fort', to: 'Badulla', depart: '04:30', arrive: '10:45', bus: 'NA-9902', driver: 'Upul Senanayake', status: 'Delayed', passengers: 47, capacity: 52 },
  { id: 'T-10', code: 'TRP-EX1-0900', routeCode: 'EX-01', from: 'Kadawatha', to: 'Kandy', depart: '09:00', arrive: '11:15', bus: 'NC-6264', driver: 'Dinesh Fernando', status: 'Scheduled', passengers: 0, capacity: 45 },
  { id: 'T-11', code: 'TRP-240-0830', routeCode: '240', from: 'Negombo', to: 'Colombo Fort', depart: '08:30', arrive: '09:50', bus: 'NB-6620', driver: 'Sisira Fernando', status: 'Scheduled', passengers: 0, capacity: 52 },
  { id: 'T-12', code: 'TRP-100-0640', routeCode: '100', from: 'Pettah', to: 'Panadura', depart: '06:40', arrive: '07:35', bus: 'NA-7418', driver: 'Roshan Perera', status: 'Completed', passengers: 52, capacity: 54 },
];

/* ------------------------------ Routes ----------------------------- */

export const ROUTES: RouteInfo[] = [
  { code: '240', name: 'Colombo Fort ↔ Negombo', type: 'Provincial', distanceKm: 38, stops: 42, busesAssigned: 86, dailyTrips: 412, fare: 180, onTime: 91 },
  { code: '01', name: 'Colombo Fort ↔ Kandy', type: 'Interprovincial', distanceKm: 116, stops: 68, busesAssigned: 142, dailyTrips: 386, fare: 520, onTime: 87 },
  { code: 'EX-02', name: 'Makumbura ↔ Matara (Southern Expressway)', type: 'Expressway', distanceKm: 162, stops: 6, busesAssigned: 74, dailyTrips: 168, fare: 1450, onTime: 96 },
  { code: '04', name: 'Colombo Fort ↔ Anuradhapura', type: 'Interprovincial', distanceKm: 205, stops: 84, busesAssigned: 58, dailyTrips: 96, fare: 880, onTime: 83 },
  { code: '87', name: 'Colombo Fort ↔ Jaffna', type: 'Interprovincial', distanceKm: 394, stops: 92, busesAssigned: 47, dailyTrips: 64, fare: 1950, onTime: 85 },
  { code: '187', name: 'Fort ↔ Katunayake Airport', type: 'City', distanceKm: 33, stops: 18, busesAssigned: 29, dailyTrips: 118, fare: 300, onTime: 94 },
  { code: '138', name: 'Pettah ↔ Homagama', type: 'City', distanceKm: 23, stops: 36, busesAssigned: 112, dailyTrips: 640, fare: 120, onTime: 89 },
  { code: '99', name: 'Colombo Fort ↔ Badulla', type: 'Interprovincial', distanceKm: 231, stops: 77, busesAssigned: 44, dailyTrips: 78, fare: 980, onTime: 81 },
  { code: 'EX-01', name: 'Kadawatha ↔ Kandy (Central Expressway)', type: 'Expressway', distanceKm: 98, stops: 4, busesAssigned: 52, dailyTrips: 132, fare: 1150, onTime: 95 },
  { code: '245', name: 'Negombo ↔ Chilaw', type: 'Provincial', distanceKm: 51, stops: 38, busesAssigned: 33, dailyTrips: 144, fare: 230, onTime: 92 },
];

/* ------------------------------ Drivers ---------------------------- */

export const DRIVERS: Driver[] = [
  { id: 'D-01', name: 'Nimal Fernando', depot: 'Negombo', licence: 'B/2009/48192', phone: '077 341 8820', rating: 4.8, tripsCompleted: 1284, experience: '14 yrs', status: 'On Duty' },
  { id: 'D-02', name: 'Kasun Perera', depot: 'Kandy South', licence: 'B/2014/90317', phone: '071 552 4419', rating: 4.7, tripsCompleted: 942, experience: '9 yrs', status: 'On Duty' },
  { id: 'D-03', name: 'Mohamed Fairoz', depot: 'Galle', licence: 'B/2011/22904', phone: '077 890 1136', rating: 4.9, tripsCompleted: 1517, experience: '12 yrs', status: 'On Duty' },
  { id: 'D-04', name: 'Sunil Bandara', depot: 'Anuradhapura', licence: 'B/2006/11857', phone: '072 304 7761', rating: 4.5, tripsCompleted: 2103, experience: '18 yrs', status: 'On Duty' },
  { id: 'D-05', name: 'S. Jeyakumar', depot: 'Vavuniya', licence: 'B/2013/66420', phone: '076 219 5308', rating: 4.8, tripsCompleted: 876, experience: '10 yrs', status: 'On Duty' },
  { id: 'D-06', name: 'Pradeep Silva', depot: 'Negombo', licence: 'B/2016/34118', phone: '070 448 9022', rating: 4.6, tripsCompleted: 613, experience: '7 yrs', status: 'On Duty' },
  { id: 'D-07', name: 'Ruwan Gamage', depot: 'Kottawa', licence: 'B/2018/77541', phone: '077 126 8843', rating: 4.4, tripsCompleted: 428, experience: '5 yrs', status: 'On Duty' },
  { id: 'D-08', name: 'Chamara Dias', depot: 'Katubedda', licence: 'B/2015/58290', phone: '071 933 2075', rating: 4.9, tripsCompleted: 1051, experience: '8 yrs', status: 'On Duty' },
  { id: 'D-09', name: 'Ajith Kumara', depot: 'Kurunegala', licence: 'B/2008/30966', phone: '077 540 6718', rating: 4.3, tripsCompleted: 1872, experience: '16 yrs', status: 'On Leave' },
  { id: 'D-10', name: 'A. Navaneethan', depot: 'Trincomalee', licence: 'B/2012/41075', phone: '075 618 3290', rating: 4.7, tripsCompleted: 1198, experience: '11 yrs', status: 'On Duty' },
  { id: 'D-11', name: 'Tharindu Rathnayake', depot: 'Polonnaruwa', licence: 'B/2019/82334', phone: '070 296 4417', rating: 4.6, tripsCompleted: 351, experience: '4 yrs', status: 'On Duty' },
  { id: 'D-12', name: 'Gamini Jayasuriya', depot: 'Tissamaharama', licence: 'B/2004/05713', phone: '072 781 0956', rating: 4.8, tripsCompleted: 2544, experience: '21 yrs', status: 'Off Duty' },
];

/* ----------------------------- Approvals --------------------------- */

export const APPROVALS: Approval[] = [
  { id: 'A-01', type: 'Route Permit', applicant: 'Sandamali Travels (Pvt) Ltd', reference: 'NTC/RP/2026/1842', region: 'Western Province', submitted: '18 Oct 2026', status: 'Pending' },
  { id: 'A-02', type: 'New Vehicle Permit', applicant: 'Southern Express Holdings', reference: 'NTC/VP/2026/0917', region: 'Southern Province', submitted: '17 Oct 2026', status: 'Pending' },
  { id: 'A-03', type: 'Operator Registration', applicant: 'Hill Country Coaches', reference: 'NTC/OR/2026/0458', region: 'Central Province', submitted: '17 Oct 2026', status: 'Pending' },
  { id: 'A-04', type: 'Fare Revision', applicant: 'Interprovincial Operators’ Association', reference: 'NTC/FR/2026/0112', region: 'National', submitted: '16 Oct 2026', status: 'Pending' },
  { id: 'A-05', type: 'New Vehicle Permit', applicant: 'Eastern Line Transport', reference: 'NTC/VP/2026/0901', region: 'Eastern Province', submitted: '15 Oct 2026', status: 'Pending' },
  { id: 'A-06', type: 'Route Permit', applicant: 'Negombo City Rider (Pvt) Ltd', reference: 'NTC/RP/2026/1830', region: 'Western Province', submitted: '14 Oct 2026', status: 'Approved' },
  { id: 'A-07', type: 'Operator Registration', applicant: 'Northern Highway Services', reference: 'NTC/OR/2026/0441', region: 'Northern Province', submitted: '12 Oct 2026', status: 'Approved' },
];

/* ------------------------------ Depots ----------------------------- */

export const DEPOTS: Depot[] = [
  { name: 'Negombo Depot', region: 'Western · Gampaha', buses: 214, capacity: 240, staff: 486, utilisation: 89, status: 'Operational' },
  { name: 'Ratmalana Depot', region: 'Western · Colombo', buses: 268, capacity: 300, staff: 612, utilisation: 89, status: 'Operational' },
  { name: 'Kottawa Depot', region: 'Western · Colombo', buses: 196, capacity: 210, staff: 429, utilisation: 93, status: 'Operational' },
  { name: 'Katubedda Depot', region: 'Western · Colombo', buses: 178, capacity: 200, staff: 394, utilisation: 89, status: 'Operational' },
  { name: 'Kandy South Depot', region: 'Central · Kandy', buses: 231, capacity: 260, staff: 517, utilisation: 88, status: 'Operational' },
  { name: 'Galle Depot', region: 'Southern · Galle', buses: 167, capacity: 190, staff: 352, utilisation: 88, status: 'Operational' },
  { name: 'Kurunegala Depot', region: 'North Western', buses: 189, capacity: 220, staff: 408, utilisation: 86, status: 'Operational' },
  { name: 'Anuradhapura Depot', region: 'North Central', buses: 143, capacity: 175, staff: 311, utilisation: 82, status: 'Partial Service' },
];

/* --------------------------- Charts & feeds ------------------------ */

/** Hourly passenger boardings (04:00 – 23:00), thousands */
export const HOURLY_BOARDINGS = [12, 28, 64, 92, 118, 104, 78, 70, 74, 82, 96, 122, 138, 126, 102, 84, 66, 48, 30, 18];
export const HOURLY_LABELS = ['4a', '5a', '6a', '7a', '8a', '9a', '10a', '11a', '12p', '1p', '2p', '3p', '4p', '5p', '6p', '7p', '8p', '9p', '10p', '11p'];

/** 7-day revenue, LKR millions */
export const WEEK_REVENUE = [38.2, 41.6, 40.1, 43.8, 46.9, 52.4, 48.2];
export const WEEK_LABELS = ['Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon'];

export const TOP_ROUTES = [
  { code: '138', name: 'Pettah – Homagama', passengers: 48210, share: 100 },
  { code: '01', name: 'Colombo – Kandy', passengers: 41560, share: 86 },
  { code: '240', name: 'Colombo – Negombo', passengers: 36840, share: 76 },
  { code: '177', name: 'Kaduwela – Kollupitiya', passengers: 30120, share: 62 },
  { code: '100', name: 'Pettah – Panadura', passengers: 27480, share: 57 },
];

export const FLEET_STATUS = [
  { label: 'On Route', value: 12486, color: '#059669' },
  { label: 'Boarding / Standby', value: 2134, color: '#34D399' },
  { label: 'At Depot', value: 2918, color: '#D1D5DB' },
  { label: 'Maintenance', value: 1402, color: '#9CA3AF' },
];

export interface ActivityItem {
  id: string;
  title: string;
  detail: string;
  time: string;
  tone: 'success' | 'warning' | 'info' | 'danger';
}

export const ACTIVITY: ActivityItem[] = [
  { id: 'ac1', title: 'Route 04 running 18 min late', detail: 'NA-6721 held near Dambulla due to roadworks on the A9.', time: '4 min ago', tone: 'warning' },
  { id: 'ac2', title: '1,248 e-tickets issued in the last hour', detail: 'Mobile app bookings up 12% against the same hour yesterday.', time: '12 min ago', tone: 'success' },
  { id: 'ac3', title: 'New GPS units provisioned', detail: '36 trackers activated for the Negombo depot fleet.', time: '38 min ago', tone: 'info' },
  { id: 'ac4', title: 'Route 99 delayed at Balangoda', detail: 'NA-9902 reporting heavy rain on the A4 corridor.', time: '52 min ago', tone: 'warning' },
  { id: 'ac5', title: 'Speed alert cleared', detail: 'NC-1156 returned to compliant speed on the Southern Expressway.', time: '1 hr ago', tone: 'success' },
];

export interface AppNotification {
  id: string;
  title: string;
  detail: string;
  time: string;
  unread: boolean;
}

export const NOTIFICATIONS: AppNotification[] = [
  { id: 'n1', title: '5 permit applications awaiting review', detail: 'Oldest submission is 2 days old (NTC/VP/2026/0901).', time: '10 min ago', unread: true },
  { id: 'n2', title: 'Anuradhapura depot at partial service', detail: 'Workshop bay 2 offline for scheduled equipment service.', time: '1 hr ago', unread: true },
  { id: 'n3', title: 'Weekly revenue report is ready', detail: 'Network revenue rose 6.4% week-on-week.', time: '3 hrs ago', unread: false },
];

/** Positions (%) of live buses on the schematic operations map */
export const MAP_BUSES = [
  { reg: 'NA-3847', route: '240 · Colombo → Negombo', x: 30, y: 34, status: 'On Route' as BusStatus, speed: 42 },
  { reg: 'NB-7710', route: '187 · Fort → Airport', x: 26, y: 44, status: 'On Route' as BusStatus, speed: 63 },
  { reg: 'NB-9204', route: '01 · Colombo → Kandy', x: 58, y: 30, status: 'On Route' as BusStatus, speed: 38 },
  { reg: 'NC-1156', route: 'EX-02 · Makumbura → Matara', x: 40, y: 76, status: 'On Route' as BusStatus, speed: 84 },
  { reg: 'NA-6721', route: '04 · Colombo → Anuradhapura', x: 56, y: 16, status: 'Delayed' as BusStatus, speed: 22 },
  { reg: 'NC-8032', route: '245 · Negombo → Chilaw', x: 22, y: 22, status: 'Boarding' as BusStatus, speed: 0 },
  { reg: 'NA-2095', route: '138 · Pettah → Homagama', x: 38, y: 58, status: 'On Route' as BusStatus, speed: 26 },
  { reg: 'NA-9902', route: '99 · Colombo → Badulla', x: 72, y: 52, status: 'Delayed' as BusStatus, speed: 31 },
  { reg: 'NC-6264', route: 'EX-01 · Kadawatha → Kandy', x: 46, y: 38, status: 'On Route' as BusStatus, speed: 79 },
  { reg: 'NB-2357', route: '32 · Colombo → Kataragama', x: 64, y: 84, status: 'On Route' as BusStatus, speed: 48 },
];
