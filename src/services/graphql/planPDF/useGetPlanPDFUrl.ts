import {useState} from 'react';
import useAppContext from '../../../context/useAppContext';
import {REQUEST_STATUSES} from '../../constants';
import getPlanPDFUrl from './getPlanPDFUrl';

type GetPlanPDFParams = {
  plan_id: number;
};

const useGetPlanPDFUrl = ({plan_id}: GetPlanPDFParams) => {
  const [loading, setLoading] = useState(false);

  const {fetch, alert} = useAppContext();

  const fetchPDFUrl = async () => {
    if (loading) return;

    setLoading(true);
    const response: any = await fetch(getPlanPDFUrl, {plan_id});
    if (response.publicProcurementPlan_PDF.status === REQUEST_STATUSES.success) {
      const binaryData = atob(response.publicProcurementPlan_PDF.item);
      const byteArray = new Uint8Array(binaryData.length);
      for (let i = 0; i < binaryData.length; i++) {
        byteArray[i] = binaryData.charCodeAt(i);
      }

      const blob = new Blob([byteArray], {type: 'application/octet-stream'});
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = 'Izvještaj-plana.pdf';
      link.style.display = 'none';
      document.body.appendChild(link);

      link.click();

      URL.revokeObjectURL(blobUrl);
    } else {
      alert.error('Došlo je do greške prilikom preuzimanja izvještaja');
    }

    setLoading(false);
  };

  return {fetchPDFUrl, loading};
};

export default useGetPlanPDFUrl;
