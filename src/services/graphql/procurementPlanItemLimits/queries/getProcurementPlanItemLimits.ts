const planItemLimitsQuery = `query ProcurementLimits($procurement_id: Int!) {
  publicProcurementPlanItem_Limits(procurement_id: $procurement_id) {
      status 
      message
      items {
          id
          limit
          organization_unit {
              id
              title
          }
          public_procurement {
              id
              title
          }
      }
    }
  }`;

export default planItemLimitsQuery;
