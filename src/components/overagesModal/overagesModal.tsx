import {Input, Modal, TrashIconTwo, Theme} from 'client-library';
import React, {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import useInsertPublicProcurementContractArticleOverage from '../../services/graphql/procurementContractArticleOverage/hooks/useInsertPublicProcurementContractArticleOverage';
import {parseDate} from '../../utils/dateUtils';
import {ModalContent, Row} from './styles';
import {ModalProps} from './types';
import useDeletePublicProcurementContractArticleOverage from '../../services/graphql/procurementContractArticleOverage/hooks/useDeletePublicProcurementContractArticleOverage';
import {NotificationsModal} from '../../shared/notifications/notificationsModal';

export const OveragesModal: React.FC<ModalProps> = ({
  open,
  onClose,
  alert,
  selectedItem,
  organizationUnitID,
  refetchData,
}) => {
  const {mutate} = useInsertPublicProcurementContractArticleOverage();
  const {mutate: deleteItem} = useDeletePublicProcurementContractArticleOverage();
  const [showModal, setShowModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(0);

  const {handleSubmit} = useForm({});
  const [overages, setOverages] = useState(
    selectedItem?.overages || [{amount: 0, created_at: '', id: 0, updated_at: ''}],
  );
  const [newOverage, setNewOverage] = useState({amount: 0, created_at: '', id: 0, updated_at: ''});

  const onSubmit = () => {
    const payload = {
      id: 0,
      article_id: selectedItem.id,
      amount: Number(newOverage.amount),
      organization_unit_id: organizationUnitID,
    };

    mutate(
      payload,
      () => {
        refetchData();
        onClose(true);
        alert.success('Prekoračenje je uspješno sačuvano!');
      },
      () => {
        onClose(false);
        alert.error('Greška prilikom čuvanja prekoračenja!');
      },
    );
  };

  const handleAmountChange = (e: any) => {
    const newAmount = e.target.value;
    setNewOverage((prev: any) => ({...prev, amount: newAmount}));
  };

  const handleDelete = () => {
    if (showModal) {
      deleteItem(
        selectedItemId,
        () => {
          setShowModal(false);
          onClose(true);
          refetchData();
          alert.success('Uspješno obrisano.');
        },
        () => {
          alert.error('Došlo je do greške pri brisanju.');
        },
      );
    }
    setSelectedItemId(0);
  };

  useEffect(() => {
    if (selectedItem.overages) {
      setOverages(selectedItem.overages);
    }
  }, [selectedItem]);

  const handleDeleteIconClick = (id: number) => {
    setSelectedItemId(id);
    setShowModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowModal(false);
    setSelectedItemId(0);
  };

  return (
    <>
      <Modal
        open={open}
        onClose={() => {
          onClose(true);
        }}
        width={350}
        leftButtonOnClick={onClose}
        leftButtonText="Otkaži"
        rightButtonOnClick={handleSubmit(onSubmit)}
        rightButtonText="Dodaj"
        title="PREKORAČENJE"
        content={
          <>
            <>
              <ModalContent>
                {overages.map((overage: any, index: any) => (
                  <Row key={index}>
                    <Input label={`Prekoračenje ${index + 1}`} value={overage?.amount} disabled />
                    <Input label={'Datum prekoračenja'} value={parseDate(overage?.created_at)} disabled name="amount" />
                    <TrashIconTwo
                      width="30px"
                      stroke={Theme?.palette.gray800}
                      onClick={() => handleDeleteIconClick(overage.id)}
                    />
                  </Row>
                ))}
                <Row>
                  <Input label="Prekoračenje" value={newOverage.amount as any} onChange={handleAmountChange} />
                </Row>
              </ModalContent>
            </>
          </>
        }
      />
      <NotificationsModal
        open={!!showModal}
        onClose={handleCloseDeleteModal}
        handleLeftButtomClick={handleDelete}
        subTitle={'Ovaj fajl ce biti trajno izbrisan iz sistema'}
      />
    </>
  );
};
