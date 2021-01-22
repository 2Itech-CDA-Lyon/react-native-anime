import { createContext } from 'react';
import { IAnimesContextValue } from '../models'

const AnimesContext = createContext<IAnimesContextValue>({
  store: {},
  actions: {
    addInStore: () => {},
  }
});

export default AnimesContext;
