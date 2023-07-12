import React, {useEffect, useMemo, useState} from 'react';
import {Modal, Typography, Input} from 'client-library';
import {FormWrapper, LabelWrapper, Row} from './styles';
import useInsertProcurementPlanItemLimit from '../../services/graphql/procurementPlanItemLimits/hooks/useInsertProcurementPlanItemLimit';
import {LimitsModalProps} from '../procurementsPlanModal/types';
import {ProcurementPlanItemLimit} from '../../types/graphql/procurementPlanItemLimits';
import {OrganizationUnit} from '../../types/graphql/organizationUnitsTypes';
import useGetProcurementPlanItemLimits from '../../services/graphql/procurementPlanItemLimits/hooks/useGetProcurementPlanItemLimit';

export const LimitsModal: React.FC<LimitsModalProps> = ({open, onClose, procurementId, alert, organizationUnits}) => {
  const {data: procurementPlanLimits} = useGetProcurementPlanItemLimits(procurementId);

  const unitsWithLimits = useMemo(() => {
    return organizationUnits?.map((unit: OrganizationUnit) => {
      const limit = procurementPlanLimits?.find(
        (limit: ProcurementPlanItemLimit) => limit?.organization_unit?.id === unit?.id,
      );
      return {
        ...unit,
        limit,
      };
    });
  }, [organizationUnits, procurementPlanLimits]);
  const [updatedUnitsWithLimits, setUpdatedUnitsWithLimits] = useState<any>([]);

  useEffect(() => {
    if (unitsWithLimits) {
      setUpdatedUnitsWithLimits(unitsWithLimits);
    }
  }, [unitsWithLimits]);

  const {mutate: addLimits} = useInsertProcurementPlanItemLimit();

  const handleChange = (unitId: string, value: string) => {
    setUpdatedUnitsWithLimits((prevUnitsWithLimits: any) => {
      return prevUnitsWithLimits?.map((unit: any) => {
        if (unit.id === Number(unitId)) {
          return {
            ...unit,
            limit: {
              ...unit.limit,
              limit: value,
            },
          };
        }
        return unit;
      });
    });
  };

  const onSubmit = async () => {
    let counter = 0;
    for (const unit of updatedUnitsWithLimits) {
      const payload = {
        id: unit?.limit?.id || 0,
        public_procurement_id: Number(procurementId) || 0,
        organization_unit_id: unit.id,
        limit: unit?.limit?.limit || '',
      };

      await addLimits(
        payload,
        () => {
          counter++;
          onClose();
          // navigate('/procurements/plans');
        },
        () => {
          alert.error('Greška pri dodavanju limita!');
        },
      );
    }
    if (counter === updatedUnitsWithLimits?.length) {
      alert.success('Uspešno ste dodali limit!');
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        onClose();
      }}
      leftButtonText="Otkaži"
      rightButtonText="Sačuvaj"
      rightButtonOnClick={onSubmit}
      content={
        <FormWrapper>
          {updatedUnitsWithLimits?.map((unit: any) => (
            <Row key={`limit.${unit?.id}`}>
              <LabelWrapper>
                <Typography variant="bodySmall" content={<b>ORGANIZACIONA JEDINICA:</b>} />
                <Typography variant="bodySmall" content={unit.title} />
              </LabelWrapper>

              <Input
                value={unit?.limit?.limit}
                leftContent={<>&euro;</>}
                label="LIMIT:"
                onChange={ev => handleChange(`${unit?.id}`, ev.target.value)}
              />
            </Row>
          ))}
        </FormWrapper>
      }
      title={'DODAJTE LIMIT'}
    />
  );
};
