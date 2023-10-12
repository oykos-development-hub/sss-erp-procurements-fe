import useAppContext from '../../../../context/useAppContext';
import updateStatusPlan from '../mutations/updatePlanStatus';

const useUpdateStatusPlan = () => {
  const {fetch} = useAppContext();

  const updateStatus = async (plan_id: number | undefined) => {
    try {
      await fetch(updateStatusPlan, {plan_id});
    } catch (error) {
      console.log(error);
    }
  };
  return {updateStatus};
};
export default useUpdateStatusPlan;
