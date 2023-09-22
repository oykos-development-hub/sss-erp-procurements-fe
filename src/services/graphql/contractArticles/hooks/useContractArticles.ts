import {useEffect, useState} from 'react';
import {ContractArticleGet, ContractArticlesGetResponse} from '../../../../types/graphql/contractsArticlesTypes';
import useAppContext from '../../../../context/useAppContext';
import query from '../queries/getContractArticles';

const useContractArticles = (id: number) => {
  const [contractArticles, setContractArticles] = useState<ContractArticleGet[]>();
  const [loading, setLoading] = useState(true);
  const {fetch} = useAppContext();

  const fetchContractArticles = async () => {
    const response: ContractArticlesGetResponse = await fetch(query, {id});
    setContractArticles(response?.publicProcurementContractArticles_Overview.items);
    setLoading(false);
  };

  useEffect(() => {
    fetchContractArticles();
  }, [id]);

  return {data: contractArticles, loading, refetchData: fetchContractArticles};
};

export default useContractArticles;
