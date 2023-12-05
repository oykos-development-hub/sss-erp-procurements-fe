import {
  ArrowLeftCircleIcon,
  Badge,
  Button,
  Dropdown,
  EditIconTwo,
  RotateCWIcon,
  SendIcon,
  Table,
  TableHead,
  Theme,
  TrashIcon,
  Typography,
} from 'client-library';
import {useEffect, useMemo, useState} from 'react';
import {ProcurementsPlanModal} from '../../components/procurementsPlanModal/procurementsPlanModal';

import {UserPermission, UserRole, checkPermission} from '../../constants';
import {yearsForDropdown} from '../../services/constants';
import useDeletePublicProcurementPlan from '../../services/graphql/plans/hooks/useDeletePublicProcurementPlan';
import useGetPlansOverview from '../../services/graphql/plans/hooks/useGetPlans';
import useInsertPublicProcurementPlan from '../../services/graphql/plans/hooks/useInsertPublicProcurementPlan';
import useProcurementArticleInsert from '../../services/graphql/procurementArticles/hooks/useProcurementArticleInsert';
import useInsertPublicProcurementPlanItem from '../../services/graphql/procurements/hooks/useInsertPublicProcurementPlanItem';
import {NotificationsModal} from '../../shared/notifications/notificationsModal';
import ScreenWrapper from '../../shared/screenWrapper';
import {PlanItem} from '../../types/graphql/getPlansTypes';
import {ScreenProps} from '../../types/screen-props';
import {parseDate, parseDateForBackend} from '../../utils/dateUtils';
import {getPlanStatuses} from './constants';
import {
  ButtonWrapper,
  Container,
  CustomDivider,
  DropdownsWrapper,
  Filters,
  MainTitle,
  StatusTextWrapper,
  TableHeader,
} from './styles';
import {ConvertModal} from '../../components/convertModal/convertModal';
import {
  ProcurementItem,
  ProcurementStatus,
  isProcurementFinished,
} from '../../types/graphql/publicProcurementPlanItemDetailsTypes';

export const PublicProcurementsMainPage: React.FC<ScreenProps> = ({context}) => {
  const [selectedItemId, setSelectedItemId] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showRevertModal, setShowRevertModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showConvertModal, setShowConvertModal] = useState(false);

  const role = context?.contextMain?.role_id; // Get the role from context
  const planStatuses = getPlanStatuses(role);
  const canCreatePlan = checkPermission(role, UserPermission.CREATE_PLANS);

  const tableHeads: TableHead[] = [
    {title: 'Godina', accessor: 'year', type: 'text'},
    {title: 'Naslov', accessor: 'title', type: 'text'},
    {
      title: 'Datum kreiranja',
      accessor: 'date_of_publishing',
      type: 'custom',
      renderContents: (date_of_publishing: any) => {
        return <Typography variant="bodyMedium" content={date_of_publishing ? parseDate(date_of_publishing) : ''} />;
      },
    },
    {
      title: 'Ukupna vrijednost',
      accessor: 'items',
      type: 'custom',
      renderContents: item => {
        const calculateTotalValue = (items: ProcurementItem[]) => {
          let totalValue = 0;
          items.forEach(item => {
            if (item && isProcurementFinished(item.status)) {
              item?.articles?.forEach(article => {
                if (article && article.net_price) {
                  const price =
                    (article.net_price + (article.net_price * Number(article.vat_percentage)) / 100) *
                    article.total_amount;
                  totalValue += price;
                }
              });
            }
          });

          return totalValue.toLocaleString('sr-RS', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });
        };

        const totalValue = calculateTotalValue(item);

        return <Typography variant="bodyMedium" content={`${totalValue} €`} />;
      },
    },

    {
      title: 'Posljednja izmjena',
      accessor: 'updated_at',
      type: 'custom',
      renderContents: (updated_at: any) => {
        return <Typography variant="bodyMedium" content={updated_at ? parseDate(updated_at) : ''} />;
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
      title: 'Zahtjevi',
      accessor: 'requests',
      type: 'text',
      shouldRender: checkPermission(role, UserPermission.VIEW_PLANS_REQUESTS),
    },
    {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
  ];
  const [form, setForm] = useState<any>({
    status: undefined,
    year: {id: '', title: 'Odaberite godinu'},
    page: 1,
    size: 1000,
    is_pre_budget: {id: null, title: 'Odaberite vrstu'},
  });

  const {
    data: tableData,
    refetchData,
    loading,
  } = useGetPlansOverview({
    ...form,
    is_pre_budget: form?.is_pre_budget?.id,
    year: form?.year?.id,
    status: form?.status?.id,
  });

  const {mutate: deletePlan} = useDeletePublicProcurementPlan();
  const {mutate: insertProcurement} = useInsertPublicProcurementPlanItem();
  const {mutate: insertPlan} = useInsertPublicProcurementPlan();
  const {mutate: addArticle} = useProcurementArticleInsert();

  const handleChange = (value: any, name: string) => {
    setForm((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const selectedItem = useMemo(() => {
    return tableData?.find((item: PlanItem) => item.id === selectedItemId);
  }, [selectedItemId]);

  const handleAdd = () => {
    setShowModal(true);
  };

  const handleEdit = (id: number) => {
    setSelectedItemId(id);
    setShowModal(true);
  };

  const handleShareIconClick = (id: number) => {
    setSelectedItemId(id);
    setShowShareModal(true);
  };

  const handleShare = async () => {
    if (!selectedItem) return;

    const payload = {
      id: selectedItem.id,
      title: selectedItem.title,
      date_of_closing: selectedItem.date_of_closing,
      date_of_publishing: parseDateForBackend(new Date()),
      year: selectedItem.year.toString(),
      is_pre_budget: selectedItem.is_pre_budget,
      pre_budget_id: selectedItem.pre_budget_plan?.id || undefined,
      serial_number: selectedItem.serial_number,
    };

    insertPlan(payload, () => {
      refetchData();
      context.alert.success('Uspješno ste poslali plan organizacionim jedinicama na pregled.');
      setShowShareModal(false);
    });
  };

  const handleRevert = async () => {
    if (!selectedItem) return;

    try {
      const payload = {
        id: selectedItem.id,
        title: selectedItem.title,
        date_of_closing: selectedItem?.date_of_closing,
        date_of_publishing: undefined,
        year: selectedItem.year.toString(),
        is_pre_budget: selectedItem.is_pre_budget,
        pre_budget_id: selectedItem.pre_budget_plan?.id || undefined,
        serial_number: selectedItem.serial_number,
      };

      insertPlan(payload, () => {
        refetchData();
        context.alert.success('Organizacione jedinice vise ne mogu vidjeti ovaj plan.');
        setShowRevertModal(false);
      });
    } catch (e) {
      console.log(e);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedItemId(0);
  };

  const handleDeleteIconClick = (id: number) => {
    setSelectedItemId(id);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedItemId(0);
  };

  const handleConvertModal = (id: number) => {
    setShowConvertModal(true);
    setSelectedItemId(id);
  };

  const handleCloseConvertModal = () => {
    setShowConvertModal(false);
    setShowConfirmationModal(false);
    setSelectedItemId(0);
  };
  const handleCloseShareModal = () => {
    setShowShareModal(false);
    setSelectedItemId(0);
  };

  const handleCloseRevertModal = () => {
    setShowRevertModal(false);
    setSelectedItemId(0);
  };

  const handleRevertIconClick = (id: number) => {
    setSelectedItemId(id);
    setShowRevertModal(true);
  };

  const handleConvert = async (year?: any) => {
    if (!selectedItem) return;

    try {
      const payload = {
        id: undefined,
        year: year,
        is_pre_budget: false,
        title: 'Plan za ' + year,
        pre_budget_id: selectedItem?.id,
        date_of_publishing: undefined,
        date_of_closing: undefined,
        file_id: selectedItem.file_id,
        serial_number: selectedItem.serial_number,
      };

      insertPlan(payload, async planID => {
        for (const item of selectedItem.items) {
          const insertItem = {
            budget_indent_id: item.budget_indent.id,
            plan_id: planID,
            is_open_procurement: item.is_open_procurement,
            title: item.title,
            article_type: item.article_type,
            status: item.status,
            file_id: item.file_id,
          };
          await insertProcurement(insertItem, async procurement => {
            for (const article of item.articles) {
              const insertArticle = {
                budget_indent_id: article?.budget_indent?.id,
                public_procurement_id: procurement.id,
                title: article?.title,
                description: article?.description,
                net_price: article?.net_price,
                vat_percentage: article?.vat_percentage,
                visibility_type: article.visibility_type,
              };
              await addArticle(insertArticle);
            }
          });
        }
        refetchData();
        context.alert.success('Uspješno ste konvertovali plan.');
        setShowConfirmationModal(false);
        context.navigation.navigate(`/procurements/plans/${planID}`);
      });
    } catch (e) {
      console.log(e);
    }
  };

  const availableYearsForPlan = useMemo(() => {
    const years = yearsForDropdown(8, false, 2);

    const existingPlanYears = tableData?.map(plan => plan.year) || [];
    const filteredYears = years.filter(year => !existingPlanYears.includes(year.id));

    return filteredYears;
  }, [tableData]);

  const handleDelete = () => {
    if (showDeleteModal) {
      deletePlan(
        selectedItemId,
        () => {
          setShowDeleteModal(false);
          refetchData();
          context.alert.success('Uspješno ste obrisali plan.');
        },
        () => {
          setShowDeleteModal(false);
          context.alert.success('Došlo je do greške pri brisanju plana.');
        },
      );
    }
    setSelectedItemId(0);
  };

  useEffect(() => {
    refetchData();
  }, [form]);

  return (
    <ScreenWrapper>
      <Container>
        <MainTitle content="LISTA SVIH PLANOVA JAVNIH NABAVKI" variant="bodyMedium" />
        <CustomDivider />
        <TableHeader>
          <DropdownsWrapper>
            <Filters>
              <Dropdown
                label={<Typography variant="bodySmall" content="GODINA:" />}
                options={yearsForDropdown(8, true, 2)}
                name="year"
                value={form?.year || null}
                onChange={handleChange}
                placeholder="Odaberite godinu"
              />
            </Filters>
            <Filters>
              <Dropdown
                label={<Typography variant="bodySmall" content="STATUS:" />}
                options={planStatuses}
                name="status"
                value={form?.status || null}
                onChange={handleChange as any}
                placeholder="Odaberite status"
              />
            </Filters>
          </DropdownsWrapper>
          {canCreatePlan && (
            <ButtonWrapper>
              <Button
                variant="secondary"
                content={<Typography variant="bodyMedium" content="Novi plan" />}
                onClick={handleAdd}
              />
            </ButtonWrapper>
          )}
        </TableHeader>

        <div>
          <Table
            tableHeads={
              role === UserRole.ADMIN || role === UserRole.OFFICIAL_FOR_PUBLIC_PROCUREMENTS
                ? tableHeads
                : tableHeads.filter(item => item?.accessor !== 'TABLE_ACTIONS')
            }
            isLoading={loading}
            data={tableData || []}
            onRowClick={row => {
              context.navigation.navigate(`/procurements/plans/${row.id.toString()}`);
              context.breadcrumbs.add({
                name: `Plan Za ${row?.year} - ${row?.is_pre_budget ? 'PREDBUDŽETSKO' : 'POSTBUDŽETSKO'}`,
                to: `/procurements/plans/${row.id.toString()}`,
              });
            }}
            tableActions={[
              {
                name: 'Izmeni',
                onClick: (item: PlanItem) => {
                  handleEdit(item.id);
                },
                icon: <EditIconTwo stroke={Theme?.palette?.gray800} />,
                shouldRender: (item: any) => item.is_pre_budget === true && item.status === 'U toku',
              },
              {
                name: 'Obriši',
                onClick: (item: any) => handleDeleteIconClick(item.id),
                icon: <TrashIcon stroke={Theme?.palette?.gray800} />,
                shouldRender: (item: any) => item.status == 'U toku',
              },
              {
                name: 'Podijeli',
                onClick: (item: any) => handleShareIconClick(item.id),
                icon: <SendIcon stroke={Theme?.palette?.gray800} />,
                shouldRender: (item: any) => !item.date_of_publishing,
              },
              {
                name: 'Konvertuj',
                onClick: (item: any) => handleConvertModal(item.id),
                icon: <RotateCWIcon stroke={Theme?.palette?.gray800} />,
                shouldRender: (item: any) => item.status === 'Objavljen' && role !== UserRole.MANAGER_OJ,
              },
              {
                name: 'Vrati',
                onClick: (item: any) => handleRevertIconClick(item.id),
                icon: <ArrowLeftCircleIcon stroke={Theme?.palette?.gray800} />,
                shouldRender: (item: any) => item.status === 'Poslat',
              },
            ]}></Table>
        </div>
        {showModal && (
          <ProcurementsPlanModal
            alert={context.alert}
            fetch={refetchData}
            open={showModal}
            onClose={closeModal}
            selectedItem={selectedItem}
            availableYearsForPlan={availableYearsForPlan}
            navigate={context.navigation.navigate}
          />
        )}
        <NotificationsModal
          open={!!showDeleteModal}
          onClose={handleCloseDeleteModal}
          handleLeftButtomClick={handleDelete}
          subTitle={'Ovaj fajl ce biti trajno izbrisan iz sistema'}
        />

        <NotificationsModal
          open={!!showShareModal}
          onClose={handleCloseShareModal}
          handleLeftButtomClick={handleShare}
          subTitle={'Ovaj fajl ce biti poslat organizacionim jedinicama na pregled.'}
        />
        <NotificationsModal
          open={!!showConfirmationModal}
          onClose={handleCloseConvertModal}
          handleLeftButtomClick={handleConvert}
          subTitle={'Plan će biti konvertovan iz predbudžetskog u postbudžetski.'}
        />
        <NotificationsModal
          open={!!showRevertModal}
          onClose={handleCloseRevertModal}
          handleLeftButtomClick={handleRevert}
          subTitle={'Plan će biti povučen iz pregleda organizacionih jedinica.'}
        />
        <ConvertModal
          open={!!showConvertModal}
          availableYearsForPlan={availableYearsForPlan}
          onClose={handleCloseConvertModal}
          handleConvert={(year: any) => handleConvert(year)}
        />
      </Container>
    </ScreenWrapper>
  );
};
