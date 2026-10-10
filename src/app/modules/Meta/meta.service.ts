import config from '../../config';
import { CANTEEN_CONSTANTS } from '../../constants/canteen.constants';
import { SquadronModel } from '../Squadron/squadron.model';

const getConstants = async () => {
  const activeSqns = await SquadronModel.find({ isActive: true }).sort({
    createdAt: 1,
  });

  const squadrons =
    activeSqns.length > 0
      ? activeSqns.map((s) => s.name)
      : Array.from(CANTEEN_CONSTANTS.squadrons);

  const roomSet = new Set<string>();
  if (activeSqns.length > 0) {
    for (const sqn of activeSqns) {
      for (const rm of sqn.rooms) {
        roomSet.add(rm);
      }
    }
  } else {
    for (const rm of CANTEEN_CONSTANTS.rooms) {
      roomSet.add(rm);
    }
  }

  return {
    squadrons,
    rooms: Array.from(roomSet),
    roles: CANTEEN_CONSTANTS.roles,
    ranks: CANTEEN_CONSTANTS.ranks,
    customerTypes: CANTEEN_CONSTANTS.customerTypes,
    paymentMethods: CANTEEN_CONSTANTS.paymentMethods,
    defaultEntry: CANTEEN_CONSTANTS.defaultEntry,
    defaultOffices: CANTEEN_CONSTANTS.defaultOffices,
    timezone: CANTEEN_CONSTANTS.timezone,
    adminPaymentInfo: {
      bkashNumber: config.admin_payment.bkash_number,
      bankAccountName: config.admin_payment.bank_account_name,
      bankAccountNumber: config.admin_payment.bank_account_number,
      bankName: config.admin_payment.bank_name,
      bankBranch: config.admin_payment.bank_branch,
      whatsappNumber: config.admin_payment.whatsapp_number,
    },
  };
};

export const MetaServices = {
  getConstants,
};
