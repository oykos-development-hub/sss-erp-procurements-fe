import useAppContext from '../../../../context/useAppContext';
import {REQUEST_STATUSES} from '../../../constants';
import sendProcurementOnRevisionMutation from '../mutations/sendProcurementsOnRevision';

const useSendProcurementOnRevision = () => {
  const {fetch} = useAppContext();

  const sendProcurementOnRevision = async (plan_id: number | undefined, onSuccess?: () => void, onError?: () => void) => {
    const response = await fetch(sendProcurementOnRevisionMutation, {plan_id});

    if (response.publicProcurementSendPlanOnRevision_Update.status === REQUEST_STATUSES.success) {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }
  };
  return {sendProcurementOnRevision};
};
export default useSendProcurementOnRevision;
