const getOrderProcurementAvailableArticles = `query OrderProcurementAvailableListOverview($public_procurement_id: Int!, $organization_unit_id: Int!) {
  orderProcurementAvailableList_Overview(public_procurement_id: $public_procurement_id, organization_unit_id: $organization_unit_id) {
      status 
      message
      total 
      items {        
          id
          title
          description
          manufacturer
          unit
          available
          total_price
      }
  }
}`;

export default getOrderProcurementAvailableArticles;
