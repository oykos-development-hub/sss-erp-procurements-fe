import {DropdownDataNumber} from './types/dropdownData';
import {Count} from './types/graphql/countType';

export const isEditProcurementAndPlanDisabled = (planStatus: string) =>
  planStatus === 'Poslat' || planStatus === 'Zaključen' || planStatus === 'Objavljen' || planStatus === 'Konvertovan';

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
    const dropdownTitle = `${item.serial_number} - ${item.title}`;

    return {
      id: item.id,
      title: dropdownTitle,
      original_title: item.title,
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
