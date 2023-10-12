const updateStatusPlan = `mutation($plan_id: Int!) {
    publicProcurementSendPlanOnRevision_Update(plan_id: $plan_id) {
        status
        message 
    }
}`;

export default updateStatusPlan;
