const publicProcurementArticleDeleteMutation = `mutation {
    publicProcurementPlanItemArticle_Delete(id: $id) {
    message
    status
  }
}`;

export default publicProcurementArticleDeleteMutation;
