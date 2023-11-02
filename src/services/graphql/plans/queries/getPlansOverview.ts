const plansOverviewQuery = `query PlansOverview($status: String, $year: String, $page: Int!, $size: Int!, $is_pre_budget: Boolean, $contract: Boolean) {
    publicProcurementPlans_Overview(status: $status, year: $year, page: $page, size: $size, is_pre_budget: $is_pre_budget, contract: $contract) {
        status 
        message
        total
        items {
            id
            requests
            pre_budget_plan {
                id
                title
            }
            is_pre_budget
            active
            year
            title
            status 
            serial_number
            date_of_publishing
            date_of_closing
            created_at
            updated_at
            file_id
            items {
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
                    public_procurement {
                        id
                        title
                    }
                    title
                    description
                    net_price
                    vat_percentage
                    manufacturer
                }
            }
        }
    }
}`;

export default plansOverviewQuery;
