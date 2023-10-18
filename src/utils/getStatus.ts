import {RequestStatus} from '../screens/publicProcurement/constants';
import {RequestArticle} from '../types/graphql/planRequests';

export const calculateStatus = (items: RequestArticle[]): RequestStatus => {
  if (items.length === 0) {
    return RequestStatus.Pending;
  }

  const isAllAccepted = items.every(request => request?.status === 'accepted' && !request.is_rejected);
  const isAllRejected = items.some(request => request?.status === 'rejected' && request.is_rejected);

  if (isAllRejected) {
    return RequestStatus.Rejected;
  } else if (isAllAccepted) {
    return RequestStatus.Approved;
  } else {
    return RequestStatus.Sent;
  }
};
