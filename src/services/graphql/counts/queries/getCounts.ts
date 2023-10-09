const getCounts = `query AccountOverview($id: Int, $tree: Boolean, $search: String) {
    account_Overview(id: $id, tree: $tree, search: $search) {
        status
        message
        total
        items {
            id
            parent_id
            title
            serial_number
            children {
                id
                parent_id
                title
                serial_number
                children {
                    id
                    parent_id
                    title
                    serial_number
                    children {
                        id
                        parent_id
                        title
                        serial_number
                        children {
                            id
                            parent_id
                            title
                            serial_number
                            children {
                                id
                                parent_id
                                title
                                serial_number
                                children {
                                    id
                                    parent_id
                                    title
                                    serial_number
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}`;

export default getCounts;
