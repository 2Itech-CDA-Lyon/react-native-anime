import { ActivityIndicator, Text, View } from "react-native";
import React, { FC, ReactElement } from 'react';
import RequestState from "../request-state";

interface FetchedContentProps {
  requestState: RequestState;
}

const FetchedContent: FC<FetchedContentProps> = ({ children, requestState }) => {
  switch (requestState) {
    case RequestState.Pending:
      return <ActivityIndicator />;

    case RequestState.Failed:
      return <Text>Error while fetching resource.</Text>;

    case RequestState.Success:
      return children as ReactElement<any>;

    default:
      return null;
  }
}

export default FetchedContent;
