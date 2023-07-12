import {useEffect, useState} from 'react';
import {GraphQL} from '../..';
import {ContractArticleGet} from '../../../../types/graphql/contractsArticlesTypes';

const useContractArticles = (id: number) => {
  const [contractArticles, setContractArticles] = useState<ContractArticleGet[]>();
  const [loading, setLoading] = useState(true);

  const fetchContractArticles = async () => {
    const response = await GraphQL.getContractArticles(id);
    const contracts = response?.items;
    setContractArticles(contracts);
    setLoading(false);
  };

  useEffect(() => {
    fetchContractArticles();
  }, [id]);

  return {data: contractArticles, loading, refetchData: fetchContractArticles};
};

export default useContractArticles;
