import {useEffect, useState} from 'react';
import useAppContext from '../../../../context/useAppContext';
import {Count, CountResponse} from '../../../../types/graphql/countType';
import getCounts from '../queries/getCounts';

interface ICountParams {
  level?: number; // starts from 0
  tree?: boolean;
  page?: number;
  size?: number;
  search?: string;
}

const useGetCounts = (data?: ICountParams) => {
  const [counts, setCounts] = useState<Count[]>([]);
  const [total, setTotal] = useState<number>(0);

  const {fetch} = useAppContext();
  const fetchCounts = async () => {
    const response: CountResponse = await fetch(getCounts, data);
    const countList = response?.account_Overview.items;
    const totalCounts = response?.account_Overview.total;

    if (countList) setCounts(countList);
    if (totalCounts) setTotal(totalCounts);
  };
  useEffect(() => {
    fetchCounts();
  }, [data]);
  return {counts, total};
};

export default useGetCounts;
