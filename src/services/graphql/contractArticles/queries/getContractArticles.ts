import {GraphQL} from '../..';
import {ContractArticlesGetResponse} from '../../../../types/graphql/contractsArticlesTypes';

const getContractArticles = async (
  id: number,
): Promise<ContractArticlesGetResponse['data']['publicProcurementContractArticles_Overview']> => {
  const response = await GraphQL.fetch(`query {
    publicProcurementContractArticles_Overview(contract_id: ${id}) {
        status 
        message
        items {
            id
            public_procurement_article {
                id
                title
                vat_percentage
                description
            }
            contract {
                id
                title
            }
            amount
            net_value
            gross_value
        }
    }
}`);

  return response?.data?.publicProcurementContractArticles_Overview || {};
};

export default getContractArticles;
