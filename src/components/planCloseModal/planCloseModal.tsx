import {Modal, Typography} from 'client-library';
import React from 'react';
import {ModalContent, TriangleIcon} from './styles';
import {ModalProps} from './types';

export const PlanCloseModal: React.FC<ModalProps> = ({open, onClose, handleRightButtonClick}) => {
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
      rightButtonText="Sačuvaj"
      content={
        <ModalContent>
          <TriangleIcon />
          <Typography
            content="Da li ste sigurni da želite da zaključite plan?"
            variant="bodyMedium"
            style={{fontWeight: 600}}
          />
        </ModalContent>
      }
    />
  );
};
