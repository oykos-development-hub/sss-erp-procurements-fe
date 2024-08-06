export const PlanStatusesForAdmin: any[] = [
  {id: undefined, title: 'Sve'},
  {id: 'U toku', title: 'U toku'},
  {id: 'Poslat', title: 'Poslat'},
  {id: 'Zaključen', title: 'Zaključen'},
  {id: 'Konvertovan', title: 'Konvertovan'},
  {id: 'Objavljen', title: 'Objavljen'},
];

export const PlanStatusesForManager: any[] = [
  {id: undefined, title: 'Sve'},
  {id: 'Obradi', title: 'Obradi'},
  {id: 'Na čekanju', title: 'Na čekanju'},
  {id: 'Odobren', title: 'Odobren'},
  {id: 'Odbijen', title: 'Odbijen'},
  {id: 'Zaključen', title: 'Zaključen'},
  {id: 'Objavljen', title: 'Objavljen'},
];

export const getPlanStatuses = (createPermission: boolean, updatePermission: boolean) => {
  if (createPermission) return PlanStatusesForAdmin;
  if (updatePermission) return PlanStatusesForManager;
  return [];
};
