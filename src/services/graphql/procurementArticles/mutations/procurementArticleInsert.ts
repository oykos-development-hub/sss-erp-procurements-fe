const articleInsertMutation = `mutation($data: PublicProcurementPlanItemArticleInsertMutation!) {
  publicProcurementPlanItemArticle_Insert(data: $data) {
      status
      message
      item {
        id
        budget_indent {
            id
            title
        }
        public_procurement {
            id
            title
        }
        title
        description
        net_price
        vat_percentage
      }
    }
  }`;

export default articleInsertMutation;
