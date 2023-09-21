import {ReactNode} from 'react';
import {DropdownDataNumber} from '../../types/dropdownData';
import {parseDate} from '../../utils/dateUtils';
import {TableHead, Typography, Badge} from 'client-library';
import {StatusTextWrapper} from './styles';

export interface ValueType {
  id: number | string | boolean;
  title: ReactNode;
}

const getCurrentYear = () => {
  return new Date().getFullYear();
};

const getYearList = () => {
  const currentYear = getCurrentYear();
  const years = [];
  for (let i = currentYear - 5; i <= currentYear + 5; i++) {
    years.push(i.toString());
  }
  return years;
};

export const YearList = getYearList()
  .map(year => ({id: year, title: year}))
  .reverse();

export const TypeForPP = [
  {id: true, title: 'Predbudžetsko'},
  {id: false, title: 'Postbudžetsko'},
  {id: null, title: 'Sve'},
];

export const PlanStatusesForAdmin: DropdownDataNumber[] = [
  {id: 1, title: 'U toku'},
  {id: 2, title: 'Poslat'},
  {id: 3, title: 'Zaključen'},
  {id: 4, title: 'Konvertovan'},
  {id: 5, title: 'Objavljen'},
  {id: 6, title: 'Sve'},
];

export const PlanStatusesForManager: DropdownDataNumber[] = [
  {id: 1, title: 'Obradi'},
  {id: 2, title: 'Na čekanju'},
  {id: 3, title: 'Odobren'},
  {id: 4, title: 'Odbijen'},
  {id: 5, title: 'Zaključen'},
  {id: 5, title: 'Objavljen'},
  {id: 6, title: 'Sve'},
];
