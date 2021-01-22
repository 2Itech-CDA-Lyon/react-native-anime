import { ILink } from ".";
import ResourceType from "./ResourceType";

export default interface Genre {
  id: string;
  type: ResourceType;
  links: ILink;
  attributes: {
    createdAt: string;
    updatedAt: string;
    slug: string;
    name: string;
    description: string;
  }
  relationships: {
    [resource in ResourceType]?: {
      links: ILink;
    };
  };
}
