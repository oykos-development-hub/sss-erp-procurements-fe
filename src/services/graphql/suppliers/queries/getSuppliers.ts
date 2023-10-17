const suppliersOverviewQuery = `query Suppliers($id: Int, $search: String, $page: Int, $size: Int) {
  suppliers_Overview(id: $id, search: $search, page: $page, size: $size) {
      status 
      message
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
