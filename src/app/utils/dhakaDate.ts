import { CANTEEN_CONSTANTS } from '../constants/canteen.constants';

/**
 * Date utility helper ensuring all operations align strictly with Asia/Dhaka time.
 */

export const getDhakaDateString = (dateInput?: Date | string): string => {
  const d = dateInput
    ? typeof dateInput === 'string'
      ? new Date(dateInput)
      : dateInput
    : new Date();

  // Use Intl.DateTimeFormat with Asia/Dhaka timezone
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: CANTEEN_CONSTANTS.timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  return formatter.format(d); // Outputs YYYY-MM-DD
};

export const parseDateParts = (
  dateStr: string,
): { year: number; month: number; day: number } => {
  const parts = dateStr.split('-');
  if (parts.length !== 3) {
    const today = getDhakaDateString();
    return parseDateParts(today);
  }

  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);

  return { year, month, day };
};

export const getDaysInMonth = (year: number, month: number): number => {
  // month is 1-indexed (1 = Jan, 12 = Dec)
  return new Date(year, month, 0).getDate();
};

export const getCurrentDhakaDate = (): {
  dateString: string;
  year: number;
  month: number;
  day: number;
} => {
  const dateString = getDhakaDateString();
  const parts = parseDateParts(dateString);
  return { dateString, ...parts };
};
