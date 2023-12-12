import {useEffect, useState} from 'react';
import {
  GetProcurementContractParams,
  ProcurementContract,
  ProcurementContractsGetResponse,
} from '../../../../types/graphql/procurementContractsTypes';
import query from '../queries/getProcurementContracts';
import useAppContext from '../../../../context/useAppContext';
import {REQUEST_STATUSES} from '../../../constants';

const useProcurementContracts = ({
  id,
  procurement_id,
  supplier_id,
  sort_by_date_of_expiry,
  sort_by_date_of_signing,
  sort_by_gross_value,
  sort_by_serial_number,
  year,
}: GetProcurementContractParams) => {
  const [procurementContracts, setProcurementContracts] = useState<ProcurementContract[]>();
  const [loading, setLoading] = useState(true);
  const {fetch} = useAppContext();

  const fetchProcurementContracts = async () => {
    if (id === 0) {
      setProcurementContracts([]);
      setLoading(false);
    } else {
      const response: ProcurementContractsGetResponse = await fetch(query, {
        id,
        procurement_id,
        supplier_id,
        sort_by_date_of_expiry,
        sort_by_date_of_signing,
        sort_by_gross_value,
        sort_by_serial_number,
        year,
      });

      if (response.publicProcurementContracts_Overview.status === REQUEST_STATUSES.success) {
        setProcurementContracts(response?.publicProcurementContracts_Overview.items);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchProcurementContracts();
  }, [
    id,
    procurement_id,
    supplier_id,
    sort_by_date_of_expiry,
    sort_by_date_of_signing,
    sort_by_gross_value,
    sort_by_serial_number,
    year,
  ]);

  return {data: procurementContracts, loading, refetchData: fetchProcurementContracts};
};

export default useProcurementContracts;
