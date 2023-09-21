export const MICRO_SERVICE_SLUG = 'procurements';

export enum REQUEST_STATUSES {
  success = 'success',
  error = 'error',
  // define other statuses here
}

export const BFF_URL = {
  local: 'http://localhost:8080',
  development: 'https://sss-erp-bff.oykos.me',
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
  return allYears.map(year => ({id: year, title: year.toString()}));
};
