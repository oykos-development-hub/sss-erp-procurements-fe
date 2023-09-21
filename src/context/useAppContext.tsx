import {useContext} from 'react';
import {appContext} from './appContext';

const useAppContext = () => {
  return useContext(appContext);
};

export default useAppContext;
