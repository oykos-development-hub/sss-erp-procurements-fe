import {useEffect, useState} from 'react';
import useAppContext from '../../../context/useAppContext';
import {REQUEST_STATUSES} from '../../constants';
import { PdfPlanData, PlanPDFResponse } from '../../../types/graphql/getPlansTypes';
import getPlanPDFUrl from './getPlanPDFUrl';

type GetPlanPDFParams = {
  plan_id?: number;
  organization_unit_id?: number;
};

const useGetPlanPDFData = ({plan_id, organization_unit_id}: GetPlanPDFParams) => {
  const [pdfData, setPdfData] = useState<PdfPlanData>();
  const [loading, setLoading] = useState(false);

  const {fetch, alert} = useAppContext();
  const fetchPDf = async () => {
    // id is mandatory
    if (loading || !plan_id) return;

    setLoading(true);

    const response: PlanPDFResponse = await fetch(getPlanPDFUrl, {plan_id, organization_unit_id});
    console.log(response);
    if (response.publicProcurementPlan_PDF.status === REQUEST_STATUSES.success) {
      setPdfData(response.publicProcurementPlan_PDF.item);
    } else {
      alert.error('Došlo je do greške prilikom preuzimanja izvještaja');
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchPDf();
  }, [plan_id, organization_unit_id]);

  return {pdfData, loading};
};

export default useGetPlanPDFData;
