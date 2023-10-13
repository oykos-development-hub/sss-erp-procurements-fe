import React from 'react';
import {NotFound404} from './screens/404';
import {ProcurementDetails} from './screens/procurementDetails/procurementDetails';
import {ProcurementsPlan} from './screens/procurementsPlan/procurementsPlan';
import {PublicProcurementsMainPage} from './screens/publicProcurement/plansOverview';
import {MicroserviceProps} from './types/micro-service-props';
import {OrganizationUnitPublicProcurements} from './screens/procurementsPlan/organizationUnitPublicProcurements';
import {ProcurementDetailsManager} from './screens/procurementDetails/procurementDetailsManager';
import {ProcurementDetailsRequests} from './screens/procurementDetails/procurementDetailsRequests';
import {ProcurementContractsMainPage} from './screens/procurementContracts/contractsOverview';
import {ContractDetails} from './screens/procurementContracts/contractDetails/contractDetails';
import {ContractDetailsSigned} from './screens/procurementContracts/contractDetails/contractDetailsSigned';

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

  const renderScreen = () => {
    if (pathname === '/procurements/plans') return <PublicProcurementsMainPage context={context} />;
    if (OrganizationUnitPublicProcurementsRegex.test(pathname)) {
      return <OrganizationUnitPublicProcurements context={context} />;
    }
    if (ProcurementDetailsRequestsRegex.test(pathname)) return <ProcurementDetailsRequests context={context} />;
    if (ProcurementDetailsRegex.test(pathname)) return <ProcurementDetails context={context} />;
    if (ProcurementDetailsManagerRegex.test(pathname)) return <ProcurementDetailsManager context={context} />;
    if (ProcurementPlanDetailsRegex.test(pathname)) return <ProcurementsPlan context={context} />;
    if (pathname === '/procurements/contracts') return <ProcurementContractsMainPage context={context} />;
    if (ContractDetailsRegex.test(pathname)) return <ContractDetails context={context} />;
    if (ContractDetailsSignedRegex.test(pathname)) return <ContractDetailsSigned context={context} />;

    return <NotFound404 context={context} />;
  };

  return renderScreen();
};
