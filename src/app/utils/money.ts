/**
 * Financial utility for integer paisa math to avoid floating point drift.
 * 1 Taka = 100 Paisa.
 */

export const toPaisa = (taka: number): number => {
  if (isNaN(taka)) return 0;
  return Math.round(taka * 100);
};

export const toTaka = (paisa: number): number => {
  if (isNaN(paisa)) return 0;
  return Math.round(paisa) / 100;
};

export const formatTaka = (paisa: number): string => {
  const taka = toTaka(paisa);
  return `Tk ${taka.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};
