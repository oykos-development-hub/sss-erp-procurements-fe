const contractDeleteMutation = `mutation {
  publicProcurementContracts_Delete(id: $id) {
      message
      status         
  }
}`;

export default contractDeleteMutation;
