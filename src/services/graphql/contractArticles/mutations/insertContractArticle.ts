import {GraphQL} from '../..';
import {ContractArticleInsert, ContractArticlesInsertResponse} from '../../../../types/graphql/contractsArticlesTypes';

const insertContractArticle = async (
  data: ContractArticleInsert,
): Promise<ContractArticlesInsertResponse['data']['publicProcurementContractArticle_Insert']> => {
  const response = await GraphQL.fetch(`mutation {
    publicProcurementContractArticle_Insert(data: {
        id: ${Number(data.id)},
        public_procurement_article_id: ${Number(data.public_procurement_article_id)},
        public_procurement_contract_id: ${Number(data.public_procurement_contract_id)},
        amount: "${data.amount}",
        net_value: "${data.net_value}",
        gross_value: "${data.gross_value}",
    }) {
        status 
        message 
        items {
            id
            public_procurement_article {
                id
                title
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

  return response?.data?.publicProcurementContractArticle_Insert || {};
};

export default insertContractArticle;
