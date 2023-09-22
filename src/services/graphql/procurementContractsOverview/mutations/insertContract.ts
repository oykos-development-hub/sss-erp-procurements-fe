const contractInsertMutation = `mutation {
  publicProcurementContracts_Insert(data: $data) {
      status 
      message 
      items {
          id
          public_procurement {
              id
              title
          }
          supplier {
              id
              title
          }
          serial_number
          date_of_signing
          date_of_expiry
          net_value
          gross_value
          created_at
          updated_at
          file_id
      }
  }
}`;

export default contractInsertMutation;
