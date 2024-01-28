export const bytesToKilobytes = (
  bytes: number,
  decimalPlaces: number = 1
): number => {
  const kilobytes = bytes / 1024;
  return parseFloat(kilobytes.toFixed(decimalPlaces));
};
