import {DropdownDataNumber, DropdownDataString} from './types/dropdownData';
import {Count} from './types/graphql/countType';

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
  EDIT_PROCUREMENTS = 'EDIT_PROCUREMENTS',
}

export const isEditProcurementAndPlanDisabled = (planStatus: string) =>
  planStatus === 'Poslat' || planStatus === 'Zaključen' || planStatus === 'Objavljen' || planStatus === 'Konvertovan';

const rolePermissionsMap = {
  [UserRole.ADMIN]: [
    UserPermission.VIEW_PLANS,
    UserPermission.FILL_PLANS,
    UserPermission.CREATE_PLANS,
    UserPermission.SEND_PROCUREMENTS,
    UserPermission.VIEW_PLANS_REQUESTS,
    UserPermission.CREATE_PROCUREMENT,
    UserPermission.VIEW_PROCUREMENT_REQUESTS,
    UserPermission.EDIT_PROCUREMENTS,
  ],
  [UserRole.OFFICIAL_FOR_PUBLIC_PROCUREMENTS]: [
    UserPermission.VIEW_PLANS,
    UserPermission.FILL_PLANS,
    UserPermission.CREATE_PLANS,
    UserPermission.VIEW_PLANS_REQUESTS,
    UserPermission.CREATE_PROCUREMENT,
    UserPermission.VIEW_PROCUREMENT_REQUESTS,
    UserPermission.EDIT_PROCUREMENTS,
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

export function generateDropdownOptions(counts: Count[]) {
  return counts?.map(item => {
    return {
      id: item.id,
      title: item.serial_number,
      orginal_title: item.title,
    };
  });
}

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
