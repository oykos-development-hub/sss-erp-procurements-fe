export const parseDate = (date: Date | string | null) => {
  if (!date) return '';
  const dateObj = new Date(date);
  const day = dateObj.toLocaleDateString('sr-latn-SR', {day: '2-digit'});
  const month = dateObj.toLocaleDateString('sr-latn-SR', {month: '2-digit'});
  const year = dateObj.toLocaleDateString('sr-latn-SR', {year: 'numeric'}).replace('.', '');

  return `${day}/${month}/${year}`;
};

// parses date of format dd/mm/yyyy to Date object
export const stringToDate = (dateString: string): Date => {
  const [day, month, year] = dateString.split('/').map(s => parseInt(s, 10));
  return new Date(year, month - 1, day); // Month is 0-indexed
};

export const parseDateForBackend = (date: Date) => {
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString();
};

export const calculateExperience = (startDate: Date | string, endDate: Date | string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffInMonths = end.getMonth() - start.getMonth() + 12 * (end.getFullYear() - start.getFullYear());

  return diffInMonths;
};

export const parseToDate = (dateString: string | null) => {
  if (!dateString) return null;

  return new Date(dateString);
};
