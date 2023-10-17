import useAppContext from '../../../../context/useAppContext';
import {REQUEST_STATUSES} from '../../../constants';
import updateStatusPlan from '../mutations/updatePlanStatus';

const useUpdateStatusPlan = () => {
  const {fetch} = useAppContext();

  const updateStatus = async (plan_id: number | undefined, onSuccess?: () => void, onError?: () => void) => {
    const response = await fetch(updateStatusPlan, {plan_id});

    if (response.publicProcurementSendPlanOnRevision_Update.status === REQUEST_STATUSES.success) {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }
  };
  return {updateStatus};
};
export default useUpdateStatusPlan;
