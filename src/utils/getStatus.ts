export const calculateStatus = (items: any[]) => {
  const isAllAccepted = items?.every(request => request?.status === 'accepted' && !request.is_rejected);
  const isAllRejected = items?.some(request => request?.status === 'rejected' && request.is_rejected);

  if (isAllRejected) {
    return {id: 3, title: 'Odbijeno'};
  } else if (isAllAccepted) {
    return {id: 2, title: 'Odobreno'};
  } else {
    return {id: 1, title: 'Na čekanju'};
  }
};
