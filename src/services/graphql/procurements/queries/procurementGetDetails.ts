const procurementDetailsQuery = `query {
    publicProcurementPlanItem_Details(id: $id) {
        message
        status
        status 
        message
        item {
            id
            budget_indent {
                id
                title
            }
            plan {
                id
                title
            }
            is_open_procurement
            title
            article_type
            status
            serial_number
            date_of_publishing
            date_of_awarding
            created_at
            updated_at
            file_id
            articles {
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
    }
}`;

export default procurementDetailsQuery;
