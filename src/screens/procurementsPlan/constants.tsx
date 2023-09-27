import {TableHead, Typography, Badge} from 'client-library';
import {parseDate} from '../../utils/dateUtils';
import {StatusTextWrapper} from '../publicProcurement/styles';
import {InlineText} from '../../shared/styles';

export const tableHeads: TableHead[] = [
  {
    title: 'Br.',
    accessor: 'id',
    type: 'text',
  },
  {
    title: 'Vrsta',
    accessor: 'article_type',
    type: 'text',
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
        articles?.reduce((sum: any, article: any) => {
          const price = article?.amount
            ? parseFloat(article.net_price) * article?.amount
            : parseFloat(article.net_price);
          return sum + price;
        }, 0) || 0;
      return (
        <InlineText>
          <Typography variant="bodyMedium" content={`${totalPrice.toFixed(2)} €`} />
        </InlineText>
      );
    },
  },
  {
    title: 'PDV',
    accessor: 'articles',
    type: 'custom',
    renderContents: (articles: any) => {
      const totalPdv =
        articles?.reduce((sum: any, article: any) => {
          const pdv = article?.amount
            ? (parseFloat(article.net_price) * parseFloat(article.vat_percentage) * article?.amount) / 100
            : (parseFloat(article.net_price) * parseFloat(article.vat_percentage)) / 100;
          return sum + pdv;
        }, 0) || 0;
      return (
        <InlineText>
          <Typography variant="bodyMedium" content={`${totalPdv.toFixed(2)} €`} />
        </InlineText>
      );
    },
  },
  {
    title: 'Ukupno',
    accessor: '',
    type: 'custom',
    renderContents: (_, row: any) => {
      const totalPdv =
        row?.articles?.reduce((sum: any, article: any) => {
          const pdv = article?.amount
            ? (parseFloat(article.net_price) * parseFloat(article.vat_percentage) * article?.amount) / 100
            : (parseFloat(article.net_price) * parseFloat(article.vat_percentage)) / 100;
          return sum + pdv;
        }, 0) || 0;
      const totalNet =
        row.articles?.reduce(
          (sum: any, article: any) =>
            article?.amount
              ? sum + parseFloat(article.net_price) * article?.amount
              : sum + parseFloat(article.net_price),
          0,
        ) || 0;
      const total = totalNet + totalPdv;
      return (
        <InlineText>
          <Typography variant="bodyMedium" content={`${total.toFixed(2)} €`} />
        </InlineText>
      );
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
    title: 'Konto',
    accessor: 'budget_indent',
    type: 'custom',
    renderContents: (item: any) => item.title,
  },
  {
    title: 'Datum objavljivanja',
    accessor: 'date_of_publishing',
    renderContents: (date: any) => {
      return <Typography variant="bodyMedium" content={date ? parseDate(date) : ''} />;
    },
  },
  // {
  //   title: 'Status',
  //   accessor: 'status',
  //   type: 'custom',
  //   renderContents: (status: any) => {
  //     return (
  //       <StatusTextWrapper>
  //         <Badge content={<Typography content={status} variant="bodySmall" />} variant="primary" />
  //       </StatusTextWrapper>
  //     );
  //   },
  // },
  {
    title: '',
    accessor: 'TABLE_ACTIONS',
    type: 'tableActions',
  },
];

export const tableHeadsRequests: TableHead[] = [
  {
    title: 'ID',
    accessor: 'id',
    type: 'text',
  },
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
    title: 'Vrsta',
    accessor: 'is_pre_budget',
    type: 'custom',
    renderContents: (is_pre_budget: any) => {
      return <Typography variant="bodyMedium" content={is_pre_budget ? 'Predbudžetsko' : 'Postbudžetsko'} />;
    },
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
    type: 'text',
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
    title: 'Br.',
    accessor: 'id',
    type: 'text',
  },
  {
    title: 'Vrsta',
    accessor: 'article_type',
    type: 'text',
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
    title: 'Konto',
    accessor: 'budget_indent',
    type: 'custom',
    renderContents: (item: any) => item.title,
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
