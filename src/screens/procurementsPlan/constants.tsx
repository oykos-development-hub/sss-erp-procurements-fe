import {Badge, TableHead, Typography} from 'client-library';
import {InlineText} from '../../shared/styles';
import {parseDate} from '../../utils/dateUtils';
import {StatusTextWrapper} from '../publicProcurement/styles';

export const tableHeadsRequests: TableHead[] = [
  {
    title: 'Organizaciona jedinica',
    accessor: 'organization_unit',
    type: 'text',
  },
  {
    title: 'Godina',
    accessor: 'year',
    type: 'text',
  },
  {
    title: 'Naslov',
    accessor: 'title',
    type: 'custom',
    renderContents: (title: any) => {
      return (
        <InlineText>
          <Typography variant="bodyMedium" content={title} />
        </InlineText>
      );
    },
  },
  {
    title: 'Datum kreiranja',
    accessor: 'date_of_publishing',
    type: 'custom',
    renderContents: (date_of_publishing: any) => {
      return <Typography variant="bodyMedium" content={parseDate(date_of_publishing)} />;
    },
  },
  {
    title: 'Ukupna vrijednost',
    accessor: 'amount',
    type: 'custom',
    renderContents: (amount: any) => {
      return <Typography variant="bodyMedium" content={`${amount?.totalPrice.toFixed(2)} €`} />;
    },
  },
  {
    title: 'Posljednja izmjena',
    accessor: 'updated_at',
    type: 'text',
  },
  {
    title: 'Status',
    accessor: 'status',
    type: 'custom',
    renderContents: (status: any) => {
      const variant = status === 'Odobreno' ? 'success' : status === 'Odbijeno' ? 'warning' : 'primary';
      return (
        <StatusTextWrapper>
          <Badge content={<Typography content={status} variant="bodySmall" />} variant={variant} />
        </StatusTextWrapper>
      );
    },
  },
];

export const tableHeadsOrganizationUnitProcurements: TableHead[] = [
  {
    title: 'Vrsta',
    accessor: 'article_type',
    type: 'text',
  },
  {
    title: 'Konto',
    accessor: 'budget_indent',
    type: 'custom',
    renderContents: (item: any) => item.serial_number,
  },
  {
    title: 'Naziv javne nabavke',
    accessor: 'title',
    type: 'text',
  },
  {
    title: 'Vrijednost neto',
    accessor: 'articles',
    type: 'custom',
    renderContents: (articles: any) => {
      const totalPrice =
        (articles &&
          articles?.reduce((sum: any, article: any) => {
            const price = parseFloat(article?.public_procurement_article?.net_price) * article?.amount;
            return sum + price;
          }, 0)) ||
        0;
      return <Typography variant="bodyMedium" content={`${totalPrice.toFixed(2)} €`} />;
    },
  },
  {
    title: 'PDV',
    accessor: 'pdv',
    type: 'custom',
    renderContents: (_, row: any) => {
      const totalPdv =
        row?.articles?.reduce((sum: any, article: any) => {
          const pdv =
            (parseFloat(article?.public_procurement_article?.net_price) *
              parseFloat(article?.public_procurement_article?.vat_percentage)) /
            100;
          const total = pdv * article?.amount;
          return sum + total;
        }, 0) || 0;
      return <Typography variant="bodyMedium" content={`${totalPdv.toFixed(2)} €`} />;
    },
  },
  {
    title: 'Ukupno',
    accessor: 'total',
    type: 'custom',
    renderContents: (_, row: any) => {
      const totalPdv =
        row?.articles?.reduce((sum: any, article: any) => {
          const pdv =
            (parseFloat(article?.public_procurement_article?.net_price) *
              parseFloat(article?.public_procurement_article?.vat_percentage)) /
            100;
          const total = pdv * article?.amount;
          return sum + total;
        }, 0) || 0;
      const totalNet =
        row.articles?.reduce((sum: any, article: any) => {
          const price = parseFloat(article?.public_procurement_article?.net_price) * article?.amount;
          return sum + price;
        }, 0) || 0;

      const total = totalNet + totalPdv;

      return <Typography variant="bodyMedium" content={`${total.toFixed(2)} €`} />;
    },
  },
  {
    title: 'Tip postupka',
    accessor: 'is_open_procurement',
    type: 'custom',
    renderContents: (item: any) => {
      return item === true ? 'Otvoreni postupak' : 'Jednostavna nabavka';
    },
  },

  {
    title: 'Datum objavljivanja',
    accessor: 'date_of_publishing',
    renderContents: (date: any) => {
      return <Typography variant="bodyMedium" content={date ? parseDate(date) : ''} />;
    },
  },
  {
    title: '',
    accessor: 'TABLE_ACTIONS',
    type: 'tableActions',
  },
];
