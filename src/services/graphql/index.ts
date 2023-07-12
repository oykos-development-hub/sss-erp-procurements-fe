import {BFF_URL} from '../constants';
import {getEnvironment} from '../get-environment';
import publicProcurementArticleDelete from './procurementArticles/procurementArticleDelete.ts';
import publicProcurementArticleInsert from './procurementArticles/procurementArticleInsert';
import publicProcurementGetDetails from './procurements/publicProcurementGetDetails.ts';
import deletePlan from './getPlans/queries/deletePublicProcurementPlan';
import getPlansOverview from './getPlans/queries/getPlansOverview';
import insertProcurementPlanItemLimits from './procurementPlanItemLimits/mutation/insertProcurementPlanItemLimit';
import deletePublicProcurementPlan from './getPlans/queries/deletePublicProcurementPlan';
import insertPublicProcurementPlan from './getPlans/queries/insertPublicProcurementPlan';
import insertPublicProcurementPlanItem from './procurements/mutations/insertPublicProcurementPlanItem.ts';
import getPublicProcurementPlanItemDetails from './procurements/queries/getPublicProcurementPlanItemDetails';
import deletePublicProcurementPlanItem from './procurements/mutations/deletePublicProcurementPlanItem.ts';
import getPublicProcurementPlanDetails from './procurementsOverview/queries/getPublicProcurementPlanDetails';
import getProcurementPlanItemLimits from './procurementPlanItemLimits/queries/getProcurementPlanItemLimits';
import getPublicProcurementPlanRequests from './plansRequests/queries/getRequests.ts';
import getOrganizationUnitPublicProcurements from './organizationUnitPublicProcurements/getOrganizationUnitPublicProcurements.ts';
import getProcurementContracts from './procurementContractsOverview/queries/getProcurementContracts';
import getSuppliers from './suppliers/queries/getSuppliers';
import insertProcurementContract from './procurementContractsOverview/mutations/insertContract';
import getContractArticles from './contractArticles/queries/getContractArticles';
import publicProcurementOrganizationUnitArticleInsert from './organizationUnitPublicProcurements/mutations/publicProcurementOrganizationUnitArticleInsert.ts';
import insertContractArticle from './contractArticles/mutations/insertContractArticle';
import deleteContract from './procurementContractsOverview/mutations/deleteContract';

export const GraphQL = {
  fetch: (query: string): Promise<any> => {
    return fetch(BFF_URL[getEnvironment()], {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer sss',
      },
      body: JSON.stringify({query}),
    })
      .then(response => response.json())
      .catch(error => console.error(error));
  },
  publicProcurementArticleInsert: publicProcurementArticleInsert,
  publicProcurementArticleDelete: publicProcurementArticleDelete,
  publicProcurementGetDetails: publicProcurementGetDetails,
  getPublicProcurementPlanItemDetails: getPublicProcurementPlanItemDetails,
  insertPublicProcurementPlanItem: insertPublicProcurementPlanItem,
  deletePublicProcurementPlanItem: deletePublicProcurementPlanItem,
  getPublicProcurementPlanDetails: getPublicProcurementPlanDetails,
  getPlansOverview: getPlansOverview,
  deletePlan: deletePlan,
  insertProcurementPlanItemLimits: insertProcurementPlanItemLimits,
  deletePublicProcurementPlan: deletePublicProcurementPlan,
  insertPublicProcurementPlan: insertPublicProcurementPlan,
  getProcurementPlanItemLimit: getProcurementPlanItemLimits,
  getPublicProcurementPlanRequests: getPublicProcurementPlanRequests,
  getOrganizationUnitPublicProcurements: getOrganizationUnitPublicProcurements,
  getProcurementContracts: getProcurementContracts,
  getSuppliers: getSuppliers,
  insertProcurementContract: insertProcurementContract,
  deleteContract: deleteContract,
  getContractArticles: getContractArticles,
  insertContractArticle: insertContractArticle,
  procurementOrganizationUnitArticleInsert: publicProcurementOrganizationUnitArticleInsert,
};
