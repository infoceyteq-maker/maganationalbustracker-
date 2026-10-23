/* ------------------------------------------------------------------ */
/*  Approval pipeline — the ONLY path a bus record can take:           */
/*  Crew Self-Registration → Depot Verification → Province Permit      */
/*  → Live Tracking Unlocked (automation). Admins never type bus data. */
/* ------------------------------------------------------------------ */

export type RegStatus =
  | 'Pending Depot Verification'
  | 'Recommended to Province'
  | 'Permit Granted'
  | 'Returned for Correction';

export interface Registration {
  id: string;
  regNo: string;
  make: string;
  year: number;
  seats: number;
  ownerName: string;
  ownerNIC: string;
  ownerPhone: string;
  driverName: string;
  driverLicence: string;
  conductorName: string;
  routeApplied: string;
  depot: string;
  province: string;
  submittedAt: string;
  status: RegStatus;
  documents: string[];
  /** Depot verification checklist results, keyed by check id. */
  checks: Record<string, boolean>;
  permitNo?: string;
  returnNote?: string;
  /** True for records owned by the signed-in crew persona. */
  mine?: boolean;
  history: { stage: string; by: string; at: string; note: string }[];
}

export const VERIFICATION_CHECKS: { id: string; label: string; hint: string }[] = [
  { id: 'chassis', label: 'Chassis & engine numbers match CR book', hint: 'Physically sighted on the vehicle plate' },
  { id: 'revenue', label: 'Revenue licence valid', hint: 'Current year, correct vehicle class' },
  { id: 'insurance', label: 'Third-party insurance active', hint: 'Policy covers public passenger service' },
  { id: 'fitness', label: 'Certificate of fitness & emission test passed', hint: 'Issued within the last 6 months' },
  { id: 'gps', label: 'GPS tracker fitted & transmitting', hint: 'Device heartbeat visible on the depot console' },
  { id: 'licence', label: 'Driver licence verified with DMT', hint: 'Heavy-vehicle class, not suspended' },
  { id: 'condition', label: 'Physical condition & seating confirmed', hint: 'Seats, tyres, lights and body inspected' },
];

const DOCS = ['CR Book (Certificate of Registration).pdf', 'Revenue Licence 2026.pdf', 'Insurance Policy.pdf', 'Fitness & Emission Certificate.pdf'];
const allChecked = Object.fromEntries(VERIFICATION_CHECKS.map((c) => [c.id, true]));
const noneChecked = Object.fromEntries(VERIFICATION_CHECKS.map((c) => [c.id, false]));

export const SEED_REGISTRATIONS: Registration[] = [
  {
    id: 'REG-1041',
    regNo: 'NC-4521',
    make: 'Ashok Leyland Viking',
    year: 2021,
    seats: 54,
    ownerName: 'Saman Kumara',
    ownerNIC: '198512304578',
    ownerPhone: '077 214 8890',
    driverName: 'Dinesh Priyantha',
    driverLicence: 'B/2016/34118',
    conductorName: 'Mahesh Fernando',
    routeApplied: '240 · Colombo Fort ↔ Negombo',
    depot: 'Negombo',
    province: 'Western',
    submittedAt: '20 Oct 2026 · 07:42',
    status: 'Pending Depot Verification',
    documents: DOCS,
    checks: { ...noneChecked },
    history: [{ stage: 'Self-registered', by: 'Saman Kumara (Crew App)', at: '20 Oct 2026 · 07:42', note: 'Submitted with 4 supporting documents.' }],
  },
  {
    id: 'REG-1040',
    regNo: 'NB-8814',
    make: 'Tata LPO 1512',
    year: 2019,
    seats: 52,
    ownerName: 'Fathima Rizna',
    ownerNIC: '199020145632',
    ownerPhone: '076 551 2048',
    driverName: 'Mohamed Imran',
    driverLicence: 'B/2014/22904',
    conductorName: 'Rizwan Ahamed',
    routeApplied: '245 · Negombo ↔ Chilaw',
    depot: 'Negombo',
    province: 'Western',
    submittedAt: '19 Oct 2026 · 16:18',
    status: 'Pending Depot Verification',
    documents: DOCS,
    checks: { ...noneChecked, chassis: true, revenue: true },
    history: [{ stage: 'Self-registered', by: 'Fathima Rizna (Crew App)', at: '19 Oct 2026 · 16:18', note: 'Submitted with 4 supporting documents.' }],
  },
  {
    id: 'REG-1039',
    regNo: 'NB-5520',
    make: 'Ashok Leyland Lynx',
    year: 2022,
    seats: 44,
    ownerName: 'Nimal Fernando',
    ownerNIC: '198207801245',
    ownerPhone: '077 341 8820',
    driverName: 'Nimal Fernando',
    driverLicence: 'B/2009/48192',
    conductorName: 'Kasun Silva',
    routeApplied: '240 · Colombo Fort ↔ Negombo',
    depot: 'Negombo',
    province: 'Western',
    submittedAt: '19 Oct 2026 · 09:05',
    status: 'Pending Depot Verification',
    documents: DOCS,
    checks: { ...noneChecked },
    mine: true,
    history: [{ stage: 'Self-registered', by: 'Nimal Fernando (Crew App)', at: '19 Oct 2026 · 09:05', note: 'Second vehicle submitted for route 240.' }],
  },
  {
    id: 'REG-1038',
    regNo: 'NC-2097',
    make: 'King Long XMQ6106',
    year: 2020,
    seats: 47,
    ownerName: 'Hill Country Coaches',
    ownerNIC: 'PV 00214875',
    ownerPhone: '081 223 4410',
    driverName: 'Bandula Herath',
    driverLicence: 'B/2011/11857',
    conductorName: 'Nuwan Bandara',
    routeApplied: '01 · Colombo Fort ↔ Kandy',
    depot: 'Kandy South',
    province: 'Central',
    submittedAt: '18 Oct 2026 · 14:30',
    status: 'Pending Depot Verification',
    documents: DOCS,
    checks: { ...noneChecked },
    history: [{ stage: 'Self-registered', by: 'Hill Country Coaches (Crew App)', at: '18 Oct 2026 · 14:30', note: 'Submitted with 4 supporting documents.' }],
  },
  {
    id: 'REG-1033',
    regNo: 'NA-7305',
    make: 'Yutong ZK6110',
    year: 2023,
    seats: 45,
    ownerName: 'Airport Express (Pvt) Ltd',
    ownerNIC: 'PV 00197542',
    ownerPhone: '011 225 7780',
    driverName: 'Chamara Dias',
    driverLicence: 'B/2015/58290',
    conductorName: '— (one-man operation)',
    routeApplied: '187 · Fort ↔ Katunayake Airport',
    depot: 'Katubedda',
    province: 'Western',
    submittedAt: '16 Oct 2026 · 08:12',
    status: 'Recommended to Province',
    documents: DOCS,
    checks: { ...allChecked },
    history: [
      { stage: 'Self-registered', by: 'Airport Express (Crew App)', at: '16 Oct 2026 · 08:12', note: 'Submitted with 4 supporting documents.' },
      { stage: 'Depot verified', by: 'S. Perera · Katubedda Depot', at: '17 Oct 2026 · 11:26', note: 'All 7 physical checks passed. GPS heartbeat confirmed.' },
      { stage: 'Recommended', by: 'S. Perera · Katubedda Depot', at: '17 Oct 2026 · 11:27', note: 'Forwarded to Western Province for final permit.' },
    ],
  },
  {
    id: 'REG-1031',
    regNo: 'NC-6110',
    make: 'Golden Dragon XML6112',
    year: 2022,
    seats: 45,
    ownerName: 'Southern Highway Caches',
    ownerNIC: 'PV 00231098',
    ownerPhone: '011 289 5514',
    driverName: 'Mohamed Fairoz',
    driverLicence: 'B/2011/22904',
    conductorName: 'Asanka Fernando',
    routeApplied: 'EX-02 · Makumbura ↔ Matara',
    depot: 'Kottawa',
    province: 'Western',
    submittedAt: '15 Oct 2026 · 10:48',
    status: 'Recommended to Province',
    documents: DOCS,
    checks: { ...allChecked },
    history: [
      { stage: 'Self-registered', by: 'Southern Highway Caches (Crew App)', at: '15 Oct 2026 · 10:48', note: 'Submitted with 4 supporting documents.' },
      { stage: 'Depot verified', by: 'K. Dissanayake · Kottawa Depot', at: '16 Oct 2026 · 09:15', note: 'All 7 physical checks passed.' },
      { stage: 'Recommended', by: 'K. Dissanayake · Kottawa Depot', at: '16 Oct 2026 · 09:16', note: 'Forwarded to Western Province for final permit.' },
    ],
  },
  {
    id: 'REG-1029',
    regNo: 'NB-4471',
    make: 'Tata Marcopolo',
    year: 2018,
    seats: 49,
    ownerName: 'Ruhunu Travels',
    ownerNIC: 'PV 00184520',
    ownerPhone: '091 223 8890',
    driverName: 'Gamini Jayasuriya',
    driverLicence: 'B/2004/05713',
    conductorName: 'Sujith Kumara',
    routeApplied: '32 · Colombo Fort ↔ Kataragama',
    depot: 'Galle',
    province: 'Southern',
    submittedAt: '14 Oct 2026 · 13:20',
    status: 'Recommended to Province',
    documents: DOCS,
    checks: { ...allChecked },
    history: [
      { stage: 'Self-registered', by: 'Ruhunu Travels (Crew App)', at: '14 Oct 2026 · 13:20', note: 'Submitted with 4 supporting documents.' },
      { stage: 'Recommended', by: 'M. Fairoz · Galle Depot', at: '15 Oct 2026 · 10:02', note: 'Forwarded to Southern Province for final permit.' },
    ],
  },
  {
    id: 'REG-1018',
    regNo: 'NA-3847',
    make: 'Ashok Leyland Viking',
    year: 2020,
    seats: 54,
    ownerName: 'Nimal Fernando',
    ownerNIC: '198207801245',
    ownerPhone: '077 341 8820',
    driverName: 'Nimal Fernando',
    driverLicence: 'B/2009/48192',
    conductorName: 'Kasun Silva',
    routeApplied: '240 · Colombo Fort ↔ Negombo',
    depot: 'Negombo',
    province: 'Western',
    submittedAt: '02 Oct 2026 · 08:30',
    status: 'Permit Granted',
    documents: DOCS,
    checks: { ...allChecked },
    permitNo: 'WP/2026/10482',
    mine: true,
    history: [
      { stage: 'Self-registered', by: 'Nimal Fernando (Crew App)', at: '02 Oct 2026 · 08:30', note: 'Submitted with 4 supporting documents.' },
      { stage: 'Recommended', by: 'Ruwan Fernando · Negombo Depot', at: '03 Oct 2026 · 12:40', note: 'All 7 physical checks passed.' },
      { stage: 'Permit granted', by: 'Kumari Jayasuriya · Western Province', at: '05 Oct 2026 · 09:12', note: 'Permit WP/2026/10482 issued · live tracking unlocked automatically.' },
    ],
  },
  {
    id: 'REG-1011',
    regNo: 'NB-9204',
    make: 'Tata LPO 1512',
    year: 2019,
    seats: 52,
    ownerName: 'Kasun Perera',
    ownerNIC: '199105604318',
    ownerPhone: '071 552 4419',
    driverName: 'Kasun Perera',
    driverLicence: 'B/2014/90317',
    conductorName: 'Duminda Rathnayake',
    routeApplied: '01 · Colombo Fort ↔ Kandy',
    depot: 'Kandy South',
    province: 'Central',
    submittedAt: '28 Sep 2026 · 11:05',
    status: 'Permit Granted',
    documents: DOCS,
    checks: { ...allChecked },
    permitNo: 'CP/2026/08741',
    history: [
      { stage: 'Self-registered', by: 'Kasun Perera (Crew App)', at: '28 Sep 2026 · 11:05', note: 'Submitted with 4 supporting documents.' },
      { stage: 'Permit granted', by: 'Central Province Authority', at: '01 Oct 2026 · 10:22', note: 'Permit CP/2026/08741 issued · live tracking unlocked automatically.' },
    ],
  },
  {
    id: 'REG-1007',
    regNo: 'NC-1148',
    make: 'Ashok Leyland Cheetah',
    year: 2016,
    seats: 52,
    ownerName: 'Nimal Fernando',
    ownerNIC: '198207801245',
    ownerPhone: '077 341 8820',
    driverName: 'Sunil Fernando',
    driverLicence: 'B/2008/30966',
    conductorName: 'Ruwan Gamage',
    routeApplied: '245 · Negombo ↔ Chilaw',
    depot: 'Negombo',
    province: 'Western',
    submittedAt: '25 Sep 2026 · 15:44',
    status: 'Returned for Correction',
    documents: DOCS,
    checks: { ...noneChecked, chassis: true, revenue: true },
    returnNote: 'Insurance policy expired on 30 Sep 2026. Please renew and re-submit the policy document.',
    mine: true,
    history: [
      { stage: 'Self-registered', by: 'Nimal Fernando (Crew App)', at: '25 Sep 2026 · 15:44', note: 'Submitted with 4 supporting documents.' },
      { stage: 'Returned', by: 'Ruwan Fernando · Negombo Depot', at: '26 Sep 2026 · 09:31', note: 'Insurance policy expired — returned to crew for correction.' },
    ],
  },
];

/* --------------------------- Admin accounts ------------------------ */

export interface AdminAccount {
  id: string;
  name: string;
  email: string;
  role: 'Master Admin' | 'Provincial Admin' | 'Depot Admin';
  assignment: string;
  status: 'Active' | 'Invitation Sent' | 'Suspended';
  lastActive: string;
  system?: boolean;
}

export const SEED_ADMINS: AdminAccount[] = [
  { id: 'ADM-001', name: 'Dr. Sarath Weerasinghe', email: 'sarath.Weerasinghe@transport.gov.lk', role: 'Master Admin', assignment: 'Ministry of Transport', status: 'Active', lastActive: 'Now', system: true },
  { id: 'ADM-014', name: 'Kumari Jayasuriya', email: 'Kumari Jayasuriya@wp.transport.gov.lk', role: 'Provincial Admin', assignment: 'Western Province', status: 'Active', lastActive: '12 min ago' },
  { id: 'ADM-015', name: 'Bandula Herath', email: 'Bandula Herath@cp.transport.gov.lk', role: 'Provincial Admin', assignment: 'Central Province', status: 'Active', lastActive: '1 hr ago' },
  { id: 'ADM-016', name: 'T. Sivagnanam', email: 'northern.transport.gov.lk', role: 'Provincial Admin', assignment: 'Northern Province', status: 'Active', lastActive: '3 hrs ago' },
  { id: 'ADM-042', name: 'Ruwan Fernando', email: 'negombo.depot@sltb.lk', role: 'Depot Admin', assignment: 'Negombo Depot', status: 'Active', lastActive: '5 min ago' },
  { id: 'ADM-043', name: 'S. Perera', email: 'katubedda.depot@sltb.lk', role: 'Depot Admin', assignment: 'Katubedda Depot', status: 'Active', lastActive: '48 min ago' },
  { id: 'ADM-044', name: 'M. Fairoz', email: 'galle.depot@sltb.lk', role: 'Depot Admin', assignment: 'Galle Depot', status: 'Invitation Sent', lastActive: '—' },
];

/* ------------------------------ Provinces -------------------------- */

export const PROVINCES = ['Western', 'Central', 'Southern', 'Northern', 'Eastern', 'North Western', 'North Central', 'Uva', 'Sabaragamuwa'];

export const PROVINCE_STATS = [
  { province: 'Western', buses: 6840, digitized: 86 },
  { province: 'Central', buses: 2410, digitized: 78 },
  { province: 'Southern', buses: 2185, digitized: 74 },
  { province: 'North Western', buses: 1890, digitized: 71 },
  { province: 'Sabaragamuwa', buses: 1540, digitized: 68 },
  { province: 'Eastern', buses: 1425, digitized: 63 },
  { province: 'North Central', buses: 1180, digitized: 66 },
  { province: 'Uva', buses: 940, digitized: 59 },
  { province: 'Northern', buses: 530, digitized: 57 },
];

/* ------------------------------ Automation ------------------------- */

export interface AutomationEvent {
  id: number;
  text: string;
  at: string;
  tone: 'permit' | 'gps' | 'notify' | 'register';
}

export const SEED_AUTOMATION: AutomationEvent[] = [
  { id: 1, text: 'Permit WP/2026/10482 issued to NA-3847 · QR + PDF generated', at: '05 Oct 2026 · 09:12', tone: 'permit' },
  { id: 2, text: 'GPS live-tracking unlocked for NA-3847 · device bound to permit', at: '05 Oct 2026 · 09:12', tone: 'gps' },
  { id: 3, text: 'Crew notified in-app & by SMS · Nimal Fernando (077 341 8820)', at: '05 Oct 2026 · 09:13', tone: 'notify' },
];

export const PROVINCE_CODE: Record<string, string> = {
  Western: 'WP',
  Central: 'CP',
  Southern: 'SP',
  Northern: 'NP',
  Eastern: 'EP',
  'North Western': 'NWP',
  'North Central': 'NCP',
  Uva: 'UP',
  Sabaragamuwa: 'SGP',
};
