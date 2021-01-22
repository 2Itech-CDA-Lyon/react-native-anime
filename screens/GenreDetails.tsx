import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { FC, useEffect, useState } from 'react';
import { View } from 'react-native';
import { AnimeList } from '../components';
import { IAnime, ICollectionApiResponse, IGenre, IResourceApiResponse } from '../models';
import { RootStackParamList } from '../navigation';

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

  useEffect(
    () => {
      fetch(`https://kitsu.io/api/edge/genres/${id}`)
      .then(response => response.json())
      .then( (json: IResourceApiResponse<IGenre>) => setGenre(json.data) );
    },
    [id]
  );

  useEffect(
    () => {
      if (typeof genre !== 'undefined') {
        fetch(`https://kitsu.io/api/edge/anime?filter[genres]=${genre?.attributes.slug}`)
        .then(response => response.json())
        .then( (json: ICollectionApiResponse<IAnime>) => setAnimes(json.data) );
      }
    },
    [genre]
  )

  return (
    <View>
      <AnimeList animes={animes} />
    </View>
  );
}

export default GenreDetails;
