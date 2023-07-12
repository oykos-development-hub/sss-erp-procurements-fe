export const MICRO_SERVICE_SLUG = 'procurements';

export const REQUEST_STATUSES = {
  success: 'success',
  error: 'error',
};

export const BFF_URL = {
  development: 'http://localhost:8080',
  staging: 'http://localhost:8080',
  production: 'http://localhost:8080',
};

export const getYear = new Date().getFullYear();

export const yearsForDropdown = () => {
  const maxOffset = 10;
  const thisYear = new Date().getFullYear();
  const allYears = [];
  for (let x = 0; x <= maxOffset; x++) {
    allYears.push(thisYear - x);
  }
  return allYears.map(year => ({id: year.toString(), title: year.toString()}));
};
