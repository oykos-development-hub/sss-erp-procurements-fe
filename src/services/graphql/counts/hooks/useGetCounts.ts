import {useEffect, useState} from 'react';
import useAppContext from '../../../../context/useAppContext';
import {Count, CountResponse} from '../../../../types/graphql/countType';
import getCounts from '../queries/getCounts';

const useGetCounts = () => {
  const [counts, setCounts] = useState<Count[]>([]);
  const [total, setTotal] = useState<number>(0);

  const {fetch} = useAppContext();
  const fetchCounts = async () => {
    const response: CountResponse = await fetch(getCounts);
    const countList = response?.account_Overview.items;
    const totalCounts = response?.account_Overview.total;

    if (countList) setCounts(countList);
    if (totalCounts) setTotal(totalCounts);
  };
  useEffect(() => {
    fetchCounts();
  }, []);
  return {counts, total};
};

export default useGetCounts;
