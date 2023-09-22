import {ReactNode} from 'react';
import {DropdownDataNumber} from '../../types/dropdownData';
import {UserRole} from '../../constants';

export interface ValueType {
  id: number | string | boolean;
  title: ReactNode;
}

const getCurrentYear = () => {
  return new Date().getFullYear();
};

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

export const getPlanStatuses = (role: UserRole) => {
  switch (role) {
    case UserRole.ADMIN:
    case UserRole.OFFICIAL_FOR_PUBLIC_PROCUREMENTS:
      return PlanStatusesForAdmin;
    case UserRole.MANAGER_OJ:
      return PlanStatusesForManager;
    default:
      return []; // Default case, if role does not match any of the above
  }
};
