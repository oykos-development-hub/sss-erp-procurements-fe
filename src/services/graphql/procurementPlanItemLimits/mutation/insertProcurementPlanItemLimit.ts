const planItemLimitInsertMutation = `mutation {
    publicProcurementPlanItemLimit_Insert(data: $data) {
        status
        message
        items {
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
