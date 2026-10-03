export const CANTEEN_CONSTANTS = {
  squadrons: ['Sadruddin', 'Liakot Ali', 'Nurul Haque', 'Mansur Ali'] as const,

  rooms: [
    'Room 1',
    'Room 2',
    'Room 3',
    'Room 4',
    'Room 5',
    'Room 6',
    'Room 7',
    'Room 8',
    'Room 9',
    'Room 10',
    'Room 11',
    'Room 12',
    'Room 13',
    'Room 14',
    'Room 15',
    'Room 16',
  ] as const,

  roles: ['ADMIN', 'NCOIC', 'JCOIC', 'WOIC'] as const,

  ranks: [
    'Air Cdre',
    'Gp Capt',
    'Wg Cdr',
    'Sqn Ldr',
    'Flt Lt',
    'Fg Offr',
    'MWO',
    'SWO',
    'WO',
    'Sgt',
    'Cpl',
    'LAC',
    'AC',
    'Civilian',
  ] as const,

  customerTypes: ['RECRUIT_ROOM', 'P_STAFF'] as const,

  paymentMethods: ['CASH', 'BKASH', 'BANK_TRANSFER', 'OTHER'] as const,

  defaultEntry: '54',

  timezone: 'Asia/Dhaka',

  defaultOffices: [
    'Admin Wing',
    'Training Wing (RTS)',
    'Logistics Squadron',
    'Station HQ',
    'MT Squadron',
    'Medical Squadron',
    'Accounts Section',
    'Canteen Staff',
    'Security & Guard Sqn',
    'Communications Flight',
  ] as const,
};

export type TSquadron = (typeof CANTEEN_CONSTANTS.squadrons)[number];
export type TRoom = (typeof CANTEEN_CONSTANTS.rooms)[number];
export type TManagerRole = (typeof CANTEEN_CONSTANTS.roles)[number];
export type TBafRank = (typeof CANTEEN_CONSTANTS.ranks)[number];
export type TCustomerType = (typeof CANTEEN_CONSTANTS.customerTypes)[number];
export type TPaymentMethod = (typeof CANTEEN_CONSTANTS.paymentMethods)[number];
