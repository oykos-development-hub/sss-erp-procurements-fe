import {useEffect, useState} from 'react';
import {GraphQL} from '../..';
import {GetProcurementContractParams, ProcurementContract} from '../../../../types/graphql/procurementContractsTypes';

const useProcurementContracts = ({id, procurement_id, supplier_id}: GetProcurementContractParams) => {
  const [procurementContracts, setProcurementContracts] = useState<ProcurementContract[]>();
  const [loading, setLoading] = useState(true);

  const fetchProcurementContracts = async () => {
    const response = await GraphQL.getProcurementContracts({id, procurement_id, supplier_id});
    const contracts = response?.items;
    setProcurementContracts(contracts);
    setLoading(false);
  };

  useEffect(() => {
    fetchProcurementContracts();
  }, [id, procurement_id, supplier_id]);

  return {data: procurementContracts, loading, refetchData: fetchProcurementContracts};
};

export default useProcurementContracts;
