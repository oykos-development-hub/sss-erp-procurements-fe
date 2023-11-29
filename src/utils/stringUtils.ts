export const numberToPriceString = (number: number) => {
  return number?.toLocaleString('sr-RS', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
