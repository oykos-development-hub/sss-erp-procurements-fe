const deletePlanMutation = `mutation($id: Int!) {
  publicProcurementPlan_Delete(id: $id) {
      message
      status
  }
}`;

export default deletePlanMutation;
