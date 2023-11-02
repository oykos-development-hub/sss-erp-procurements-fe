import { RequestStatus } from '../screens/procurementsPlan/types';
import {RequestArticle} from '../types/graphql/planRequests';

export const calculateStatus = (items: RequestArticle[]): RequestStatus => {
  if (items.length === 0 || items.some(request => request?.status === 'in_progress')) {
    return RequestStatus.Pending;
  }

  const isAllAccepted = items.every(request => request?.status === 'accepted');
  const isAllRejected = items.some(request => request?.status === 'rejected');

  if (isAllRejected) {
    return RequestStatus.Rejected;
  } else if (isAllAccepted) {
    return RequestStatus.Approved;
  } else {
    return RequestStatus.Sent;
  }
};
