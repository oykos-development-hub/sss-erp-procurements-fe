import React, {useEffect, useState} from 'react';
import {Modal, Typography, Input} from 'client-library';
import {FormWrapper, LabelWrapper, Row} from './styles';
import useInsertProcurementPlanItemLimit from '../../services/graphql/procurementPlanItemLimits/hooks/useInsertProcurementPlanItemLimit';
import {LimitsModalProps} from '../procurementsPlanModal/types';
import useGetProcurementPlanItemLimits from '../../services/graphql/procurementPlanItemLimits/hooks/useGetProcurementPlanItemLimit';
import {OrganizationUnitWithLimit} from '../../types/graphql/procurementPlanItemLimits';

const defaultLimitValues = {
  id: 0,
  limit: '',
  organization_unit: undefined,
  public_procurement: undefined,
};

export const LimitsModal: React.FC<LimitsModalProps> = ({
  open,
  onClose,
  procurementId,
  alert,
  organizationUnitList,
}) => {
  const {data: procurementPlanLimits} = useGetProcurementPlanItemLimits(procurementId);

  const [unitsWithLimits, setUnitsWithLimits] = useState<OrganizationUnitWithLimit[]>([]); // Replace with your actual type

  useEffect(() => {
    const mergedList = organizationUnitList.map(unit => {
      const foundLimit =
        procurementPlanLimits?.find(limit => limit?.organization_unit?.id === unit?.id) || defaultLimitValues;

      return {
        ...unit,
        limit: foundLimit,
      };
    });

    setUnitsWithLimits(mergedList);
  }, [procurementPlanLimits, organizationUnitList]);

  const {mutate: addLimits} = useInsertProcurementPlanItemLimit();

  const handleChange = (unitId: number, value: string) => {
    setUnitsWithLimits(prevUnits => {
      const newUnits = [...prevUnits];
      const foundUnit = newUnits.find(unit => unit.id === unitId);

      if (foundUnit) {
        foundUnit.limit.limit = value;
      }

      return newUnits;
    });
  };

  const onSubmit = async () => {
    const requests = unitsWithLimits.map(unit => {
      const payload = {
        id: unit?.limit?.id,
        public_procurement_id: procurementId,
        organization_unit_id: unit.id,
        limit: unit?.limit?.limit || '',
      };

      return addLimits(payload);
    });

    try {
      await Promise.all(requests);
      alert.success('Uspješno ste dodali limit!');
      onClose();
    } catch (error) {
      alert.error('Greška pri dodavanju limita!');
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      leftButtonText="Otkaži"
      rightButtonText="Sačuvaj"
      rightButtonOnClick={onSubmit}
      content={
        <FormWrapper>
          {unitsWithLimits?.map(unit => (
            <Row key={`limit.${unit?.id}`}>
              <LabelWrapper>
                <Typography variant="bodySmall" content={<b>ORGANIZACIONA JEDINICA:</b>} />
                <Typography variant="bodySmall" content={unit.title} />
              </LabelWrapper>

              <Input
                value={unit?.limit?.limit}
                leftContent={<>&euro;</>}
                label="LIMIT:"
                onChange={ev => handleChange(unit.id, ev.target.value)}
              />
            </Row>
          ))}
        </FormWrapper>
      }
      title={'DODAJTE LIMIT'}
    />
  );
};
