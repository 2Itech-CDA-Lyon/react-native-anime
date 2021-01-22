import { RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { FC, useEffect, useState,useContext } from 'react';
import { StatusBar, SafeAreaView, ScrollView, View } from 'react-native';
import { IAnime, ICollectionApiResponse, IGenre, IResourceApiResponse } from '../models';
import { RootStackParamList } from '../navigation';
import { AnimesContext } from '../contexts'
import { Badge, Tile } from 'react-native-elements';
import RequestState from '../request-state';
import { FetchedContent } from '../components';

// Avec react-navigation, les composants qui représentent des écrans reçoivent automatiquement deux props:
// - navigation: qui contient un ensemble de fonctions permettant de changer d'écran
// - route: qui contient des informations sur la route actuelle, et notamment les paramètres passés par l'écran précédent
// Ce code permet de typer ces deux props, afin de pouvoir bénéficier de l'apport de TypeScript
// (notamment, s'assurer que le code du composant est compatible avec les paramètres attendus par la route),
// et dit en substance: le prop navigation dépend de la structure des routes déclarée dans RootStackParamList,
// ainsi que du nom de route auquel est lié le compoasnt.
// NOTE: ce code n'est absolument pas indispensable au bon fonctionnement de l'application et peut être omis.
// Il permet simplement d'améliorer l'expérience de développement et de réduire l'erreur humaine.
type AnimeDetailsNavigationProp = StackNavigationProp<RootStackParamList, 'AnimeDetails'>;
type AnimeDetailsRouteProp = RouteProp<RootStackParamList, 'AnimeDetails'>;

interface AnimeDetailsProps {
  navigation: AnimeDetailsNavigationProp;
  route: AnimeDetailsRouteProp;
}

const AnimeDetails: FC<AnimeDetailsProps> = ({ route }) => {
  // Trouve l'ID de l'animé demandé dans les paramètres de la route
  const { id } = route.params;
  // Retient l'état actuel de l'animé d'une exécution du composant à l'autre
  const [anime, setAnime] = useState<IAnime>();
  const [genres, setGenres] = useState<IGenre[]>([]);

  const [animeRequestState, setAnimeRequestState] = useState(RequestState.Idle);
  const [genresRequestState, setGenresRequestState] = useState(RequestState.Idle);

  const { actions, store } = useContext(AnimesContext);

  const navigation = useNavigation();

  // Associe un comportement à la création du composant
  useEffect(
    () => {
      // Si l'animé n'existe pas encore dans le store
      if (typeof store[id] === 'undefined') {
        setAnimeRequestState(RequestState.Pending);
        // Envoie une requête AJAX pour récupérer l'animé demandé
        fetch(`https://kitsu.io/api/edge/anime/${id}`)
        // Dès que la requête a répondu, transforme son contenu en objets JavaScript
        .then( response => response.json() )
        // Dès que la transformation est terminée, range le résultat dans la liste des animés
        .then( (json: IResourceApiResponse<IAnime>) => {
          setAnimeRequestState(RequestState.Success);
          setAnime(json.data);
          actions.addInStore(json.data);
        });
      // Si l'animé existe déjà dans le store
      } else {
        setAnimeRequestState(RequestState.Success);
        // Range les données de l'animé dans le composant
        setAnime(store[id]);
      }
    },
    // Liste des dépendances
    [id]
  );

  // Associe un comportement à la récupération des données de l'animé
  useEffect(
    () => {
      // Si un animé a bien été récupéré
      if (typeof anime !== 'undefined') {
        // Vérifie que l'animé contient bien un lien vers une collection de "genres"
        if (typeof anime.relationships.genres !== 'undefined' && anime.relationships.genres.links.related !== 'undefined') {
          setGenresRequestState(RequestState.Pending);
          // Envoie une requête AJAX permettant de récupérer les genres de l'animé
          fetch(`https://kitsu.io/api/edge/${anime.relationships.genres.links.related}`)
          .then(response => response.json())
          .then( (json: ICollectionApiResponse<IGenre>) => {
            setGenresRequestState(RequestState.Success);
            setGenres(json.data)
          });
        }
      }
    },
    [anime]
  );

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic">

          <FetchedContent requestState={animeRequestState}>
            <Tile
              imageSrc={{ uri: anime?.attributes.posterImage?.small }}
              title={anime?.attributes.canonicalTitle}
            />

            <FetchedContent requestState={genresRequestState}>
              <View
                style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' }}
              >
                {
                  genres.map(
                    (genre, index) =>
                      <Badge
                        key={index}
                        badgeStyle={{ marginLeft: '.25em', marginRight: '.25em', marginBottom: '.25em' }}
                        status="primary"
                        value={genre.attributes.name}
                        onPress={() => navigation.navigate('GenreDetails', { id: genre.id, title: genre.attributes.name })}
                      />
                  )
                }
              </View>
            </FetchedContent>
          </FetchedContent>

        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default AnimeDetails;
