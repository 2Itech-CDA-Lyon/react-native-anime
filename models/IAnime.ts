import { ILink } from '.';
import IImage from './IImage';
import ResourceType from './ResourceType';

export default interface IAnime {
  id: string;
  type: ResourceType;
  links: ILink;
  attributes: {
    createdAt: string,
    updatedAt: string,
    slug: string,
    synopsis: string,
    canonicalTitle: string,
    description: string,
    posterImage?: IImage;
    coverImage?: IImage;
  };
  relationships: {
    [resource in ResourceType]?: {
      links: ILink;
    };
  };
};
