import React, {useMemo, useState} from 'react';
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

export const ProcurementContractsMainPage: React.FC<ScreenProps> = ({context}) => {
  const [showModal, setShowModal] = useState(false);

  const [selectedSupplier, setSelectedSupplier] = useState(0);
  // const [selectedYear, setSelectedYear] = useState();
  const [searchQuery, setSearchQuery] = useState('');

  const {
    data: tableData,
    refetchData,
    loading,
  } = useProcurementContracts({
    id: 0,
    procurement_id: 0,
    supplier_id: selectedSupplier,
  });

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

  return (
    <ScreenWrapper>
      <Container>
        <MainTitle content="LISTA SVIH UGOVORA" variant="bodyMedium" />
        <CustomDivider />
        <TableHeader>
          <ProcurementContractsFilters
            suppliers={suppliers || []}
            setFilters={({year, supplier_id}) => {
              // setSelectedYear(year);
              setSelectedSupplier(supplier_id);
            }}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            context={context}
          />

          <ButtonWrapper>
            <Button
              variant="secondary"
              content={<Typography variant="bodyMedium" content="Novi ugovor" />}
              onClick={handleAdd}
            />
          </ButtonWrapper>
        </TableHeader>

        <div>
          <Table
            tableHeads={tableHeads}
            data={filteredTableData || []}
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
              },
              {
                name: 'delete',
                onClick: (item: ProcurementContract) => handleDeleteIconClick(item.id),
                icon: <TrashIcon stroke={Theme?.palette?.gray800} />,
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
