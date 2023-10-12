const publicProcurementArticleDeleteMutation = `mutation($id: Int!) {
  publicProcurementPlanItemArticle_Delete(id: $id) {
      message
      status
  }
}`;

export default publicProcurementArticleDeleteMutation;
