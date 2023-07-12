export const formatData = (data: any) => {
  const payload = {
    ...data,
    budget_indent_id: data.budget_indent?.id || 0,
    vat_percentage: data.vat_percentage?.id.toString(),
  };

  delete payload.budget_indent;
  delete payload.public_procurement;
  delete payload.total_price;

  return payload;
};
