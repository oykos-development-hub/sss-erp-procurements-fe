import {DropdownDataNumber} from '../../types/dropdownData';
import {parseDate} from '../../utils/dateUtils';
import {TableHead, Typography, Theme} from 'client-library';
import {numberToPriceString} from '../../utils/stringUtils';
import {ContractStatus, Status} from './styles';

export const dashboardContractsTableHeads: TableHead[] = [
  {
    title: 'Dana do isteka',
    accessor: 'days_until_expiry',
    type: 'custom',
    renderContents: (days_until_expiry: number) => {
      const color =
        days_until_expiry <= 30
          ? Theme.palette.error700
          : days_until_expiry > 0 && days_until_expiry < 30
          ? Theme.palette.warning500
          : Theme.palette.warning100;
      return (
        <ContractStatus>
          <Status color={color} />
          <Typography variant="bodySmall" content={days_until_expiry} />
        </ContractStatus>
      );
    },
  },
  {
    title: 'Datum završetka',
    accessor: 'date_of_expiry',
    type: 'custom',
    renderContents: (date_of_expiry: string) => {
      return <Typography variant="bodySmall" content={date_of_expiry ? parseDate(date_of_expiry) : ''} />;
    },
  },
  {
    title: 'Dobavljač',
    accessor: 'supplier',
    type: 'custom',
    renderContents: (supplier: DropdownDataNumber) => {
      return <Typography variant="bodySmall" content={supplier.title} />;
    },
  },
  {
    title: 'Ukupno',
    accessor: 'gross_value',
    type: 'custom',
    renderContents: gross_value => {
      return <Typography variant="bodySmall" content={numberToPriceString(gross_value)} />;
    },
  },
  {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
];
