const planItemLimitInsertMutation = `mutation($data: PublicProcurementPlanItemLimitInsertMutation!) {
    publicProcurementPlanItemLimit_Insert(data: $data) {
        status 
        message 
        item {
            id
            organization_unit {
                id
                title
            }
            public_procurement {
                id
                title
            }
            limit
        }
    }
}`;

export default planItemLimitInsertMutation;
