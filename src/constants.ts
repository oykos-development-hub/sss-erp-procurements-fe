import {DropdownDataNumber} from './types/dropdownData';

export enum UserRole {
  ADMIN = 1,
  MANAGER_OJ = 2,
  OFFICIAL_FOR_PUBLIC_PROCUREMENTS = 3,
}

export enum UserPermission {
  VIEW_PLANS = 'VIEW_PLANS',
  VIEW_PLANS_REQUESTS = 'VIEW_PLANS_REQUESTS',
  FILL_PLANS = 'FILL_PLANS',
  CREATE_PLANS = 'CREATE_PLANS',
  SEND_PROCUREMENTS = 'SEND_PROCUREMENTS',
  CREATE_PROCUREMENT = 'CREATE_PROCUREMENT',
  VIEW_PROCUREMENT_REQUESTS = 'VIEW_PROCUREMENT_REQUESTS',
}

const rolePermissionsMap = {
  [UserRole.ADMIN]: [
    UserPermission.VIEW_PLANS,
    UserPermission.FILL_PLANS,
    UserPermission.CREATE_PLANS,
    UserPermission.SEND_PROCUREMENTS,
    UserPermission.VIEW_PLANS_REQUESTS,
    UserPermission.CREATE_PROCUREMENT,
    UserPermission.VIEW_PROCUREMENT_REQUESTS,
  ],
  [UserRole.OFFICIAL_FOR_PUBLIC_PROCUREMENTS]: [
    UserPermission.VIEW_PLANS,
    UserPermission.FILL_PLANS,
    UserPermission.CREATE_PLANS,
    UserPermission.VIEW_PLANS_REQUESTS,
    UserPermission.CREATE_PROCUREMENT,
    UserPermission.VIEW_PROCUREMENT_REQUESTS,
  ],
  [UserRole.MANAGER_OJ]: [UserPermission.VIEW_PLANS, UserPermission.FILL_PLANS, UserPermission.SEND_PROCUREMENTS],
};

export const checkPermission = (role: UserRole, permission: UserPermission) => {
  return rolePermissionsMap[role]?.includes(permission) || false;
};

export const pdvOptions: DropdownDataNumber[] = [
  {id: 0, title: '0 %'},
  {id: 7, title: '7 %'},
  {id: 21, title: '21 %'},
];

export const dropdownProcurementTypeOptions: DropdownDataNumber[] = [
  {id: 1, title: 'Otvoreni postupak'},
  {id: 2, title: 'Jednostavna nabavka'},
];

export const dropdownBudgetIndentOptions: DropdownDataNumber[] = [
  {
    id: 1,
    title: 'indent 1',
  },
  {
    id: 2,
    title: 'indent 12',
  },
  {
    id: 3,
    title: 'indent 2',
  },
  {
    id: 4,
    title: 'indent 21',
  },
];

export const dropdownArticleTypeOptions: DropdownDataNumber[] = [
  {id: 1, title: 'Roba'},
  {id: 2, title: 'Usluga'},
  {id: 3, title: 'Radovi'},
];

export const dropdownProcurementStatusOptions: DropdownDataNumber[] = [
  {id: 1, title: 'Na čekanju'},
  {id: 2, title: 'Odobreno'},
  {id: 3, title: 'Odbijeno'},
];
