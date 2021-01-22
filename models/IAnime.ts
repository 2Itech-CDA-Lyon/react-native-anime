import IImage from './IImage';

export default interface IAnime {
  id: string;
  createdAt: string,
  updatedAt: string,
  slug: string,
  synopsis: string,
  type: string;
  links: {
    self: string;
  };
  attributes: {
    canonicalTitle: string,
    description: string,
    posterImage?: IImage;
    coverImage?: IImage;
  };
  relationships: any;
};
