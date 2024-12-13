import React from 'react';
import {NotFound404} from './screens/404';
import {LandingPage} from './screens/landingPage/landingPage';
import {ContractDetails} from './screens/procurementContracts/contractDetails/contractDetails';
import {ContractDetailsSigned} from './screens/procurementContracts/contractDetails/contractDetailsSigned';
import {ProcurementContractsMainPage} from './screens/procurementContracts/contractsOverview';
import {ProcurementDetails} from './screens/procurementDetails/procurementDetails';
import {ProcurementDetailsManager} from './screens/procurementDetails/procurementDetailsManager';
import {ProcurementDetailsRequests} from './screens/procurementDetails/procurementDetailsRequests';
import {OrganizationUnitPublicProcurements} from './screens/procurementsPlan/organizationUnitPublicProcurements';
import {ProcurementsPlan} from './screens/procurementsPlan/procurementsPlan';
import {PublicProcurementsMainPage} from './screens/publicProcurement/plansOverview';
import {Reports} from './screens/reports/reports';
import {MicroserviceProps} from './types/micro-service-props';
import {checkRoutePermissions} from './services/checkRoutePermissions.ts';

const ProcurementPlanDetailsRegex = /^\/procurements\/plans\/\d+/;
const OrganizationUnitPublicProcurementsRegex = /^\/procurements\/plans\/\d+\/requests\/\d+$/;
const ProcurementDetailsRegex = /^\/procurements\/plans\/[^/]+\/procurement-details\/\d+/;
const ContractDetailsRegex = /\/procurements\/contracts\/\d+$/;
const ContractDetailsSignedRegex = /^\/procurements\/contracts\/\d+\/signed$/;
const ProcurementDetailsManagerRegex = /^\/procurements\/plans\/[^/]+\/procurement-details-manager\/\d+/;
const ProcurementDetailsRequestsRegex = /^\/procurements\/plans\/\d+\/requests\/\d+\/procurement-details-requests\/\d+/;

export const Router: React.FC<MicroserviceProps> = props => {
  const pathname = props?.navigation?.location?.pathname;
  const context = Object.freeze({
    ...props,
  });
  const allowedRoutes = checkRoutePermissions(context?.contextMain?.permissions);

  const renderScreen = () => {
    if (pathname === '/procurements' && allowedRoutes.includes('/procurements')) return <LandingPage />;
    if (pathname === '/procurements/plans' && allowedRoutes.includes('/procurements/plans'))
      return <PublicProcurementsMainPage context={context} />;
    if (OrganizationUnitPublicProcurementsRegex.test(pathname) && allowedRoutes.includes('/procurements/plans')) {
      return <OrganizationUnitPublicProcurements context={context} />;
    }
    if (ProcurementDetailsRequestsRegex.test(pathname) && allowedRoutes.includes('/procurements/plans'))
      return <ProcurementDetailsRequests context={context} />;
    if (ProcurementDetailsRegex.test(pathname) && allowedRoutes.includes('/procurements/plans'))
      return <ProcurementDetails context={context} />;
    if (ProcurementDetailsManagerRegex.test(pathname) && allowedRoutes.includes('/procurements/plans'))
      return <ProcurementDetailsManager context={context} />;
    if (ProcurementPlanDetailsRegex.test(pathname) && allowedRoutes.includes('/procurements/plans'))
      return <ProcurementsPlan context={context} />;
    if (pathname === '/procurements/contracts' && allowedRoutes.includes('/procurements/contracts'))
      return <ProcurementContractsMainPage context={context} />;
    if (ContractDetailsRegex.test(pathname) && allowedRoutes.includes('/procurements/contracts'))
      return <ContractDetails />;
    if (ContractDetailsSignedRegex.test(pathname) && allowedRoutes.includes('/procurements/contracts'))
      return <ContractDetailsSigned context={context} />;
    if (pathname === '/procurements/reports' && allowedRoutes.includes('/procurements/reports')) return <Reports />;

    return <NotFound404 context={context} />;
  };

  return renderScreen();
};
