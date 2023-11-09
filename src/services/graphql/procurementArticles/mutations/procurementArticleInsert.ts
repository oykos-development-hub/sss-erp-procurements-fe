const articleInsertMutation = `mutation($data: [PublicProcurementPlanItemArticleInsertMutation]) {
  publicProcurementPlanItemArticle_Insert(data: $data) {
      status
      message
      items {
        id
        public_procurement {
            id
            title
        }
        title
        description
        net_price
        vat_percentage
        manufacturer
        amount
        total_amount
      }
    }
  }`;

export default articleInsertMutation;
