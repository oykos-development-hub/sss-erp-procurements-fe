import {useEffect, useState} from 'react';
import {GetSupplier, Supplier, SuppliersOverviewResponse} from '../../../../types/graphql/suppliersTypes';
import useAppContext from '../../../../context/useAppContext';
import query from '../queries/getSuppliers';

const useGetSuppliers = ({id, search}: GetSupplier) => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const {fetch} = useAppContext();

  const fetchSuppliers = async () => {
    const response: SuppliersOverviewResponse = await fetch(query, {id, search});
    setSuppliers(response?.suppliers_Overview.items);
    setLoading(false);
  };

  useEffect(() => {
    fetchSuppliers();
  }, [search]);

  return {data: suppliers, loading, refetch: fetchSuppliers};
};

export default useGetSuppliers;
