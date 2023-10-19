import {Modal, Typography} from 'client-library';
import React from 'react';
import {ModalContent, TriangleIcon} from './styles';
import {ModalProps} from './types';

export const RejectedProcurementModal: React.FC<ModalProps> = ({open, onClose, handleRightButtonClick}) => {
  return (
    <Modal
      open={open}
      onClose={() => {
        onClose(true);
      }}
      width={450}
      leftButtonOnClick={onClose}
      leftButtonText="Otkaži"
      rightButtonOnClick={handleRightButtonClick}
      content={
        <ModalContent>
          <TriangleIcon />
          <Typography content="Da li ste implementirali sve izmjene?" variant="bodyMedium" style={{fontWeight: 600}} />
          <Typography content="Ukoliko pritisnete pošalji, zahtjev će biti proslijeđen." variant="bodySmall" />
        </ModalContent>
      }
    />
  );
};
