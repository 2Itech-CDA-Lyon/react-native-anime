import { IAnime } from '../models';

interface IAnimesContextValue {
  store: {
    [id: string]: IAnime,
  },
  actions: {
    addInStore: (anime: IAnime) => void
  }
};

export default IAnimesContextValue;