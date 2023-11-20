import {ReactNode} from 'react';
import {UserRole} from '../../constants';
import {DropdownDataString} from '../../types/dropdownData';

export interface ValueType {
  id: number | string | boolean;
  title: ReactNode;
}

export const TypeForPP = [
  {id: true, title: 'Predbudžetsko'},
  {id: false, title: 'Postbudžetsko'},
  {id: null, title: 'Sve'},
];

export const PlanStatusesForAdmin: any[] = [
  {id: undefined, title: 'Sve'},
  {id: 'U toku', title: 'U toku'},
  {id: 'Poslat', title: 'Poslat'},
  {id: 'Zaključen', title: 'Zaključen'},
  {id: 'Konvertovan', title: 'Konvertovan'},
  {id: 'Objavljen', title: 'Objavljen'},
];

export const PlanStatusesForManager: any[] = [
  {id: undefined, title: 'Sve'},
  {id: 'Obradi', title: 'Obradi'},
  {id: 'Na čekanju', title: 'Na čekanju'},
  {id: 'Odobren', title: 'Odobren'},
  {id: 'Odbijen', title: 'Odbijen'},
  {id: 'Zaključen', title: 'Zaključen'},
  {id: 'Objavljen', title: 'Objavljen'},
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
