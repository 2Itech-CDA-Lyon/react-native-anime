import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { FC, useEffect, useState } from 'react';
import { Text } from 'react-native';
import { Card } from 'react-native-elements';
import { AnimeList, FetchedContent } from '../components';
import { IAnime, ICollectionApiResponse, IGenre, IResourceApiResponse } from '../models';
import { RootStackParamList } from '../navigation';
import RequestState from '../request-state';

// Avec react-navigation, les composants qui représentent des écrans reçoivent automatiquement deux props:
// - navigation: qui contient un ensemble de fonctions permettant de changer d'écran
// - route: qui contient des informations sur la route actuelle, et notamment les paramètres passés par l'écran précédent
// Ce code permet de typer ces deux props, afin de pouvoir bénéficier de l'apport de TypeScript
// (notamment, s'assurer que le code du composant est compatible avec les paramètres attendus par la route),
// et dit en substance: le prop navigation dépend de la structure des routes déclarée dans RootStackParamList,
// ainsi que du nom de route auquel est lié le compoasnt.
// NOTE: ce code n'est absolument pas indispensable au bon fonctionnement de l'application et peut être omis.
// Il permet simplement d'améliorer l'expérience de développement et de réduire l'erreur humaine.
type GenreDetailsNavigationProp = StackNavigationProp<RootStackParamList, 'GenreDetails'>;
type GenreDetailsRouteProp = RouteProp<RootStackParamList, 'GenreDetails'>;

interface GenreDetailsProps {
  navigation: GenreDetailsNavigationProp;
  route: GenreDetailsRouteProp;
}

const GenreDetails: FC<GenreDetailsProps> = ({ route }) => {
  const { id } = route.params;

  const [genre, setGenre] = useState<IGenre>();

  const [animes, setAnimes] = useState<IAnime[]>([]);

  const [genreRequestState, setGenreRequestState] = useState(RequestState.Idle);
  const [animesRequestState, setAnimesRequestState] = useState(RequestState.Idle);

  useEffect(
    () => {
      setGenreRequestState(RequestState.Pending);
      fetch(`https://kitsu.io/api/edge/genres/${id}`)
      .then(response => response.json())
      .then( (json: IResourceApiResponse<IGenre>) => {
        setGenreRequestState(RequestState.Success);
        setGenre(json.data);
      });
    },
    [id]
  );

  useEffect(
    () => {
      if (typeof genre !== 'undefined') {
        setAnimesRequestState(RequestState.Pending);
        fetch(`https://kitsu.io/api/edge/anime?filter[genres]=${genre?.attributes.slug}`)
        .then(response => response.json())
        .then( (json: ICollectionApiResponse<IAnime>) => {
          setAnimesRequestState(RequestState.Success);
          setAnimes(json.data);
        });
      }
    },
    [genre]
  )

  return (
    <FetchedContent requestState={genreRequestState}>
      <Card>
        <Card.Title>{genre?.attributes.name}</Card.Title>
        {genre?.attributes.description && <Text>{genre?.attributes.description}</Text>}
      </Card>

      <FetchedContent requestState={animesRequestState}>
        <AnimeList animes={animes} />
      </FetchedContent>
    </FetchedContent>
  );
}

export default GenreDetails;
