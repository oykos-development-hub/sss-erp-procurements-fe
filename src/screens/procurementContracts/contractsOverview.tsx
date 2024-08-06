import React, {useEffect, useMemo, useState} from 'react';
import {Button, Table, Theme, TrashIcon, Typography, EditIconTwo} from 'client-library';
import {NotificationsModal} from '../../shared/notifications/notificationsModal';
import ScreenWrapper from '../../shared/screenWrapper';
import {ScreenProps} from '../../types/screen-props';
import {tableHeads} from './constants';
import {ButtonWrapper, Container, CustomDivider, MainTitle, TableHeader} from './styles';
import useProcurementContracts from '../../services/graphql/procurementContractsOverview/hooks/useProcurementContracts';
import {ProcurementContract} from '../../types/graphql/procurementContractsTypes';
import {ProcurementContractsFilters} from './filters/procurementContractsFilters';
import useGetSuppliers from '../../services/graphql/suppliers/hooks/useGetSuppliers';
import {ProcurementContractModal} from '../../components/procurementContractModal/procurementContractModal';
import useContractDelete from '../../services/graphql/procurementContractsOverview/hooks/useContractDelete';
import {checkActionRoutePermissions} from '../../services/checkRoutePermissions.ts';

export const ProcurementContractsMainPage: React.FC<ScreenProps> = ({context}) => {
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<any>({
    supplier_id: 0,
    id: undefined,
    procurement_id: undefined,
    year: undefined,
  });
  const createPermittedRoutes = checkActionRoutePermissions(context?.contextMain?.permissions, 'create');
  const createPermission = createPermittedRoutes.includes('/procurements/contracts');
  const updatePermittedRoutes = checkActionRoutePermissions(context?.contextMain?.permissions, 'update');
  const updatePermission = updatePermittedRoutes.includes('/procurements/contracts');
  const deletePermittedRoutes = checkActionRoutePermissions(context?.contextMain?.permissions, 'delete');
  const deletePermission = deletePermittedRoutes.includes('/procurements/contracts');

  const {data: tableData, refetchData, loading} = useProcurementContracts(filters);

  const filteredTableData = tableData?.filter(item => {
    const searchString = searchQuery.toLowerCase();
    const supplier = item?.supplier.title.toLowerCase();
    const serialNumber = item?.serial_number.toLowerCase();
    const procurementTitle = item?.public_procurement?.title?.toLowerCase();

    return (
      supplier.includes(searchString) || serialNumber.includes(searchString) || procurementTitle.includes(searchString)
    );
  });

  const {data: suppliers} = useGetSuppliers({id: 0, search: ''});

  const [selectedItemId, setSelectedItemId] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const {mutate: deleteContract} = useContractDelete();

  const selectedItem = useMemo(() => {
    return tableData?.find((item: ProcurementContract) => item.id === selectedItemId);
  }, [tableData, selectedItemId]);

  const handleAdd = () => {
    setShowModal(true);
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

  const handleDelete = () => {
    if (showDeleteModal) {
      deleteContract(
        selectedItemId,
        () => {
          setShowDeleteModal(false);
          refetchData();
          context.alert.success('Uspješno obrisano');
        },
        () => {
          setShowDeleteModal(false);
          context.alert.error('Došlo je do greške pri brisanju');
        },
      );
    }
    setSelectedItemId(0);
  };

  const handleSort = (column: string, direction: string) => {
    const sorter = `sort_by_${column}`;
    setFilters((prevState: any) => ({
      id: prevState.id,
      procurement_id: prevState.procurement_id,
      supplier_id: prevState.supplier_id,
      [sorter]: direction,
    }));
  };

  useEffect(() => {
    refetchData();
  }, [filters]);

  return (
    <ScreenWrapper>
      <Container>
        <MainTitle content="LISTA SVIH UGOVORA" variant="bodyMedium" />
        <CustomDivider />
        <TableHeader>
          <ProcurementContractsFilters
            suppliers={suppliers || []}
            setFilters={({supplier_id, year}) => {
              setFilters({
                ...filters,
                supplier_id,
                year,
              });
            }}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            context={context}
          />

          {createPermission && (
            <ButtonWrapper>
              <Button
                variant="secondary"
                content={<Typography variant="bodyMedium" content="Novi ugovor" />}
                onClick={handleAdd}
              />
            </ButtonWrapper>
          )}
        </TableHeader>

        <div>
          <Table
            tableHeads={tableHeads}
            data={filteredTableData || []}
            onSort={handleSort}
            isLoading={loading}
            onRowClick={row => {
              context.navigation.navigate(`/procurements/contracts/${row.id.toString()}/signed`);
              context.breadcrumbs.add({
                name: `Detalji zaključenog ugovora ${row?.serial_number} `,
                to: `/procurements/contracts/${row.id.toString()}/signed`,
              });
            }}
            tableActions={[
              {
                name: 'edit',
                onClick: (item: any) => context.navigation.navigate(`/procurements/contracts/${item.id.toString()}`),
                icon: <EditIconTwo stroke={Theme?.palette?.gray800} />,
                shouldRender: () => updatePermission,
              },
              {
                name: 'delete',
                onClick: (item: ProcurementContract) => handleDeleteIconClick(item.id),
                icon: <TrashIcon stroke={Theme?.palette?.gray800} />,
                shouldRender: () => deletePermission,
              },
            ]}
          />
        </div>
        {showModal && (
          <ProcurementContractModal
            alert={context.alert}
            fetch={refetchData}
            open={showModal}
            onClose={closeModal}
            selectedItem={selectedItem}
            navigate={context.navigation.navigate}
            context={context}
          />
        )}
        <NotificationsModal
          open={!!showDeleteModal}
          onClose={handleCloseDeleteModal}
          handleLeftButtomClick={handleDelete}
          subTitle={'Ovaj fajl ce biti trajno izbrisan iz sistema'}
        />
      </Container>
    </ScreenWrapper>
  );
};
