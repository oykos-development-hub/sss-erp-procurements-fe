import {useEffect, useState} from 'react';
import {GraphQL} from '../..';
import {REQUEST_STATUSES} from '../../../constants';
import {PublicProcurement} from '../../../../types/graphql/publicProcurementTypes';

const usePublicProcurementGetDetails = (id: number) => {
  const [loading, setLoading] = useState(false);
  const [publicProcurement, setPublicProcurement] = useState<PublicProcurement>();

  const getProcurementDetails = async (onSuccess?: () => void, onError?: () => void) => {
    setLoading(true);
    const response = await GraphQL.publicProcurementGetDetails(id);
    if (response.status === REQUEST_STATUSES.success) {
      response?.items && setPublicProcurement(response?.items[0]);
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }
    setLoading(false);
  };

  useEffect(() => {
    getProcurementDetails();
  }, [id]);

  return {loading, publicProcurement, refetch: getProcurementDetails};
};

export default usePublicProcurementGetDetails;
