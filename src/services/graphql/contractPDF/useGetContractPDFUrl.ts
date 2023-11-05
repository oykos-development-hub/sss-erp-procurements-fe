import {useState} from 'react';
import useAppContext from '../../../context/useAppContext';
import getContractPDFUrl from './getContractPDFUrl';

type GetContractPDFParams = {
  id: number;
  organization_unit_id?: number;
};

const useGetContractPDFUrl = (data: GetContractPDFParams) => {
  // const [url, setUrl] = useState([]);
  const [loading, setLoading] = useState(true);

  const {fetch} = useAppContext();

  const fetchPDFUrl = async () => {
    setLoading(true);
    const response: any = await fetch(getContractPDFUrl, data);
    console.log(response);

    setLoading(false);
  };

  return {fetchPDFUrl, loading};
};

export default useGetContractPDFUrl;
