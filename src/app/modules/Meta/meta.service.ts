import config from '../../config';
import { CANTEEN_CONSTANTS } from '../../constants/canteen.constants';

const getConstants = async () => {
  return {
    squadrons: CANTEEN_CONSTANTS.squadrons,
    rooms: CANTEEN_CONSTANTS.rooms,
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
