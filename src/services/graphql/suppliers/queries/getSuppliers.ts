const suppliersOverviewQuery = `query {
  suppliers_Overview(id: $id, search: $search) {
    message
    status
    total
    items {
      id
      title
      abbreviation
      official_id
      address
      description
      folder_id
    }
  }
}`;

export default suppliersOverviewQuery;
