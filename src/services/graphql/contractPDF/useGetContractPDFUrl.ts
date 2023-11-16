import {useEffect, useState} from 'react';
import useAppContext from '../../../context/useAppContext';
import getContractPDFUrl from './getContractPDFUrl';
import {REQUEST_STATUSES} from '../../constants';
import {ContractPDFResponse, PdfData} from '../../../types/graphql/contractPDFTypes';

type GetContractPDFParams = {
  id?: number;
  organization_unit_id?: number;
};

const useGetContractPDFUrl = ({id, organization_unit_id}: GetContractPDFParams) => {
  const [pdfData, setPdfData] = useState<PdfData>();
  const [loading, setLoading] = useState(false);

  const {fetch, alert} = useAppContext();
  const fetchPDf = async () => {
    // id is mandatory
    if (loading || !id) return;

    setLoading(true);

    const response: ContractPDFResponse = await fetch(getContractPDFUrl, {id, organization_unit_id});
    if (response.publicProcurementPlanItem_PDF.status === REQUEST_STATUSES.success) {
      setPdfData(response.publicProcurementPlanItem_PDF.item);
    } else {
      alert.error('Došlo je do greške prilikom preuzimanja izvještaja');
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchPDf();
  }, [id, organization_unit_id]);

  return {pdfData, loading};
};

export default useGetContractPDFUrl;
