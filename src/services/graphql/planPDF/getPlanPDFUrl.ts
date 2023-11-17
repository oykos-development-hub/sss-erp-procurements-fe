const getPlanPDFUrl = `query PublicProcurementPlanPDF($plan_id: Int!, $organization_unit_id: Int) {
    publicProcurementPlan_PDF(plan_id: $plan_id, organization_unit_id: $organization_unit_id) {
        status 
        message
        item {
            plan_id
            year
            published_date
            total_gross
            total_vat
            table_data {
                id
                budget_indent
                article_type
                title
                total_gross
                total_vat
                type_of_procedure
                funding_source
            }
        }
    }
}`;

export default getPlanPDFUrl;
