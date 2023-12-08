import {Dropdown, Modal, Typography} from 'client-library';
import React from 'react';
import {Controller, useForm} from 'react-hook-form';
import {ModalContent} from './styles';
import {ConvertModalProps} from './types';

export const ConvertModal: React.FC<ConvertModalProps> = ({open, onClose, availableYearsForPlan, handleConvert}) => {
  const {
    control,
    reset,
    formState: {errors},
    watch,
    handleSubmit,
  } = useForm();

  const year = watch('year');

  const onSubmit = () => {
    handleConvert(year?.id);
    reset();
  };

  const handleClose = () => {
    onClose();
    reset();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      leftButtonText="Otkaži"
      rightButtonText="Konvertuj"
      rightButtonOnClick={handleSubmit(onSubmit)}
      width={200}
      content={
        <ModalContent>
          <Typography
            content="Da li želite ovaj plan iskoristiti kao šablon za odabranu godinu?"
            variant="bodyMedium"
            style={{fontWeight: 600, textAlign: 'center'}}
          />
          <Controller
            name="year"
            control={control}
            rules={{required: 'Izaberite godinu.'}}
            render={({field: {name, value, onChange}}) => (
              <Dropdown
                value={value}
                onChange={onChange}
                name={name}
                label="GODINA:"
                options={availableYearsForPlan}
                error={errors?.year?.message as string}
                isRequired
              />
            )}
          />
        </ModalContent>
      }
      title="KONVERTUJ PLAN"
    />
  );
};
