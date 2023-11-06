import {Badge, TableHead, Typography} from 'client-library';
import {InlineText} from '../../shared/styles';
import {parseDate} from '../../utils/dateUtils';
import {StatusTextWrapper} from '../publicProcurement/styles';
import {UserRole} from '../../constants';
import {
  ProcurementItem,
  ProcurementItemForOrganizationUnit,
  isProcurementFinished,
} from '../../types/graphql/publicProcurementPlanItemDetailsTypes';
import {
  PublicProcurementArticle,
  PublicProcurementArticleWithAmount,
} from '../../types/graphql/publicProcurementArticlesTypes';
import {DropdownDataBudgetIndent} from '../../types/dropdownData';
import {RequestAmountType, RequestStatus} from './types';

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
    renderContents: (title: string) => {
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
    renderContents: (date_of_publishing: string) => {
      return <Typography variant="bodyMedium" content={parseDate(date_of_publishing)} />;
    },
  },
  {
    title: 'Ukupna vrijednost',
    accessor: 'amount',
    type: 'custom',
    renderContents: (amount: RequestAmountType) => {
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
    renderContents: (status: RequestStatus) => {
      const variant =
        status === RequestStatus.Approved ? 'success' : status === RequestStatus.Rejected ? 'warning' : 'primary';
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
    renderContents: (item: ProcurementItemForOrganizationUnit) => item.serial_number,
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
    renderContents: (articles: PublicProcurementArticleWithAmount[]) => {
      const totalPrice =
        articles.reduce((sum, article) => {
          const price = (article.public_procurement_article.net_price || 0) * article.amount;
          return sum + price;
        }, 0) || 0;
      return <Typography variant="bodyMedium" content={`${totalPrice.toFixed(2)} €`} />;
    },
  },
  {
    title: 'PDV',
    accessor: 'pdv',
    type: 'custom',
    renderContents: (_, row: ProcurementItemForOrganizationUnit) => {
      const totalPdv =
        row.articles.reduce((sum, article) => {
          const pdv =
            ((article.public_procurement_article.net_price || 0) * article.public_procurement_article.vat_percentage) /
            100;
          const total = pdv * article.amount;
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
    renderContents: (item: boolean) => {
      return item === true ? 'Otvoreni postupak' : 'Jednostavna nabavka';
    },
  },

  {
    title: 'Datum objavljivanja',
    accessor: 'date_of_publishing',
    renderContents: (date: string) => {
      return <Typography variant="bodyMedium" content={date ? parseDate(date) : ''} />;
    },
  },
  {
    title: '',
    accessor: 'TABLE_ACTIONS',
    type: 'tableActions',
  },
];

export const getTableHeadsPlanDetails = (role: number): TableHead[] => [
  {
    title: 'Konto',
    accessor: 'budget_indent',
    type: 'custom',
    renderContents: (item: DropdownDataBudgetIndent) => item.serial_number,
  },
  {
    title: 'Naziv konta',
    accessor: 'budget_indent',
    type: 'custom',
    renderContents: (item: DropdownDataBudgetIndent) => item.title,
  },
  {
    title: 'Opis javne nabavke',
    accessor: 'title',
    type: 'text',
  },
  {
    title: 'Vrsta',
    accessor: 'article_type',
    type: 'text',
  },
  {
    title: 'Tip postupka',
    accessor: 'is_open_procurement',
    type: 'custom',
    renderContents: (item: boolean) => {
      return item === true ? 'Otvoreni postupak' : 'Jednostavna nabavka';
    },
  },
  {
    title: 'Vrijednost neto',
    accessor: 'articles',
    type: 'custom',
    shouldRender: role !== UserRole.MANAGER_OJ,
    renderContents: (articles: PublicProcurementArticle[], row: ProcurementItem) => {
      if (!isProcurementFinished(row.status)) return 0;
      const totalPrice =
        articles.reduce((sum, article) => {
          const price = (article?.amount ? (article.net_price || 0) * article?.amount : article.net_price) || 0;
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
    shouldRender: role !== UserRole.MANAGER_OJ,
    renderContents: (articles: PublicProcurementArticle[], row: ProcurementItem) => {
      if (!isProcurementFinished(row.status)) return 0;
      const totalPdv =
        articles?.reduce((sum, article) => {
          if (!isProcurementFinished(row.status)) return 0;
          const pdv = article?.amount
            ? ((article.net_price || 0) * article.vat_percentage * article?.amount) / 100
            : ((article.net_price || 0) * article.vat_percentage) / 100;
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
    shouldRender: role !== UserRole.MANAGER_OJ,
    renderContents: (_, row: ProcurementItem) => {
      if (!isProcurementFinished(row.status)) return 0;
      const totalPdv =
        row?.articles?.reduce((sum, article) => {
          const pdv = article?.amount
            ? ((article.net_price || 0) * article.vat_percentage * article?.amount) / 100
            : ((article.net_price || 0) * article.vat_percentage) / 100;
          return sum + pdv;
        }, 0) || 0;
      const totalNet =
        row.articles?.reduce(
          (sum, article) =>
            article?.amount ? sum + (article.net_price || 0) * article?.amount : sum + (article.net_price || 0),
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
    title: 'Datum objavljivanja',
    accessor: 'date_of_publishing',
    renderContents: (date: string) => {
      return <Typography variant="bodyMedium" content={date ? parseDate(date) : ''} />;
    },
  },
  {
    title: 'Status',
    accessor: 'status',
    type: 'custom',
    renderContents: (status: string) => {
      return (
        <StatusTextWrapper>
          <Badge content={<Typography content={status} variant="bodySmall" />} variant="primary" />
        </StatusTextWrapper>
      );
    },
  },
  {
    title: '',
    accessor: 'TABLE_ACTIONS',
    type: 'tableActions',
  },
];
