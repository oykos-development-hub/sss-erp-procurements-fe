const procurementPlanItemDeleteMutation = `mutation {
    publicProcurementPlanItem_Delete(id: $id) {
    message
    status
  }
}
`;

export default procurementPlanItemDeleteMutation;
