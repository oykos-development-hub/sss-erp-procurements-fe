const getPlanPDFUrl = `query PlanPDF($plan_id: Int!) {
    publicProcurementPlan_PDF(plan_id: $plan_id) {
        status 
        message
        item
    }
}`;

export default getPlanPDFUrl;
