const getContractPDFUrl = `query PlanItemPDF($id: Int!, $organization_unit_id: Int) {
    publicProcurementPlanItem_PDF(id: $id, organization_unit_id: $organization_unit_id) {
        status 
        message
        item {
            subtitles {
                public_procurement
                organization_unit
                supplier
            }
            table_data {
                procurement_item
                key_features
                contracted_amount
                available_amount
                consumed_amount
            }
        }
    }
}`;

export default getContractPDFUrl;
