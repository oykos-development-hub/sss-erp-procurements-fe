const contractsOverviewQuery = `query Contracts($id: Int, $procurement_id: Int, $supplier_id: Int, $sort_by_date_of_expiry: String, $sort_by_date_of_signing: String, $sort_by_gross_value: String, $sort_by_serial_number:String, $year: String) {
    publicProcurementContracts_Overview(id: $id, procurement_id: $procurement_id, supplier_id: $supplier_id, sort_by_date_of_expiry: $sort_by_date_of_expiry, sort_by_date_of_signing: $sort_by_date_of_signing, sort_by_gross_value: $sort_by_gross_value, sort_by_serial_number: $sort_by_serial_number, year:$year) {
        status 
        message
        total
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
            vat_value
            created_at
            updated_at
            days_until_expiry
            file {
              id
              name
              type
            }
        }
    }
}`;
export default contractsOverviewQuery;
