import {
  ArrowLeftCircleIcon,
  Button,
  Dropdown,
  EditIconTwo,
  RotateCWIcon,
  SendIcon,
  Table,
  Theme,
  TrashIcon,
  Typography,
  TableHead,
  Badge,
} from 'client-library';
import {useEffect, useMemo, useState} from 'react';
import {ProcurementsPlanModal} from '../../components/procurementsPlanModal/procurementsPlanModal';
import useGetPlansOverview from '../../services/graphql/plans/hooks/useGetPlans';
import useDeletePublicProcurementPlan from '../../services/graphql/plans/hooks/useDeletePublicProcurementPlan';
import useInsertPublicProcurementPlan from '../../services/graphql/plans/hooks/useInsertPublicProcurementPlan';
import useInsertPublicProcurementPlanItem from '../../services/graphql/procurements/hooks/useInsertPublicProcurementPlanItem';
import {NotificationsModal} from '../../shared/notifications/notificationsModal';
import ScreenWrapper from '../../shared/screenWrapper';
import {PlanItem} from '../../types/graphql/getPlansTypes';
import {ScreenProps} from '../../types/screen-props';
import {parseDate, parseDateForBackend} from '../../utils/dateUtils';
import {TypeForPP, YearList, getPlanStatuses} from './constants';
import {
  ButtonWrapper,
  Container,
  CustomDivider,
  DropdownsWrapper,
  MainTitle,
  StatusTextWrapper,
  TableHeader,
  YearWrapper,
} from './styles';
import useProcurementArticleInsert from '../../services/graphql/procurementArticles/useProcurementArticleInsert';
import {UserPermission, UserRole, checkPermission} from '../../constants';

export const PublicProcurementsMainPage: React.FC<ScreenProps> = ({context}) => {
  const [selectedItemId, setSelectedItemId] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showRevertModal, setShowRevertModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const role = context?.contextMain?.role_id; // Get the role from context
  const planStatuses = getPlanStatuses(role);
  const canCreatePlan = checkPermission(role, UserPermission.CREATE_PLANS);

  const tableHeads: TableHead[] = [
    {title: 'ID', accessor: 'id', type: 'text'},
    {title: 'Godina', accessor: 'year', type: 'text'},
    {
      title: 'Vrsta',
      accessor: 'is_pre_budget',
      type: 'custom',
      renderContents: (is_pre_budget: any) => {
        return <Typography variant="bodyMedium" content={is_pre_budget ? 'Predbudžetsko' : 'Postbudžetsko'} />;
      },
    },
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
        const calculateTotalValue = (items: any[]) => {
          let totalValue = 0;
          items.forEach(item => {
            if (item && item.articles && item.articles.length > 0) {
              item.articles.forEach((article: {net_price: string; vat_percentage: string}) => {
                if (article && article.net_price) {
                  const price =
                    Number(article.net_price) + (Number(article.net_price) * Number(article.vat_percentage)) / 100;
                  if (!isNaN(price)) {
                    totalValue += price;
                  }
                }
              });
            }
          });

          return totalValue.toFixed(2);
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
      type: 'custom',
      shouldRender: checkPermission(role, UserPermission.VIEW_PLAN_REQUESTS),
    },
    {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
  ];
  const [form, setForm] = useState<any>({
    status: '',
    year: {id: '', title: 'Odaberite godinu'},
    page: 1,
    size: 100,
    is_pre_budget: {id: null, title: 'Odaberite vrstu'},
  });

  const {data: tableData, refetchData} = useGetPlansOverview({
    ...form,
    is_pre_budget: form?.is_pre_budget?.id,
    year: form?.year?.id,
    status: form?.status?.id,
  });

  const {mutate: deletePlan} = useDeletePublicProcurementPlan();
  const {mutate: insertProcurement} = useInsertPublicProcurementPlanItem();
  const {mutate: insertPlan} = useInsertPublicProcurementPlan();
  const {mutate: addArticle} = useProcurementArticleInsert();

  const initialValuesDropdownData = useMemo(() => {
    const filteredData =
      tableData
        ?.filter(data => {
          return data.is_pre_budget && (data.status === 'Zaključen' || data.status === 'Objavljen');
        })
        .map(item => {
          return {
            id: item.id,
            title: item.title,
          };
        }) || [];

    filteredData.unshift({id: 0, title: 'None'});
    return filteredData;
  }, [tableData]);
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

    try {
      const payload = {
        id: selectedItem.id,
        title: selectedItem.title,
        active: selectedItem.active,
        date_of_closing: selectedItem.date_of_closing,
        date_of_publishing: parseDateForBackend(new Date()) as string,
        year: selectedItem.year.toString(),
        is_pre_budget: selectedItem.is_pre_budget,
        pre_budget_id: selectedItem.pre_budget_plan.id,
        serial_number: selectedItem.serial_number,
      };
      insertPlan(payload, () => {
        refetchData();
        context.alert.success('Uspješno ste poslali plan organizacionim jedinicama na pregled.');
        setShowShareModal(false);
      });
    } catch (e) {
      console.log(e);
    }
  };

  const handleRevert = async () => {
    if (!selectedItem) return;

    try {
      const payload = {
        id: selectedItem.id,
        title: selectedItem.title,
        active: selectedItem.active,
        date_of_closing: selectedItem?.date_of_closing,
        date_of_publishing: undefined,
        year: selectedItem.year.toString(),
        is_pre_budget: selectedItem.is_pre_budget,
        pre_budget_id: selectedItem.pre_budget_plan.id,
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

  const handleCloseConvertModal = () => {
    setShowConfirmationModal(false);
    setSelectedItemId(0);
  };
  const handleCloseShareModal = () => {
    setShowShareModal(false);
    setSelectedItemId(0);
  };

  const handleConvertIconClick = (id: number) => {
    setSelectedItemId(id);
    setShowConfirmationModal(true);
  };
  const handleCloseRevertModal = () => {
    setShowRevertModal(false);
    setSelectedItemId(0);
  };

  const handleRevertIconClick = (id: number) => {
    setSelectedItemId(id);
    setShowRevertModal(true);
  };

  const handleConvert = async () => {
    try {
      const payload = {
        ...selectedItem,
        id: 0,
        year: selectedItem?.year,
        is_pre_budget: false,
        title: 'Postbudzetski' + '-' + 'Plan za ' + selectedItem?.year,
        pre_budget_id: selectedItem?.id,
        date_of_publishing: '',
        date_of_closing: '',
      };

      insertPlan(payload as any, async planID => {
        if (selectedItem) {
          for (const item of selectedItem.items) {
            const insertItem = {
              id: 0,
              budget_indent_id: item.budget_indent.id,
              plan_id: planID,
              is_open_procurement: item.is_open_procurement,
              title: item.title,
              article_type: item.article_type,
              status: item.status,
              file_id: item.file_id,
              date_of_awarding: '',
              date_of_publishing: '',
            };
            await insertProcurement(insertItem as any, async procurementID => {
              for (const article of item.articles) {
                const insertArticle = {
                  id: 0,
                  budget_indent_id: article?.budget_indent?.id ?? 0,
                  public_procurement_id: procurementID,
                  title: article?.title,
                  description: article?.description,
                  net_price: article?.net_price,
                  vat_percentage: article?.vat_percentage,
                };
                await addArticle(insertArticle as any);
              }
            });
          }
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
    <ScreenWrapper context={context}>
      <Container>
        <MainTitle content="LISTA SVIH PLANOVA JAVNIH NABAVKI" variant="bodyMedium" />
        <CustomDivider />
        <TableHeader>
          <DropdownsWrapper>
            <YearWrapper>
              <Dropdown
                label={<Typography variant="bodySmall" content="GODINA:" />}
                options={YearList as any}
                name="year"
                value={form?.year || null}
                onChange={handleChange}
                placeholder="Odaberite godinu"
              />
            </YearWrapper>
            <YearWrapper>
              <Dropdown
                label={<Typography variant="bodySmall" content="VRSTA:" />}
                options={TypeForPP as any}
                name="is_pre_budget"
                value={form?.is_pre_budget || null}
                onChange={handleChange as any}
              />
            </YearWrapper>
            <YearWrapper>
              <Dropdown
                label={<Typography variant="bodySmall" content="STATUS:" />}
                options={planStatuses}
                name="status"
                value={form?.status || null}
                onChange={handleChange as any}
                placeholder="Odaberite status"
              />
            </YearWrapper>
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
            data={tableData || []}
            onRowClick={row => {
              context.navigation.navigate(`/procurements/plans/${row.id.toString()}`);
              context.breadcrumbs.add({
                name: `Plan Za ${row?.year} - ${row?.is_pre_budget ? 'PREDBUDŽETSKO' : 'POSTBUDŽETSKO'}`,
                to: `/procurements/plans/${row.id.toString()}`,
              });
            }}
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
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
                onClick: (item: any) => handleConvertIconClick(item.id),
                icon: <RotateCWIcon stroke={Theme?.palette?.gray800} />,
                shouldRender: (item: any) => item.is_pre_budget === true && item.status === 'Zaključen',
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
            dropdownData={initialValuesDropdownData}
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
      </Container>
    </ScreenWrapper>
  );
};
